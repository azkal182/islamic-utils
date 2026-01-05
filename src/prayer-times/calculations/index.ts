/**
 * @fileoverview Prayer calculations exports
 * @module prayer-times/calculations
 */

// Core calculations
export {
  getJulianDay,
  calculateSolarNoon,
  getSolarDeclination,
  calculateFajr,
  calculateSunrise,
  calculateDhuhr,
  calculateAsr,
  calculateMaghrib,
  calculateIsha,
  calculateCorePrayerTimes,
  calculateNightDuration,
  calculateMidnight,
} from './core';
export type { CoreCalculationParams } from './core';

// Imsak calculations
export { calculateImsakMinutes, calculateImsakAngle, calculateImsak } from './imsak';

// Dhuha calculations
export {
  calculateDhuhaStartMinutes,
  calculateDhuhaStartAltitude,
  calculateDhuhaEnd,
  calculateDhuha,
} from './dhuha';
