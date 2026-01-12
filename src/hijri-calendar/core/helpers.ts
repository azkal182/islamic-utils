/**
 * @fileoverview Internal helper utilities for Hijri calendar computations.
 * @module hijri-calendar/core/helpers
 */

import { failure, success } from '../../core/types/result';
import type { Result, TraceStep } from '../../core/types/result';
import { Errors } from '../../core/errors';
import type {
  GregorianDate,
  HijriCalendarOptions,
  HijriCalendarOptionsNormalized,
  HijriDate,
  HijriDayItem,
  HijriMethodId,
  HijriMonthIdentifier,
  HijriWeekday,
} from '../types';
import { YEAR_RANGE } from '../../core/validators/date';
import {
  normalizeHijriCalendarOptions,
  validateHijriDate,
  validateHijriMethodId,
  validateHijriMonthIdentifier,
} from '../utils/validators';

/**
 * Validates a Hijri date using shared validators.
 */
export function ensureHijriDate(date: HijriDate): Result<HijriDate> {
  return validateHijriDate(date);
}

/**
 * Validates month identifier (year + month).
 */
export function ensureHijriMonthIdentifier(
  identifier: HijriMonthIdentifier
): Result<HijriMonthIdentifier> {
  return validateHijriMonthIdentifier(identifier);
}

/**
 * Validates a Hijri method ID.
 */
export function ensureHijriMethodId(method: HijriMethodId | string): Result<HijriMethodId> {
  return validateHijriMethodId(method);
}

/**
 * Validates a Gregorian date structure prior to conversion.
 */
export function ensureGregorianDate(date: GregorianDate): Result<GregorianDate> {
  if (
    !Number.isInteger(date.year) ||
    date.year < YEAR_RANGE.MIN ||
    date.year > YEAR_RANGE.MAX
  ) {
    return failure(
      Errors.outOfSupportedRange('Gregorian year is out of supported range for Hijri conversion', {
        year: date.year,
        range: YEAR_RANGE,
      })
    );
  }

  if (!Number.isInteger(date.month) || date.month < 1 || date.month > 12) {
    return failure(
      Errors.invalidParameterType('Gregorian month must be an integer between 1 and 12', {
        month: date.month,
      })
    );
  }

  if (!Number.isInteger(date.day) || date.day < 1 || date.day > 31) {
    return failure(
      Errors.invalidParameterType('Gregorian day must be an integer between 1 and 31', {
        day: date.day,
      })
    );
  }

  return success(date);
}

/**
 * Helper to create a trace step in a consistent format.
 */
export function createTraceStep(
  step: number,
  description: string,
  value?: unknown,
  calculation?: string
): TraceStep {
  return {
    step,
    description,
    value,
    calculation,
  };
}

/**
 * Creates a canonical Hijri day item.
 */
export function createHijriDayItem(params: {
  readonly hijri: HijriDate;
  readonly gregorian: GregorianDate;
  readonly weekday: HijriWeekday;
  readonly isAdjusted: boolean;
}): HijriDayItem {
  return {
    hijri: params.hijri,
    gregorian: params.gregorian,
    weekday: params.weekday,
    isAdjusted: params.isAdjusted,
  };
}

/**
 * Normalizes options using shared validator.
 */
export function normalizeOptions(
  options: HijriCalendarOptions | undefined
): Result<HijriCalendarOptionsNormalized> {
  return normalizeHijriCalendarOptions(options);
}

/**
 * Derives the weekday (0 = Sunday ... 6 = Saturday) for a Gregorian date.
 */
export function deriveWeekdayFromGregorian(date: GregorianDate): HijriWeekday {
  const jsDate = new Date(Date.UTC(date.year, date.month - 1, date.day));
  return jsDate.getUTCDay() as HijriWeekday;
}

/**
 * Validates a Gregorian month query (year + month).
 */
export function ensureGregorianMonth(query: {
  readonly year: number;
  readonly month: number;
}): Result<{ readonly year: number; readonly month: number }> {
  if (!Number.isInteger(query.year) || query.year < YEAR_RANGE.MIN || query.year > YEAR_RANGE.MAX) {
    return failure(
      Errors.outOfSupportedRange('Gregorian year is out of supported range for Hijri conversion', {
        year: query.year,
        range: YEAR_RANGE,
      })
    );
  }

  if (!Number.isInteger(query.month) || query.month < 1 || query.month > 12) {
    return failure(
      Errors.invalidParameterType('Gregorian month must be an integer between 1 and 12', {
        month: query.month,
      })
    );
  }

  return success({ year: query.year, month: query.month });
}
