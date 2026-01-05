/**
 * @fileoverview Re-exports all astronomy functions
 * @module astronomy
 *
 * This module provides the public API for astronomical calculations.
 *
 * @example
 * ```typescript
 * import {
 *   solarDeclination,
 *   equationOfTime,
 *   hourAngle,
 *   dateToJulianDay
 * } from 'islamic-utils/astronomy';
 * ```
 */

// Solar position calculations
export {
  dateToJulianDay,
  julianCentury,
  sunMeanLongitude,
  sunMeanAnomaly,
  earthOrbitEccentricity,
  sunEquationOfCenter,
  sunTrueLongitude,
  sunApparentLongitude,
  meanObliquityOfEcliptic,
  obliquityCorrection,
  solarDeclination,
  equationOfTime,
  hourAngle,
  solarNoon,
  timeForSunAngle,
  asrSunAngle,
} from './solar';

// Time conversions
export {
  dateOnlyToJulianDay,
  julianDayToDateOnly,
  fractionalHoursToTimeOfDay,
  timeOfDayToFractionalHours,
  formatTime,
  toJSDateTime,
  fractionDayOfYear,
} from './time';

// Angular calculations
export {
  initialBearing,
  finalBearing,
  midpoint,
  destinationPoint,
  bearingToCompass,
} from './angles';
