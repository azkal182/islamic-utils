/**
 * @fileoverview Range conversion function for Hijri calendar calculations.
 * @module hijri-calendar/core/compute-range
 */

import { failure, success } from '../../core/types/result';
import type { Result, TraceStep } from '../../core/types/result';
import { Errors } from '../../core/errors';
import type {
  GregorianDate,
  HijriCalendarOptions,
  HijriDayItem,
  HijriRangeResult,
} from '../types';
import { addDays } from '../../core/validators/date';
import { computeHijriDate } from './compute-date';
import { createTraceStep, deriveWeekdayFromGregorian, ensureGregorianDate, normalizeOptions } from './helpers';

export interface ComputeHijriRangeInput {
  readonly start: GregorianDate;
  readonly end: GregorianDate;
}

function compareGregorian(a: GregorianDate, b: GregorianDate): number {
  if (a.year !== b.year) return a.year - b.year;
  if (a.month !== b.month) return a.month - b.month;
  return a.day - b.day;
}

/**
 * Builds Hijri conversion results for a range of Gregorian dates (inclusive).
 */
export function computeHijriRange(
  input: ComputeHijriRangeInput,
  options?: HijriCalendarOptions
): Result<HijriRangeResult> {
  if (!input || !input.start) {
    return failure(Errors.missingParameter('start'));
  }

  if (!input.end) {
    return failure(Errors.missingParameter('end'));
  }

  const startValidation = ensureGregorianDate(input.start);
  if (!startValidation.success) {
    return failure(startValidation.error);
  }

  const endValidation = ensureGregorianDate(input.end);
  if (!endValidation.success) {
    return failure(endValidation.error);
  }

  if (compareGregorian(startValidation.data, endValidation.data) > 0) {
    return failure(
      Errors.invalidDate('Start date must be on or before end date', {
        start: startValidation.data,
        end: endValidation.data,
      })
    );
  }

  const optionsResult = normalizeOptions(options);
  if (!optionsResult.success) {
    return failure(optionsResult.error);
  }

  const normalized = optionsResult.data;

  const days: HijriDayItem[] = [];
  const trace: TraceStep[] = [
    createTraceStep(1, 'Validated range input', {
      start: startValidation.data,
      end: endValidation.data,
    }),
  ];

  let cursor = startValidation.data;
  let index = 0;

  while (compareGregorian(cursor, endValidation.data) <= 0) {
    const dateResult = computeHijriDate({ date: cursor }, options);
    if (!dateResult.success) {
      return failure(dateResult.error, trace);
    }

    days.push({
      hijri: dateResult.data.hijri,
      gregorian: cursor,
      weekday: deriveWeekdayFromGregorian(cursor),
      isAdjusted: dateResult.data.isAdjusted,
    });

    cursor = addDays(cursor, 1);
    index += 1;

    if (index > 40000) {
      return failure(
        Errors.outOfSupportedRange('Gregorian date range is too large', {
          start: startValidation.data,
          end: endValidation.data,
          maxDays: 40000,
        }),
        trace
      );
    }
  }

  trace.push(createTraceStep(2, 'Converted Gregorian range to Hijri', { dayCount: days.length }));

  const result: HijriRangeResult = {
    method: normalized.method,
    start: startValidation.data,
    end: endValidation.data,
    days,
    meta: {
      dayCount: days.length,
      adjustmentApplied: days.some((day) => day.isAdjusted),
    },
    trace,
  };

  return success(result, trace);
}
