/**
 * @fileoverview High latitude prayer time adjustments
 * @module prayer-times/high-latitude
 *
 * This module handles special cases at high latitudes where the sun
 * may not reach the required angles for Fajr and Isha calculations.
 *
 * @remarks
 * At latitudes above approximately 48.5°, during summer months, the sun
 * may not descend far enough below the horizon for the Fajr or Isha
 * angles to be reached. This module provides alternative calculation
 * methods for such situations.
 */

import type {
  PrayerTimes,
  HighLatitudeRule,
  CalculationMethod,
  PrayerName as PrayerNameType,
} from './types';
import { HighLatitudeRule as HLRule, PrayerName } from './types';
import { calculateNightDuration } from './calculations/core';

/**
 * Parameters for high latitude adjustment.
 */
export interface HighLatitudeParams {
  /** The high latitude rule to apply */
  rule: HighLatitudeRule;
  /** Sunset time in fractional hours */
  sunset: number;
  /** Next sunrise time in fractional hours */
  sunrise: number;
  /** The calculation method (for angle-based rule) */
  method: CalculationMethod;
  /** Observer's latitude in degrees */
  latitude: number;
}

/**
 * Result of night portion calculation.
 */
interface NightPortion {
  /** Portion of night for Fajr calculation (from sunrise, going back) */
  fajrPortion: number;
  /** Portion of night for Isha calculation (from sunset, going forward) */
  ishaPortion: number;
}

/**
 * Calculates night portions using Middle of Night method.
 *
 * @returns Night portions (0.5 for both Fajr and Isha)
 *
 * @remarks
 * This method divides the night into two equal halves.
 * - Fajr: Sunrise - (night duration × 0.5)
 * - Isha: Sunset + (night duration × 0.5)
 */
export function middleOfNight(): NightPortion {
  return {
    fajrPortion: 0.5,
    ishaPortion: 0.5,
  };
}

/**
 * Calculates night portions using One-Seventh method.
 *
 * @returns Night portions (1/7 for Fajr, 6/7 for Isha)
 *
 * @remarks
 * This method is based on the hadith about dividing the night into seven parts.
 * - Fajr: Sunrise - (night duration × 1/7)
 * - Isha: Sunset + (night duration × 6/7)
 */
export function oneSeventh(): NightPortion {
  return {
    fajrPortion: 1 / 7,
    ishaPortion: 6 / 7,
  };
}

/**
 * Calculates night portions using Angle-Based method.
 *
 * @param fajrAngle - Fajr angle below horizon
 * @param ishaAngle - Isha angle below horizon
 * @param latitude - Observer's latitude
 * @returns Night portions proportional to angles
 *
 * @remarks
 * This method calculates the portion based on the ratio of the
 * prayer angle to a reference angle (60°).
 *
 * Formula: portion = angle / 60
 *
 * This gives a proportional time that corresponds to how far
 * the sun would need to travel below the horizon.
 */
export function angleBased(fajrAngle: number, ishaAngle: number): NightPortion {
  // Reference angle is 60° (night duration at this latitude would be fully dark)
  const referenceAngle = 60;

  return {
    fajrPortion: fajrAngle / referenceAngle,
    ishaPortion: ishaAngle / referenceAngle,
  };
}

/**
 * Gets night portions based on the specified rule.
 *
 * @param params - High latitude parameters
 * @returns Night portions or null if NONE rule is used
 */
function getNightPortions(params: HighLatitudeParams): NightPortion | null {
  const { rule, method } = params;

  switch (rule) {
    case HLRule.NONE:
      return null;

    case HLRule.MIDDLE_OF_NIGHT:
      return middleOfNight();

    case HLRule.ONE_SEVENTH:
      return oneSeventh();

    case HLRule.ANGLE_BASED:
      const ishaAngle = method.ishaAngle ?? 17;
      return angleBased(method.fajrAngle, ishaAngle);

    default:
      return null;
  }
}

/**
 * Calculates adjusted Fajr time using high latitude rule.
 *
 * @param sunset - Sunset time
 * @param sunrise - Sunrise time
 * @param portion - Night portion for Fajr
 * @returns Adjusted Fajr time
 */
function calculateAdjustedFajr(sunset: number, sunrise: number, portion: number): number {
  const nightDuration = calculateNightDuration(sunset, sunrise);
  const adjustedFajr = sunrise - nightDuration * portion;

  // Normalize to 0-24 range
  if (adjustedFajr < 0) {
    return adjustedFajr + 24;
  }
  return adjustedFajr;
}

/**
 * Calculates adjusted Isha time using high latitude rule.
 *
 * @param sunset - Sunset time
 * @param sunrise - Sunrise time
 * @param portion - Night portion for Isha
 * @returns Adjusted Isha time
 */
function calculateAdjustedIsha(sunset: number, sunrise: number, portion: number): number {
  const nightDuration = calculateNightDuration(sunset, sunrise);
  const adjustedIsha = sunset + nightDuration * portion;

  // Normalize to 0-24 range
  if (adjustedIsha >= 24) {
    return adjustedIsha - 24;
  }
  return adjustedIsha;
}

/**
 * Applies high latitude rule to prayer times.
 *
 * @param times - Partially calculated prayer times
 * @param params - High latitude parameters
 * @returns Adjusted prayer times with list of adjusted prayers
 *
 * @remarks
 * This function checks if Fajr and/or Isha are null (couldn't be calculated)
 * and applies the specified high latitude rule to calculate substitute times.
 *
 * @example
 * ```typescript
 * const result = applyHighLatitudeRule(times, {
 *   rule: HighLatitudeRule.MIDDLE_OF_NIGHT,
 *   sunset: 21.5,
 *   sunrise: 3.5,
 *   method: CALCULATION_METHODS.MWL,
 *   latitude: 59.9
 * });
 *
 * console.log(result.times.fajr); // Adjusted time
 * console.log(result.adjustedPrayers); // ['fajr'] or ['fajr', 'isha']
 * ```
 */
export function applyHighLatitudeRule(
  times: Partial<PrayerTimes>,
  params: HighLatitudeParams
): { times: Partial<PrayerTimes>; adjustedPrayers: PrayerNameType[] } {
  const adjustedTimes = { ...times };
  const adjustedPrayers: PrayerNameType[] = [];

  // If rule is NONE, just return as-is
  if (params.rule === HLRule.NONE) {
    return { times: adjustedTimes, adjustedPrayers };
  }

  // Get night portions
  const portions = getNightPortions(params);
  if (!portions) {
    return { times: adjustedTimes, adjustedPrayers };
  }

  // Check if we need to adjust Fajr
  if (times[PrayerName.FAJR] === null || times[PrayerName.FAJR] === undefined) {
    adjustedTimes[PrayerName.FAJR] = calculateAdjustedFajr(
      params.sunset,
      params.sunrise,
      portions.fajrPortion
    );
    adjustedPrayers.push(PrayerName.FAJR);
  }

  // Check if we need to adjust Isha
  if (times[PrayerName.ISHA] === null || times[PrayerName.ISHA] === undefined) {
    adjustedTimes[PrayerName.ISHA] = calculateAdjustedIsha(
      params.sunset,
      params.sunrise,
      portions.ishaPortion
    );
    adjustedPrayers.push(PrayerName.ISHA);
  }

  return { times: adjustedTimes, adjustedPrayers };
}

/**
 * Checks if high latitude adjustments are needed.
 *
 * @param times - Calculated prayer times
 * @returns True if Fajr or Isha is null
 */
export function needsHighLatitudeAdjustment(times: Partial<PrayerTimes>): boolean {
  return times[PrayerName.FAJR] === null || times[PrayerName.ISHA] === null;
}

/**
 * Determines if a location is considered high latitude.
 *
 * @param latitude - Latitude in degrees
 * @param threshold - Threshold for high latitude (default: 48.5)
 * @returns True if latitude exceeds threshold
 */
export function isHighLatitudeLocation(latitude: number, threshold: number = 48.5): boolean {
  return Math.abs(latitude) > threshold;
}
