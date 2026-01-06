/**
 * @fileoverview Radd (remainder redistribution) handler
 * @module inheritance/rules/radd
 *
 * Implements Radd rules from DECISION_MATRIX_WARIS.md Section 8.
 * Radd occurs when total furudh < 1 and no asabah exists.
 */

import type { InheritanceTraceStep, InheritancePolicy } from '../types';
import { HeirType } from '../types';
import type { Fraction } from '../utils/fraction';
import {
  add,
  subtract,
  multiply,
  divide,
  toString,
  lessThan,
  isPositive,
  FRACTION,
} from '../utils/fraction';

// ═══════════════════════════════════════════════════════════════════════════
// Types
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Share with heir type for radd calculation.
 */
export interface ShareForRadd {
  readonly heirType: HeirType;
  readonly share: Fraction;
}

/**
 * Adjusted share after radd.
 */
export interface RaddAdjustedShare {
  readonly heirType: HeirType;
  readonly originalShare: Fraction;
  readonly raddPortion: Fraction;
  readonly finalShare: Fraction;
}

/**
 * Result of radd detection and application.
 */
export interface RaddResult {
  readonly raddApplied: boolean;
  readonly remainder: Fraction;
  readonly adjustedShares: RaddAdjustedShare[];
  readonly trace: InheritanceTraceStep[];
}

// ═══════════════════════════════════════════════════════════════════════════
// Main Functions
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Detects if Radd is applicable.
 *
 * @param totalFurudh - Total of all furudh shares
 * @param hasAsabah - Whether asabah heirs exist
 * @returns True if Radd should be applied
 */
export function detectRadd(totalFurudh: Fraction, hasAsabah: boolean): boolean {
  if (hasAsabah) return false;
  return lessThan(totalFurudh, FRACTION.ONE);
}

/**
 * Applies Radd (remainder redistribution) to shares.
 *
 * @param shares - Array of shares to receive radd
 * @param totalFurudh - Total furudh before radd
 * @param policy - Inheritance policy (determines if spouse gets radd)
 * @returns Radd result with adjusted shares
 *
 * @remarks
 * **Radd Rule from DECISION_MATRIX_WARIS.md:**
 * ```spec
 * RADD_RULE:
 *   IF TOTAL_FURUDH < 1 AND NO_ASABAH_EXISTS
 *   THEN DISTRIBUTE REMAINDER TO:
 *     ALL_FURUDH_HOLDERS
 *     EXCEPT SPOUSE IF RADD_INCLUDES_SPOUSE == false
 * ```
 */
export function applyRadd(
  shares: ShareForRadd[],
  totalFurudh: Fraction,
  policy: InheritancePolicy
): RaddResult {
  const trace: InheritanceTraceStep[] = [];

  // Calculate remainder
  const remainder = subtract(FRACTION.ONE, totalFurudh);

  if (!isPositive(remainder)) {
    trace.push({
      step: 1,
      phase: 'RADD',
      description: 'No remainder for Radd (Furudh >= 1)',
      arabicTerm: 'لا رد',
      value: {
        totalFurudh: toString(totalFurudh),
        remainder: toString(remainder),
      },
    });

    return {
      raddApplied: false,
      remainder: FRACTION.ZERO,
      adjustedShares: shares.map((s) => ({
        heirType: s.heirType,
        originalShare: s.share,
        raddPortion: FRACTION.ZERO,
        finalShare: s.share,
      })),
      trace,
    };
  }

  trace.push({
    step: 1,
    phase: 'RADD',
    description: 'Radd applicable: remainder exists with no Asabah',
    arabicTerm: 'الرد',
    value: {
      totalFurudh: toString(totalFurudh),
      remainder: toString(remainder),
    },
    formula: `Remainder = 1 - ${toString(totalFurudh)} = ${toString(remainder)}`,
  });

  // Determine eligible heirs for radd
  const raddEligible = shares.filter((s) => {
    // Spouse excluded from radd in most madhabs
    if (!policy.raddIncludesSpouse) {
      if (s.heirType === HeirType.HUSBAND || s.heirType === HeirType.WIFE) {
        return false;
      }
    }
    return isPositive(s.share);
  });

  if (raddEligible.length === 0) {
    trace.push({
      step: 2,
      phase: 'RADD',
      description: 'No eligible heirs for Radd (only spouse present)',
      value: 'Remainder not distributed',
    });

    return {
      raddApplied: false,
      remainder,
      adjustedShares: shares.map((s) => ({
        heirType: s.heirType,
        originalShare: s.share,
        raddPortion: FRACTION.ZERO,
        finalShare: s.share,
      })),
      trace,
    };
  }

  trace.push({
    step: 2,
    phase: 'RADD',
    description: `Radd eligible heirs: ${raddEligible.length}`,
    arabicTerm: policy.raddIncludesSpouse ? 'الرد يشمل الزوج' : 'الرد لا يشمل الزوج',
    value: raddEligible.map((s) => s.heirType),
  });

  // Calculate total shares of eligible heirs
  let eligibleTotal = FRACTION.ZERO;
  for (const share of raddEligible) {
    eligibleTotal = add(eligibleTotal, share.share);
  }

  trace.push({
    step: 3,
    phase: 'RADD',
    description: 'Total shares of Radd-eligible heirs',
    value: toString(eligibleTotal),
  });

  // Distribute remainder proportionally
  const adjustedShares: RaddAdjustedShare[] = [];

  for (const share of shares) {
    const isEligible = raddEligible.some((e) => e.heirType === share.heirType);

    if (isEligible) {
      // Calculate this heir's portion of the remainder
      // raddPortion = remainder × (share / eligibleTotal)
      const shareProportion = divide(share.share, eligibleTotal);
      const raddPortion = multiply(remainder, shareProportion);
      const finalShare = add(share.share, raddPortion);

      adjustedShares.push({
        heirType: share.heirType,
        originalShare: share.share,
        raddPortion,
        finalShare,
      });

      trace.push({
        step: trace.length + 1,
        phase: 'RADD',
        description: `${share.heirType} receives Radd portion`,
        value: {
          original: toString(share.share),
          raddPortion: toString(raddPortion),
          final: toString(finalShare),
        },
        formula: `${toString(share.share)} + (${toString(remainder)} × ${toString(share.share)} / ${toString(eligibleTotal)}) = ${toString(finalShare)}`,
      });
    } else {
      // Not eligible for radd (spouse)
      adjustedShares.push({
        heirType: share.heirType,
        originalShare: share.share,
        raddPortion: FRACTION.ZERO,
        finalShare: share.share,
      });

      if (share.heirType === HeirType.HUSBAND || share.heirType === HeirType.WIFE) {
        trace.push({
          step: trace.length + 1,
          phase: 'RADD',
          description: `${share.heirType} excluded from Radd`,
          arabicTerm: 'الزوج/الزوجة لا يرد عليه',
          value: {
            share: toString(share.share),
            reason: 'Spouse excluded from Radd by policy',
          },
        });
      }
    }
  }

  return {
    raddApplied: true,
    remainder,
    adjustedShares,
    trace,
  };
}
