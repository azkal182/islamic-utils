/**
 * @fileoverview Derived flags calculator
 * @module inheritance/flags
 *
 * Calculates boolean flags from heir list as per DECISION_MATRIX_WARIS.md Section 2.
 */

import type { HeirInput, DerivedFlags } from './types';
import { HeirType } from './types';

// ═══════════════════════════════════════════════════════════════════════════
// Main Function
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Calculates derived flags from the list of heirs.
 *
 * @param heirs - Array of heir inputs
 * @returns Derived boolean flags
 *
 * @remarks
 * These flags are used throughout the calculation to determine:
 * - Hijab (exclusion) rules
 * - Furudh share amounts
 * - Special case detection
 *
 * @example
 * ```typescript
 * const flags = calculateFlags([
 *   { type: HeirType.SON, count: 2 },
 *   { type: HeirType.DAUGHTER, count: 1 },
 *   { type: HeirType.WIFE, count: 1 },
 * ]);
 *
 * flags.HAS_CHILD       // true
 * flags.HAS_SON         // true
 * flags.HAS_DESCENDANT  // true
 * ```
 */
export function calculateFlags(heirs: HeirInput[]): DerivedFlags {
  // Create a map for quick lookup
  const heirCounts = new Map<HeirType, number>();
  for (const heir of heirs) {
    const current = heirCounts.get(heir.type) ?? 0;
    heirCounts.set(heir.type, current + heir.count);
  }

  // Helper to get count
  const getCount = (type: HeirType): number => heirCounts.get(type) ?? 0;

  // Calculate individual flags
  const HAS_SON = getCount(HeirType.SON) > 0;
  const HAS_DAUGHTER = getCount(HeirType.DAUGHTER) > 0;
  const HAS_GRANDSON = getCount(HeirType.GRANDSON_SON) > 0;
  const HAS_GRANDDAUGHTER = getCount(HeirType.GRANDDAUGHTER_SON) > 0;
  const HAS_CHILD = HAS_SON || HAS_DAUGHTER;
  const HAS_DESCENDANT = HAS_CHILD || HAS_GRANDSON || HAS_GRANDDAUGHTER;

  const HAS_FATHER = getCount(HeirType.FATHER) > 0;
  const HAS_MOTHER = getCount(HeirType.MOTHER) > 0;
  const HAS_GRANDFATHER = getCount(HeirType.GRANDFATHER_PATERNAL) > 0;
  const HAS_GRANDMOTHER =
    getCount(HeirType.GRANDMOTHER_MATERNAL) > 0 || getCount(HeirType.GRANDMOTHER_PATERNAL) > 0;

  const HAS_HUSBAND = getCount(HeirType.HUSBAND) > 0;
  const HAS_WIFE = getCount(HeirType.WIFE) > 0;
  const HAS_SPOUSE = HAS_HUSBAND || HAS_WIFE;

  // Siblings counts
  const fullBrothers = getCount(HeirType.BROTHER_FULL);
  const fullSisters = getCount(HeirType.SISTER_FULL);
  const paternalBrothers = getCount(HeirType.BROTHER_PATERNAL);
  const paternalSisters = getCount(HeirType.SISTER_PATERNAL);
  const uterineBrothers = getCount(HeirType.BROTHER_UTERINE);
  const uterineSisters = getCount(HeirType.SISTER_UTERINE);

  const HAS_SIBLINGS_TOTAL =
    fullBrothers +
    fullSisters +
    paternalBrothers +
    paternalSisters +
    uterineBrothers +
    uterineSisters;

  const HAS_TWO_OR_MORE_SIBLINGS = HAS_SIBLINGS_TOTAL >= 2;
  const HAS_UTERINE_SIBLINGS = uterineBrothers + uterineSisters > 0;
  const HAS_FULL_SIBLINGS = fullBrothers + fullSisters > 0;
  const HAS_PATERNAL_SIBLINGS = paternalBrothers + paternalSisters > 0;

  return {
    HAS_CHILD,
    HAS_SON,
    HAS_DAUGHTER,
    HAS_GRANDSON,
    HAS_GRANDDAUGHTER,
    HAS_DESCENDANT,
    HAS_FATHER,
    HAS_MOTHER,
    HAS_GRANDFATHER,
    HAS_GRANDMOTHER,
    HAS_SIBLINGS_TOTAL,
    HAS_TWO_OR_MORE_SIBLINGS,
    HAS_UTERINE_SIBLINGS,
    HAS_FULL_SIBLINGS,
    HAS_PATERNAL_SIBLINGS,
    HAS_HUSBAND,
    HAS_WIFE,
    HAS_SPOUSE,
  };
}

// ═══════════════════════════════════════════════════════════════════════════
// Utility Functions
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Gets the count of a specific heir type from the heirs array.
 *
 * @param heirs - Array of heir inputs
 * @param type - Heir type to count
 * @returns Count of that heir type
 */
export function getHeirCount(heirs: HeirInput[], type: HeirType): number {
  return heirs.filter((h) => h.type === type).reduce((sum, h) => sum + h.count, 0);
}

/**
 * Gets total number of heirs across all types.
 *
 * @param heirs - Array of heir inputs
 * @returns Total count of all heirs
 */
export function getTotalHeirCount(heirs: HeirInput[]): number {
  return heirs.reduce((sum, h) => sum + h.count, 0);
}

/**
 * Checks if any heirs exist.
 *
 * @param heirs - Array of heir inputs
 * @returns True if at least one heir exists
 */
export function hasAnyHeirs(heirs: HeirInput[]): boolean {
  return heirs.some((h) => h.count > 0);
}

/**
 * Gets all heir types present in the heirs array.
 *
 * @param heirs - Array of heir inputs
 * @returns Array of heir types with count > 0
 */
export function getPresentHeirTypes(heirs: HeirInput[]): HeirType[] {
  return heirs.filter((h) => h.count > 0).map((h) => h.type);
}
