/**
 * @fileoverview Next Prayer Time Calculator
 * @module prayer-times/next-prayer
 *
 * This module provides the `getNextPrayer` function that determines
 * which prayer is next based on the current time.
 */

import type { Timezone } from '../core/types';
import { dateToLocalTime } from '../core/utils/timezone';
import type { PrayerTimesResult, PrayerName } from './types';
import { PrayerName as PrayerNameConst } from './types';

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
 * @param currentTime - JavaScript Date object representing current time
 * @param prayerTimes - Result from computePrayerTimes
 * @param timezone - IANA timezone name or UTC offset
 * @returns Next prayer information
 *
 * @example
 * ```typescript
 * import { computePrayerTimes, getNextPrayer, CALCULATION_METHODS } from '@azkal182/islamic-utils';
 *
 * const result = computePrayerTimes(
 *   { latitude: -6.2088, longitude: 106.8456 },
 *   { date: { year: 2024, month: 1, day: 15 }, timezone: 7 },
 *   { method: CALCULATION_METHODS.KEMENAG }
 * );
 *
 * if (result.success) {
 *   const next = getNextPrayer(new Date(), result.data, 7);
 *   console.log(`Next: ${next.name} at ${next.time}`);
 *   console.log(`In ${next.minutesUntil} minutes`);
 * }
 * ```
 */
export function getNextPrayer(
  currentTime: Date,
  prayerTimes: PrayerTimesResult,
  timezone: Timezone
): NextPrayerInfo {
  // Get current local time
  const local = dateToLocalTime(currentTime, timezone);
  const currentFractional = local.fractionalHours;

  // Find next prayer
  for (const prayer of MAIN_PRAYER_ORDER) {
    const prayerTime = prayerTimes.times[prayer];

    if (prayerTime === null) continue;

    if (prayerTime > currentFractional) {
      // Found next prayer (today)
      const minutesUntil = Math.round((prayerTime - currentFractional) * 60);

      return {
        name: prayer,
        time: prayerTimes.formatted[prayer] ?? '',
        timeNumeric: prayerTime,
        minutesUntil,
        isNextDay: false,
      };
    }
  }

  // All prayers have passed - next is tomorrow's Imsak/Fajr
  const tomorrowImsak = prayerTimes.times.imsak ?? prayerTimes.times.fajr;
  const tomorrowPrayer =
    prayerTimes.times.imsak !== null ? PrayerNameConst.IMSAK : PrayerNameConst.FAJR;

  if (tomorrowImsak === null) {
    // Fallback if no times available
    return {
      name: PrayerNameConst.FAJR,
      time: '??:??',
      timeNumeric: 0,
      minutesUntil: 0,
      isNextDay: true,
    };
  }

  // Calculate minutes until tomorrow's prayer
  // (24 - current) + tomorrow = remaining today + time into tomorrow
  const minutesRemaining = (24 - currentFractional + tomorrowImsak) * 60;

  return {
    name: tomorrowPrayer,
    time: prayerTimes.formatted[tomorrowPrayer] ?? '',
    timeNumeric: tomorrowImsak,
    minutesUntil: Math.round(minutesRemaining),
    isNextDay: true,
  };
}

/**
 * Determines the current prayer period.
 *
 * @param currentTime - JavaScript Date object representing current time
 * @param prayerTimes - Result from computePrayerTimes
 * @param timezone - IANA timezone name or UTC offset
 * @returns Current prayer period info
 *
 * @example
 * ```typescript
 * const current = getCurrentPrayer(new Date(), result.data, 7);
 * if (current.current) {
 *   console.log(`Current period: ${current.current}`);
 * }
 * ```
 */
export function getCurrentPrayer(
  currentTime: Date,
  prayerTimes: PrayerTimesResult,
  timezone: Timezone
): CurrentPrayerInfo {
  // Get current local time
  const local = dateToLocalTime(currentTime, timezone);
  const currentFractional = local.fractionalHours;

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

  return { current, previous };
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
