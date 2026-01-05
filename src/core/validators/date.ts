/**
 * @fileoverview Date validation functions
 * @module core/validators/date
 *
 * This module provides validation functions for date values.
 * All validation functions return a Result type for consistent error handling.
 */

import type { DateOnly } from '../types/date';
import type { Result } from '../types/result';
import { success, failure } from '../types/result';
import { Errors } from '../errors';

/**
 * Valid year range constants.
 *
 * @remarks
 * The library supports dates from year 1 to 9999.
 * This covers the practical range for prayer time calculations.
 */
export const YEAR_RANGE = {
  MIN: 1,
  MAX: 9999,
} as const;

/**
 * Days in each month for non-leap years.
 */
const DAYS_IN_MONTH = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31] as const;

/**
 * Checks if a year is a leap year.
 *
 * @param year - The year to check
 * @returns True if the year is a leap year
 *
 * @remarks
 * Leap year rules:
 * 1. Divisible by 4
 * 2. NOT divisible by 100, unless...
 * 3. Divisible by 400
 *
 * @example
 * ```typescript
 * isLeapYear(2024); // true (divisible by 4)
 * isLeapYear(2023); // false
 * isLeapYear(2000); // true (divisible by 400)
 * isLeapYear(1900); // false (divisible by 100, not by 400)
 * ```
 */
export function isLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

/**
 * Gets the number of days in a given month.
 *
 * @param year - The year (needed to check for February in leap years)
 * @param month - The month (1-12)
 * @returns Number of days in the month
 *
 * @example
 * ```typescript
 * getDaysInMonth(2024, 2);  // 29 (February in leap year)
 * getDaysInMonth(2023, 2);  // 28 (February in non-leap year)
 * getDaysInMonth(2024, 1);  // 31 (January)
 * getDaysInMonth(2024, 4);  // 30 (April)
 * ```
 */
export function getDaysInMonth(year: number, month: number): number {
  if (month < 1 || month > 12) {
    return 0;
  }

  // February in a leap year
  if (month === 2 && isLeapYear(year)) {
    return 29;
  }

  const index = month - 1;
  return DAYS_IN_MONTH[index] ?? 0;
}

/**
 * Validates a date.
 *
 * @param date - The date to validate
 * @returns Success with validated date, or failure with error details
 *
 * @remarks
 * Validation rules:
 * - Year must be between 1 and 9999
 * - Month must be between 1 and 12
 * - Day must be valid for the given month and year
 * - All values must be integers
 *
 * @example
 * ```typescript
 * // Valid date
 * validateDate({ year: 2024, month: 1, day: 15 });
 * // result.success === true
 *
 * // Invalid month
 * validateDate({ year: 2024, month: 13, day: 1 });
 * // result.error.code === 'INVALID_DATE'
 *
 * // February 29 in non-leap year
 * validateDate({ year: 2023, month: 2, day: 29 });
 * // result.error.code === 'INVALID_DATE'
 * ```
 */
export function validateDate(date: DateOnly): Result<DateOnly> {
  // Check year is a number
  if (typeof date.year !== 'number' || !Number.isInteger(date.year)) {
    return failure(
      Errors.invalidDate('Year must be an integer', {
        year: date.year,
      })
    );
  }

  // Check year range
  if (date.year < YEAR_RANGE.MIN || date.year > YEAR_RANGE.MAX) {
    return failure(
      Errors.invalidDate(`Year must be between ${YEAR_RANGE.MIN} and ${YEAR_RANGE.MAX}`, {
        year: date.year,
        min: YEAR_RANGE.MIN,
        max: YEAR_RANGE.MAX,
      })
    );
  }

  // Check month is a number
  if (typeof date.month !== 'number' || !Number.isInteger(date.month)) {
    return failure(
      Errors.invalidDate('Month must be an integer', {
        month: date.month,
      })
    );
  }

  // Check month range
  if (date.month < 1 || date.month > 12) {
    return failure(
      Errors.invalidDate('Month must be between 1 and 12', {
        month: date.month,
        min: 1,
        max: 12,
      })
    );
  }

  // Check day is a number
  if (typeof date.day !== 'number' || !Number.isInteger(date.day)) {
    return failure(
      Errors.invalidDate('Day must be an integer', {
        day: date.day,
      })
    );
  }

  // Check day range for the specific month
  const daysInMonth = getDaysInMonth(date.year, date.month);
  if (date.day < 1 || date.day > daysInMonth) {
    return failure(
      Errors.invalidDate(`Day must be between 1 and ${daysInMonth} for this month`, {
        year: date.year,
        month: date.month,
        day: date.day,
        maxDay: daysInMonth,
      })
    );
  }

  // All validations passed
  return success(date);
}

/**
 * Gets the day of the year (1-366).
 *
 * @param date - The date to calculate
 * @returns Day of year (1 = January 1, 365/366 = December 31)
 *
 * @remarks
 * This is useful for astronomical calculations where the day of year
 * is used to determine the sun's position.
 *
 * @example
 * ```typescript
 * getDayOfYear({ year: 2024, month: 1, day: 1 });   // 1
 * getDayOfYear({ year: 2024, month: 12, day: 31 }); // 366 (leap year)
 * getDayOfYear({ year: 2023, month: 12, day: 31 }); // 365
 * ```
 */
export function getDayOfYear(date: DateOnly): number {
  let dayOfYear = date.day;

  // Add days from previous months
  for (let month = 1; month < date.month; month++) {
    dayOfYear += getDaysInMonth(date.year, month);
  }

  return dayOfYear;
}

/**
 * Checks if two dates are the same.
 *
 * @param a - First date
 * @param b - Second date
 * @returns True if dates are equal
 */
export function datesEqual(a: DateOnly, b: DateOnly): boolean {
  return a.year === b.year && a.month === b.month && a.day === b.day;
}

/**
 * Adds days to a date.
 *
 * @param date - The starting date
 * @param days - Number of days to add (can be negative)
 * @returns New date with days added
 *
 * @example
 * ```typescript
 * addDays({ year: 2024, month: 1, day: 31 }, 1);
 * // Result: { year: 2024, month: 2, day: 1 }
 *
 * addDays({ year: 2024, month: 1, day: 1 }, -1);
 * // Result: { year: 2023, month: 12, day: 31 }
 * ```
 */
export function addDays(date: DateOnly, days: number): DateOnly {
  // Convert to JavaScript Date for calculation, then convert back
  // This handles all edge cases (month/year boundaries, leap years)
  const jsDate = new Date(date.year, date.month - 1, date.day);
  jsDate.setDate(jsDate.getDate() + days);

  return {
    year: jsDate.getFullYear(),
    month: jsDate.getMonth() + 1,
    day: jsDate.getDate(),
  };
}

/**
 * Creates a DateOnly from a JavaScript Date.
 *
 * @param date - JavaScript Date object
 * @returns DateOnly representation
 *
 * @remarks
 * Uses local timezone of the JavaScript Date.
 */
export function fromJSDate(date: Date): DateOnly {
  return {
    year: date.getFullYear(),
    month: date.getMonth() + 1,
    day: date.getDate(),
  };
}

/**
 * Converts a DateOnly to a JavaScript Date.
 *
 * @param date - The DateOnly to convert
 * @returns JavaScript Date at midnight local time
 */
export function toJSDate(date: DateOnly): Date {
  return new Date(date.year, date.month - 1, date.day);
}
