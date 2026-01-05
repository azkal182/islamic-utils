/**
 * @fileoverview Solar position calculations
 * @module astronomy/solar
 *
 * This module provides functions to calculate the sun's position in the sky.
 * These calculations are fundamental for determining prayer times.
 *
 * @remarks
 * The algorithms are based on Jean Meeus' "Astronomical Algorithms" and
 * NOAA solar calculator methodology. They provide accuracy suitable for
 * prayer time calculations (within seconds for most locations).
 */

import { ASTRONOMICAL } from '../core/constants/astronomical';
import { sinDeg, cosDeg, tanDeg, safeAcosDeg } from '../core/utils/trigonometry';
import { wrap } from '../core/utils/math';

/**
 * Calculates the Julian Day Number for a given date.
 *
 * @param year - Full year (e.g., 2024)
 * @param month - Month (1-12)
 * @param day - Day of month (1-31, can have fractional part for time)
 * @returns Julian Day Number
 *
 * @remarks
 * Julian Day is a continuous count of days since the beginning of the Julian
 * Period (January 1, 4713 BC in the proleptic Julian calendar).
 * It's useful for astronomical calculations because it avoids calendar complexities.
 *
 * This function implements the algorithm for the Gregorian calendar.
 *
 * @example
 * ```typescript
 * // January 1, 2000, at noon (J2000.0 epoch)
 * dateToJulianDay(2000, 1, 1.5);  // 2451545.0
 *
 * // January 15, 2024
 * dateToJulianDay(2024, 1, 15);   // 2460324.5
 * ```
 */
export function dateToJulianDay(year: number, month: number, day: number): number {
  // Adjust for months January and February
  // (treat them as months 13 and 14 of the previous year)
  let y = year;
  let m = month;

  if (m <= 2) {
    y -= 1;
    m += 12;
  }

  // Calculate century correction for Gregorian calendar
  const A = Math.floor(y / 100);
  const B = 2 - A + Math.floor(A / 4);

  // Calculate Julian Day
  const JD = Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (m + 1)) + day + B - 1524.5;

  return JD;
}

/**
 * Calculates the Julian Century from J2000.0 epoch.
 *
 * @param julianDay - Julian Day Number
 * @returns Julian centuries since J2000.0
 *
 * @remarks
 * Many astronomical formulas use Julian centuries (36525 days) since the
 * J2000.0 epoch as their time parameter.
 *
 * @example
 * ```typescript
 * // J2000.0 epoch itself
 * julianCentury(2451545.0);  // 0
 *
 * // One century later
 * julianCentury(2451545.0 + 36525);  // 1.0
 * ```
 */
export function julianCentury(julianDay: number): number {
  return (julianDay - ASTRONOMICAL.J2000_EPOCH) / ASTRONOMICAL.JULIAN_CENTURY;
}

/**
 * Calculates the Sun's geometric mean longitude.
 *
 * @param T - Julian centuries since J2000.0
 * @returns Mean longitude in degrees (0-360)
 *
 * @remarks
 * The mean longitude is the Sun's position if it moved uniformly along
 * its mean path (ignoring perturbations).
 */
export function sunMeanLongitude(T: number): number {
  const L0 = 280.46646 + 36000.76983 * T + 0.0003032 * T * T;
  return wrap(L0, 0, 360);
}

/**
 * Calculates the Sun's mean anomaly.
 *
 * @param T - Julian centuries since J2000.0
 * @returns Mean anomaly in degrees (0-360)
 *
 * @remarks
 * The mean anomaly represents the angular distance from perihelion
 * as if the Sun moved uniformly in a circular orbit.
 */
export function sunMeanAnomaly(T: number): number {
  const M = 357.52911 + 35999.05029 * T - 0.0001537 * T * T;
  return wrap(M, 0, 360);
}

/**
 * Calculates the eccentricity of Earth's orbit.
 *
 * @param T - Julian centuries since J2000.0
 * @returns Eccentricity (dimensionless, approximately 0.017)
 *
 * @remarks
 * The eccentricity slowly decreases over time.
 * Current value is approximately 0.0167.
 */
export function earthOrbitEccentricity(T: number): number {
  return 0.016708634 - 0.000042037 * T - 0.0000001267 * T * T;
}

/**
 * Calculates the Sun's equation of the center.
 *
 * @param T - Julian centuries since J2000.0
 * @returns Equation of center in degrees
 *
 * @remarks
 * The equation of center is the angular difference between the Sun's
 * actual position and its mean position. It accounts for the elliptical
 * orbit of Earth.
 */
export function sunEquationOfCenter(T: number): number {
  const M = sunMeanAnomaly(T);

  const C =
    (1.914602 - 0.004817 * T - 0.000014 * T * T) * sinDeg(M) +
    (0.019993 - 0.000101 * T) * sinDeg(2 * M) +
    0.00029 * sinDeg(3 * M);

  return C;
}

/**
 * Calculates the Sun's true longitude.
 *
 * @param T - Julian centuries since J2000.0
 * @returns True longitude in degrees (0-360)
 *
 * @remarks
 * True longitude = mean longitude + equation of center
 */
export function sunTrueLongitude(T: number): number {
  const L0 = sunMeanLongitude(T);
  const C = sunEquationOfCenter(T);
  return wrap(L0 + C, 0, 360);
}

/**
 * Calculates the Sun's apparent longitude.
 *
 * @param T - Julian centuries since J2000.0
 * @returns Apparent longitude in degrees (0-360)
 *
 * @remarks
 * Apparent longitude includes corrections for nutation and aberration.
 * This is the Sun's longitude as it appears from Earth.
 */
export function sunApparentLongitude(T: number): number {
  const trueLong = sunTrueLongitude(T);

  // Longitude of the ascending node of the Moon's mean orbit
  const Omega = 125.04 - 1934.136 * T;

  // Correction for nutation and aberration
  const lambda = trueLong - 0.00569 - 0.00478 * sinDeg(Omega);

  return wrap(lambda, 0, 360);
}

/**
 * Calculates the mean obliquity of the ecliptic.
 *
 * @param T - Julian centuries since J2000.0
 * @returns Mean obliquity in degrees
 *
 * @remarks
 * The obliquity is Earth's axial tilt relative to its orbital plane.
 * It changes slowly over time due to gravitational effects.
 */
export function meanObliquityOfEcliptic(T: number): number {
  // Using the IAU formula
  const seconds = 21.448 - 46.815 * T - 0.00059 * T * T + 0.001813 * T * T * T;

  return 23 + (26 + seconds / 60) / 60;
}

/**
 * Calculates the corrected obliquity of the ecliptic.
 *
 * @param T - Julian centuries since J2000.0
 * @returns Corrected obliquity in degrees
 *
 * @remarks
 * Includes nutation correction for slightly more accurate results.
 */
export function obliquityCorrection(T: number): number {
  const e0 = meanObliquityOfEcliptic(T);
  const Omega = 125.04 - 1934.136 * T;
  return e0 + 0.00256 * cosDeg(Omega);
}

/**
 * Calculates the Sun's declination.
 *
 * @param T - Julian centuries since J2000.0
 * @returns Declination in degrees (-23.44 to +23.44)
 *
 * @remarks
 * Declination is the angular distance of the Sun north or south of
 * the celestial equator. It ranges from approximately -23.44° (winter
 * solstice) to +23.44° (summer solstice) in the Northern Hemisphere.
 *
 * @example
 * ```typescript
 * // Around summer solstice (Northern Hemisphere)
 * solarDeclination(T);  // approximately +23.4°
 *
 * // Around equinox
 * solarDeclination(T);  // approximately 0°
 * ```
 */
export function solarDeclination(T: number): number {
  const lambda = sunApparentLongitude(T);
  const epsilon = obliquityCorrection(T);

  const sinDecl = sinDeg(epsilon) * sinDeg(lambda);

  // Constrain result to valid range to avoid floating-point issues
  const constrained = Math.max(-1, Math.min(1, sinDecl));

  return Math.asin(constrained) * (180 / Math.PI);
}

/**
 * Calculates the Equation of Time.
 *
 * @param T - Julian centuries since J2000.0
 * @returns Equation of time in minutes
 *
 * @remarks
 * The equation of time is the difference between apparent solar time
 * and mean solar time. It varies throughout the year due to:
 * 1. Earth's elliptical orbit (varying speed)
 * 2. Earth's axial tilt (obliquity)
 *
 * Range: approximately -14 to +16 minutes
 *
 * @example
 * ```typescript
 * // Used to calculate local solar noon:
 * // Solar noon = 12:00 - EoT - (longitude / 15)
 * ```
 */
export function equationOfTime(T: number): number {
  const epsilon = obliquityCorrection(T);
  const L0 = sunMeanLongitude(T);
  const e = earthOrbitEccentricity(T);
  const M = sunMeanAnomaly(T);

  // Calculate y = tan²(ε/2)
  const y = tanDeg(epsilon / 2) ** 2;

  // Equation of time formula
  const EoT =
    y * sinDeg(2 * L0) -
    2 * e * sinDeg(M) +
    4 * e * y * sinDeg(M) * cosDeg(2 * L0) -
    0.5 * y * y * sinDeg(4 * L0) -
    1.25 * e * e * sinDeg(2 * M);

  // Convert from radians to minutes (4 minutes per degree)
  return (4 * EoT * 180) / Math.PI;
}

/**
 * Calculates the hour angle for a given sun elevation.
 *
 * @param latitude - Observer's latitude in degrees
 * @param declination - Sun's declination in degrees
 * @param elevation - Target sun elevation in degrees (e.g., -18 for Fajr)
 * @returns Hour angle in degrees, or null if the sun never reaches that elevation
 *
 * @remarks
 * The hour angle is the angular distance of the sun from the observer's
 * meridian (solar noon = 0°). For sunrise/sunset, we typically use
 * elevation = -0.833° (accounting for refraction).
 *
 * Returns null for polar day/night situations where the sun never
 * reaches the specified elevation.
 *
 * @example
 * ```typescript
 * // Calculate hour angle for sunrise (elevation = -0.833°)
 * hourAngle(51.5, 23.4, -0.833);  // Returns angle in degrees
 *
 * // High latitude in summer (sun doesn't set)
 * hourAngle(70, 23.4, -0.833);    // May return null
 * ```
 */
export function hourAngle(latitude: number, declination: number, elevation: number): number | null {
  // Hour angle formula:
  // cos(HA) = (sin(elevation) - sin(lat) * sin(decl)) / (cos(lat) * cos(decl))

  const latRad = latitude;
  const declRad = declination;

  const cosHourAngle =
    (sinDeg(elevation) - sinDeg(latRad) * sinDeg(declRad)) / (cosDeg(latRad) * cosDeg(declRad));

  // Check if the sun reaches this elevation at all
  if (cosHourAngle > 1) {
    // Sun never rises high enough (polar winter for sunrise)
    return null;
  }
  if (cosHourAngle < -1) {
    // Sun never drops low enough (polar summer for sunset)
    return null;
  }

  // Return absolute value of hour angle
  return safeAcosDeg(cosHourAngle);
}

/**
 * Calculates solar noon (when the sun crosses the local meridian).
 *
 * @param longitude - Observer's longitude in degrees
 * @param timezone - Timezone offset in hours from UTC
 * @param julianDay - Julian Day Number
 * @returns Solar noon as fractional hours (local time)
 *
 * @remarks
 * Solar noon is when the sun is at its highest point in the sky for the day.
 * This is the basis for calculating all other prayer times.
 *
 * @example
 * ```typescript
 * // Jakarta (longitude 106.8456°, timezone UTC+7)
 * const jd = dateToJulianDay(2024, 1, 15);
 * solarNoon(106.8456, 7, jd);  // Returns approximately 11.9 (11:54 AM)
 * ```
 */
export function solarNoon(longitude: number, timezone: number, julianDay: number): number {
  const T = julianCentury(julianDay);
  const EoT = equationOfTime(T);

  // Solar noon = 12:00 - EoT/60 - longitude/15 + timezone
  const noon = 12 - EoT / 60 - longitude / 15 + timezone;

  return noon;
}

/**
 * Calculates the time for a given sun elevation angle.
 *
 * @param julianDay - Julian Day Number
 * @param latitude - Observer's latitude in degrees
 * @param longitude - Observer's longitude in degrees
 * @param timezone - Timezone offset in hours from UTC
 * @param angle - Target sun elevation angle in degrees
 * @param rising - True for morning (before noon), false for afternoon
 * @returns Time as fractional hours, or null if sun doesn't reach angle
 *
 * @remarks
 * This is the core function used to calculate prayer times.
 * - For sunrise: angle = -0.833, rising = true
 * - For Fajr: angle = -18 (or method-specific), rising = true
 * - For sunset/Maghrib: angle = -0.833, rising = false
 * - For Isha: angle = -17 (or method-specific), rising = false
 *
 * @example
 * ```typescript
 * const jd = dateToJulianDay(2024, 1, 15);
 *
 * // Sunrise
 * timeForSunAngle(jd, -6.2, 106.8, 7, -0.833, true);
 *
 * // Fajr (with 20° angle)
 * timeForSunAngle(jd, -6.2, 106.8, 7, -20, true);
 * ```
 */
export function timeForSunAngle(
  julianDay: number,
  latitude: number,
  longitude: number,
  timezone: number,
  angle: number,
  rising: boolean
): number | null {
  const T = julianCentury(julianDay);
  const declination = solarDeclination(T);
  const noon = solarNoon(longitude, timezone, julianDay);

  const HA = hourAngle(latitude, declination, angle);

  if (HA === null) {
    return null;
  }

  // Convert hour angle to hours
  const hoursFromNoon = HA / ASTRONOMICAL.DEGREES_PER_HOUR;

  return rising ? noon - hoursFromNoon : noon + hoursFromNoon;
}

/**
 * Calculates shadow length ratio for Asr time calculation.
 *
 * @param latitude - Observer's latitude in degrees
 * @param declination - Sun's declination in degrees
 * @param shadowFactor - Shadow length factor (1 for Shafi'i, 2 for Hanafi)
 * @returns Sun elevation angle in degrees when shadow reaches the factor
 *
 * @remarks
 * In Islamic fiqh, Asr begins when an object's shadow equals its length
 * plus the shadow at solar noon (Shafi'i/Maliki/Hanbali) or twice that (Hanafi).
 *
 * @example
 * ```typescript
 * // Shafi'i/Maliki/Hanbali: shadow = 1x + noon shadow
 * asrSunAngle(latitude, declination, 1);
 *
 * // Hanafi: shadow = 2x + noon shadow
 * asrSunAngle(latitude, declination, 2);
 * ```
 */
export function asrSunAngle(latitude: number, declination: number, shadowFactor: 1 | 2): number {
  // Shadow at noon = |tan(latitude - declination)|
  // For Asr, shadow = factor + |tan(latitude - declination)|
  // Therefore, tan(90 - altitude) = factor + |tan(latitude - declination)|

  const noonShadow = Math.abs(tanDeg(latitude - declination));
  const asrShadow = shadowFactor + noonShadow;

  // altitude = atan(1 / shadow)
  const altitudeRad = Math.atan(1 / asrShadow);
  const altitude = altitudeRad * (180 / Math.PI);

  return altitude;
}
