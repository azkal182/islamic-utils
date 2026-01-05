/**
 * @fileoverview Prayer time adjustments and rounding
 * @module prayer-times/adjustments
 *
 * This module handles manual adjustments and safety buffers for prayer times.
 */

import type {
  PrayerTimes,
  PrayerName as PrayerNameType,
  PrayerAdjustments,
  SafetyBuffer,
  PrayerRoundingRule,
} from './types';
import { PrayerName, PrayerRoundingRule as RoundRule, PRAYER_NAMES_ORDERED } from './types';
import { roundToMinute } from '../core/utils/math';
import type { RoundingRule } from '../core/utils/math';

/**
 * Maps PrayerRoundingRule to RoundingRule.
 */
function mapRoundingRule(rule: PrayerRoundingRule): RoundingRule {
  switch (rule) {
    case RoundRule.NONE:
      return 'none';
    case RoundRule.NEAREST:
      return 'nearest';
    case RoundRule.CEIL:
      return 'ceil';
    case RoundRule.FLOOR:
      return 'floor';
    default:
      return 'nearest';
  }
}

/**
 * Applies manual adjustments to prayer times.
 *
 * @param times - Prayer times in fractional hours
 * @param adjustments - Adjustments in minutes for each prayer
 * @returns Adjusted prayer times
 *
 * @remarks
 * Positive values delay the prayer time (add minutes).
 * Negative values make the prayer time earlier (subtract minutes).
 *
 * @example
 * ```typescript
 * // Delay Fajr by 2 minutes, make Maghrib 1 minute earlier
 * applyAdjustments(times, {
 *   fajr: 2,
 *   maghrib: -1
 * });
 * ```
 */
export function applyAdjustments(
  times: Partial<PrayerTimes>,
  adjustments: PrayerAdjustments
): Partial<PrayerTimes> {
  const result: Partial<PrayerTimes> = { ...times };

  for (const prayer of PRAYER_NAMES_ORDERED) {
    const adjustment = adjustments[prayer];
    const time = times[prayer];

    if (adjustment !== undefined && time !== null && time !== undefined) {
      result[prayer] = time + adjustment / 60;
    }
  }

  return result;
}

/**
 * Applies safety buffer (ihtiyath) to prayer times.
 *
 * @param times - Prayer times in fractional hours
 * @param buffer - Buffer configuration (single value or per-prayer)
 * @returns Buffered prayer times
 *
 * @remarks
 * Safety buffer is a precautionary margin added to prayer times.
 * - For prayers at the START of their window (Fajr, Dhuhr, Asr, Maghrib, Isha):
 *   Buffer is ADDED (delays the time for safety)
 * - For prayers at the END of their window (Imsak, Sunrise, Dhuha end):
 *   Buffer is SUBTRACTED (makes the time earlier for safety)
 *
 * @example
 * ```typescript
 * // Add 2-minute buffer to all prayers
 * applySafetyBuffer(times, 2);
 *
 * // Custom buffer per prayer
 * applySafetyBuffer(times, { fajr: 3, maghrib: 2 });
 * ```
 */
export function applySafetyBuffer(
  times: Partial<PrayerTimes>,
  buffer: SafetyBuffer
): Partial<PrayerTimes> {
  const result: Partial<PrayerTimes> = { ...times };

  // Prayers where buffer is subtracted (end-of-window times)
  const subtractBufferPrayers: PrayerNameType[] = [
    PrayerName.IMSAK,
    PrayerName.SUNRISE,
    PrayerName.DHUHA_END,
  ];

  for (const prayer of PRAYER_NAMES_ORDERED) {
    const time = times[prayer];
    if (time === null || time === undefined) continue;

    // Get buffer value for this prayer
    let bufferMinutes: number;
    if (typeof buffer === 'number') {
      bufferMinutes = buffer;
    } else {
      bufferMinutes = buffer[prayer] ?? 0;
    }

    if (bufferMinutes === 0) continue;

    // Apply buffer (subtract for end-of-window, add for start-of-window)
    if (subtractBufferPrayers.includes(prayer)) {
      result[prayer] = time - bufferMinutes / 60;
    } else {
      result[prayer] = time + bufferMinutes / 60;
    }
  }

  return result;
}

/**
 * Applies rounding to prayer times.
 *
 * @param times - Prayer times in fractional hours
 * @param rule - Rounding rule to apply
 * @returns Rounded prayer times
 *
 * @example
 * ```typescript
 * // Round all times to nearest minute
 * applyRounding(times, PrayerRoundingRule.NEAREST);
 * ```
 */
export function applyRounding(
  times: Partial<PrayerTimes>,
  rule: PrayerRoundingRule
): Partial<PrayerTimes> {
  if (rule === RoundRule.NONE) {
    return times;
  }

  const result: Partial<PrayerTimes> = {};
  const roundingRule = mapRoundingRule(rule);

  for (const prayer of PRAYER_NAMES_ORDERED) {
    const time = times[prayer];
    if (time === null || time === undefined) {
      result[prayer] = time;
    } else {
      result[prayer] = roundToMinute(time, roundingRule);
    }
  }

  return result;
}

/**
 * Applies all adjustments in the correct order.
 *
 * @param times - Base prayer times
 * @param adjustments - Manual adjustments
 * @param buffer - Safety buffer
 * @param roundingRule - Rounding rule
 * @returns Fully adjusted prayer times
 *
 * @remarks
 * Order of application:
 * 1. Manual adjustments
 * 2. Safety buffer
 * 3. Rounding
 */
export function applyAllAdjustments(
  times: Partial<PrayerTimes>,
  adjustments?: PrayerAdjustments,
  buffer?: SafetyBuffer,
  roundingRule?: PrayerRoundingRule
): Partial<PrayerTimes> {
  let result = times;

  // 1. Apply manual adjustments
  if (adjustments && Object.keys(adjustments).length > 0) {
    result = applyAdjustments(result, adjustments);
  }

  // 2. Apply safety buffer
  if (buffer !== undefined) {
    result = applySafetyBuffer(result, buffer);
  }

  // 3. Apply rounding
  if (roundingRule) {
    result = applyRounding(result, roundingRule);
  }

  return result;
}
