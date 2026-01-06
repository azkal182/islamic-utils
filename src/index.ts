/**
 * @fileoverview Islamic Utilities Core Library - Main Entry Point
 * @module islamic-utils
 *
 * @description
 * This library provides accurate and consistent Islamic utilities for:
 * - Prayer times calculation (including Imsak and Dhuha)
 * - Qibla direction calculation
 * - Inheritance (Faraidh) calculation
 *
 * @remarks
 * The library is designed with the following principles:
 * - **Language-Agnostic**: Pure algorithms without platform dependencies
 * - **Deterministik**: Same input always produces same output
 * - **Explainable**: Results include optional trace for verification
 * - **Modular**: Each module can be used independently
 * - **No I/O**: All external data provided by the caller
 *
 * @example
 * ```typescript
 * import { computeQiblaDirection, KAABA_COORDINATES } from 'islamic-utils';
 *
 * const result = computeQiblaDirection({
 *   coordinates: { latitude: -6.2088, longitude: 106.8456 }
 * });
 *
 * if (result.success) {
 *   console.log(`Qibla: ${result.data.bearing}°`);
 * }
 * ```
 *
 * @packageDocumentation
 */

// ═══════════════════════════════════════════════════════════════════════════
// Core Types
// ═══════════════════════════════════════════════════════════════════════════

export type {
  // Coordinates
  Coordinates,
  // Date and Time
  DateOnly,
  TimeOfDay,
  Timezone,
  TimeContext,
  DateTimeLocal,
  // Angles
  AngleDMS,
  Angle,
  // Results
  TraceStep,
  SuccessResult,
  ErrorResult,
  Result,
} from './core/types';

export {
  // Type guards
  isCoordinatesLike,
  isDateOnlyLike,
  isTimeOfDayLike,
  // Angle utilities
  dmsToDecimal,
  decimalToDms,
  normalizeAngle,
  normalizeAngleSigned,
  toDecimalDegrees,
  // Result utilities
  success,
  failure,
  isSuccess,
  isError,
  unwrap,
  unwrapOr,
} from './core/types';

// ═══════════════════════════════════════════════════════════════════════════
// Error Handling
// ═══════════════════════════════════════════════════════════════════════════

export type { ErrorCode } from './core/errors';

export { ErrorCodes, isValidErrorCode, LibraryError, createError, Errors } from './core/errors';

// ═══════════════════════════════════════════════════════════════════════════
// Validators
// ═══════════════════════════════════════════════════════════════════════════

export {
  // Coordinate validation
  validateCoordinates,
  normalizeCoordinates,
  isHighLatitude,
  LATITUDE_RANGE,
  LONGITUDE_RANGE,
  // Date validation
  validateDate,
  isLeapYear,
  getDaysInMonth,
  getDayOfYear,
  datesEqual,
  addDays,
  fromJSDate,
  toJSDate,
  YEAR_RANGE,
  // Timezone validation
  validateTimezone,
  validateUtcOffset,
  validateIanaTimezone,
  getUtcOffset,
  formatUtcOffset,
  UTC_OFFSET_RANGE,
  COMMON_TIMEZONES,
} from './core/validators';

// ═══════════════════════════════════════════════════════════════════════════
// Constants
// ═══════════════════════════════════════════════════════════════════════════

export {
  // Astronomical constants
  ASTRONOMICAL,
  PRAYER_ANGLES,
  TRIG,
  // Geographic constants
  KAABA_COORDINATES,
  KAABA_PROXIMITY_THRESHOLD_KM,
  EARTH_RADIUS_KM,
  calculateDistance,
  isAtKaaba,
} from './core/constants';

// ═══════════════════════════════════════════════════════════════════════════
// Utilities
// ═══════════════════════════════════════════════════════════════════════════

export type { RoundingRule } from './core/utils';

export {
  // Math utilities
  roundByRule,
  roundToMinute,
  toFractionalHours,
  fromFractionalHours,
  clamp,
  lerp,
  frac,
  wrap,
  fixPrecision,
  // Trigonometry utilities
  toRadians,
  toDegrees,
  sinDeg,
  cosDeg,
  tanDeg,
  cotDeg,
  asinDeg,
  acosDeg,
  atanDeg,
  atan2Deg,
  acotDeg,
  safeAcosDeg,
  safeAsinDeg,
} from './core/utils';

// ═══════════════════════════════════════════════════════════════════════════
// Astronomy
// ═══════════════════════════════════════════════════════════════════════════

export {
  // Solar calculations
  dateToJulianDay,
  julianCentury,
  solarDeclination,
  equationOfTime,
  hourAngle,
  solarNoon,
  timeForSunAngle,
  asrSunAngle,
  // Time utilities
  dateOnlyToJulianDay,
  julianDayToDateOnly,
  fractionalHoursToTimeOfDay,
  timeOfDayToFractionalHours,
  formatTime,
  toJSDateTime,
  fractionDayOfYear,
  // Navigation angles
  initialBearing,
  finalBearing,
  midpoint,
  destinationPoint,
  bearingToCompass,
} from './astronomy';

// ═══════════════════════════════════════════════════════════════════════════
// Prayer Times Module
// ═══════════════════════════════════════════════════════════════════════════

// Main calculator
export { computePrayerTimes } from './prayer-times';

// Types
export type {
  LocationInput,
  TimeContext as PrayerTimeContext,
  CalculatorOptions,
  PrayerCalculationParams,
  CalculationMethod,
  PrayerAdjustments,
  SafetyBuffer,
  ImsakRule,
  DhuhaRule,
  PrayerTimes,
  PrayerTimeStrings,
  PrayerTimesMeta,
  PrayerTimesResult,
} from './prayer-times';

export {
  PrayerName,
  PRAYER_NAMES_ORDERED,
  AsrMadhhab,
  getAsrShadowFactor,
  HighLatitudeRule,
  PrayerRoundingRule,
  DEFAULT_IMSAK_RULE,
  DEFAULT_DHUHA_RULE,
} from './prayer-times';

// Calculation methods
export {
  CALCULATION_METHODS,
  MWL,
  ISNA,
  EGYPT,
  MAKKAH,
  KARACHI,
  TEHRAN,
  JAKIM,
  SINGAPORE,
  KEMENAG,
  DIYANET,
  UOIF,
  KUWAIT,
  QATAR,
  registerMethod,
  getMethod,
  listMethodKeys,
} from './prayer-times';

export type { CalculationMethodKey } from './prayer-times';

// ═══════════════════════════════════════════════════════════════════════════
// Qibla Direction Module
// ═══════════════════════════════════════════════════════════════════════════

// Main calculator
export { computeQiblaDirection } from './qibla';

// Types
export type { QiblaInput, QiblaOptions, QiblaResult, QiblaMeta } from './qibla';

export { CompassDirection, bearingToCompassDirection } from './qibla';

// Great circle utilities
export {
  calculateInitialBearing,
  calculateFinalBearing,
  calculateGreatCircleDistance,
  calculateMidpoint,
} from './qibla';

// ═══════════════════════════════════════════════════════════════════════════
// Inheritance (Faraidh) Module
// ═══════════════════════════════════════════════════════════════════════════

// Main calculator
export { computeInheritance } from './inheritance';

// Types
export type {
  InheritanceInput,
  InheritanceOptions,
  InheritanceResult,
  InheritanceTraceStep,
  InheritancePolicy,
  HeirInput,
  HeirShare,
  EstateInput,
  EstateResult,
  DerivedFlags,
  InheritanceSummary,
  InheritanceMeta,
  Fraction,
} from './inheritance';

// Enums and constants
export {
  HeirType,
  HeirCategory,
  ShareCategory,
  AsabahType,
  SPECIAL_CASES,
  DEFAULT_POLICY,
  getHeirCategory,
  getHeirArabicName,
  isMaleHeir,
  isFemaleHeir,
} from './inheritance';

// Sub-calculators (for advanced use)
export { calculateFlags, calculateNetEstate, applyHijab } from './inheritance';

// Fraction utilities
export {
  fraction,
  add as fractionAdd,
  subtract as fractionSubtract,
  multiply as fractionMultiply,
  divide as fractionDivide,
  simplify as fractionSimplify,
  toDecimal as fractionToDecimal,
  toString as fractionToString,
  FRACTION,
} from './inheritance';

// ═══════════════════════════════════════════════════════════════════════════
// Version
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Library version string.
 */
export const VERSION = '0.1.0';
