/**
 * @fileoverview Furudh (fixed shares) calculator
 * @module inheritance/rules/furudh
 *
 * Implements the Furudh share calculation rules from DECISION_MATRIX_WARIS.md Section 5.
 */

import type { HeirInput, DerivedFlags, InheritanceTraceStep, InheritancePolicy } from '../types';
import { HeirType, ShareCategory, getHeirArabicName } from '../types';
import type { Fraction } from '../utils/fraction';
import { FRACTION, fraction, toString, toArabicName } from '../utils/fraction';
import { getHeirCount } from '../flags';

// ═══════════════════════════════════════════════════════════════════════════
// Types
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Result of calculating a heir's furudh share.
 */
export interface FurudhShareResult {
  readonly heirType: HeirType;
  readonly share: Fraction;
  readonly category: ShareCategory;
  readonly isAsabah: boolean;
  readonly notes: string[];
}

/**
 * Result of furudh calculation.
 */
export interface FurudhResult {
  readonly shares: FurudhShareResult[];
  readonly asalMasalah: number;
  readonly totalFurudh: Fraction;
  readonly hasAsabah: boolean;
  readonly trace: InheritanceTraceStep[];
}

// ═══════════════════════════════════════════════════════════════════════════
// Main Function
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Calculates Furudh (fixed shares) for all heirs.
 *
 * @param heirs - List of active heirs (after hijab)
 * @param flags - Derived flags
 * @param policy - Inheritance policy
 * @returns Furudh calculation result
 */
export function calculateFurudh(
  heirs: HeirInput[],
  flags: DerivedFlags,
  policy: InheritancePolicy
): FurudhResult {
  const trace: InheritanceTraceStep[] = [];
  const shares: FurudhShareResult[] = [];
  let hasAsabah = false;

  trace.push({
    step: 1,
    phase: 'FURUDH',
    description: 'Calculating fixed shares (Furudh)',
    arabicTerm: 'حساب الفروض',
    value: `Processing ${heirs.length} heir types`,
  });

  // Process each heir type
  for (const heir of heirs) {
    if (heir.count === 0) continue;

    const result = calculateSingleFurudh(heir, flags, policy, heirs);

    if (result) {
      shares.push(result);

      if (result.isAsabah) {
        hasAsabah = true;
      }

      trace.push({
        step: trace.length + 1,
        phase: 'FURUDH',
        description: `${getHeirArabicName(heir.type)} (×${heir.count})`,
        arabicTerm:
          result.share.denominator > 0 ? (toArabicName(result.share) ?? undefined) : undefined,
        value: {
          share: toString(result.share),
          category: result.category,
          isAsabah: result.isAsabah,
        },
        formula: result.notes.join('; '),
      });
    }
  }

  // Calculate total and asal masalah
  const { totalFurudh, asalMasalah } = calculateTotals(shares);

  trace.push({
    step: trace.length + 1,
    phase: 'FURUDH',
    description: 'Furudh calculation complete',
    arabicTerm: 'أصل المسألة',
    value: {
      asalMasalah,
      totalFurudh: toString(totalFurudh),
      hasAsabah,
      shareCount: shares.length,
    },
  });

  return { shares, asalMasalah, totalFurudh, hasAsabah, trace };
}

// ═══════════════════════════════════════════════════════════════════════════
// Individual Heir Share Calculation
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Calculates furudh for a single heir type.
 */
function calculateSingleFurudh(
  heir: HeirInput,
  flags: DerivedFlags,
  _policy: InheritancePolicy,
  allHeirs: HeirInput[]
): FurudhShareResult | null {
  const type = heir.type;
  const notes: string[] = [];

  switch (type) {
    // ─────────────────────────────────────────────────────────────────────
    // SPOUSE
    // ─────────────────────────────────────────────────────────────────────

    case HeirType.HUSBAND: {
      if (flags.HAS_DESCENDANT) {
        notes.push('With descendants: 1/4');
        return {
          heirType: type,
          share: FRACTION.QUARTER,
          category: ShareCategory.FURUDH,
          isAsabah: false,
          notes,
        };
      } else {
        notes.push('No descendants: 1/2');
        return {
          heirType: type,
          share: FRACTION.HALF,
          category: ShareCategory.FURUDH,
          isAsabah: false,
          notes,
        };
      }
    }

    case HeirType.WIFE: {
      if (flags.HAS_DESCENDANT) {
        notes.push('With descendants: 1/8 (shared if multiple)');
        return {
          heirType: type,
          share: FRACTION.EIGHTH,
          category: ShareCategory.FURUDH,
          isAsabah: false,
          notes,
        };
      } else {
        notes.push('No descendants: 1/4 (shared if multiple)');
        return {
          heirType: type,
          share: FRACTION.QUARTER,
          category: ShareCategory.FURUDH,
          isAsabah: false,
          notes,
        };
      }
    }

    // ─────────────────────────────────────────────────────────────────────
    // PARENTS
    // ─────────────────────────────────────────────────────────────────────

    case HeirType.MOTHER: {
      // Special case: Umariyatayn is handled in special-cases module
      if (flags.HAS_DESCENDANT) {
        notes.push('With descendants: 1/6');
        return {
          heirType: type,
          share: FRACTION.SIXTH,
          category: ShareCategory.FURUDH,
          isAsabah: false,
          notes,
        };
      } else if (flags.HAS_TWO_OR_MORE_SIBLINGS) {
        notes.push('With 2+ siblings: 1/6');
        return {
          heirType: type,
          share: FRACTION.SIXTH,
          category: ShareCategory.FURUDH,
          isAsabah: false,
          notes,
        };
      } else {
        notes.push('No descendants, < 2 siblings: 1/3');
        return {
          heirType: type,
          share: FRACTION.THIRD,
          category: ShareCategory.FURUDH,
          isAsabah: false,
          notes,
        };
      }
    }

    case HeirType.FATHER: {
      if (flags.HAS_SON) {
        notes.push('With son: 1/6 (furudh only)');
        return {
          heirType: type,
          share: FRACTION.SIXTH,
          category: ShareCategory.FURUDH,
          isAsabah: false,
          notes,
        };
      } else if (flags.HAS_DESCENDANT) {
        // Has daughters/granddaughters but no son
        notes.push('With female descendants only: 1/6 + asabah');
        return {
          heirType: type,
          share: FRACTION.SIXTH,
          category: ShareCategory.FURUDH_AND_ASABAH,
          isAsabah: true,
          notes,
        };
      } else {
        notes.push('No descendants: asabah only');
        return {
          heirType: type,
          share: FRACTION.ZERO,
          category: ShareCategory.ASABAH,
          isAsabah: true,
          notes,
        };
      }
    }

    case HeirType.GRANDFATHER_PATERNAL: {
      // Similar to father but with policy consideration
      if (flags.HAS_SON) {
        notes.push('With son: 1/6 (furudh only)');
        return {
          heirType: type,
          share: FRACTION.SIXTH,
          category: ShareCategory.FURUDH,
          isAsabah: false,
          notes,
        };
      } else if (flags.HAS_DESCENDANT) {
        notes.push('With female descendants only: 1/6 + asabah');
        return {
          heirType: type,
          share: FRACTION.SIXTH,
          category: ShareCategory.FURUDH_AND_ASABAH,
          isAsabah: true,
          notes,
        };
      } else {
        notes.push('No descendants: asabah only');
        return {
          heirType: type,
          share: FRACTION.ZERO,
          category: ShareCategory.ASABAH,
          isAsabah: true,
          notes,
        };
      }
    }

    // ─────────────────────────────────────────────────────────────────────
    // GRANDMOTHERS
    // ─────────────────────────────────────────────────────────────────────

    case HeirType.GRANDMOTHER_MATERNAL:
    case HeirType.GRANDMOTHER_PATERNAL: {
      notes.push('Grandmother: 1/6 (shared if multiple)');
      return {
        heirType: type,
        share: FRACTION.SIXTH,
        category: ShareCategory.FURUDH,
        isAsabah: false,
        notes,
      };
    }

    // ─────────────────────────────────────────────────────────────────────
    // DAUGHTERS
    // ─────────────────────────────────────────────────────────────────────

    case HeirType.DAUGHTER: {
      if (flags.HAS_SON) {
        notes.push('With son: asabah bil ghayr (2:1 ratio)');
        return {
          heirType: type,
          share: FRACTION.ZERO,
          category: ShareCategory.ASABAH,
          isAsabah: true,
          notes,
        };
      } else if (heir.count === 1) {
        notes.push('Single daughter: 1/2');
        return {
          heirType: type,
          share: FRACTION.HALF,
          category: ShareCategory.FURUDH,
          isAsabah: false,
          notes,
        };
      } else {
        notes.push('Two or more daughters: 2/3 (shared)');
        return {
          heirType: type,
          share: FRACTION.TWO_THIRDS,
          category: ShareCategory.FURUDH,
          isAsabah: false,
          notes,
        };
      }
    }

    // ─────────────────────────────────────────────────────────────────────
    // GRANDDAUGHTERS
    // ─────────────────────────────────────────────────────────────────────

    case HeirType.GRANDDAUGHTER_SON: {
      const daughterCount = getHeirCount(allHeirs, HeirType.DAUGHTER);
      const gransonCount = getHeirCount(allHeirs, HeirType.GRANDSON_SON);

      if (gransonCount > 0) {
        notes.push('With grandson: asabah bil ghayr');
        return {
          heirType: type,
          share: FRACTION.ZERO,
          category: ShareCategory.ASABAH,
          isAsabah: true,
          notes,
        };
      } else if (daughterCount >= 2) {
        // Blocked - 2+ daughters take the full 2/3
        notes.push('With 2+ daughters: excluded (2/3 exhausted)');
        return {
          heirType: type,
          share: FRACTION.ZERO,
          category: ShareCategory.BLOCKED,
          isAsabah: false,
          notes,
        };
      } else if (daughterCount === 1) {
        notes.push('With 1 daughter: 1/6 (completion of 2/3)');
        return {
          heirType: type,
          share: FRACTION.SIXTH,
          category: ShareCategory.FURUDH,
          isAsabah: false,
          notes,
        };
      } else if (heir.count === 1) {
        notes.push('Single granddaughter: 1/2');
        return {
          heirType: type,
          share: FRACTION.HALF,
          category: ShareCategory.FURUDH,
          isAsabah: false,
          notes,
        };
      } else {
        notes.push('Two or more granddaughters: 2/3 (shared)');
        return {
          heirType: type,
          share: FRACTION.TWO_THIRDS,
          category: ShareCategory.FURUDH,
          isAsabah: false,
          notes,
        };
      }
    }

    // ─────────────────────────────────────────────────────────────────────
    // SONS & GRANDSONS (Always Asabah)
    // ─────────────────────────────────────────────────────────────────────

    case HeirType.SON: {
      notes.push('Son: asabah bi nafs');
      return {
        heirType: type,
        share: FRACTION.ZERO,
        category: ShareCategory.ASABAH,
        isAsabah: true,
        notes,
      };
    }

    case HeirType.GRANDSON_SON: {
      notes.push('Grandson: asabah bi nafs');
      return {
        heirType: type,
        share: FRACTION.ZERO,
        category: ShareCategory.ASABAH,
        isAsabah: true,
        notes,
      };
    }

    // ─────────────────────────────────────────────────────────────────────
    // FULL SIBLINGS
    // ─────────────────────────────────────────────────────────────────────

    case HeirType.BROTHER_FULL: {
      notes.push('Full brother: asabah bi nafs');
      return {
        heirType: type,
        share: FRACTION.ZERO,
        category: ShareCategory.ASABAH,
        isAsabah: true,
        notes,
      };
    }

    case HeirType.SISTER_FULL: {
      const fullBrotherCount = getHeirCount(allHeirs, HeirType.BROTHER_FULL);

      if (fullBrotherCount > 0) {
        notes.push('With full brother: asabah bil ghayr');
        return {
          heirType: type,
          share: FRACTION.ZERO,
          category: ShareCategory.ASABAH,
          isAsabah: true,
          notes,
        };
      } else if (flags.HAS_DAUGHTER || flags.HAS_GRANDDAUGHTER) {
        notes.push('With daughters: asabah maal ghayr');
        return {
          heirType: type,
          share: FRACTION.ZERO,
          category: ShareCategory.ASABAH,
          isAsabah: true,
          notes,
        };
      } else if (heir.count === 1) {
        notes.push('Single full sister: 1/2');
        return {
          heirType: type,
          share: FRACTION.HALF,
          category: ShareCategory.FURUDH,
          isAsabah: false,
          notes,
        };
      } else {
        notes.push('Two or more full sisters: 2/3 (shared)');
        return {
          heirType: type,
          share: FRACTION.TWO_THIRDS,
          category: ShareCategory.FURUDH,
          isAsabah: false,
          notes,
        };
      }
    }

    // ─────────────────────────────────────────────────────────────────────
    // PATERNAL SIBLINGS
    // ─────────────────────────────────────────────────────────────────────

    case HeirType.BROTHER_PATERNAL: {
      notes.push('Paternal brother: asabah bi nafs');
      return {
        heirType: type,
        share: FRACTION.ZERO,
        category: ShareCategory.ASABAH,
        isAsabah: true,
        notes,
      };
    }

    case HeirType.SISTER_PATERNAL: {
      const paternalBrotherCount = getHeirCount(allHeirs, HeirType.BROTHER_PATERNAL);
      const fullSisterCount = getHeirCount(allHeirs, HeirType.SISTER_FULL);

      if (paternalBrotherCount > 0) {
        notes.push('With paternal brother: asabah bil ghayr');
        return {
          heirType: type,
          share: FRACTION.ZERO,
          category: ShareCategory.ASABAH,
          isAsabah: true,
          notes,
        };
      } else if (fullSisterCount >= 2) {
        notes.push('With 2+ full sisters: excluded (2/3 exhausted)');
        return {
          heirType: type,
          share: FRACTION.ZERO,
          category: ShareCategory.BLOCKED,
          isAsabah: false,
          notes,
        };
      } else if (fullSisterCount === 1) {
        notes.push('With 1 full sister: 1/6 (completion of 2/3)');
        return {
          heirType: type,
          share: FRACTION.SIXTH,
          category: ShareCategory.FURUDH,
          isAsabah: false,
          notes,
        };
      } else if (heir.count === 1) {
        notes.push('Single paternal sister: 1/2');
        return {
          heirType: type,
          share: FRACTION.HALF,
          category: ShareCategory.FURUDH,
          isAsabah: false,
          notes,
        };
      } else {
        notes.push('Two or more paternal sisters: 2/3 (shared)');
        return {
          heirType: type,
          share: FRACTION.TWO_THIRDS,
          category: ShareCategory.FURUDH,
          isAsabah: false,
          notes,
        };
      }
    }

    // ─────────────────────────────────────────────────────────────────────
    // UTERINE SIBLINGS (Always Furudh)
    // ─────────────────────────────────────────────────────────────────────

    case HeirType.BROTHER_UTERINE:
    case HeirType.SISTER_UTERINE: {
      // Already checked by hijab, but guard anyway
      if (flags.HAS_DESCENDANT || flags.HAS_FATHER) {
        notes.push('Excluded by descendant or father');
        return {
          heirType: type,
          share: FRACTION.ZERO,
          category: ShareCategory.BLOCKED,
          isAsabah: false,
          notes,
        };
      }

      const uterineTotal =
        getHeirCount(allHeirs, HeirType.BROTHER_UTERINE) +
        getHeirCount(allHeirs, HeirType.SISTER_UTERINE);

      if (uterineTotal === 1) {
        notes.push('Single uterine sibling: 1/6');
        return {
          heirType: type,
          share: FRACTION.SIXTH,
          category: ShareCategory.FURUDH,
          isAsabah: false,
          notes,
        };
      } else {
        notes.push('Two or more uterine siblings: 1/3 (shared equally)');
        return {
          heirType: type,
          share: FRACTION.THIRD,
          category: ShareCategory.FURUDH,
          isAsabah: false,
          notes,
        };
      }
    }

    // ─────────────────────────────────────────────────────────────────────
    // EXTENDED ASABAH (Always Asabah)
    // ─────────────────────────────────────────────────────────────────────

    case HeirType.NEPHEW_FULL:
    case HeirType.NEPHEW_PATERNAL:
    case HeirType.UNCLE_FULL:
    case HeirType.UNCLE_PATERNAL:
    case HeirType.COUSIN_FULL:
    case HeirType.COUSIN_PATERNAL: {
      notes.push('Extended male relative: asabah bi nafs');
      return {
        heirType: type,
        share: FRACTION.ZERO,
        category: ShareCategory.ASABAH,
        isAsabah: true,
        notes,
      };
    }

    // ─────────────────────────────────────────────────────────────────────
    // DHAWIL ARHAM
    // ─────────────────────────────────────────────────────────────────────

    default: {
      notes.push('Dhawil arham: no fixed share');
      return {
        heirType: type,
        share: FRACTION.ZERO,
        category: ShareCategory.DHAWIL_ARHAM,
        isAsabah: false,
        notes,
      };
    }
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// Helper Functions
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Calculates total furudh and asal masalah.
 */
function calculateTotals(shares: FurudhShareResult[]): {
  totalFurudh: Fraction;
  asalMasalah: number;
} {
  // Get all furudh shares (excluding pure asabah)
  const furudhShares = shares
    .filter(
      (s) => s.category === ShareCategory.FURUDH || s.category === ShareCategory.FURUDH_AND_ASABAH
    )
    .map((s) => s.share);

  if (furudhShares.length === 0) {
    return { totalFurudh: FRACTION.ZERO, asalMasalah: 1 };
  }

  // Find common denominator
  const denominators = furudhShares.map((f) => f.denominator);
  let asalMasalah = denominators[0];
  for (let i = 1; i < denominators.length; i++) {
    asalMasalah = lcm(asalMasalah, denominators[i]);
  }

  // Sum numerators
  let totalNumerator = 0;
  for (const share of furudhShares) {
    totalNumerator += share.numerator * (asalMasalah / share.denominator);
  }

  return {
    totalFurudh: fraction(totalNumerator, asalMasalah),
    asalMasalah,
  };
}

/**
 * Least common multiple.
 */
function lcm(a: number, b: number): number {
  return (a * b) / gcd(a, b);
}

/**
 * Greatest common divisor.
 */
function gcd(a: number, b: number): number {
  while (b !== 0) {
    const temp = b;
    b = a % b;
    a = temp;
  }
  return a;
}
