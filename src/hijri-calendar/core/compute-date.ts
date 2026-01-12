/**
 * @fileoverview Core conversion function for single-date Hijri calculations.
 * @module hijri-calendar/core/compute-date
 */

import { failure, success } from '../../core/types/result';
import type { Result, TraceStep } from '../../core/types/result';
import { Errors } from '../../core/errors';
import type {
  GregorianDate,
  HijriCalendarOptions,
  HijriDateResult,
} from '../types';
import { getMethod } from '../methods';
import { loadHijriAdjustmentsForYear, resolveHijriMonthAdjustments } from '../adjustments';
import { gregorianToJulianDay, julianDayToGregorian } from './conversion';
import { createTraceStep, ensureGregorianDate, normalizeOptions } from './helpers';

export interface ComputeHijriDateInput {
  readonly date: GregorianDate;
}

/**
 * Converts a single Gregorian date into its Hijri representation.
 */
export function computeHijriDate(
  input: ComputeHijriDateInput,
  options?: HijriCalendarOptions
): Result<HijriDateResult> {
  if (!input || !input.date) {
    return failure(Errors.missingParameter('date'));
  }

  const dateValidation = ensureGregorianDate(input.date);
  if (!dateValidation.success) {
    return failure(dateValidation.error);
  }

  const optionsResult = normalizeOptions(options);
  if (!optionsResult.success) {
    return failure(optionsResult.error);
  }

  const normalized = optionsResult.data;
  const method = getMethod(normalized.method);
  if (!method) {
    return failure(
      Errors.methodNotSupported('Hijri calculation method is not yet available', {
        method: normalized.method,
      })
    );
  }

  const baseHijriDate = method.convertGregorianToHijri(dateValidation.data);

  let hijriDate = baseHijriDate;
  let appliedShift = 0;
  let adjustmentSource: string | undefined;

  const adjustmentsForYear = loadHijriAdjustmentsForYear(
    normalized.adjustments,
    baseHijriDate.year,
    normalized.method
  );

  if (!adjustmentsForYear.success) {
    return failure(adjustmentsForYear.error);
  }

  const resolved = resolveHijriMonthAdjustments(
    { year: baseHijriDate.year, month: baseHijriDate.month },
    adjustmentsForYear.data
  );

  if (resolved.adjustment && resolved.adjustment.shiftDays !== 0) {
    appliedShift = resolved.adjustment.shiftDays;
    adjustmentSource = resolved.adjustment.source;

    // Apply adjustment by shifting the input Gregorian date forward by shiftDays,
    // then re-converting. This yields the expected day shift relative to the moved
    // Hijri month start.
    const jd = gregorianToJulianDay(dateValidation.data);
    const shiftedGregorian = julianDayToGregorian(jd + appliedShift);
    hijriDate = method.convertGregorianToHijri(shiftedGregorian);
  }

  const trace: TraceStep[] = [
    createTraceStep(1, 'Validated Gregorian date input', dateValidation.data),
    createTraceStep(2, `Using calculation method: ${method.name}`, {
      method: method.id,
      description: method.description,
    }),
    createTraceStep(3, 'Converted Gregorian date to Hijri', baseHijriDate),
    createTraceStep(4, 'Resolved Hijri month adjustment', {
      hijriMonth: { year: baseHijriDate.year, month: baseHijriDate.month },
      shiftDays: appliedShift,
      source: adjustmentSource,
    }),
    createTraceStep(5, 'Applied Hijri month adjustment', hijriDate),
  ];

  const result: HijriDateResult = {
    gregorian: dateValidation.data,
    hijri: hijriDate,
    method: normalized.method,
    isAdjusted: appliedShift !== 0,
    adjustmentSource,
    trace,
  };

  return success(result, trace);
}
