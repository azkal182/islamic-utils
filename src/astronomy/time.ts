/**
 * @fileoverview Time conversion utilities for astronomical calculations
 * @module astronomy/time
 *
 * This module provides functions to convert between different time
 * representations used in astronomical calculations.
 */

import type { DateOnly, TimeOfDay } from '../core/types/date';
import { fromFractionalHours } from '../core/utils/math';

/**
 * Converts a DateOnly to Julian Day Number (at midnight).
 *
 * @param date - The date to convert
 * @returns Julian Day Number at 0:00 local time
 *
 * @example
 * ```typescript
 * dateOnlyToJulianDay({ year: 2024, month: 1, day: 15 });
 * // Returns JD at midnight on Jan 15, 2024
 * ```
 */
export function dateOnlyToJulianDay(date: DateOnly): number {
  let y = date.year;
  let m = date.month;

  if (m <= 2) {
    y -= 1;
    m += 12;
  }

  const A = Math.floor(y / 100);
  const B = 2 - A + Math.floor(A / 4);

  return Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (m + 1)) + date.day + B - 1524.5;
}

/**
 * Converts Julian Day Number to DateOnly.
 *
 * @param jd - Julian Day Number
 * @returns DateOnly representation
 *
 * @remarks
 * The fractional part of the JD is ignored (returns the date at the start of that JD).
 *
 * @example
 * ```typescript
 * julianDayToDateOnly(2460324.5);
 * // Returns { year: 2024, month: 1, day: 15 }
 * ```
 */
export function julianDayToDateOnly(jd: number): DateOnly {
  // Add 0.5 to get to noon of the day
  const JD = jd + 0.5;
  const Z = Math.floor(JD);
  const F = JD - Z;

  let A: number;
  if (Z < 2299161) {
    A = Z;
  } else {
    const alpha = Math.floor((Z - 1867216.25) / 36524.25);
    A = Z + 1 + alpha - Math.floor(alpha / 4);
  }

  const B = A + 1524;
  const C = Math.floor((B - 122.1) / 365.25);
  const D = Math.floor(365.25 * C);
  const E = Math.floor((B - D) / 30.6001);

  const day = B - D - Math.floor(30.6001 * E);
  const month = E < 14 ? E - 1 : E - 13;
  const year = month > 2 ? C - 4716 : C - 4715;

  void F; // Fractional day is ignored

  return { year, month, day };
}

/**
 * Converts fractional hours to TimeOfDay.
 *
 * @param hours - Time in fractional hours (e.g., 5.5 = 5:30 AM)
 * @returns TimeOfDay representation
 *
 * @remarks
 * Handles wrap-around for values outside 0-24 range.
 * Negative values are treated as "hours before midnight".
 *
 * @example
 * ```typescript
 * fractionalHoursToTimeOfDay(5.5);
 * // { hours: 5, minutes: 30, seconds: 0 }
 *
 * fractionalHoursToTimeOfDay(12.25);
 * // { hours: 12, minutes: 15, seconds: 0 }
 *
 * fractionalHoursToTimeOfDay(25.5);
 * // { hours: 1, minutes: 30, seconds: 0 } (wrapped)
 * ```
 */
export function fractionalHoursToTimeOfDay(hours: number): TimeOfDay {
  // Normalize to 0-24 range
  let normalizedHours = hours % 24;
  if (normalizedHours < 0) {
    normalizedHours += 24;
  }

  const { hours: h, minutes: m, seconds: s } = fromFractionalHours(normalizedHours);

  return {
    hours: h,
    minutes: m,
    seconds: Math.round(s),
  };
}

/**
 * Converts TimeOfDay to fractional hours.
 *
 * @param time - The time to convert
 * @returns Time in fractional hours
 *
 * @example
 * ```typescript
 * timeOfDayToFractionalHours({ hours: 5, minutes: 30, seconds: 0 });
 * // 5.5
 *
 * timeOfDayToFractionalHours({ hours: 12, minutes: 15, seconds: 30 });
 * // 12.2583...
 * ```
 */
export function timeOfDayToFractionalHours(time: TimeOfDay): number {
  return time.hours + time.minutes / 60 + (time.seconds ?? 0) / 3600;
}

/**
 * Formats fractional hours as a time string.
 *
 * @param hours - Time in fractional hours
 * @param format - Format style ('24h' or '12h')
 * @param includeSeconds - Whether to include seconds
 * @returns Formatted time string
 *
 * @example
 * ```typescript
 * formatTime(5.5, '24h', false);    // "05:30"
 * formatTime(5.5, '12h', false);    // "5:30 AM"
 * formatTime(17.25, '24h', true);   // "17:15:00"
 * formatTime(17.25, '12h', false);  // "5:15 PM"
 * ```
 */
export function formatTime(
  hours: number,
  format: '24h' | '12h' = '24h',
  includeSeconds: boolean = false
): string {
  const time = fractionalHoursToTimeOfDay(hours);

  if (format === '24h') {
    const h = time.hours.toString().padStart(2, '0');
    const m = time.minutes.toString().padStart(2, '0');

    if (includeSeconds) {
      const s = (time.seconds ?? 0).toString().padStart(2, '0');
      return `${h}:${m}:${s}`;
    }
    return `${h}:${m}`;
  }

  // 12-hour format
  const period = time.hours >= 12 ? 'PM' : 'AM';
  let displayHours = time.hours % 12;
  if (displayHours === 0) displayHours = 12;

  const m = time.minutes.toString().padStart(2, '0');

  if (includeSeconds) {
    const s = (time.seconds ?? 0).toString().padStart(2, '0');
    return `${displayHours}:${m}:${s} ${period}`;
  }
  return `${displayHours}:${m} ${period}`;
}

/**
 * Converts fractional hours to a JavaScript Date object.
 *
 * @param date - The date part
 * @param hours - Time in fractional hours
 * @param timezoneOffset - Timezone offset in hours (for display purposes)
 * @returns JavaScript Date object
 *
 * @remarks
 * The returned Date is in local timezone of the runtime.
 * Use this for display and comparison within the same timezone context.
 *
 * @example
 * ```typescript
 * const date = { year: 2024, month: 1, day: 15 };
 * toJSDateTime(date, 5.5, 7);
 * // Date object representing Jan 15, 2024, 5:30 AM in UTC+7
 * ```
 */
export function toJSDateTime(date: DateOnly, hours: number, timezoneOffset: number = 0): Date {
  const time = fractionalHoursToTimeOfDay(hours);

  // Create date in local time, then adjust for timezone
  const jsDate = new Date(
    date.year,
    date.month - 1,
    date.day,
    time.hours,
    time.minutes,
    time.seconds ?? 0
  );

  // Adjust for timezone difference between local and target
  const localOffset = jsDate.getTimezoneOffset() / 60; // Local offset in hours (negative of UTC offset)
  const targetOffset = timezoneOffset;
  const offsetDiff = targetOffset + localOffset;

  jsDate.setTime(jsDate.getTime() + offsetDiff * 60 * 60 * 1000);

  return jsDate;
}

/**
 * Gets the fractional day of the year.
 *
 * @param date - The date
 * @param hours - Time in fractional hours (optional, default 0)
 * @returns Fractional day of year (1.0 = midnight on Jan 1)
 *
 * @remarks
 * This is used in some astronomical formulas that require the
 * day of year with time precision.
 *
 * @example
 * ```typescript
 * // Noon on January 15
 * fractionDayOfYear({ year: 2024, month: 1, day: 15 }, 12);
 * // 15.5
 *
 * // 6 AM on February 1
 * fractionDayOfYear({ year: 2024, month: 2, day: 1 }, 6);
 * // 32.25
 * ```
 */
export function fractionDayOfYear(date: DateOnly, hours: number = 0): number {
  // Calculate day of year
  const monthDays = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
  let dayOfYear = (monthDays[date.month - 1] ?? 0) + date.day;

  // Adjust for leap year if past February
  if (date.month > 2) {
    const isLeap = (date.year % 4 === 0 && date.year % 100 !== 0) || date.year % 400 === 0;
    if (isLeap) dayOfYear += 1;
  }

  return dayOfYear + hours / 24;
}
