/**
 * @fileoverview Prayer time validation
 * @module prayer-times/validation
 *
 * This module validates that calculated prayer times are in the correct order.
 */

import type { Result } from '../core/types/result';
import { success, failure } from '../core/types/result';
import { Errors } from '../core/errors';
import type { PrayerTimes, PrayerName as PrayerNameType } from './types';
import { PrayerName, PRAYER_NAMES_ORDERED } from './types';

/**
 * Validates that prayer times are in chronological order.
 *
 * @param times - Prayer times to validate
 * @returns Success if valid, failure with details if not
 *
 * @remarks
 * Expected order:
 * Imsak < Fajr < Sunrise < Dhuha Start < Dhuha End < Dhuhr < Asr < Maghrib < Isha
 *
 * Null values are skipped in validation.
 *
 * @example
 * ```typescript
 * const result = validateTimeSequence(times);
 * if (result.success) {
 *   console.log('Times are in valid order');
 * } else {
 *   console.error('Invalid order:', result.error.details);
 * }
 * ```
 */
export function validateTimeSequence(times: Partial<PrayerTimes>): Result<boolean> {
  let previousTime: number | null = null;
  let previousPrayer: PrayerNameType | null = null;

  for (const prayer of PRAYER_NAMES_ORDERED) {
    const time = times[prayer];

    // Skip null/undefined values
    if (time === null || time === undefined) {
      continue;
    }

    // Check if current time is after previous time
    if (previousTime !== null && time <= previousTime) {
      return failure(
        Errors.prayerTimesInconsistent({
          previousPrayer,
          previousTime,
          currentPrayer: prayer,
          currentTime: time,
          message: `${prayer} (${formatTime(time)}) must be after ${previousPrayer} (${formatTime(previousTime)})`,
        })
      );
    }

    previousTime = time;
    previousPrayer = prayer;
  }

  return success(true);
}

/**
 * Validates that a specific prayer time is within a reasonable range.
 *
 * @param prayer - Prayer name
 * @param time - Time in fractional hours
 * @returns True if time is within expected range
 *
 * @remarks
 * This provides a sanity check that calculated times make sense.
 * - Morning prayers (Imsak, Fajr, Sunrise, Dhuha): 0-12 hours
 * - Afternoon prayers (Dhuhr, Asr): 10-18 hours
 * - Evening prayers (Maghrib, Isha): 15-24 hours (or 0-3 for late Isha)
 */
export function isTimeInReasonableRange(prayer: PrayerNameType, time: number): boolean {
  // Normalize time to 0-24
  const normalizedTime = time < 0 ? time + 24 : time >= 24 ? time - 24 : time;

  switch (prayer) {
    case PrayerName.IMSAK:
    case PrayerName.FAJR:
      // 2 AM to 8 AM
      return normalizedTime >= 2 && normalizedTime <= 8;

    case PrayerName.SUNRISE:
    case PrayerName.DHUHA_START:
      // 4 AM to 10 AM
      return normalizedTime >= 4 && normalizedTime <= 10;

    case PrayerName.DHUHA_END:
    case PrayerName.DHUHR:
      // 10 AM to 3 PM
      return normalizedTime >= 10 && normalizedTime <= 15;

    case PrayerName.ASR:
      // 12 PM to 6 PM
      return normalizedTime >= 12 && normalizedTime <= 18;

    case PrayerName.MAGHRIB:
      // 4 PM to 9 PM
      return normalizedTime >= 16 && normalizedTime <= 21;

    case PrayerName.ISHA:
      // 6 PM to 12 AM (can extend past midnight at high latitudes)
      return normalizedTime >= 18 || normalizedTime <= 3;

    default:
      return true;
  }
}

/**
 * Validates all prayer times are within reasonable ranges.
 *
 * @param times - Prayer times to validate
 * @returns Array of prayers with out-of-range times
 */
export function validateTimeRanges(times: Partial<PrayerTimes>): PrayerNameType[] {
  const outOfRange: PrayerNameType[] = [];

  for (const prayer of PRAYER_NAMES_ORDERED) {
    const time = times[prayer];
    if (time !== null && time !== undefined) {
      if (!isTimeInReasonableRange(prayer, time)) {
        outOfRange.push(prayer);
      }
    }
  }

  return outOfRange;
}

/**
 * Formats a fractional hour as HH:MM string.
 *
 * @param hours - Time in fractional hours
 * @returns Formatted time string
 */
function formatTime(hours: number): string {
  const h = Math.floor(hours);
  const m = Math.round((hours - h) * 60);
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
}

/**
 * Performs full validation of prayer times.
 *
 * @param times - Prayer times to validate
 * @returns Result with validation outcome
 */
export function validatePrayerTimes(times: Partial<PrayerTimes>): Result<boolean> {
  // First check sequence
  const sequenceResult = validateTimeSequence(times);
  if (!sequenceResult.success) {
    return sequenceResult;
  }

  // Then check ranges (this is a warning, not an error)
  const outOfRange = validateTimeRanges(times);
  if (outOfRange.length > 0) {
    // Log warning but don't fail - extreme latitudes may have unusual times
    // This could be enhanced to use a trace/warning system
  }

  return success(true);
}
