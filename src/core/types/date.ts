/**
 * @fileoverview Core type definitions for date and time handling
 * @module core/types/date
 *
 * This module provides type definitions for date and time representations
 * used throughout the Islamic utilities library. These types are designed
 * to be timezone-aware and avoid common pitfalls with JavaScript Date objects.
 *
 * @remarks
 * The library uses its own date types instead of JavaScript Date to:
 * 1. Ensure deterministic behavior across different environments
 * 2. Clearly separate date-only values from date-time values
 * 3. Make timezone handling explicit rather than implicit
 *
 * @example
 * ```typescript
 * import { DateOnly, TimeContext, TimeOfDay } from 'islamic-utils';
 *
 * // Specify a date without time
 * const date: DateOnly = { year: 2024, month: 1, day: 15 };
 *
 * // Add timezone context for calculations
 * const context: TimeContext = {
 *   date,
 *   timezone: 'Asia/Jakarta' // or use offset: 7
 * };
 * ```
 */

/**
 * Represents a calendar date without time information.
 *
 * @remarks
 * This type represents a specific day on the Gregorian calendar.
 * It does NOT include any time or timezone information.
 *
 * Use this when you need to specify "which day" without specifying
 * a specific moment in time.
 *
 * @example
 * ```typescript
 * // January 15, 2024
 * const date: DateOnly = {
 *   year: 2024,
 *   month: 1,
 *   day: 15
 * };
 *
 * // Ramadan 2024 start (estimated)
 * const ramadanStart: DateOnly = {
 *   year: 2024,
 *   month: 3,
 *   day: 10
 * };
 * ```
 */
export interface DateOnly {
  /**
   * Full year (4 digits).
   *
   * @remarks
   * Uses the Gregorian calendar year.
   * Valid range: 1 to 9999 (practical range for this library)
   *
   * @example 2024, 1445 (but note: this is Gregorian, not Hijri)
   */
  readonly year: number;

  /**
   * Month of the year (1-indexed).
   *
   * @remarks
   * Unlike JavaScript Date (0-11), months are 1-indexed:
   * - 1 = January
   * - 12 = December
   *
   * Valid range: 1 to 12
   */
  readonly month: number;

  /**
   * Day of the month (1-indexed).
   *
   * @remarks
   * Valid range depends on the month:
   * - 1-31 for January, March, May, July, August, October, December
   * - 1-30 for April, June, September, November
   * - 1-28 or 1-29 for February (depending on leap year)
   */
  readonly day: number;
}

/**
 * Represents a time of day without date information.
 *
 * @remarks
 * Used for representing prayer times, sunrise, sunset, etc.
 * The time is in the local timezone context.
 *
 * @example
 * ```typescript
 * // Fajr at 5:23:45 AM
 * const fajrTime: TimeOfDay = {
 *   hours: 5,
 *   minutes: 23,
 *   seconds: 45
 * };
 * ```
 */
export interface TimeOfDay {
  /**
   * Hours in 24-hour format.
   *
   * @remarks
   * Valid range: 0 to 23
   * - 0 = midnight (12:00 AM)
   * - 12 = noon (12:00 PM)
   * - 23 = 11:00 PM
   */
  readonly hours: number;

  /**
   * Minutes within the hour.
   *
   * @remarks
   * Valid range: 0 to 59
   */
  readonly minutes: number;

  /**
   * Seconds within the minute.
   *
   * @remarks
   * Valid range: 0 to 59
   * Optional for most use cases.
   *
   * @defaultValue 0
   */
  readonly seconds?: number;
}

/**
 * Represents timezone information.
 *
 * @remarks
 * Can be specified as:
 * - IANA timezone name (recommended): "Asia/Jakarta", "America/New_York"
 * - UTC offset in hours: 7, -5, 5.5 (for half-hour offsets like India)
 *
 * IANA names are preferred because they handle DST automatically.
 *
 * @example
 * ```typescript
 * // Using IANA name (recommended)
 * const tz1: Timezone = "Asia/Jakarta";
 *
 * // Using UTC offset
 * const tz2: Timezone = 7;        // UTC+7
 * const tz3: Timezone = -5;       // UTC-5
 * const tz4: Timezone = 5.5;      // UTC+5:30 (India)
 * ```
 */
export type Timezone = string | number;

/**
 * Provides complete context for time-based calculations.
 *
 * @remarks
 * Combines a date with timezone information to provide unambiguous
 * context for astronomical calculations.
 *
 * @example
 * ```typescript
 * // Calculate prayer times for Jakarta on January 15, 2024
 * const context: TimeContext = {
 *   date: { year: 2024, month: 1, day: 15 },
 *   timezone: 'Asia/Jakarta'
 * };
 *
 * // Or using UTC offset
 * const context2: TimeContext = {
 *   date: { year: 2024, month: 1, day: 15 },
 *   timezone: 7 // UTC+7
 * };
 * ```
 */
export interface TimeContext {
  /**
   * The calendar date for calculations.
   */
  readonly date: DateOnly;

  /**
   * Timezone for the calculation.
   *
   * @see Timezone for details on accepted formats
   */
  readonly timezone: Timezone;
}

/**
 * Represents a precise moment in time with full date, time, and timezone.
 *
 * @remarks
 * Used for representing the exact moment of prayer times.
 * This combines DateOnly and TimeOfDay with timezone context.
 *
 * @example
 * ```typescript
 * // Fajr on January 15, 2024 at 5:23 AM in Jakarta
 * const fajrMoment: DateTimeLocal = {
 *   year: 2024,
 *   month: 1,
 *   day: 15,
 *   hours: 5,
 *   minutes: 23,
 *   seconds: 0,
 *   timezone: 'Asia/Jakarta'
 * };
 * ```
 */
export interface DateTimeLocal extends DateOnly, TimeOfDay {
  /**
   * Timezone context for this moment.
   */
  readonly timezone: Timezone;
}

/**
 * Type guard to check if an object is a valid DateOnly interface.
 *
 * @param obj - The object to check
 * @returns True if the object matches the DateOnly interface structure
 */
export function isDateOnlyLike(obj: unknown): obj is DateOnly {
  if (typeof obj !== 'object' || obj === null) {
    return false;
  }

  const date = obj as Record<string, unknown>;

  return (
    typeof date['year'] === 'number' &&
    typeof date['month'] === 'number' &&
    typeof date['day'] === 'number'
  );
}

/**
 * Type guard to check if an object is a valid TimeOfDay interface.
 *
 * @param obj - The object to check
 * @returns True if the object matches the TimeOfDay interface structure
 */
export function isTimeOfDayLike(obj: unknown): obj is TimeOfDay {
  if (typeof obj !== 'object' || obj === null) {
    return false;
  }

  const time = obj as Record<string, unknown>;

  return (
    typeof time['hours'] === 'number' &&
    typeof time['minutes'] === 'number' &&
    (time['seconds'] === undefined || typeof time['seconds'] === 'number')
  );
}
