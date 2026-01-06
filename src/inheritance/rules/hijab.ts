/**
 * @fileoverview Hijab (blocking) rules implementation
 * @module inheritance/rules/hijab
 *
 * Implements the 7 Hijab Hirman (total exclusion) rules
 * from DECISION_MATRIX_WARIS.md Section 4.
 */

import type { HeirInput, DerivedFlags, InheritanceTraceStep } from '../types';
import { HeirType, getHeirArabicName } from '../types';

// ═══════════════════════════════════════════════════════════════════════════
// Types
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Result of applying hijab rules.
 */
export interface HijabResult {
  /**
   * Heirs that remain active after hijab.
   */
  readonly activeHeirs: HeirInput[];

  /**
   * Heirs that were blocked.
   */
  readonly blockedHeirs: BlockedHeirInfo[];

  /**
   * Trace steps for the hijab phase.
   */
  readonly trace: InheritanceTraceStep[];
}

/**
 * Information about a blocked heir.
 */
export interface BlockedHeirInfo {
  readonly heir: HeirInput;
  readonly blockedBy: HeirType[];
  readonly rule: string;
}

/**
 * Hijab rule definition.
 */
interface HijabRule {
  readonly id: string;
  readonly description: string;
  readonly arabicTerm: string;
  readonly condition: (flags: DerivedFlags, heirs: HeirInput[]) => boolean;
  readonly excludes: HeirType[];
  readonly excludedBy: HeirType[];
}

// ═══════════════════════════════════════════════════════════════════════════
// Hijab Hirman Rules (7 Rules)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * The 7 Hijab Hirman rules from DECISION_MATRIX_WARIS.md.
 */
const HIJAB_HIRMAN_RULES: HijabRule[] = [
  // E1: Descendants exclude siblings
  {
    id: 'E1',
    description: 'Descendants exclude all siblings',
    arabicTerm: 'الفرع الوارث يحجب الإخوة',
    condition: (flags) => flags.HAS_DESCENDANT,
    excludes: [
      HeirType.BROTHER_FULL,
      HeirType.SISTER_FULL,
      HeirType.BROTHER_PATERNAL,
      HeirType.SISTER_PATERNAL,
      HeirType.BROTHER_UTERINE,
      HeirType.SISTER_UTERINE,
    ],
    excludedBy: [
      HeirType.SON,
      HeirType.DAUGHTER,
      HeirType.GRANDSON_SON,
      HeirType.GRANDDAUGHTER_SON,
    ],
  },

  // E2: Father excludes many male relatives
  {
    id: 'E2',
    description: 'Father excludes grandfather, brothers, nephews, uncles, cousins',
    arabicTerm: 'الأب يحجب الجد والإخوة ومن بعدهم',
    condition: (flags) => flags.HAS_FATHER,
    excludes: [
      HeirType.GRANDFATHER_PATERNAL,
      HeirType.BROTHER_FULL,
      HeirType.BROTHER_PATERNAL,
      HeirType.NEPHEW_FULL,
      HeirType.NEPHEW_PATERNAL,
      HeirType.UNCLE_FULL,
      HeirType.UNCLE_PATERNAL,
      HeirType.COUSIN_FULL,
      HeirType.COUSIN_PATERNAL,
    ],
    excludedBy: [HeirType.FATHER],
  },

  // E3: Son excludes grandchildren
  {
    id: 'E3',
    description: 'Son excludes grandchildren (from sons)',
    arabicTerm: 'الابن يحجب أولاد الابن',
    condition: (flags) => flags.HAS_SON,
    excludes: [HeirType.GRANDSON_SON, HeirType.GRANDDAUGHTER_SON],
    excludedBy: [HeirType.SON],
  },

  // E4: Mother excludes maternal grandmother
  {
    id: 'E4',
    description: 'Mother excludes maternal grandmother',
    arabicTerm: 'الأم تحجب الجدة من جهة الأم',
    condition: (flags) => flags.HAS_MOTHER,
    excludes: [HeirType.GRANDMOTHER_MATERNAL],
    excludedBy: [HeirType.MOTHER],
  },

  // E5: Father excludes paternal grandmother
  {
    id: 'E5',
    description: 'Father excludes paternal grandmother',
    arabicTerm: 'الأب يحجب الجدة من جهته',
    condition: (flags) => flags.HAS_FATHER,
    excludes: [HeirType.GRANDMOTHER_PATERNAL],
    excludedBy: [HeirType.FATHER],
  },

  // E6: Full brother excludes paternal siblings
  {
    id: 'E6',
    description: 'Full brother excludes paternal siblings',
    arabicTerm: 'الأخ الشقيق يحجب الإخوة لأب',
    condition: (_, heirs) => getHeirCount(heirs, HeirType.BROTHER_FULL) > 0,
    excludes: [HeirType.BROTHER_PATERNAL, HeirType.SISTER_PATERNAL],
    excludedBy: [HeirType.BROTHER_FULL],
  },

  // E7: Paternal brother excludes nephews
  {
    id: 'E7',
    description: 'Paternal brother excludes nephews',
    arabicTerm: 'الأخ لأب يحجب أبناء الإخوة',
    condition: (_, heirs) => getHeirCount(heirs, HeirType.BROTHER_PATERNAL) > 0,
    excludes: [HeirType.NEPHEW_FULL, HeirType.NEPHEW_PATERNAL],
    excludedBy: [HeirType.BROTHER_PATERNAL],
  },
];

// ═══════════════════════════════════════════════════════════════════════════
// Main Function
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Applies Hijab Hirman rules to determine which heirs are blocked.
 *
 * @param heirs - List of heir inputs
 * @param flags - Derived flags from heirs
 * @returns Hijab result with active heirs, blocked heirs, and trace
 *
 * @remarks
 * Hijab Hirman = Total exclusion. A blocked heir receives nothing.
 *
 * @example
 * ```typescript
 * const result = applyHijab(
 *   [
 *     { type: HeirType.SON, count: 1 },
 *     { type: HeirType.BROTHER_FULL, count: 1 },
 *   ],
 *   flags
 * );
 *
 * // Brother is blocked by son (Rule E1)
 * result.blockedHeirs[0].heir.type  // 'brother_full'
 * result.blockedHeirs[0].blockedBy  // ['son']
 * ```
 */
export function applyHijab(heirs: HeirInput[], flags: DerivedFlags): HijabResult {
  const trace: InheritanceTraceStep[] = [];
  const blockedHeirs: BlockedHeirInfo[] = [];
  const blockedTypes = new Set<HeirType>();
  const blockedByMap = new Map<HeirType, HeirType[]>();

  trace.push({
    step: 1,
    phase: 'HIJAB',
    description: 'Applying Hijab Hirman (total exclusion) rules',
    arabicTerm: 'تطبيق قواعد الحجب بالحرمان',
    value: `Checking ${heirs.length} heir types against ${HIJAB_HIRMAN_RULES.length} rules`,
  });

  // Apply each rule
  for (const rule of HIJAB_HIRMAN_RULES) {
    if (rule.condition(flags, heirs)) {
      for (const excludedType of rule.excludes) {
        if (!blockedTypes.has(excludedType) && hasHeirType(heirs, excludedType)) {
          blockedTypes.add(excludedType);

          // Track which heirs caused the blocking
          const existingBlockers = blockedByMap.get(excludedType) ?? [];
          blockedByMap.set(excludedType, [
            ...existingBlockers,
            ...rule.excludedBy.filter((t) => hasHeirType(heirs, t)),
          ]);

          trace.push({
            step: trace.length + 1,
            phase: 'HIJAB',
            description: `${getHeirArabicName(excludedType)} blocked by Rule ${rule.id}`,
            arabicTerm: rule.arabicTerm,
            value: {
              blocked: excludedType,
              by: rule.excludedBy,
              rule: rule.id,
            },
            reference: rule.description,
          });
        }
      }
    }
  }

  // Separate active and blocked heirs
  const activeHeirs: HeirInput[] = [];

  for (const heir of heirs) {
    if (blockedTypes.has(heir.type)) {
      blockedHeirs.push({
        heir,
        blockedBy: blockedByMap.get(heir.type) ?? [],
        rule: findRuleForBlocking(heir.type)?.id ?? 'unknown',
      });
    } else {
      activeHeirs.push(heir);
    }
  }

  // Summary trace
  if (blockedHeirs.length > 0) {
    trace.push({
      step: trace.length + 1,
      phase: 'HIJAB',
      description: 'Hijab summary',
      value: {
        totalHeirs: heirs.length,
        activeHeirs: activeHeirs.length,
        blockedHeirs: blockedHeirs.length,
        blocked: blockedHeirs.map((b) => b.heir.type),
      },
    });
  } else {
    trace.push({
      step: trace.length + 1,
      phase: 'HIJAB',
      description: 'No heirs blocked by Hijab',
      arabicTerm: 'لا حجب',
      value: `All ${heirs.length} heir types remain active`,
    });
  }

  return { activeHeirs, blockedHeirs, trace };
}

// ═══════════════════════════════════════════════════════════════════════════
// Utility Functions
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Checks if a heir type exists in the heirs array with count > 0.
 */
function hasHeirType(heirs: HeirInput[], type: HeirType): boolean {
  return heirs.some((h) => h.type === type && h.count > 0);
}

/**
 * Gets count of a specific heir type.
 */
function getHeirCount(heirs: HeirInput[], type: HeirType): number {
  return heirs.filter((h) => h.type === type).reduce((sum, h) => sum + h.count, 0);
}

/**
 * Finds the rule that blocks a specific heir type.
 */
function findRuleForBlocking(type: HeirType): HijabRule | undefined {
  return HIJAB_HIRMAN_RULES.find((rule) => rule.excludes.includes(type));
}

/**
 * Gets all applicable blocking rules for a set of heirs.
 *
 * @param heirs - List of heirs
 * @param flags - Derived flags
 * @returns Array of applicable rules
 */
export function getApplicableRules(
  heirs: HeirInput[],
  flags: DerivedFlags
): { rule: HijabRule; blockedTypes: HeirType[] }[] {
  const applicable: { rule: HijabRule; blockedTypes: HeirType[] }[] = [];

  for (const rule of HIJAB_HIRMAN_RULES) {
    if (rule.condition(flags, heirs)) {
      const blockedTypes = rule.excludes.filter((t) => hasHeirType(heirs, t));
      if (blockedTypes.length > 0) {
        applicable.push({ rule, blockedTypes });
      }
    }
  }

  return applicable;
}
