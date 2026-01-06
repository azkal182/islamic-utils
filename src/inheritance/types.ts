/**
 * @fileoverview Inheritance module type definitions
 * @module inheritance/types
 *
 * Comprehensive types for Islamic inheritance (Faraidh) calculations
 * based on DECISION_MATRIX_WARIS.md specifications.
 */

import type { TraceStep } from '../core/types/result';
import type { Fraction } from './utils/fraction';

// ═══════════════════════════════════════════════════════════════════════════
// SECTION 1 - Heir Types (30+ types)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * All possible heir types in Islamic inheritance.
 *
 * @remarks
 * Organized by category as per DECISION_MATRIX_WARIS.md Section 1.
 */
export const HeirType = {
  // === SPOUSE ===
  HUSBAND: 'husband',
  WIFE: 'wife',

  // === ASCENDANTS ===
  FATHER: 'father',
  MOTHER: 'mother',
  GRANDFATHER_PATERNAL: 'grandfather_paternal',
  GRANDMOTHER_MATERNAL: 'grandmother_maternal',
  GRANDMOTHER_PATERNAL: 'grandmother_paternal',

  // === DESCENDANTS ===
  SON: 'son',
  DAUGHTER: 'daughter',
  GRANDSON_SON: 'grandson_son',
  GRANDDAUGHTER_SON: 'granddaughter_son',

  // === SIBLINGS ===
  BROTHER_FULL: 'brother_full',
  SISTER_FULL: 'sister_full',
  BROTHER_PATERNAL: 'brother_paternal',
  SISTER_PATERNAL: 'sister_paternal',
  BROTHER_UTERINE: 'brother_uterine',
  SISTER_UTERINE: 'sister_uterine',

  // === EXTENDED ASABAH ===
  NEPHEW_FULL: 'nephew_full',
  NEPHEW_PATERNAL: 'nephew_paternal',
  UNCLE_FULL: 'uncle_full',
  UNCLE_PATERNAL: 'uncle_paternal',
  COUSIN_FULL: 'cousin_full',
  COUSIN_PATERNAL: 'cousin_paternal',

  // === DHAWIL ARHAM ===
  GRANDCHILD_DAUGHTER: 'grandchild_daughter',
  AUNT_MATERNAL: 'aunt_maternal',
  AUNT_PATERNAL: 'aunt_paternal',
  UNCLE_MATERNAL: 'uncle_maternal',
  OTHER_DHAWIL_ARHAM: 'other_dhawil_arham',
} as const;

export type HeirType = (typeof HeirType)[keyof typeof HeirType];

/**
 * Heir category classification.
 */
export const HeirCategory = {
  SPOUSE: 'spouse',
  ASCENDANT: 'ascendant',
  DESCENDANT: 'descendant',
  SIBLING: 'sibling',
  EXTENDED_ASABAH: 'extended_asabah',
  DHAWIL_ARHAM: 'dhawil_arham',
} as const;

export type HeirCategory = (typeof HeirCategory)[keyof typeof HeirCategory];

/**
 * Share category classification.
 */
export const ShareCategory = {
  FURUDH: 'furudh', // Fixed share (1/2, 1/3, etc.)
  ASABAH: 'asabah', // Remainder heir
  FURUDH_AND_ASABAH: 'furudh_and_asabah', // Both (e.g., father with daughters)
  BLOCKED: 'blocked', // Excluded by hijab
  DHAWIL_ARHAM: 'dhawil_arham',
} as const;

export type ShareCategory = (typeof ShareCategory)[keyof typeof ShareCategory];

/**
 * Asabah (residuary heir) type classification.
 */
export const AsabahType = {
  BI_NAFS: 'bi_nafs', // By themselves (male relatives)
  BIL_GHAYR: 'bil_ghayr', // Through another (women with male siblings)
  MAA_GHAYR: 'maa_ghayr', // With another (sisters with daughters)
} as const;

export type AsabahType = (typeof AsabahType)[keyof typeof AsabahType];

// ═══════════════════════════════════════════════════════════════════════════
// SECTION 2 - Policy Configuration (Ikhtilaf Handling)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Policy configuration for handling scholarly differences (ikhtilaf).
 *
 * @remarks
 * Based on DECISION_MATRIX_WARIS.md Section 3.
 */
export interface InheritancePolicy {
  /**
   * Whether spouse receives radd (remainder redistribution).
   *
   * @default false
   * @remarks Most madhabs exclude spouse from radd.
   */
  readonly raddIncludesSpouse: boolean;

  /**
   * How grandfather is treated with siblings.
   *
   * @default 'COMPETE_WITH_SIBLINGS'
   * @remarks
   * - LIKE_FATHER: Grandfather blocks siblings entirely
   * - COMPETE_WITH_SIBLINGS: Grandfather competes with siblings
   */
  readonly grandfatherMode: 'LIKE_FATHER' | 'COMPETE_WITH_SIBLINGS';

  /**
   * Whether to include Dhawil Arham or assign to Baitul Mal.
   *
   * @default 'ENABLED'
   */
  readonly dhawilArhamMode: 'ENABLED' | 'BAITUL_MAL';

  /**
   * How siblings affect mother's share calculation.
   *
   * @default 'COUNT_ALL'
   */
  readonly motherSiblingRule: 'COUNT_ALL' | 'EXCLUDE_UTERINE';

  /**
   * Mushtarakah case handling.
   *
   * @default 'UMAR'
   * @remarks
   * - STANDARD: Uterine siblings get 1/3, full brothers get nothing
   * - UMAR: All siblings share 1/3 equally
   */
  readonly mushtarakahPolicy: 'STANDARD' | 'UMAR';
}

/**
 * Default policy configuration.
 */
export const DEFAULT_POLICY: InheritancePolicy = {
  raddIncludesSpouse: false,
  grandfatherMode: 'COMPETE_WITH_SIBLINGS',
  dhawilArhamMode: 'ENABLED',
  motherSiblingRule: 'COUNT_ALL',
  mushtarakahPolicy: 'UMAR',
};

// ═══════════════════════════════════════════════════════════════════════════
// SECTION 3 - Input Types
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Estate (harta warisan) input.
 */
export interface EstateInput {
  /**
   * Gross value of the estate.
   */
  readonly grossValue: number;

  /**
   * Outstanding debts.
   * @default 0
   */
  readonly debts?: number;

  /**
   * Funeral costs (tajhiz).
   * @default 0
   */
  readonly funeralCosts?: number;

  /**
   * Bequest (wasiyyah) - will be limited to 1/3 of remaining.
   * @default 0
   */
  readonly wasiyyah?: number;

  /**
   * If true, wasiyyah can exceed 1/3 (approved by heirs).
   * @default false
   */
  readonly wasiyyahApprovedByHeirs?: boolean;

  /**
   * Currency code for display purposes.
   * @default 'IDR'
   */
  readonly currency?: string;
}

/**
 * Single heir input.
 */
export interface HeirInput {
  /**
   * Type of heir.
   */
  readonly type: HeirType;

  /**
   * Number of heirs of this type.
   * @example 3 sons, 2 daughters
   */
  readonly count: number;
}

/**
 * Deceased person information.
 */
export interface DeceasedInfo {
  /**
   * Gender of the deceased.
   */
  readonly gender: 'male' | 'female';
}

/**
 * Main input for inheritance calculation.
 */
export interface InheritanceInput {
  /**
   * Estate information.
   */
  readonly estate: EstateInput;

  /**
   * List of heirs.
   */
  readonly heirs: HeirInput[];

  /**
   * Deceased person information.
   */
  readonly deceased: DeceasedInfo;

  /**
   * Optional policy overrides.
   */
  readonly policy?: Partial<InheritancePolicy>;
}

/**
 * Options for inheritance calculation.
 */
export interface InheritanceOptions {
  /**
   * Whether to include detailed trace.
   * @default true (trace is always included for inheritance)
   */
  readonly includeTrace?: boolean;
}

// ═══════════════════════════════════════════════════════════════════════════
// SECTION 4 - Derived Flags
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Boolean flags derived from heir list.
 *
 * @remarks
 * Based on DECISION_MATRIX_WARIS.md Section 2.
 */
export interface DerivedFlags {
  readonly HAS_CHILD: boolean;
  readonly HAS_SON: boolean;
  readonly HAS_DAUGHTER: boolean;
  readonly HAS_GRANDSON: boolean;
  readonly HAS_GRANDDAUGHTER: boolean;
  readonly HAS_DESCENDANT: boolean;
  readonly HAS_FATHER: boolean;
  readonly HAS_MOTHER: boolean;
  readonly HAS_GRANDFATHER: boolean;
  readonly HAS_GRANDMOTHER: boolean;
  readonly HAS_SIBLINGS_TOTAL: number;
  readonly HAS_TWO_OR_MORE_SIBLINGS: boolean;
  readonly HAS_UTERINE_SIBLINGS: boolean;
  readonly HAS_FULL_SIBLINGS: boolean;
  readonly HAS_PATERNAL_SIBLINGS: boolean;
  readonly HAS_HUSBAND: boolean;
  readonly HAS_WIFE: boolean;
  readonly HAS_SPOUSE: boolean;
}

// ═══════════════════════════════════════════════════════════════════════════
// SECTION 5 - Output Types
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Estate calculation result.
 */
export interface EstateResult {
  readonly grossValue: number;
  readonly deductions: {
    readonly funeralCosts: number;
    readonly debts: number;
    readonly wasiyyah: number;
    readonly wasiyyahOriginal: number;
    readonly wasiyyahCapped: boolean;
  };
  readonly netEstate: number;
  readonly currency: string;
}

/**
 * Share calculation for a single heir type.
 */
export interface HeirShare {
  /**
   * Heir type.
   */
  readonly heirType: HeirType;

  /**
   * Number of heirs of this type.
   */
  readonly count: number;

  /**
   * Share category.
   */
  readonly category: ShareCategory;

  /**
   * Asabah type if applicable.
   */
  readonly asabahType?: AsabahType;

  /**
   * Original furudh share before adjustments.
   */
  readonly originalShare?: Fraction;

  /**
   * Final share after aul/radd adjustments.
   */
  readonly finalShare: Fraction;

  /**
   * Total absolute value for this heir type.
   */
  readonly totalValue: number;

  /**
   * Value per person (totalValue / count).
   */
  readonly perPersonValue: number;

  /**
   * Is this heir blocked by hijab?
   */
  readonly isBlocked: boolean;

  /**
   * Which heir types blocked this heir.
   */
  readonly blockedBy?: HeirType[];

  /**
   * Additional notes/explanations.
   */
  readonly notes?: string[];
}

/**
 * Summary of the inheritance calculation.
 */
export interface InheritanceSummary {
  /**
   * Total value distributed.
   */
  readonly totalDistributed: number;

  /**
   * Whether Aul was applied.
   */
  readonly aulApplied: boolean;

  /**
   * Aul adjustment ratio if applied.
   */
  readonly aulRatio?: Fraction;

  /**
   * Original denominator before Aul.
   */
  readonly aulOriginalDenominator?: number;

  /**
   * New denominator after Aul.
   */
  readonly aulNewDenominator?: number;

  /**
   * Whether Radd was applied.
   */
  readonly raddApplied: boolean;

  /**
   * Remainder that was redistributed.
   */
  readonly raddRemainder?: Fraction;

  /**
   * Special case that was applied (if any).
   */
  readonly specialCase?: string;

  /**
   * Special case Arabic name.
   */
  readonly specialCaseArabic?: string;
}

/**
 * Metadata about the calculation.
 */
export interface InheritanceMeta {
  /**
   * Estate breakdown.
   */
  readonly estate: EstateResult;

  /**
   * Policy used for calculation.
   */
  readonly policy: InheritancePolicy;

  /**
   * Derived flags from heirs.
   */
  readonly flags: DerivedFlags;

  /**
   * Base denominator (Asal Masalah).
   */
  readonly asalMasalah: number;

  /**
   * Number of heirs.
   */
  readonly totalHeirs: number;

  /**
   * Number of blocked heirs.
   */
  readonly blockedHeirs: number;
}

/**
 * Inheritance-specific trace step.
 */
export interface InheritanceTraceStep extends TraceStep {
  /**
   * Phase of calculation.
   */
  readonly phase:
    | 'VALIDATION'
    | 'ESTATE'
    | 'FLAGS'
    | 'HIJAB'
    | 'SPECIAL_CASE'
    | 'FURUDH'
    | 'ASABAH'
    | 'AUL'
    | 'RADD'
    | 'DISTRIBUTION'
    | 'VERIFICATION';

  /**
   * Arabic term for this step (for verification with kitab).
   */
  readonly arabicTerm?: string;

  /**
   * Calculation formula if applicable.
   */
  readonly formula?: string;

  /**
   * Reference to kitab/source.
   */
  readonly reference?: string;
}

/**
 * Complete inheritance calculation result.
 */
export interface InheritanceResult {
  /**
   * Net estate value (after deductions).
   */
  readonly netEstate: number;

  /**
   * Individual share allocations.
   */
  readonly shares: HeirShare[];

  /**
   * Calculation summary.
   */
  readonly summary: InheritanceSummary;

  /**
   * Calculation metadata.
   */
  readonly meta: InheritanceMeta;

  /**
   * Detailed trace of calculation steps.
   *
   * @remarks
   * ALWAYS included for inheritance calculations.
   */
  readonly trace: InheritanceTraceStep[];

  /**
   * Verification that calculation is valid.
   */
  readonly verification: {
    readonly sumOfShares: number;
    readonly netEstate: number;
    readonly isValid: boolean;
    readonly difference: number;
  };
}

// ═══════════════════════════════════════════════════════════════════════════
// SECTION 6 - Special Case Types
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Special case identifier.
 */
export const SpecialCaseId = {
  UMARIYATAYN: 'umariyatayn',
  MUSHTARAKAH: 'mushtarakah',
  AKDARIYYAH: 'akdariyyah',
  SISTERS_MAAL_GHAYR: 'sisters_maal_ghayr',
  COMPLETION_TWO_THIRDS: 'completion_two_thirds',
  KALALAH_UTERINE: 'kalalah_uterine',
  MULTIPLE_GRANDMOTHERS: 'multiple_grandmothers',
  RADD: 'radd',
  DHAWIL_ARHAM: 'dhawil_arham',
  NO_HEIRS: 'no_heirs',
} as const;

export type SpecialCaseId = (typeof SpecialCaseId)[keyof typeof SpecialCaseId];

/**
 * Special case definition.
 */
export interface SpecialCase {
  readonly id: SpecialCaseId;
  readonly name: string;
  readonly arabicName: string;
  readonly priority: number;
  readonly description: string;
}

/**
 * All special cases in priority order.
 */
export const SPECIAL_CASES: SpecialCase[] = [
  {
    id: SpecialCaseId.UMARIYATAYN,
    name: "Umariyatayn (Two Umar's Cases)",
    arabicName: 'العُمَرِيَّتَان',
    priority: 1,
    description: 'Mother receives 1/3 of remainder instead of 1/3 of total',
  },
  {
    id: SpecialCaseId.MUSHTARAKAH,
    name: 'Mushtarakah/Himariyyah',
    arabicName: 'المُشْتَرَكَة',
    priority: 2,
    description: 'Full siblings share with uterine siblings in 1/3',
  },
  {
    id: SpecialCaseId.AKDARIYYAH,
    name: 'Akdariyyah',
    arabicName: 'الأكدرية',
    priority: 3,
    description: 'Complex case with grandfather, sister, husband, and mother',
  },
  {
    id: SpecialCaseId.SISTERS_MAAL_GHAYR,
    name: 'Sisters as Asabah Maal Ghayr',
    arabicName: 'الأخوات مع البنات',
    priority: 4,
    description: 'Sisters become asabah with presence of daughters',
  },
  {
    id: SpecialCaseId.COMPLETION_TWO_THIRDS,
    name: 'Completion of Two-Thirds',
    arabicName: 'تكميل الثلثين',
    priority: 5,
    description: 'Granddaughter receives 1/6 to complete 2/3 with daughter',
  },
  {
    id: SpecialCaseId.KALALAH_UTERINE,
    name: 'Kalalah with Uterine Siblings',
    arabicName: 'الكلالة',
    priority: 6,
    description: 'No descendants and no father, only uterine siblings',
  },
  {
    id: SpecialCaseId.MULTIPLE_GRANDMOTHERS,
    name: 'Multiple Grandmothers',
    arabicName: 'الجدات',
    priority: 7,
    description: 'Multiple grandmothers share 1/6 together',
  },
  {
    id: SpecialCaseId.RADD,
    name: 'Radd (Return of Remainder)',
    arabicName: 'الرد',
    priority: 8,
    description: 'Redistribute remainder when no asabah exists',
  },
  {
    id: SpecialCaseId.DHAWIL_ARHAM,
    name: 'Dhawil Arham Fallback',
    arabicName: 'ذوو الأرحام',
    priority: 9,
    description: 'Distant relatives inherit when no furudh/asabah',
  },
  {
    id: SpecialCaseId.NO_HEIRS,
    name: 'No Heirs (Baitul Mal)',
    arabicName: 'بيت المال',
    priority: 10,
    description: 'No heirs exist, estate goes to Baitul Mal',
  },
];

// ═══════════════════════════════════════════════════════════════════════════
// SECTION 7 - Conflict Validation Types
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Result of rule conflict validation.
 */
export interface ConflictValidationResult {
  /**
   * Whether validation passed (no conflicts).
   */
  readonly valid: boolean;

  /**
   * List of active special cases detected.
   */
  readonly activeCases: SpecialCaseId[];

  /**
   * Conflicts found (should always be empty if valid).
   */
  readonly conflicts: ConflictDescription[];
}

/**
 * Description of a conflict between rules.
 */
export interface ConflictDescription {
  readonly case1: SpecialCaseId;
  readonly case2: SpecialCaseId;
  readonly reason: string;
}

// ═══════════════════════════════════════════════════════════════════════════
// Helper Functions
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Gets the category of a heir type.
 */
export function getHeirCategory(type: HeirType): HeirCategory {
  switch (type) {
    case HeirType.HUSBAND:
    case HeirType.WIFE:
      return HeirCategory.SPOUSE;

    case HeirType.FATHER:
    case HeirType.MOTHER:
    case HeirType.GRANDFATHER_PATERNAL:
    case HeirType.GRANDMOTHER_MATERNAL:
    case HeirType.GRANDMOTHER_PATERNAL:
      return HeirCategory.ASCENDANT;

    case HeirType.SON:
    case HeirType.DAUGHTER:
    case HeirType.GRANDSON_SON:
    case HeirType.GRANDDAUGHTER_SON:
      return HeirCategory.DESCENDANT;

    case HeirType.BROTHER_FULL:
    case HeirType.SISTER_FULL:
    case HeirType.BROTHER_PATERNAL:
    case HeirType.SISTER_PATERNAL:
    case HeirType.BROTHER_UTERINE:
    case HeirType.SISTER_UTERINE:
      return HeirCategory.SIBLING;

    case HeirType.NEPHEW_FULL:
    case HeirType.NEPHEW_PATERNAL:
    case HeirType.UNCLE_FULL:
    case HeirType.UNCLE_PATERNAL:
    case HeirType.COUSIN_FULL:
    case HeirType.COUSIN_PATERNAL:
      return HeirCategory.EXTENDED_ASABAH;

    default:
      return HeirCategory.DHAWIL_ARHAM;
  }
}

/**
 * Gets Arabic name for a heir type.
 */
export function getHeirArabicName(type: HeirType): string {
  const names: Record<HeirType, string> = {
    [HeirType.HUSBAND]: 'الزوج',
    [HeirType.WIFE]: 'الزوجة',
    [HeirType.FATHER]: 'الأب',
    [HeirType.MOTHER]: 'الأم',
    [HeirType.GRANDFATHER_PATERNAL]: 'الجد',
    [HeirType.GRANDMOTHER_MATERNAL]: 'الجدة (أم الأم)',
    [HeirType.GRANDMOTHER_PATERNAL]: 'الجدة (أم الأب)',
    [HeirType.SON]: 'الابن',
    [HeirType.DAUGHTER]: 'البنت',
    [HeirType.GRANDSON_SON]: 'ابن الابن',
    [HeirType.GRANDDAUGHTER_SON]: 'بنت الابن',
    [HeirType.BROTHER_FULL]: 'الأخ الشقيق',
    [HeirType.SISTER_FULL]: 'الأخت الشقيقة',
    [HeirType.BROTHER_PATERNAL]: 'الأخ لأب',
    [HeirType.SISTER_PATERNAL]: 'الأخت لأب',
    [HeirType.BROTHER_UTERINE]: 'الأخ لأم',
    [HeirType.SISTER_UTERINE]: 'الأخت لأم',
    [HeirType.NEPHEW_FULL]: 'ابن الأخ الشقيق',
    [HeirType.NEPHEW_PATERNAL]: 'ابن الأخ لأب',
    [HeirType.UNCLE_FULL]: 'العم الشقيق',
    [HeirType.UNCLE_PATERNAL]: 'العم لأب',
    [HeirType.COUSIN_FULL]: 'ابن العم الشقيق',
    [HeirType.COUSIN_PATERNAL]: 'ابن العم لأب',
    [HeirType.GRANDCHILD_DAUGHTER]: 'ولد البنت',
    [HeirType.AUNT_MATERNAL]: 'الخالة',
    [HeirType.AUNT_PATERNAL]: 'العمة',
    [HeirType.UNCLE_MATERNAL]: 'الخال',
    [HeirType.OTHER_DHAWIL_ARHAM]: 'ذوي الأرحام',
  };

  return names[type] ?? type;
}

/**
 * Checks if heir type is male.
 */
export function isMaleHeir(type: HeirType): boolean {
  const maleHeirs: HeirType[] = [
    HeirType.HUSBAND,
    HeirType.FATHER,
    HeirType.GRANDFATHER_PATERNAL,
    HeirType.SON,
    HeirType.GRANDSON_SON,
    HeirType.BROTHER_FULL,
    HeirType.BROTHER_PATERNAL,
    HeirType.BROTHER_UTERINE,
    HeirType.NEPHEW_FULL,
    HeirType.NEPHEW_PATERNAL,
    HeirType.UNCLE_FULL,
    HeirType.UNCLE_PATERNAL,
    HeirType.COUSIN_FULL,
    HeirType.COUSIN_PATERNAL,
    HeirType.UNCLE_MATERNAL,
  ];

  return maleHeirs.includes(type);
}

/**
 * Checks if heir type is female.
 */
export function isFemaleHeir(type: HeirType): boolean {
  return !isMaleHeir(type);
}
