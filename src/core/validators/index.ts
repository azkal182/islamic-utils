/**
 * @fileoverview Re-exports all validation functions
 * @module core/validators
 *
 * This module provides the public API for all validation utilities.
 *
 * @example
 * ```typescript
 * import { validateCoordinates, validateDate, validateTimezone } from 'islamic-utils';
 *
 * const coordResult = validateCoordinates({ latitude: -6.2, longitude: 106.8 });
 * const dateResult = validateDate({ year: 2024, month: 1, day: 15 });
 * const tzResult = validateTimezone('Asia/Jakarta');
 * ```
 */

// Coordinate validation
export {
  validateCoordinates,
  normalizeCoordinates,
  isHighLatitude,
  LATITUDE_RANGE,
  LONGITUDE_RANGE,
} from './coordinates';

// Date validation
export {
  validateDate,
  isLeapYear,
  getDaysInMonth,
  getDayOfYear,
  datesEqual,
  addDays,
  fromJSDate,
  toJSDate,
  YEAR_RANGE,
} from './date';

// Timezone validation
export {
  validateTimezone,
  validateUtcOffset,
  validateIanaTimezone,
  getUtcOffset,
  formatUtcOffset,
  UTC_OFFSET_RANGE,
  VALID_OFFSET_INCREMENTS,
  COMMON_TIMEZONES,
} from './timezone';
