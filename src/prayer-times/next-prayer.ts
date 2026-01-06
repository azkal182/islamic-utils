/**
 * @fileoverview Next Prayer Time Calculator
 * @module prayer-times/next-prayer
 *
 * This module provides the `getNextPrayer` function that determines
 * which prayer is next based on the current time.
 */

import type { Result } from '../core/types';
import { success, failure } from '../core/types';
import type { Timezone, DateOnly } from '../core/types';
import { dateToLocalTime } from '../core/utils/timezone';
import { fromJSDate, addDays } from '../core/validators';
import type {
  LocationInput,
  PrayerCalculationParams,
  PrayerName,
  PrayerTimesResult,
} from './types';
import { PrayerName as PrayerNameConst } from './types';
import { computePrayerTimes } from './calculator';

// ═══════════════════════════════════════════════════════════════════════════
// Types
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Information about the next upcoming prayer.
 */
export interface NextPrayerInfo {
  /**
   * Name of the next prayer.
   */
  readonly name: PrayerName;

  /**
   * Formatted time string (HH:MM).
   */
  readonly time: string;

  /**
   * Time as fractional hours (for calculations).
   */
  readonly timeNumeric: number;

  /**
   * Minutes until the next prayer.
   *
   * @remarks
   * Always positive. If the next prayer is tomorrow, this includes
   * the remaining minutes of today plus the time into tomorrow.
   */
  readonly minutesUntil: number;

  /**
   * Whether the next prayer is on the following day.
   *
   * @remarks
   * True if we've passed Isha and the next prayer is tomorrow's Imsak/Fajr.
   */
  readonly isNextDay: boolean;

  /**
   * Prayer times for the current day.
   *
   * @remarks
   * Included for convenience if you want to display all times.
   */
  readonly prayerTimes: PrayerTimesResult;
}

/**
 * Information about the current prayer period.
 */
export interface CurrentPrayerInfo {
  /**
   * Current prayer period.
   *
   * @remarks
   * The prayer whose time has most recently passed.
   * null if before Fajr (or if times are invalid).
   */
  readonly current: PrayerName | null;

  /**
   * Previous prayer (the one before current).
   */
  readonly previous: PrayerName | null;

  /**
   * Prayer times for the current day.
   */
  readonly prayerTimes: PrayerTimesResult;
}

// ═══════════════════════════════════════════════════════════════════════════
// Constants
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Prayer order for next prayer calculation.
 * Excludes dhuha times as they are optional window, not fixed prayer.
 */
const MAIN_PRAYER_ORDER: readonly PrayerName[] = [
  PrayerNameConst.IMSAK,
  PrayerNameConst.FAJR,
  PrayerNameConst.SUNRISE,
  PrayerNameConst.DHUHR,
  PrayerNameConst.ASR,
  PrayerNameConst.MAGHRIB,
  PrayerNameConst.ISHA,
] as const;

// ═══════════════════════════════════════════════════════════════════════════
// Main Function
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Determines the next prayer based on current time.
 *
 * @param location - Geographic location (latitude, longitude)
 * @param timezone - IANA timezone name or UTC offset
 * @param params - Calculation parameters (method, madhhab, etc.)
 * @param currentTime - Optional, defaults to new Date()
 * @returns Result containing next prayer info or error
 *
 * @example
 * ```typescript
 * import { getNextPrayer, KEMENAG } from '@azkal182/islamic-utils';
 *
 * const result = getNextPrayer(
 *   { latitude: -6.2088, longitude: 106.8456 },
 *   'Asia/Jakarta',
 *   { method: KEMENAG }
 * );
 *
 * if (result.success) {
 *   console.log(`Next: ${result.data.name} at ${result.data.time}`);
 *   console.log(`In ${result.data.minutesUntil} minutes`);
 * }
 * ```
 */
export function getNextPrayer(
  location: LocationInput,
  timezone: Timezone,
  params: PrayerCalculationParams,
  currentTime: Date = new Date()
): Result<NextPrayerInfo> {
  // Get current local time
  const local = dateToLocalTime(currentTime, timezone);
  const currentFractional = local.fractionalHours;

  // Extract date from currentTime
  const date = extractDateFromTime(currentTime, timezone);

  // Calculate prayer times for today
  const todayResult = computePrayerTimes(location, { date, timezone }, params);

  if (!todayResult.success) {
    return failure(todayResult.error);
  }

  const prayerTimes = todayResult.data;

  // Find next prayer
  for (const prayer of MAIN_PRAYER_ORDER) {
    const prayerTime = prayerTimes.times[prayer];

    if (prayerTime === null) continue;

    if (prayerTime > currentFractional) {
      // Found next prayer (today)
      const minutesUntil = Math.round((prayerTime - currentFractional) * 60);

      return success({
        name: prayer,
        time: prayerTimes.formatted[prayer] ?? '',
        timeNumeric: prayerTime,
        minutesUntil,
        isNextDay: false,
        prayerTimes,
      });
    }
  }

  // All prayers have passed - next is tomorrow's Imsak/Fajr
  const tomorrow = addDays(date, 1);
  const tomorrowResult = computePrayerTimes(location, { date: tomorrow, timezone }, params);

  if (tomorrowResult.success) {
    const tomorrowTimes = tomorrowResult.data;
    const tomorrowImsak = tomorrowTimes.times.imsak ?? tomorrowTimes.times.fajr;
    const tomorrowPrayer =
      tomorrowTimes.times.imsak !== null ? PrayerNameConst.IMSAK : PrayerNameConst.FAJR;

    if (tomorrowImsak !== null) {
      const minutesRemaining = Math.round((24 - currentFractional + tomorrowImsak) * 60);

      return success({
        name: tomorrowPrayer,
        time: tomorrowTimes.formatted[tomorrowPrayer] ?? '',
        timeNumeric: tomorrowImsak,
        minutesUntil: minutesRemaining,
        isNextDay: true,
        prayerTimes, // Still return today's times
      });
    }
  }

  // Fallback if tomorrow calculation fails
  const tomorrowImsak = prayerTimes.times.imsak ?? prayerTimes.times.fajr;
  const tomorrowPrayer =
    prayerTimes.times.imsak !== null ? PrayerNameConst.IMSAK : PrayerNameConst.FAJR;

  return success({
    name: tomorrowPrayer,
    time: prayerTimes.formatted[tomorrowPrayer] ?? '??:??',
    timeNumeric: tomorrowImsak ?? 0,
    minutesUntil: tomorrowImsak ? Math.round((24 - currentFractional + tomorrowImsak) * 60) : 0,
    isNextDay: true,
    prayerTimes,
  });
}

/**
 * Determines the current prayer period.
 *
 * @param location - Geographic location (latitude, longitude)
 * @param timezone - IANA timezone name or UTC offset
 * @param params - Calculation parameters (method, madhhab, etc.)
 * @param currentTime - Optional, defaults to new Date()
 * @returns Result containing current prayer info or error
 *
 * @example
 * ```typescript
 * const result = getCurrentPrayer(
 *   { latitude: -6.2088, longitude: 106.8456 },
 *   'Asia/Jakarta',
 *   { method: KEMENAG }
 * );
 *
 * if (result.success && result.data.current) {
 *   console.log(`Current period: ${result.data.current}`);
 * }
 * ```
 */
export function getCurrentPrayer(
  location: LocationInput,
  timezone: Timezone,
  params: PrayerCalculationParams,
  currentTime: Date = new Date()
): Result<CurrentPrayerInfo> {
  // Get current local time
  const local = dateToLocalTime(currentTime, timezone);
  const currentFractional = local.fractionalHours;

  // Extract date from currentTime
  const date = extractDateFromTime(currentTime, timezone);

  // Calculate prayer times for today
  const todayResult = computePrayerTimes(location, { date, timezone }, params);

  if (!todayResult.success) {
    return failure(todayResult.error);
  }

  const prayerTimes = todayResult.data;

  let current: PrayerName | null = null;
  let previous: PrayerName | null = null;

  // Find the most recent prayer that has passed
  for (let i = 0; i < MAIN_PRAYER_ORDER.length; i++) {
    const prayer = MAIN_PRAYER_ORDER[i];
    const prayerTime = prayerTimes.times[prayer];

    if (prayerTime === null) continue;

    if (prayerTime <= currentFractional) {
      previous = current;
      current = prayer;
    } else {
      break;
    }
  }

  return success({ current, previous, prayerTimes });
}

/**
 * Formats minutes into a human-readable countdown string.
 *
 * @param minutes - Number of minutes
 * @returns Formatted string like "1h 30m" or "45m"
 *
 * @example
 * ```typescript
 * formatMinutesUntil(90);  // "1h 30m"
 * formatMinutesUntil(45);  // "45m"
 * formatMinutesUntil(150); // "2h 30m"
 * ```
 */
export function formatMinutesUntil(minutes: number): string {
  if (minutes < 60) {
    return `${minutes}m`;
  }

  const hours = Math.floor(minutes / 60);
  const remaining = minutes % 60;

  if (remaining === 0) {
    return `${hours}h`;
  }

  return `${hours}h ${remaining}m`;
}

// ═══════════════════════════════════════════════════════════════════════════
// Helper Functions
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Extracts DateOnly from a JavaScript Date in the given timezone.
 */
function extractDateFromTime(date: Date, timezone: Timezone): DateOnly {
  if (typeof timezone === 'string') {
    // Use Intl API for IANA timezone
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
    });

    const parts = formatter.formatToParts(date);
    const year = parseInt(parts.find((p) => p.type === 'year')?.value ?? '2024', 10);
    const month = parseInt(parts.find((p) => p.type === 'month')?.value ?? '1', 10);
    const day = parseInt(parts.find((p) => p.type === 'day')?.value ?? '1', 10);

    return { year, month, day };
  } else {
    // Simple offset calculation
    const utcMs = date.getTime();
    const offsetMs = timezone * 60 * 60 * 1000;
    const localDate = new Date(utcMs + offsetMs);

    return fromJSDate(localDate);
  }
}
