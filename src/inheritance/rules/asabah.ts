/**
 * @fileoverview Asabah (residuary heirs) calculator
 * @module inheritance/rules/asabah
 *
 * Implements the Asabah share calculation rules from DECISION_MATRIX_WARIS.md Section 6.
 */

import type { HeirInput, DerivedFlags, InheritanceTraceStep } from '../types';
import { HeirType, AsabahType, getHeirArabicName } from '../types';
import type { Fraction } from '../utils/fraction';
import { FRACTION, fraction, subtract, toString, isPositive, isZero } from '../utils/fraction';
import { getHeirCount } from '../flags';

// ═══════════════════════════════════════════════════════════════════════════
// Types
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Result of calculating asabah shares.
 */
export interface AsabahShareResult {
  readonly heirType: HeirType;
  readonly asabahType: AsabahType;
  readonly share: Fraction;
  readonly ratio: number; // For splitting (e.g., male=2, female=1)
  readonly notes: string[];
}

/**
 * Result of asabah calculation.
 */
export interface AsabahResult {
  readonly shares: AsabahShareResult[];
  readonly remainder: Fraction;
  readonly hasAsabah: boolean;
  readonly trace: InheritanceTraceStep[];
}

// ═══════════════════════════════════════════════════════════════════════════
// Asabah Priority Order (from DECISION_MATRIX_WARIS.md Section 6)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Asabah bi Nafs priority order.
 * Higher priority = earlier in array.
 */
const ASABAH_BI_NAFS_PRIORITY: HeirType[] = [
  HeirType.SON,
  HeirType.GRANDSON_SON,
  HeirType.FATHER,
  HeirType.GRANDFATHER_PATERNAL,
  HeirType.BROTHER_FULL,
  HeirType.BROTHER_PATERNAL,
  HeirType.NEPHEW_FULL,
  HeirType.NEPHEW_PATERNAL,
  HeirType.UNCLE_FULL,
  HeirType.UNCLE_PATERNAL,
  HeirType.COUSIN_FULL,
  HeirType.COUSIN_PATERNAL,
];

/**
 * Female counterparts for asabah bil ghayr.
 */
const ASABAH_BIL_GHAYR_PAIRS: Map<HeirType, HeirType> = new Map([
  [HeirType.SON, HeirType.DAUGHTER],
  [HeirType.GRANDSON_SON, HeirType.GRANDDAUGHTER_SON],
  [HeirType.BROTHER_FULL, HeirType.SISTER_FULL],
  [HeirType.BROTHER_PATERNAL, HeirType.SISTER_PATERNAL],
]);

// ═══════════════════════════════════════════════════════════════════════════
// Main Function
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Calculates Asabah (remainder) shares for all eligible heirs.
 *
 * @param heirs - List of active heirs
 * @param flags - Derived flags
 * @param totalFurudh - Total furudh shares as fraction
 * @returns Asabah calculation result
 *
 * @remarks
 * Asabah Types:
 * 1. **Asabah bi Nafs** - Male relatives who take remainder by themselves
 * 2. **Asabah bil Ghayr** - Females who take remainder with male counterpart (2:1)
 * 3. **Asabah maal Ghayr** - Sisters who take remainder with daughters
 */
export function calculateAsabah(
  heirs: HeirInput[],
  flags: DerivedFlags,
  totalFurudh: Fraction
): AsabahResult {
  const trace: InheritanceTraceStep[] = [];
  const shares: AsabahShareResult[] = [];

  // Calculate remainder
  const remainder = subtract(FRACTION.ONE, totalFurudh);

  trace.push({
    step: 1,
    phase: 'ASABAH',
    description: 'Calculating remainder for Asabah',
    arabicTerm: 'حساب الباقي للعصبة',
    value: {
      totalFurudh: toString(totalFurudh),
      remainder: toString(remainder),
    },
    formula: `1 - ${toString(totalFurudh)} = ${toString(remainder)}`,
  });

  // No remainder or negative = no asabah share
  if (isZero(remainder) || !isPositive(remainder)) {
    trace.push({
      step: 2,
      phase: 'ASABAH',
      description: 'No remainder for Asabah (Furudh exhausted estate)',
      value: 'Asabah heirs receive nothing',
    });

    return { shares: [], remainder: FRACTION.ZERO, hasAsabah: false, trace };
  }

  // Find asabah heirs by priority
  const asabahHeirs = findAsabahHeirs(heirs, flags);

  if (asabahHeirs.length === 0) {
    trace.push({
      step: 2,
      phase: 'ASABAH',
      description: 'No Asabah heirs present',
      arabicTerm: 'لا عصبة',
      value: 'Remainder will go to Radd or Dhawil Arham',
    });

    return { shares: [], remainder, hasAsabah: false, trace };
  }

  trace.push({
    step: 2,
    phase: 'ASABAH',
    description: 'Asabah heirs found',
    arabicTerm: 'العصبات',
    value: asabahHeirs.map((a) => ({
      type: a.type,
      asabahType: a.asabahType,
      count: a.count,
      ratio: a.ratio,
    })),
  });

  // Calculate shares for asabah with highest priority
  const highestPriorityGroup = getHighestPriorityGroup(asabahHeirs);

  // Calculate total ratio units
  let totalRatioUnits = 0;
  for (const asabah of highestPriorityGroup) {
    totalRatioUnits += asabah.count * asabah.ratio;
  }

  // Distribute remainder proportionally
  for (const asabah of highestPriorityGroup) {
    const shareNumerator = remainder.numerator * asabah.count * asabah.ratio;
    const shareDenominator = remainder.denominator * totalRatioUnits;
    const share = fraction(shareNumerator, shareDenominator);

    shares.push({
      heirType: asabah.type,
      asabahType: asabah.asabahType,
      share,
      ratio: asabah.ratio,
      notes: [asabah.note],
    });

    trace.push({
      step: trace.length + 1,
      phase: 'ASABAH',
      description: `${getHeirArabicName(asabah.type)} receives Asabah share`,
      value: {
        share: toString(share),
        type: asabah.asabahType,
        ratio: asabah.ratio,
        count: asabah.count,
      },
      formula: `(${toString(remainder)} × ${asabah.count} × ${asabah.ratio}) / ${totalRatioUnits} = ${toString(share)}`,
    });
  }

  return { shares, remainder, hasAsabah: true, trace };
}

// ═══════════════════════════════════════════════════════════════════════════
// Helper Types & Functions
// ═══════════════════════════════════════════════════════════════════════════

interface AsabahHeirInfo {
  type: HeirType;
  asabahType: AsabahType;
  priority: number;
  count: number;
  ratio: number;
  note: string;
}

/**
 * Finds all asabah heirs from the heir list.
 */
function findAsabahHeirs(heirs: HeirInput[], flags: DerivedFlags): AsabahHeirInfo[] {
  const result: AsabahHeirInfo[] = [];

  // Check Asabah bi Nafs
  for (let i = 0; i < ASABAH_BI_NAFS_PRIORITY.length; i++) {
    const type = ASABAH_BI_NAFS_PRIORITY[i];
    const count = getHeirCount(heirs, type);

    if (count > 0) {
      result.push({
        type,
        asabahType: AsabahType.BI_NAFS,
        priority: i,
        count,
        ratio: 2, // Male ratio
        note: 'Asabah bi nafs',
      });

      // Check for female counterpart (Asabah bil Ghayr)
      const femaleType = ASABAH_BIL_GHAYR_PAIRS.get(type);
      if (femaleType) {
        const femaleCount = getHeirCount(heirs, femaleType);
        if (femaleCount > 0) {
          result.push({
            type: femaleType,
            asabahType: AsabahType.BIL_GHAYR,
            priority: i,
            count: femaleCount,
            ratio: 1, // Female ratio
            note: 'Asabah bil ghayr (with male)',
          });
        }
      }
    }
  }

  // Check Asabah maal Ghayr (sisters with daughters)
  if (flags.HAS_DAUGHTER || flags.HAS_GRANDDAUGHTER) {
    // Full sister
    const fullSisterCount = getHeirCount(heirs, HeirType.SISTER_FULL);
    if (fullSisterCount > 0 && !hasHeirType(heirs, HeirType.BROTHER_FULL)) {
      result.push({
        type: HeirType.SISTER_FULL,
        asabahType: AsabahType.MAA_GHAYR,
        priority: ASABAH_BI_NAFS_PRIORITY.indexOf(HeirType.BROTHER_FULL),
        count: fullSisterCount,
        ratio: 1,
        note: 'Asabah maal ghayr (with daughters)',
      });
    }

    // Paternal sister
    const paternalSisterCount = getHeirCount(heirs, HeirType.SISTER_PATERNAL);
    if (paternalSisterCount > 0 && !hasHeirType(heirs, HeirType.BROTHER_PATERNAL)) {
      result.push({
        type: HeirType.SISTER_PATERNAL,
        asabahType: AsabahType.MAA_GHAYR,
        priority: ASABAH_BI_NAFS_PRIORITY.indexOf(HeirType.BROTHER_PATERNAL),
        count: paternalSisterCount,
        ratio: 1,
        note: 'Asabah maal ghayr (with daughters)',
      });
    }
  }

  return result;
}

/**
 * Gets only the highest priority asabah group.
 * In asabah, only the highest priority group takes the remainder.
 */
function getHighestPriorityGroup(asabahHeirs: AsabahHeirInfo[]): AsabahHeirInfo[] {
  if (asabahHeirs.length === 0) return [];

  const minPriority = Math.min(...asabahHeirs.map((h) => h.priority));
  return asabahHeirs.filter((h) => h.priority === minPriority);
}

/**
 * Checks if heir type exists.
 */
function hasHeirType(heirs: HeirInput[], type: HeirType): boolean {
  return getHeirCount(heirs, type) > 0;
}
