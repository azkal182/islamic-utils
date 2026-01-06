/**
 * @fileoverview Special cases handler
 * @module inheritance/rules/special-cases
 *
 * Implements the 10 special cases from SPECIAL_CASE_RULES_INHERITANCE.md.
 */

import type {
  HeirInput,
  DerivedFlags,
  InheritancePolicy,
  InheritanceTraceStep,
  SpecialCaseId,
} from '../types';
import { HeirType, SPECIAL_CASES } from '../types';
import type { Fraction } from '../utils/fraction';
import { FRACTION, fraction } from '../utils/fraction';
import { getHeirCount } from '../flags';

// ═══════════════════════════════════════════════════════════════════════════
// Types
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Result of special case detection.
 */
export interface SpecialCaseDetection {
  readonly detected: boolean;
  readonly caseId: SpecialCaseId | null;
  readonly caseName: string | null;
  readonly arabicName: string | null;
  readonly trace: InheritanceTraceStep[];
}

/**
 * Result of applying a special case.
 */
export interface SpecialCaseApplication {
  readonly shares: Map<HeirType, Fraction>;
  readonly overrides: string[];
  readonly trace: InheritanceTraceStep[];
}

// ═══════════════════════════════════════════════════════════════════════════
// Detection Functions (Ordered by Priority)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Detects which special case (if any) applies.
 *
 * @param heirs - List of heirs
 * @param flags - Derived flags
 * @param policy - Inheritance policy
 * @returns Detection result
 */
export function detectSpecialCase(
  heirs: HeirInput[],
  flags: DerivedFlags,
  _policy: InheritancePolicy
): SpecialCaseDetection {
  const trace: InheritanceTraceStep[] = [];

  trace.push({
    step: 1,
    phase: 'SPECIAL_CASE',
    description: 'Checking for special cases (10 cases, priority order)',
    arabicTerm: 'فحص المسائل الخاصة',
    value: 'Checking in priority order: 1-10',
  });

  // SC-01: UMARIYATAYN
  if (checkUmariyatayn(heirs, flags)) {
    const sc = SPECIAL_CASES.find((s) => s.id === 'umariyatayn')!;
    trace.push({
      step: 2,
      phase: 'SPECIAL_CASE',
      description: `Special case detected: ${sc.name}`,
      arabicTerm: sc.arabicName,
      value: sc.description,
    });
    return {
      detected: true,
      caseId: 'umariyatayn',
      caseName: sc.name,
      arabicName: sc.arabicName,
      trace,
    };
  }

  // SC-02: MUSHTARAKAH
  if (checkMushtarakah(heirs, flags)) {
    const sc = SPECIAL_CASES.find((s) => s.id === 'mushtarakah')!;
    trace.push({
      step: 2,
      phase: 'SPECIAL_CASE',
      description: `Special case detected: ${sc.name}`,
      arabicTerm: sc.arabicName,
      value: sc.description,
    });
    return {
      detected: true,
      caseId: 'mushtarakah',
      caseName: sc.name,
      arabicName: sc.arabicName,
      trace,
    };
  }

  // SC-03: AKDARIYYAH
  if (checkAkdariyyah(heirs, flags)) {
    const sc = SPECIAL_CASES.find((s) => s.id === 'akdariyyah')!;
    trace.push({
      step: 2,
      phase: 'SPECIAL_CASE',
      description: `Special case detected: ${sc.name}`,
      arabicTerm: sc.arabicName,
      value: sc.description,
    });
    return {
      detected: true,
      caseId: 'akdariyyah',
      caseName: sc.name,
      arabicName: sc.arabicName,
      trace,
    };
  }

  // SC-04: SISTERS_MAAL_GHAYR
  if (checkSistersMaalGhayr(heirs, flags)) {
    const sc = SPECIAL_CASES.find((s) => s.id === 'sisters_maal_ghayr')!;
    trace.push({
      step: 2,
      phase: 'SPECIAL_CASE',
      description: `Special case detected: ${sc.name}`,
      arabicTerm: sc.arabicName,
      value: sc.description,
    });
    return {
      detected: true,
      caseId: 'sisters_maal_ghayr',
      caseName: sc.name,
      arabicName: sc.arabicName,
      trace,
    };
  }

  // SC-05: COMPLETION_TWO_THIRDS
  if (checkCompletionTwoThirds(heirs, flags)) {
    const sc = SPECIAL_CASES.find((s) => s.id === 'completion_two_thirds')!;
    trace.push({
      step: 2,
      phase: 'SPECIAL_CASE',
      description: `Special case detected: ${sc.name}`,
      arabicTerm: sc.arabicName,
      value: sc.description,
    });
    return {
      detected: true,
      caseId: 'completion_two_thirds',
      caseName: sc.name,
      arabicName: sc.arabicName,
      trace,
    };
  }

  // SC-06: KALALAH_UTERINE
  if (checkKalalahUterine(heirs, flags)) {
    const sc = SPECIAL_CASES.find((s) => s.id === 'kalalah_uterine')!;
    trace.push({
      step: 2,
      phase: 'SPECIAL_CASE',
      description: `Special case detected: ${sc.name}`,
      arabicTerm: sc.arabicName,
      value: sc.description,
    });
    return {
      detected: true,
      caseId: 'kalalah_uterine',
      caseName: sc.name,
      arabicName: sc.arabicName,
      trace,
    };
  }

  // SC-07: MULTIPLE_GRANDMOTHERS
  if (checkMultipleGrandmothers(heirs, flags)) {
    const sc = SPECIAL_CASES.find((s) => s.id === 'multiple_grandmothers')!;
    trace.push({
      step: 2,
      phase: 'SPECIAL_CASE',
      description: `Special case detected: ${sc.name}`,
      arabicTerm: sc.arabicName,
      value: sc.description,
    });
    return {
      detected: true,
      caseId: 'multiple_grandmothers',
      caseName: sc.name,
      arabicName: sc.arabicName,
      trace,
    };
  }

  // SC-08 to SC-10 are handled later (RADD, DHAWIL_ARHAM, NO_HEIRS)

  trace.push({
    step: 2,
    phase: 'SPECIAL_CASE',
    description: 'No special case detected - using general rules',
    arabicTerm: 'القواعد العامة',
    value: 'Proceeding with standard Furudh/Asabah calculation',
  });

  return { detected: false, caseId: null, caseName: null, arabicName: null, trace };
}

// ═══════════════════════════════════════════════════════════════════════════
// Individual Case Checkers
// ═══════════════════════════════════════════════════════════════════════════

/**
 * SC-01: Umariyatayn (العُمَرِيَّتَان)
 * Condition: Spouse + Mother + Father, no descendant
 */
function checkUmariyatayn(_heirs: HeirInput[], flags: DerivedFlags): boolean {
  return flags.HAS_SPOUSE && flags.HAS_MOTHER && flags.HAS_FATHER && !flags.HAS_DESCENDANT;
}

/**
 * SC-02: Mushtarakah (المُشْتَرَكَة)
 * Condition: Husband + Mother + uterine siblings (2+) + full siblings (1+)
 */
function checkMushtarakah(heirs: HeirInput[], flags: DerivedFlags): boolean {
  const husbandCount = getHeirCount(heirs, HeirType.HUSBAND);
  const uterineCount =
    getHeirCount(heirs, HeirType.BROTHER_UTERINE) + getHeirCount(heirs, HeirType.SISTER_UTERINE);
  const fullCount =
    getHeirCount(heirs, HeirType.BROTHER_FULL) + getHeirCount(heirs, HeirType.SISTER_FULL);

  return (
    husbandCount > 0 &&
    flags.HAS_MOTHER &&
    uterineCount >= 2 &&
    fullCount >= 1 &&
    !flags.HAS_DESCENDANT &&
    !flags.HAS_FATHER
  );
}

/**
 * SC-03: Akdariyyah (الأكدرية)
 * Condition: Husband + Mother + Grandfather + 1 Full sister, no father, no descendant
 */
function checkAkdariyyah(heirs: HeirInput[], flags: DerivedFlags): boolean {
  const husbandCount = getHeirCount(heirs, HeirType.HUSBAND);
  const grandfatherCount = getHeirCount(heirs, HeirType.GRANDFATHER_PATERNAL);
  const fullSisterCount = getHeirCount(heirs, HeirType.SISTER_FULL);

  return (
    husbandCount > 0 &&
    flags.HAS_MOTHER &&
    grandfatherCount > 0 &&
    fullSisterCount === 1 &&
    !flags.HAS_FATHER &&
    !flags.HAS_DESCENDANT
  );
}

/**
 * SC-04: Sisters as Asabah Maal Ghayr
 * Condition: Daughter present + Sisters present + no son + no father
 */
function checkSistersMaalGhayr(heirs: HeirInput[], flags: DerivedFlags): boolean {
  const hasFullSister = getHeirCount(heirs, HeirType.SISTER_FULL) > 0;
  const hasPaternalSister = getHeirCount(heirs, HeirType.SISTER_PATERNAL) > 0;
  const hasFullBrother = getHeirCount(heirs, HeirType.BROTHER_FULL) > 0;
  const hasPaternalBrother = getHeirCount(heirs, HeirType.BROTHER_PATERNAL) > 0;

  return (
    flags.HAS_DAUGHTER &&
    !flags.HAS_SON &&
    (hasFullSister || hasPaternalSister) &&
    !hasFullBrother &&
    !hasPaternalBrother &&
    !flags.HAS_FATHER
  );
}

/**
 * SC-05: Completion of Two-Thirds
 * Condition: Exactly 1 daughter + granddaughter(s) + no son
 */
function checkCompletionTwoThirds(heirs: HeirInput[], flags: DerivedFlags): boolean {
  const daughterCount = getHeirCount(heirs, HeirType.DAUGHTER);
  const granddaughterCount = getHeirCount(heirs, HeirType.GRANDDAUGHTER_SON);

  return daughterCount === 1 && granddaughterCount >= 1 && !flags.HAS_SON;
}

/**
 * SC-06: Kalalah with Uterine Siblings
 * Condition: No descendant + no father + uterine siblings present
 */
function checkKalalahUterine(_heirs: HeirInput[], flags: DerivedFlags): boolean {
  return !flags.HAS_DESCENDANT && !flags.HAS_FATHER && flags.HAS_UTERINE_SIBLINGS;
}

/**
 * SC-07: Multiple Grandmothers
 * Condition: 2+ grandmothers present
 */
function checkMultipleGrandmothers(heirs: HeirInput[], _flags: DerivedFlags): boolean {
  const maternalGM = getHeirCount(heirs, HeirType.GRANDMOTHER_MATERNAL);
  const paternalGM = getHeirCount(heirs, HeirType.GRANDMOTHER_PATERNAL);

  return maternalGM + paternalGM >= 2;
}

// ═══════════════════════════════════════════════════════════════════════════
// Application Functions
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Applies the Umariyatayn special case.
 * Mother receives 1/3 of remainder (after spouse), not 1/3 of total.
 */
export function applyUmariyatayn(heirs: HeirInput[], _flags: DerivedFlags): SpecialCaseApplication {
  const trace: InheritanceTraceStep[] = [];
  const shares = new Map<HeirType, Fraction>();

  const hasHusband = getHeirCount(heirs, HeirType.HUSBAND) > 0;

  if (hasHusband) {
    // Husband + Mother + Father, no descendant
    // Husband: 1/2, Mother: 1/3 of remainder = 1/6, Father: remainder
    shares.set(HeirType.HUSBAND, FRACTION.HALF);

    // Mother: 1/3 of (1 - 1/2) = 1/3 of 1/2 = 1/6
    shares.set(HeirType.MOTHER, FRACTION.SIXTH);

    // Father: remainder = 1 - 1/2 - 1/6 = 2/6 = 1/3
    shares.set(HeirType.FATHER, FRACTION.THIRD);

    trace.push({
      step: 1,
      phase: 'SPECIAL_CASE',
      description: 'Applying Umariyatayn (Husband case)',
      arabicTerm: 'العُمَرِيَّة الأولى',
      value: {
        husband: '1/2',
        mother: '1/6 (1/3 of remainder)',
        father: '1/3 (remainder)',
      },
      formula: 'Mother gets 1/3 of remainder to ensure Father >= Mother',
    });
  } else {
    // Wife + Mother + Father, no descendant
    // Wife: 1/4, Mother: 1/3 of remainder = 1/4, Father: remainder
    shares.set(HeirType.WIFE, FRACTION.QUARTER);

    // Mother: 1/3 of (1 - 1/4) = 1/3 of 3/4 = 3/12 = 1/4
    shares.set(HeirType.MOTHER, FRACTION.QUARTER);

    // Father: remainder = 1 - 1/4 - 1/4 = 2/4 = 1/2
    shares.set(HeirType.FATHER, FRACTION.HALF);

    trace.push({
      step: 1,
      phase: 'SPECIAL_CASE',
      description: 'Applying Umariyatayn (Wife case)',
      arabicTerm: 'العُمَرِيَّة الثانية',
      value: {
        wife: '1/4',
        mother: '1/4 (1/3 of remainder)',
        father: '1/2 (remainder)',
      },
      formula: 'Mother gets 1/3 of remainder to ensure Father >= Mother',
    });
  }

  return {
    shares,
    overrides: ['GENERAL_MOTHER_RULE', 'RADD'],
    trace,
  };
}

/**
 * Applies the Mushtarakah special case.
 * Full siblings share 1/3 with uterine siblings equally.
 */
export function applyMushtarakah(
  heirs: HeirInput[],
  _flags: DerivedFlags,
  _policy: InheritancePolicy
): SpecialCaseApplication {
  const trace: InheritanceTraceStep[] = [];
  const shares = new Map<HeirType, Fraction>();

  // Standard assignment
  shares.set(HeirType.HUSBAND, FRACTION.HALF);
  shares.set(HeirType.MOTHER, FRACTION.SIXTH);

  // Combined 1/3 for all siblings (uterine + full)
  const uterineCount =
    getHeirCount(heirs, HeirType.BROTHER_UTERINE) + getHeirCount(heirs, HeirType.SISTER_UTERINE);
  const fullCount =
    getHeirCount(heirs, HeirType.BROTHER_FULL) + getHeirCount(heirs, HeirType.SISTER_FULL);
  const totalSiblings = uterineCount + fullCount;

  // Each sibling gets 1/3 ÷ totalSiblings
  const siblingShare = fraction(1, 3 * totalSiblings);

  if (getHeirCount(heirs, HeirType.BROTHER_UTERINE) > 0) {
    shares.set(HeirType.BROTHER_UTERINE, siblingShare);
  }
  if (getHeirCount(heirs, HeirType.SISTER_UTERINE) > 0) {
    shares.set(HeirType.SISTER_UTERINE, siblingShare);
  }
  if (getHeirCount(heirs, HeirType.BROTHER_FULL) > 0) {
    shares.set(HeirType.BROTHER_FULL, siblingShare);
  }
  if (getHeirCount(heirs, HeirType.SISTER_FULL) > 0) {
    shares.set(HeirType.SISTER_FULL, siblingShare);
  }

  trace.push({
    step: 1,
    phase: 'SPECIAL_CASE',
    description: 'Applying Mushtarakah',
    arabicTerm: 'المُشْتَرَكَة أو الحِمَارِيَّة',
    value: {
      husband: '1/2',
      mother: '1/6',
      siblings: `1/3 shared equally among ${totalSiblings} siblings`,
    },
    formula: 'Full siblings join uterine siblings in 1/3 share',
  });

  return {
    shares,
    overrides: ['ASABAH', 'RADD'],
    trace,
  };
}
