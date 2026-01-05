/**
 * @fileoverview Re-exports all core types
 * @module core/types
 *
 * This module serves as the public API for all core type definitions.
 * Import from this module rather than individual files for cleaner imports.
 *
 * @example
 * ```typescript
 * import {
 *   Coordinates,
 *   DateOnly,
 *   TimeContext,
 *   Angle,
 *   Result
 * } from 'islamic-utils/core/types';
 * ```
 */

// Coordinates types and utilities
export type { Coordinates } from './coordinates';
export { isCoordinatesLike } from './coordinates';

// Date and time types
export type { DateOnly, TimeOfDay, Timezone, TimeContext, DateTimeLocal } from './date';
export { isDateOnlyLike, isTimeOfDayLike } from './date';

// Angle types and utilities
export type { AngleDMS, Angle } from './angle';
export {
  dmsToDecimal,
  decimalToDms,
  normalizeAngle,
  normalizeAngleSigned,
  toDecimalDegrees,
} from './angle';

// Result types and utilities
export type { TraceStep, SuccessResult, ErrorResult, Result } from './result';
export { success, failure, isSuccess, isError, unwrap, unwrapOr } from './result';
