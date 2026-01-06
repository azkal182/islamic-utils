/**
 * @fileoverview Estate calculator for net inheritance value
 * @module inheritance/estate
 *
 * Calculates net estate after deducting debts, funeral costs, and wasiyyah.
 * Based on DECISION_MATRIX_WARIS.md Section 0.
 */

import type { Result } from '../core/types/result';
import { success, failure } from '../core/types/result';
import { Errors } from '../core/errors';
import type { EstateInput, EstateResult, InheritanceTraceStep } from './types';

// ═══════════════════════════════════════════════════════════════════════════
// Main Function
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Calculates the net estate after all deductions.
 *
 * @param input - Estate input with gross value and optional deductions
 * @returns Result containing estate breakdown or error
 *
 * @remarks
 * Deduction order (as per Islamic law):
 * 1. Funeral costs (tajhiz)
 * 2. Debts
 * 3. Wasiyyah (limited to 1/3 of remaining unless approved by heirs)
 *
 * **Rules from DECISION_MATRIX_WARIS.md:**
 * ```spec
 * NET_ESTATE_RULE:
 *   net_estate = gross_estate - debts - funeral_costs - allowed_wasiyyah
 *
 * WASIYYAH_RULE:
 *   allowed_wasiyyah = MIN(wasiyyah, (gross_estate - debts - funeral_costs) * 1/3)
 *   OVERRIDE_IF wasiyyah_approved_by_heirs == true
 * ```
 *
 * @example
 * ```typescript
 * const result = calculateNetEstate({
 *   grossValue: 1_000_000_000,
 *   debts: 50_000_000,
 *   funeralCosts: 10_000_000,
 *   wasiyyah: 400_000_000,  // Will be capped to 1/3
 * });
 *
 * if (result.success) {
 *   console.log(result.data.netEstate);
 *   // 940_000_000 - 313_333_333 = 626_666_667
 * }
 * ```
 */
export function calculateNetEstate(
  input: EstateInput
): Result<{ result: EstateResult; trace: InheritanceTraceStep[] }> {
  const trace: InheritanceTraceStep[] = [];
  const currency = input.currency ?? 'IDR';

  // Step 1: Validate gross value
  if (input.grossValue < 0) {
    return failure(
      Errors.invalidEstate('Gross estate cannot be negative', { field: 'grossValue' })
    );
  }

  if (input.grossValue === 0) {
    return failure(Errors.invalidEstate('Gross estate cannot be zero', { field: 'grossValue' }));
  }

  let remaining = input.grossValue;

  trace.push({
    step: 1,
    phase: 'ESTATE',
    description: 'Gross estate value',
    arabicTerm: 'التركة الإجمالية',
    value: remaining,
    formula: `Gross = ${formatCurrency(remaining, currency)}`,
  });

  // Step 2: Deduct funeral costs
  const funeralCosts = input.funeralCosts ?? 0;
  if (funeralCosts < 0) {
    return failure(
      Errors.invalidEstate('Funeral costs cannot be negative', { field: 'funeralCosts' })
    );
  }

  if (funeralCosts > 0) {
    remaining -= funeralCosts;

    trace.push({
      step: 2,
      phase: 'ESTATE',
      description: 'After funeral costs (tajhiz)',
      arabicTerm: 'بعد تجهيز الميت',
      value: remaining,
      formula: `${formatCurrency(input.grossValue, currency)} - ${formatCurrency(funeralCosts, currency)} = ${formatCurrency(remaining, currency)}`,
    });
  }

  // Step 3: Deduct debts
  const debts = input.debts ?? 0;
  if (debts < 0) {
    return failure(Errors.invalidEstate('Debts cannot be negative', { field: 'debts' }));
  }

  if (debts > 0) {
    remaining -= debts;

    trace.push({
      step: trace.length + 1,
      phase: 'ESTATE',
      description: 'After debts payment',
      arabicTerm: 'بعد سداد الديون',
      value: remaining,
      formula: `Remaining - ${formatCurrency(debts, currency)} = ${formatCurrency(remaining, currency)}`,
    });
  }

  // Check if remaining is negative after debts
  if (remaining < 0) {
    trace.push({
      step: trace.length + 1,
      phase: 'ESTATE',
      description: 'ERROR: Estate is insufficient to cover debts',
      value: remaining,
    });

    return failure(
      Errors.invalidEstate(
        `Estate is insufficient: Gross (${formatCurrency(input.grossValue, currency)}) < Debts + Funeral (${formatCurrency(debts + funeralCosts, currency)})`,
        { grossValue: input.grossValue, debts, funeralCosts }
      )
    );
  }

  // Step 4: Handle wasiyyah
  const wasiyyahOriginal = input.wasiyyah ?? 0;
  if (wasiyyahOriginal < 0) {
    return failure(Errors.invalidEstate('Wasiyyah cannot be negative', { field: 'wasiyyah' }));
  }

  let wasiyyahAllowed = wasiyyahOriginal;
  let wasiyyahCapped = false;

  if (wasiyyahOriginal > 0) {
    const maxWasiyyah = remaining / 3;

    if (!input.wasiyyahApprovedByHeirs && wasiyyahOriginal > maxWasiyyah) {
      wasiyyahAllowed = Math.floor(maxWasiyyah);
      wasiyyahCapped = true;

      trace.push({
        step: trace.length + 1,
        phase: 'ESTATE',
        description: 'Wasiyyah exceeds 1/3 limit - capped',
        arabicTerm: 'الوصية محدودة بالثلث',
        value: wasiyyahAllowed,
        formula: `MAX(1/3) = ${formatCurrency(remaining, currency)} ÷ 3 = ${formatCurrency(wasiyyahAllowed, currency)}`,
        reference: 'Wasiyyah limited to 1/3 unless approved by heirs',
      });
    }

    if (input.wasiyyahApprovedByHeirs && wasiyyahOriginal > maxWasiyyah) {
      trace.push({
        step: trace.length + 1,
        phase: 'ESTATE',
        description: 'Wasiyyah exceeds 1/3 but approved by heirs',
        arabicTerm: 'الوصية بأكثر من الثلث بإذن الورثة',
        value: wasiyyahAllowed,
      });
    }

    remaining -= wasiyyahAllowed;

    trace.push({
      step: trace.length + 1,
      phase: 'ESTATE',
      description: 'After wasiyyah deduction',
      arabicTerm: 'بعد تنفيذ الوصية',
      value: remaining,
      formula: `Remaining - ${formatCurrency(wasiyyahAllowed, currency)} = ${formatCurrency(remaining, currency)}`,
    });
  }

  // Step 5: Final net estate
  trace.push({
    step: trace.length + 1,
    phase: 'ESTATE',
    description: 'Net estate for distribution',
    arabicTerm: 'التركة الصافية للتوزيع',
    value: remaining,
    formula: `Net Estate = ${formatCurrency(remaining, currency)}`,
  });

  const result: EstateResult = {
    grossValue: input.grossValue,
    deductions: {
      funeralCosts,
      debts,
      wasiyyah: wasiyyahAllowed,
      wasiyyahOriginal,
      wasiyyahCapped,
    },
    netEstate: remaining,
    currency,
  };

  return success({ result, trace });
}

// ═══════════════════════════════════════════════════════════════════════════
// Utility Functions
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Formats a number as currency string.
 *
 * @param value - Numeric value
 * @param currency - Currency code
 * @returns Formatted currency string
 */
function formatCurrency(value: number, currency: string): string {
  if (currency === 'IDR') {
    return `Rp ${value.toLocaleString('id-ID')}`;
  }

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

/**
 * Validates estate input before calculation.
 *
 * @param input - Estate input to validate
 * @returns Validation result
 */
export function validateEstateInput(input: EstateInput): Result<true> {
  if (typeof input.grossValue !== 'number' || isNaN(input.grossValue)) {
    return failure(
      Errors.invalidEstate('Gross value must be a valid number', { field: 'grossValue' })
    );
  }

  if (input.grossValue < 0) {
    return failure(Errors.invalidEstate('Gross value cannot be negative', { field: 'grossValue' }));
  }

  if (input.debts !== undefined && input.debts < 0) {
    return failure(Errors.invalidEstate('Debts cannot be negative', { field: 'debts' }));
  }

  if (input.funeralCosts !== undefined && input.funeralCosts < 0) {
    return failure(
      Errors.invalidEstate('Funeral costs cannot be negative', { field: 'funeralCosts' })
    );
  }

  if (input.wasiyyah !== undefined && input.wasiyyah < 0) {
    return failure(Errors.invalidEstate('Wasiyyah cannot be negative', { field: 'wasiyyah' }));
  }

  return success(true);
}
