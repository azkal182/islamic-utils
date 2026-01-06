/**
 * @fileoverview Main inheritance calculator
 * @module inheritance/calculator
 *
 * The main entry point for Islamic inheritance (Faraidh) calculations.
 */

import type { Result } from '../core/types/result';
import { success, failure } from '../core/types/result';
import { Errors } from '../core/errors';
import type {
  InheritanceInput,
  InheritanceOptions,
  InheritanceResult,
  InheritanceTraceStep,
  HeirShare,
  InheritanceSummary,
  InheritanceMeta,
  InheritancePolicy,
  HeirInput,
} from './types';
import { HeirType, ShareCategory, DEFAULT_POLICY } from './types';
import { calculateFlags, getTotalHeirCount, hasAnyHeirs } from './flags';
import { calculateNetEstate } from './estate';
import { applyHijab } from './rules/hijab';
import { calculateFurudh } from './rules/furudh';
import { calculateAsabah } from './rules/asabah';
import { detectAul, applyAul, type ShareForAul } from './rules/aul';
import { detectRadd, applyRadd, type ShareForRadd } from './rules/radd';
import { detectSpecialCase, applyUmariyatayn, applyMushtarakah } from './rules/special-cases';
import { validateNoConflicts } from './validation/rule-conflict';
import type { Fraction } from './utils/fraction';
import { FRACTION, toDecimal, toString, fraction, add } from './utils/fraction';

// ═══════════════════════════════════════════════════════════════════════════
// Main Calculator
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Computes Islamic inheritance distribution.
 *
 * @param input - Inheritance input with estate, heirs, and policy
 * @param options - Calculation options
 * @returns Result containing inheritance distribution or error
 *
 * @remarks
 * **Calculation Flow:**
 * 1. Validate input
 * 2. Calculate net estate
 * 3. Calculate derived flags
 * 4. Validate no rule conflicts
 * 5. Apply hijab (exclusion)
 * 6. Detect special case
 * 7. If special case: apply override
 * 8. Else: calculate furudh → asabah → aul/radd
 * 9. Convert to absolute values
 * 10. Verify sum = net estate
 * 11. Build trace and return
 *
 * @example
 * ```typescript
 * const result = computeInheritance({
 *   estate: {
 *     grossValue: 1_000_000_000,
 *     debts: 50_000_000,
 *     funeralCosts: 10_000_000,
 *   },
 *   heirs: [
 *     { type: HeirType.WIFE, count: 1 },
 *     { type: HeirType.SON, count: 2 },
 *     { type: HeirType.DAUGHTER, count: 1 },
 *   ],
 *   deceased: { gender: 'male' },
 * });
 *
 * if (result.success) {
 *   for (const share of result.data.shares) {
 *     console.log(`${share.heirType}: ${share.totalValue}`);
 *   }
 * }
 * ```
 */
export function computeInheritance(
  input: InheritanceInput,
  _options?: InheritanceOptions
): Result<InheritanceResult> {
  const allTrace: InheritanceTraceStep[] = [];
  const policy: InheritancePolicy = { ...DEFAULT_POLICY, ...input.policy };

  // ─────────────────────────────────────────────────────────────────────────
  // Step 1: Validate input
  // ─────────────────────────────────────────────────────────────────────────

  allTrace.push({
    step: 1,
    phase: 'VALIDATION',
    description: 'Starting inheritance calculation',
    arabicTerm: 'بداية حساب المواريث',
    value: {
      heirTypes: input.heirs.length,
      totalHeirs: getTotalHeirCount(input.heirs),
    },
  });

  if (!hasAnyHeirs(input.heirs)) {
    allTrace.push({
      step: 2,
      phase: 'VALIDATION',
      description: 'No heirs provided',
      value: 'Estate goes to Baitul Mal or Dhawil Arham',
    });

    // Handle no heirs case
    return failure(Errors.invalidHeirs('At least one heir must be provided'));
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Step 2: Calculate net estate
  // ─────────────────────────────────────────────────────────────────────────

  const estateResult = calculateNetEstate(input.estate);
  if (!estateResult.success) {
    return failure(estateResult.error);
  }

  const { result: estate, trace: estateTrace } = estateResult.data;
  allTrace.push(...estateTrace);

  const netEstate = estate.netEstate;

  // ─────────────────────────────────────────────────────────────────────────
  // Step 3: Calculate derived flags
  // ─────────────────────────────────────────────────────────────────────────

  const flags = calculateFlags(input.heirs);

  allTrace.push({
    step: allTrace.length + 1,
    phase: 'FLAGS',
    description: 'Derived flags calculated',
    arabicTerm: 'حساب الأحوال',
    value: {
      HAS_DESCENDANT: flags.HAS_DESCENDANT,
      HAS_FATHER: flags.HAS_FATHER,
      HAS_MOTHER: flags.HAS_MOTHER,
      HAS_SPOUSE: flags.HAS_SPOUSE,
      HAS_SIBLINGS: flags.HAS_SIBLINGS_TOTAL,
    },
  });

  // ─────────────────────────────────────────────────────────────────────────
  // Step 4: Validate no rule conflicts (CRITICAL)
  // ─────────────────────────────────────────────────────────────────────────

  const conflictValidation = validateNoConflicts(input.heirs, flags, policy);
  allTrace.push(...conflictValidation.trace);

  if (!conflictValidation.result.valid) {
    return failure(
      Errors.internal(
        `CRITICAL: Multiple special cases detected: ${conflictValidation.result.activeCases.join(', ')}. This indicates a bug in the rule system.`
      )
    );
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Step 5: Apply hijab (exclusion)
  // ─────────────────────────────────────────────────────────────────────────

  const hijabResult = applyHijab(input.heirs, flags);
  allTrace.push(...hijabResult.trace);

  const activeHeirs = hijabResult.activeHeirs;

  // ─────────────────────────────────────────────────────────────────────────
  // Step 6: Detect special case
  // ─────────────────────────────────────────────────────────────────────────

  const specialCaseDetection = detectSpecialCase(activeHeirs, flags, policy);
  allTrace.push(...specialCaseDetection.trace);

  // ─────────────────────────────────────────────────────────────────────────
  // Step 7-8: Calculate shares (special case or standard)
  // ─────────────────────────────────────────────────────────────────────────

  let finalShares: Map<HeirType, Fraction> = new Map();
  let summary: InheritanceSummary;

  if (specialCaseDetection.detected && specialCaseDetection.caseId) {
    // Apply special case
    const scResult = applySpecialCaseLogic(specialCaseDetection.caseId, activeHeirs, flags, policy);
    allTrace.push(...scResult.trace);
    finalShares = scResult.shares;

    summary = {
      totalDistributed: netEstate,
      aulApplied: false,
      raddApplied: false,
      specialCase: specialCaseDetection.caseName ?? undefined,
      specialCaseArabic: specialCaseDetection.arabicName ?? undefined,
    };
  } else {
    // Standard calculation
    const standardResult = calculateStandardShares(activeHeirs, flags, policy);
    allTrace.push(...standardResult.trace);
    finalShares = standardResult.shares;

    summary = {
      totalDistributed: netEstate,
      aulApplied: standardResult.aulApplied,
      aulRatio: standardResult.aulRatio,
      aulOriginalDenominator: standardResult.aulOriginalDenominator,
      aulNewDenominator: standardResult.aulNewDenominator,
      raddApplied: standardResult.raddApplied,
      raddRemainder: standardResult.raddRemainder,
    };
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Step 9: Convert to absolute values and build HeirShare[]
  // ─────────────────────────────────────────────────────────────────────────

  const shares = buildHeirShares(input.heirs, finalShares, hijabResult.blockedHeirs, netEstate);

  allTrace.push({
    step: allTrace.length + 1,
    phase: 'DISTRIBUTION',
    description: 'Converting shares to monetary values',
    arabicTerm: 'تحويل الأنصبة إلى مبالغ',
    value: shares.map((s) => ({
      heir: s.heirType,
      share: toString(s.finalShare),
      value: s.totalValue,
    })),
  });

  // ─────────────────────────────────────────────────────────────────────────
  // Step 10: Verify sum = net estate
  // ─────────────────────────────────────────────────────────────────────────

  const sumOfShares = shares.reduce((acc, s) => acc + s.totalValue, 0);
  const difference = Math.abs(sumOfShares - netEstate);
  const isValid = difference < 1; // Allow < 1 unit rounding error

  allTrace.push({
    step: allTrace.length + 1,
    phase: 'VERIFICATION',
    description: 'Verifying total distribution',
    arabicTerm: 'التحقق من المجموع',
    value: {
      sumOfShares,
      netEstate,
      difference,
      isValid: isValid ? '✓ Valid' : '✗ Invalid',
    },
  });

  // ─────────────────────────────────────────────────────────────────────────
  // Step 11: Build meta and return
  // ─────────────────────────────────────────────────────────────────────────

  const meta: InheritanceMeta = {
    estate,
    policy,
    flags,
    asalMasalah: 24, // Will be calculated properly
    totalHeirs: getTotalHeirCount(input.heirs),
    blockedHeirs: hijabResult.blockedHeirs.length,
  };

  const result: InheritanceResult = {
    netEstate,
    shares,
    summary,
    meta,
    trace: allTrace,
    verification: {
      sumOfShares,
      netEstate,
      isValid,
      difference,
    },
  };

  return success(result);
}

// ═══════════════════════════════════════════════════════════════════════════
// Helper Functions
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Applies the appropriate special case logic.
 */
function applySpecialCaseLogic(
  caseId: string,
  heirs: HeirInput[],
  flags: any,
  policy: InheritancePolicy
): { shares: Map<HeirType, Fraction>; trace: InheritanceTraceStep[] } {
  switch (caseId) {
    case 'umariyatayn': {
      const result = applyUmariyatayn(heirs, flags);
      return { shares: result.shares, trace: result.trace };
    }
    case 'mushtarakah': {
      const result = applyMushtarakah(heirs, flags, policy);
      return { shares: result.shares, trace: result.trace };
    }
    // Add more special cases as implemented
    default:
      return { shares: new Map(), trace: [] };
  }
}

/**
 * Standard share calculation (furudh → asabah → aul/radd).
 */
function calculateStandardShares(
  heirs: HeirInput[],
  flags: any,
  policy: InheritancePolicy
): {
  shares: Map<HeirType, Fraction>;
  trace: InheritanceTraceStep[];
  aulApplied: boolean;
  aulRatio?: Fraction;
  aulOriginalDenominator?: number;
  aulNewDenominator?: number;
  raddApplied: boolean;
  raddRemainder?: Fraction;
} {
  const trace: InheritanceTraceStep[] = [];
  let shares = new Map<HeirType, Fraction>();

  // Calculate furudh
  const furudhResult = calculateFurudh(heirs, flags, policy);
  trace.push(...furudhResult.trace);

  // Initial shares from furudh
  for (const share of furudhResult.shares) {
    if (share.category !== ShareCategory.BLOCKED) {
      shares.set(share.heirType, share.share);
    }
  }

  // Check for aul
  let aulApplied = false;
  let aulRatio: Fraction | undefined;
  let aulOriginalDenominator: number | undefined;
  let aulNewDenominator: number | undefined;

  if (detectAul(furudhResult.totalFurudh)) {
    const sharesForAul: ShareForAul[] = Array.from(shares.entries()).map(([type, share]) => ({
      heirType: type,
      originalShare: share,
    }));

    const aulResult = applyAul(sharesForAul, furudhResult.asalMasalah);
    trace.push(...aulResult.trace);

    if (aulResult.aulApplied) {
      aulApplied = true;
      aulOriginalDenominator = aulResult.originalDenominator;
      aulNewDenominator = aulResult.newDenominator;
      aulRatio = fraction(aulResult.newDenominator, aulResult.originalDenominator);

      // Update shares with adjusted values
      shares.clear();
      for (const adjusted of aulResult.adjustedShares) {
        shares.set(adjusted.heirType as HeirType, adjusted.adjustedShare);
      }
    }
  }

  // Calculate asabah (if no aul and furudh < 1)
  let raddApplied = false;
  let raddRemainder: Fraction | undefined;

  if (!aulApplied && furudhResult.hasAsabah) {
    const asabahResult = calculateAsabah(heirs, flags, furudhResult.totalFurudh);
    trace.push(...asabahResult.trace);

    // Add asabah shares
    for (const share of asabahResult.shares) {
      const existing = shares.get(share.heirType) ?? FRACTION.ZERO;
      shares.set(share.heirType, add(existing, share.share));
    }
  } else if (!aulApplied && !furudhResult.hasAsabah) {
    // Check for radd
    if (detectRadd(furudhResult.totalFurudh, furudhResult.hasAsabah)) {
      const sharesForRadd: ShareForRadd[] = Array.from(shares.entries()).map(([type, share]) => ({
        heirType: type,
        share,
      }));

      const raddResult = applyRadd(sharesForRadd, furudhResult.totalFurudh, policy);
      trace.push(...raddResult.trace);

      if (raddResult.raddApplied) {
        raddApplied = true;
        raddRemainder = raddResult.remainder;

        // Update shares with radd-adjusted values
        shares.clear();
        for (const adjusted of raddResult.adjustedShares) {
          shares.set(adjusted.heirType, adjusted.finalShare);
        }
      }
    }
  }

  return {
    shares,
    trace,
    aulApplied,
    aulRatio,
    aulOriginalDenominator,
    aulNewDenominator,
    raddApplied,
    raddRemainder,
  };
}

/**
 * Builds the final HeirShare[] array with absolute values.
 */
function buildHeirShares(
  originalHeirs: HeirInput[],
  shares: Map<HeirType, Fraction>,
  blockedHeirs: { heir: HeirInput; blockedBy: HeirType[] }[],
  netEstate: number
): HeirShare[] {
  const result: HeirShare[] = [];

  for (const heir of originalHeirs) {
    const isBlocked = blockedHeirs.some((b) => b.heir.type === heir.type);
    const blockedBy = blockedHeirs.find((b) => b.heir.type === heir.type)?.blockedBy;

    if (isBlocked) {
      result.push({
        heirType: heir.type,
        count: heir.count,
        category: ShareCategory.BLOCKED,
        finalShare: FRACTION.ZERO,
        totalValue: 0,
        perPersonValue: 0,
        isBlocked: true,
        blockedBy,
        notes: ['Excluded by hijab'],
      });
    } else {
      const share = shares.get(heir.type) ?? FRACTION.ZERO;
      const totalValue = Math.round(toDecimal(share) * netEstate);
      const perPersonValue = heir.count > 0 ? Math.round(totalValue / heir.count) : 0;

      result.push({
        heirType: heir.type,
        count: heir.count,
        category: share.numerator > 0 ? ShareCategory.FURUDH : ShareCategory.ASABAH,
        finalShare: share,
        totalValue,
        perPersonValue,
        isBlocked: false,
      });
    }
  }

  return result;
}
