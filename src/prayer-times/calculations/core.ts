/**
 * @fileoverview Core prayer time calculations
 * @module prayer-times/calculations/core
 *
 * This module provides the fundamental calculations for each prayer time,
 * leveraging the astronomical functions from the astronomy module.
 */

import type { Coordinates } from '../../core/types/coordinates';
import type { DateOnly } from '../../core/types/date';
import type { CalculationMethod, PrayerTimes } from '../types';
import { PrayerName, getAsrShadowFactor, type AsrMadhhab } from '../types';
import {
  dateToJulianDay,
  julianCentury,
  solarDeclination,
  solarNoon as calcSolarNoon,
  asrSunAngle,
  timeForSunAngle,
} from '../../astronomy/solar';
import { PRAYER_ANGLES } from '../../core/constants/astronomical';

// ═══════════════════════════════════════════════════════════════════════════
// Solar Position Calculations
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Calculates the Julian Day for a given date.
 *
 * @param date - The date
 * @returns Julian Day number at midnight
 */
export function getJulianDay(date: DateOnly): number {
  return dateToJulianDay(date.year, date.month, date.day);
}

/**
 * Calculates solar noon (Dhuhr time) for a location.
 *
 * @param date - The date
 * @param longitude - Longitude in degrees
 * @param timezone - Timezone offset in hours
 * @returns Solar noon in fractional hours
 *
 * @remarks
 * Solar noon is when the sun crosses the local meridian.
 * This is the reference point for calculating other prayer times.
 */
export function calculateSolarNoon(date: DateOnly, longitude: number, timezone: number): number {
  const jd = getJulianDay(date);
  return calcSolarNoon(longitude, timezone, jd);
}

/**
 * Calculates the sun's declination for a given date.
 *
 * @param date - The date
 * @returns Declination in degrees
 */
export function getSolarDeclination(date: DateOnly): number {
  const jd = getJulianDay(date);
  const T = julianCentury(jd);
  return solarDeclination(T);
}

// ═══════════════════════════════════════════════════════════════════════════
// Individual Prayer Calculations
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Calculates Fajr time based on the method's angle.
 *
 * @param date - The date
 * @param coords - Geographic coordinates
 * @param timezone - Timezone offset
 * @param fajrAngle - Angle below horizon for Fajr (typically 15-20°)
 * @returns Fajr time in fractional hours, or null if not calculable
 *
 * @remarks
 * Fajr begins when the first light appears on the eastern horizon,
 * which occurs when the sun is at the specified angle below the horizon.
 */
export function calculateFajr(
  date: DateOnly,
  coords: Coordinates,
  timezone: number,
  fajrAngle: number
): number | null {
  const jd = getJulianDay(date);
  return timeForSunAngle(jd, coords.latitude, coords.longitude, timezone, -fajrAngle, true);
}

/**
 * Calculates sunrise time.
 *
 * @param date - The date
 * @param coords - Geographic coordinates
 * @param timezone - Timezone offset
 * @returns Sunrise time in fractional hours, or null if polar day/night
 */
export function calculateSunrise(
  date: DateOnly,
  coords: Coordinates,
  timezone: number
): number | null {
  const jd = getJulianDay(date);
  return timeForSunAngle(
    jd,
    coords.latitude,
    coords.longitude,
    timezone,
    PRAYER_ANGLES.SUNRISE_SUNSET,
    true
  );
}

/**
 * Calculates Dhuhr (noon prayer) time.
 *
 * @param date - The date
 * @param coords - Geographic coordinates
 * @param timezone - Timezone offset
 * @returns Dhuhr time in fractional hours
 *
 * @remarks
 * Dhuhr begins just after solar noon (when the sun has passed its zenith).
 * We add a small buffer (1 minute) to ensure we're past the zenith.
 */
export function calculateDhuhr(date: DateOnly, coords: Coordinates, timezone: number): number {
  const noon = calculateSolarNoon(date, coords.longitude, timezone);
  // Add 1 minute buffer past solar noon
  return noon + 1 / 60;
}

/**
 * Calculates Asr time based on shadow length.
 *
 * @param date - The date
 * @param coords - Geographic coordinates
 * @param timezone - Timezone offset
 * @param madhhab - Asr calculation madhhab (standard = 1x shadow, hanafi = 2x shadow)
 * @returns Asr time in fractional hours, or null if not calculable
 */
export function calculateAsr(
  date: DateOnly,
  coords: Coordinates,
  timezone: number,
  madhhab: AsrMadhhab
): number | null {
  const jd = getJulianDay(date);
  const T = julianCentury(jd);
  const declination = solarDeclination(T);

  // Get shadow factor (1 for standard, 2 for Hanafi)
  const shadowFactor = getAsrShadowFactor(madhhab);

  // Calculate sun altitude when shadow reaches the required ratio
  const altitude = asrSunAngle(coords.latitude, declination, shadowFactor);

  // Calculate time for this altitude (afternoon = setting)
  return timeForSunAngle(jd, coords.latitude, coords.longitude, timezone, altitude, false);
}

/**
 * Calculates Maghrib (sunset) time.
 *
 * @param date - The date
 * @param coords - Geographic coordinates
 * @param timezone - Timezone offset
 * @param maghribAngle - Optional custom angle (default: -0.833°)
 * @returns Maghrib time in fractional hours, or null if polar day/night
 */
export function calculateMaghrib(
  date: DateOnly,
  coords: Coordinates,
  timezone: number,
  maghribAngle?: number
): number | null {
  const jd = getJulianDay(date);
  const angle = maghribAngle ?? PRAYER_ANGLES.SUNRISE_SUNSET;
  return timeForSunAngle(jd, coords.latitude, coords.longitude, timezone, angle, false);
}

/**
 * Calculates Isha time based on angle or interval.
 *
 * @param date - The date
 * @param coords - Geographic coordinates
 * @param timezone - Timezone offset
 * @param method - Calculation method (provides ishaAngle or ishaIntervalMinutes)
 * @param maghribTime - Previously calculated Maghrib time (needed if using interval)
 * @returns Isha time in fractional hours, or null if not calculable
 */
export function calculateIsha(
  date: DateOnly,
  coords: Coordinates,
  timezone: number,
  method: CalculationMethod,
  maghribTime: number | null
): number | null {
  // If method uses interval (e.g., Makkah - 90 minutes after Maghrib)
  if (method.ishaIntervalMinutes !== undefined) {
    if (maghribTime === null) return null;
    return maghribTime + method.ishaIntervalMinutes / 60;
  }

  // Otherwise use angle-based calculation
  const ishaAngle = method.ishaAngle ?? 17; // Default to 17° if not specified
  const jd = getJulianDay(date);
  return timeForSunAngle(jd, coords.latitude, coords.longitude, timezone, -ishaAngle, false);
}

// ═══════════════════════════════════════════════════════════════════════════
// Batch Calculation
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Parameters for calculating all prayer times.
 */
export interface CoreCalculationParams {
  /** The date */
  date: DateOnly;
  /** Geographic coordinates */
  coords: Coordinates;
  /** Timezone offset in hours */
  timezone: number;
  /** Calculation method */
  method: CalculationMethod;
  /** Asr madhhab */
  asrMadhhab: AsrMadhhab;
}

/**
 * Calculates the core prayer times (without Imsak and Dhuha).
 *
 * @param params - Calculation parameters
 * @returns Object with calculated times (may contain nulls for polar regions)
 *
 * @remarks
 * This calculates the 6 core times: Fajr, Sunrise, Dhuhr, Asr, Maghrib, Isha.
 * Imsak and Dhuha are calculated separately (they derive from Fajr/Sunrise/Dhuhr).
 */
export function calculateCorePrayerTimes(params: CoreCalculationParams): Partial<PrayerTimes> {
  const { date, coords, timezone, method, asrMadhhab } = params;

  // Calculate times in order
  const fajr = calculateFajr(date, coords, timezone, method.fajrAngle);
  const sunrise = calculateSunrise(date, coords, timezone);
  const dhuhr = calculateDhuhr(date, coords, timezone);
  const asr = calculateAsr(date, coords, timezone, asrMadhhab);
  const maghrib = calculateMaghrib(date, coords, timezone, method.maghribAngle);
  const isha = calculateIsha(date, coords, timezone, method, maghrib);

  return {
    [PrayerName.FAJR]: fajr,
    [PrayerName.SUNRISE]: sunrise,
    [PrayerName.DHUHR]: dhuhr,
    [PrayerName.ASR]: asr,
    [PrayerName.MAGHRIB]: maghrib,
    [PrayerName.ISHA]: isha,
  };
}

/**
 * Calculates night duration (from sunset to next sunrise).
 *
 * @param sunset - Sunset time in fractional hours
 * @param sunrise - Next sunrise time in fractional hours
 * @returns Night duration in hours
 *
 * @remarks
 * Used for high latitude calculations.
 * If sunrise is before sunset (next day), adds 24 hours.
 */
export function calculateNightDuration(sunset: number, sunrise: number): number {
  let duration = sunrise - sunset;
  if (duration < 0) {
    duration += 24;
  }
  return duration;
}

/**
 * Calculates midnight (middle of the night).
 *
 * @param sunset - Sunset time in fractional hours
 * @param sunrise - Next sunrise time in fractional hours
 * @returns Midnight time in fractional hours
 */
export function calculateMidnight(sunset: number, sunrise: number): number {
  const nightDuration = calculateNightDuration(sunset, sunrise);
  let midnight = sunset + nightDuration / 2;
  if (midnight >= 24) {
    midnight -= 24;
  }
  return midnight;
}
