/**
 * @fileoverview Imsak calculation
 * @module prayer-times/calculations/imsak
 *
 * Imsak is the time to stop eating before Fajr, marking the start of fasting.
 */

import type { Coordinates } from '../../core/types/coordinates';
import type { DateOnly } from '../../core/types/date';
import type { ImsakRule } from '../types';
import { DEFAULT_IMSAK_RULE } from '../types';
import { calculateFajr } from './core';

/**
 * Calculates Imsak time based on minutes before Fajr.
 *
 * @param fajrTime - Fajr time in fractional hours
 * @param minutesBefore - Number of minutes before Fajr
 * @returns Imsak time in fractional hours
 *
 * @example
 * ```typescript
 * // If Fajr is at 5.5 (5:30 AM), and we want 10 minutes before:
 * calculateImsakMinutes(5.5, 10); // 5.333... (5:20 AM)
 * ```
 */
export function calculateImsakMinutes(fajrTime: number, minutesBefore: number): number {
  return fajrTime - minutesBefore / 60;
}

/**
 * Calculates Imsak time based on sun angle.
 *
 * @param date - The date
 * @param coords - Geographic coordinates
 * @param timezone - Timezone offset
 * @param angle - Sun angle for Imsak (typically 19-20°)
 * @returns Imsak time in fractional hours, or null if not calculable
 *
 * @remarks
 * Angle-based Imsak uses a slightly larger angle than Fajr,
 * providing a built-in safety margin for the start of fasting.
 */
export function calculateImsakAngle(
  date: DateOnly,
  coords: Coordinates,
  timezone: number,
  angle: number
): number | null {
  // Imsak uses a larger angle than Fajr (sun deeper below horizon)
  return calculateFajr(date, coords, timezone, angle);
}

/**
 * Calculates Imsak time based on the specified rule.
 *
 * @param date - The date
 * @param coords - Geographic coordinates
 * @param timezone - Timezone offset
 * @param fajrTime - Previously calculated Fajr time
 * @param rule - Imsak calculation rule
 * @returns Imsak time in fractional hours, or null if not calculable
 *
 * @example
 * ```typescript
 * // Minutes-based (most common)
 * calculateImsak(date, coords, 7, 5.5, {
 *   type: 'minutes_before_fajr',
 *   value: 10
 * }); // 5.333...
 *
 * // Angle-based
 * calculateImsak(date, coords, 7, 5.5, {
 *   type: 'angle_based',
 *   value: 20
 * }); // Calculated from sun angle
 * ```
 */
export function calculateImsak(
  date: DateOnly,
  coords: Coordinates,
  timezone: number,
  fajrTime: number | null,
  rule: ImsakRule = DEFAULT_IMSAK_RULE
): number | null {
  switch (rule.type) {
    case 'minutes_before_fajr':
      if (fajrTime === null) return null;
      return calculateImsakMinutes(fajrTime, rule.value);

    case 'angle_based':
      return calculateImsakAngle(date, coords, timezone, rule.value);

    default:
      // Fallback to default rule
      if (fajrTime === null) return null;
      return calculateImsakMinutes(fajrTime, 10);
  }
}
