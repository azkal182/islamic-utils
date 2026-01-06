/**
 * @fileoverview Prayer Times Module entry point
 * @module prayer-times
 *
 * This module exports the public API for prayer time calculations.
 *
 * @example
 * ```typescript
 * import {
 *   computePrayerTimes,
 *   CALCULATION_METHODS,
 *   PrayerName,
 *   AsrMadhhab
 * } from 'islamic-utils/prayer-times';
 * ```
 */

// Main calculator
export { computePrayerTimes } from './calculator';

// Monthly calculator
export { computeMonthlyPrayerTimes } from './monthly';
export type {
  MonthlyPrayerTimesInput,
  MonthlyPrayerTimesDayResult,
  MonthlyPrayerTimesMeta,
  MonthlyPrayerTimesResult,
} from './monthly';

// Types
export type {
  LocationInput,
  TimeContext,
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
} from './types';

export {
  PrayerName,
  PRAYER_NAMES_ORDERED,
  AsrMadhhab,
  getAsrShadowFactor,
  HighLatitudeRule,
  PrayerRoundingRule,
  DEFAULT_IMSAK_RULE,
  DEFAULT_DHUHA_RULE,
} from './types';

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
  unregisterMethod,
  getMethod,
  listMethodKeys,
} from './methods';
export type { CalculationMethodKey } from './methods';

// Individual calculations (for advanced users)
export {
  calculateFajr,
  calculateSunrise,
  calculateDhuhr,
  calculateAsr,
  calculateMaghrib,
  calculateIsha,
  calculateImsak,
  calculateDhuha,
} from './calculations';

// High latitude rules
export {
  applyHighLatitudeRule,
  needsHighLatitudeAdjustment,
  isHighLatitudeLocation,
  middleOfNight,
  oneSeventh,
  angleBased,
} from './high-latitude';

// Adjustments
export { applyAdjustments, applySafetyBuffer, applyRounding } from './adjustments';

// Validation
export { validateTimeSequence, validatePrayerTimes } from './validation';

// Next prayer utilities
export { getNextPrayer, getCurrentPrayer, formatMinutesUntil } from './next-prayer';
export type { NextPrayerInfo, CurrentPrayerInfo } from './next-prayer';
