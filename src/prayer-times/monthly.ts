/**
 * @fileoverview Monthly Prayer Times Calculator
 * @module prayer-times/monthly
 *
 * This module provides the `computeMonthlyPrayerTimes` function that
 * calculates prayer times for an entire month.
 */

import type { Result, TraceStep } from '../core/types';
import { success, failure } from '../core/types';
import { Errors } from '../core/errors';
import { getDaysInMonth, isLeapYear } from '../core/validators';
import type {
  LocationInput,
  PrayerCalculationParams,
  PrayerTimes,
  PrayerTimeStrings,
  CalculatorOptions,
  CalculationMethod,
} from './types';
import type { DateOnly, Timezone } from '../core/types';
import { computePrayerTimes } from './calculator';

// ═══════════════════════════════════════════════════════════════════════════
// Types
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Input for monthly prayer times calculation.
 */
export interface MonthlyPrayerTimesInput {
  /**
   * Year (e.g., 2024).
   */
  readonly year: number;

  /**
   * Month (1-12).
   */
  readonly month: number;

  /**
   * Geographic location.
   */
  readonly location: LocationInput;

  /**
   * Timezone (IANA name or UTC offset in hours).
   */
  readonly timezone: Timezone;

  /**
   * Calculation parameters.
   */
  readonly params: PrayerCalculationParams;
}

/**
 * Prayer times result for a single day within the month.
 */
export interface MonthlyPrayerTimesDayResult {
  /**
   * Day of the month (1-31).
   */
  readonly day: number;

  /**
   * Full date object.
   */
  readonly date: DateOnly;

  /**
   * Calculated prayer times in fractional hours.
   */
  readonly times: PrayerTimes;

  /**
   * Formatted time strings (HH:MM format).
   */
  readonly formatted: PrayerTimeStrings;
}

/**
 * Metadata for monthly prayer times calculation.
 */
export interface MonthlyPrayerTimesMeta {
  /**
   * Year calculated.
   */
  readonly year: number;

  /**
   * Month calculated (1-12).
   */
  readonly month: number;

  /**
   * Number of days in the month.
   */
  readonly daysInMonth: number;

  /**
   * Whether this is a leap year (relevant for February).
   */
  readonly isLeapYear: boolean;

  /**
   * Location used for calculation.
   */
  readonly location: LocationInput;

  /**
   * Timezone used.
   */
  readonly timezone: Timezone;

  /**
   * Calculation method used.
   */
  readonly method: CalculationMethod;

  /**
   * Full parameters used for calculation.
   */
  readonly params: PrayerCalculationParams;
}

/**
 * Complete result of monthly prayer times calculation.
 */
export interface MonthlyPrayerTimesResult {
  /**
   * Array of prayer times for each day of the month.
   * Index 0 = Day 1, Index 29 = Day 30, etc.
   */
  readonly days: MonthlyPrayerTimesDayResult[];

  /**
   * Metadata about the calculation.
   */
  readonly meta: MonthlyPrayerTimesMeta;

  /**
   * Optional trace of calculation steps.
   */
  readonly trace?: TraceStep[];
}

// ═══════════════════════════════════════════════════════════════════════════
// Main Function
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Computes prayer times for an entire month.
 *
 * @param input - Monthly calculation input
 * @param options - Optional calculator options
 * @returns Result containing prayer times for each day or error
 *
 * @example
 * ```typescript
 * import { computeMonthlyPrayerTimes, CALCULATION_METHODS } from '@azkal182/islamic-utils';
 *
 * const result = computeMonthlyPrayerTimes({
 *   year: 2024,
 *   month: 1, // January
 *   location: { latitude: -6.2088, longitude: 106.8456 },
 *   timezone: 7,
 *   params: { method: CALCULATION_METHODS.KEMENAG },
 * });
 *
 * if (result.success) {
 *   for (const day of result.data.days) {
 *     console.log(`Day ${day.day}: Fajr ${day.formatted.fajr}`);
 *   }
 * }
 * ```
 */
export function computeMonthlyPrayerTimes(
  input: MonthlyPrayerTimesInput,
  options: CalculatorOptions = {}
): Result<MonthlyPrayerTimesResult> {
  const { year, month, location, timezone, params } = input;
  const trace: TraceStep[] = [];

  // ─────────────────────────────────────────────────────────────────────────
  // Validation
  // ─────────────────────────────────────────────────────────────────────────

  if (!Number.isInteger(year) || year < 1970 || year > 2100) {
    return failure(Errors.invalidDate(`Invalid year: ${year}. Must be between 1970 and 2100.`));
  }

  if (!Number.isInteger(month) || month < 1 || month > 12) {
    return failure(Errors.invalidDate(`Invalid month: ${month}. Must be between 1 and 12.`));
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Calculate days in month
  // ─────────────────────────────────────────────────────────────────────────

  const daysInMonth = getDaysInMonth(year, month);
  const leapYear = isLeapYear(year);

  trace.push({
    step: 1,
    description: `Calculating prayer times for ${getMonthName(month)} ${year}`,
    value: {
      year,
      month,
      monthName: getMonthName(month),
      daysInMonth,
      isLeapYear: leapYear,
    },
  });

  // ─────────────────────────────────────────────────────────────────────────
  // Calculate prayer times for each day
  // ─────────────────────────────────────────────────────────────────────────

  const days: MonthlyPrayerTimesDayResult[] = [];

  for (let day = 1; day <= daysInMonth; day++) {
    const date: DateOnly = { year, month, day };

    const dayResult = computePrayerTimes(
      location,
      { date, timezone },
      params,
      { includeTrace: false } // Don't include trace for each day to save memory
    );

    if (!dayResult.success) {
      return failure(
        Errors.internal(
          `Failed to calculate prayer times for day ${day}: ${dayResult.error.message}`
        )
      );
    }

    days.push({
      day,
      date,
      times: dayResult.data.times,
      formatted: dayResult.data.formatted,
    });
  }

  trace.push({
    step: 2,
    description: `Successfully calculated prayer times for ${daysInMonth} days`,
    value: {
      firstDay: days[0]?.formatted,
      lastDay: days[days.length - 1]?.formatted,
    },
  });

  // ─────────────────────────────────────────────────────────────────────────
  // Build result
  // ─────────────────────────────────────────────────────────────────────────

  const meta: MonthlyPrayerTimesMeta = {
    year,
    month,
    daysInMonth,
    isLeapYear: leapYear,
    location,
    timezone,
    method: params.method,
    params,
  };

  const result: MonthlyPrayerTimesResult = {
    days,
    meta,
    ...(options.includeTrace && { trace }),
  };

  return success(result);
}

// ═══════════════════════════════════════════════════════════════════════════
// Helper Functions
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Get month name in English.
 */
function getMonthName(month: number): string {
  const names = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  return names[month - 1] ?? 'Unknown';
}
