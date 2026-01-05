/**
 * @fileoverview Dhuha calculation
 * @module prayer-times/calculations/dhuha
 *
 * Dhuha is a voluntary prayer performed after sunrise and before solar noon.
 */

import type { Coordinates } from '../../core/types/coordinates';
import type { DateOnly } from '../../core/types/date';
import type { DhuhaRule } from '../types';
import { DEFAULT_DHUHA_RULE } from '../types';
import { getJulianDay } from './core';
import { timeForSunAngle } from '../../astronomy/solar';

/**
 * Calculates Dhuha start time based on minutes after sunrise.
 *
 * @param sunriseTime - Sunrise time in fractional hours
 * @param minutesAfter - Number of minutes after sunrise
 * @returns Dhuha start time in fractional hours
 *
 * @example
 * ```typescript
 * // If Sunrise is at 6.0 (6:00 AM), and we want 15 minutes after:
 * calculateDhuhaStartMinutes(6.0, 15); // 6.25 (6:15 AM)
 * ```
 */
export function calculateDhuhaStartMinutes(sunriseTime: number, minutesAfter: number): number {
  return sunriseTime + minutesAfter / 60;
}

/**
 * Calculates Dhuha start time based on sun altitude.
 *
 * @param date - The date
 * @param coords - Geographic coordinates
 * @param timezone - Timezone offset
 * @param altitude - Sun altitude in degrees above horizon
 * @returns Dhuha start time in fractional hours, or null if not calculable
 *
 * @remarks
 * Some scholars define Dhuha as beginning when the sun reaches
 * a certain height above the horizon (e.g., 4.5° or 12°).
 *
 * @example
 * ```typescript
 * // Dhuha starts when sun is 12° above horizon
 * calculateDhuhaStartAltitude(date, coords, 7, 12);
 * ```
 */
export function calculateDhuhaStartAltitude(
  date: DateOnly,
  coords: Coordinates,
  timezone: number,
  altitude: number
): number | null {
  const jd = getJulianDay(date);
  // Rising = true because Dhuha is in the morning
  return timeForSunAngle(jd, coords.latitude, coords.longitude, timezone, altitude, true);
}

/**
 * Calculates Dhuha end time.
 *
 * @param dhuhrTime - Dhuhr (solar noon) time in fractional hours
 * @param minutesBefore - Number of minutes before Dhuhr
 * @returns Dhuha end time in fractional hours
 *
 * @remarks
 * Dhuha ends at or slightly before solar noon.
 * A value of 0 means Dhuha ends exactly at Dhuhr.
 *
 * @example
 * ```typescript
 * // Dhuhr is at 12.0, Dhuha ends at Dhuhr
 * calculateDhuhaEnd(12.0, 0); // 12.0
 *
 * // Dhuhr is at 12.0, Dhuha ends 5 minutes before
 * calculateDhuhaEnd(12.0, 5); // 11.916... (11:55 AM)
 * ```
 */
export function calculateDhuhaEnd(dhuhrTime: number, minutesBefore: number): number {
  return dhuhrTime - minutesBefore / 60;
}

/**
 * Calculates Dhuha prayer time window.
 *
 * @param date - The date
 * @param coords - Geographic coordinates
 * @param timezone - Timezone offset
 * @param sunriseTime - Previously calculated sunrise time
 * @param dhuhrTime - Previously calculated Dhuhr time
 * @param rule - Dhuha calculation rule
 * @returns Object with start and end times, or nulls if not calculable
 *
 * @example
 * ```typescript
 * const dhuha = calculateDhuha(date, coords, 7, 6.0, 12.0, {
 *   start: { type: 'minutes_after_sunrise', value: 15 },
 *   end: { type: 'minutes_before_dhuhr', value: 0 }
 * });
 * // { start: 6.25, end: 12.0 }
 * ```
 */
export function calculateDhuha(
  date: DateOnly,
  coords: Coordinates,
  timezone: number,
  sunriseTime: number | null,
  dhuhrTime: number,
  rule: DhuhaRule = DEFAULT_DHUHA_RULE
): { start: number | null; end: number } {
  // Calculate start time
  let start: number | null = null;

  switch (rule.start.type) {
    case 'minutes_after_sunrise':
      if (sunriseTime !== null) {
        start = calculateDhuhaStartMinutes(sunriseTime, rule.start.value);
      }
      break;

    case 'sun_altitude':
      start = calculateDhuhaStartAltitude(date, coords, timezone, rule.start.value);
      break;
  }

  // Calculate end time
  const end = calculateDhuhaEnd(dhuhrTime, rule.end.value);

  return { start, end };
}
