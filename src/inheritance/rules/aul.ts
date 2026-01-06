/**
 * @fileoverview Aul (over-subscription) handler
 * @module inheritance/rules/aul
 *
 * Implements Aul rules from DECISION_MATRIX_WARIS.md Section 7.
 * Aul occurs when total furudh shares exceed 1.
 */

import type { InheritanceTraceStep } from '../types';
import type { Fraction } from '../utils/fraction';
import { fraction, toString, greaterThan, FRACTION } from '../utils/fraction';

// ═══════════════════════════════════════════════════════════════════════════
// Types
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Share with heir type for aul adjustment.
 */
export interface ShareForAul {
  readonly heirType: string;
  readonly originalShare: Fraction;
}

/**
 * Adjusted share after aul.
 */
export interface AdjustedShare {
  readonly heirType: string;
  readonly originalShare: Fraction;
  readonly adjustedShare: Fraction;
}

/**
 * Result of aul detection and application.
 */
export interface AulResult {
  readonly aulApplied: boolean;
  readonly originalDenominator: number;
  readonly newDenominator: number;
  readonly adjustedShares: AdjustedShare[];
  readonly trace: InheritanceTraceStep[];
}

// ═══════════════════════════════════════════════════════════════════════════
// Main Functions
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Detects if Aul is needed (total furudh > 1).
 *
 * @param totalFurudh - Total of all furudh shares
 * @returns True if Aul should be applied
 */
export function detectAul(totalFurudh: Fraction): boolean {
  return greaterThan(totalFurudh, FRACTION.ONE);
}

/**
 * Applies Aul (proportional reduction) to shares.
 *
 * @param shares - Map of heir type to share
 * @param asalMasalah - Original base denominator
 * @returns Aul result with adjusted shares
 *
 * @remarks
 * **Aul Rule from DECISION_MATRIX_WARIS.md:**
 * ```spec
 * AUL_RULE:
 *   IF TOTAL_FURUDH > 1
 *   THEN FOR EACH FURUDH:
 *     adjusted_share = share / TOTAL_FURUDH
 *   NO_REMAINDER
 * ```
 *
 * **Example:**
 * - Husband (1/2) + 2 sisters (2/3)
 * - Asal masalah: 6
 * - Husband: 3/6, Sisters: 4/6
 * - Total: 7/6 > 1 (Aul!)
 * - New denominator: 7
 * - Husband: 3/7, Sisters: 4/7
 */
export function applyAul(shares: ShareForAul[], asalMasalah: number): AulResult {
  const trace: InheritanceTraceStep[] = [];

  // Calculate total numerators using common denominator
  let totalNumerators = 0;
  const normalizedShares: { heirType: string; numerator: number }[] = [];

  for (const share of shares) {
    const numerator =
      share.originalShare.numerator * (asalMasalah / share.originalShare.denominator);
    normalizedShares.push({ heirType: share.heirType, numerator });
    totalNumerators += numerator;
  }

  // Check if Aul is needed
  if (totalNumerators <= asalMasalah) {
    trace.push({
      step: 1,
      phase: 'AUL',
      description: 'No Aul needed (total shares <= 1)',
      arabicTerm: 'لا عول',
      value: {
        totalNumerators,
        asalMasalah,
        ratio: `${totalNumerators}/${asalMasalah}`,
      },
    });

    return {
      aulApplied: false,
      originalDenominator: asalMasalah,
      newDenominator: asalMasalah,
      adjustedShares: shares.map((s) => ({
        heirType: s.heirType,
        originalShare: s.originalShare,
        adjustedShare: s.originalShare,
      })),
      trace,
    };
  }

  // Apply Aul
  const newDenominator = totalNumerators;

  trace.push({
    step: 1,
    phase: 'AUL',
    description: 'Aul detected! Total shares exceed estate',
    arabicTerm: 'العول',
    value: {
      totalNumerators,
      asalMasalah,
      excessRatio: `${totalNumerators}/${asalMasalah}`,
    },
    formula: `Total = ${totalNumerators}/${asalMasalah} > 1`,
  });

  trace.push({
    step: 2,
    phase: 'AUL',
    description: 'Applying Aul: new denominator = total numerators',
    arabicTerm: 'تطبيق العول',
    value: {
      originalDenominator: asalMasalah,
      newDenominator,
    },
    formula: `New asal masalah = ${newDenominator}`,
  });

  // Create adjusted shares
  const adjustedShares: AdjustedShare[] = [];

  for (const share of normalizedShares) {
    const adjustedShare = fraction(share.numerator, newDenominator);

    adjustedShares.push({
      heirType: share.heirType,
      originalShare: shares.find((s) => s.heirType === share.heirType)!.originalShare,
      adjustedShare,
    });

    trace.push({
      step: trace.length + 1,
      phase: 'AUL',
      description: `${share.heirType} adjusted`,
      value: {
        original: `${share.numerator}/${asalMasalah}`,
        adjusted: toString(adjustedShare),
      },
      formula: `${share.numerator}/${asalMasalah} → ${share.numerator}/${newDenominator}`,
    });
  }

  return {
    aulApplied: true,
    originalDenominator: asalMasalah,
    newDenominator,
    adjustedShares,
    trace,
  };
}

/**
 * Gets the Aul ratio (for display/trace purposes).
 *
 * @param originalDenominator - Original asal masalah
 * @param newDenominator - New asal masalah after aul
 * @returns Aul ratio as fraction
 */
export function getAulRatio(originalDenominator: number, newDenominator: number): Fraction {
  return fraction(newDenominator, originalDenominator);
}
