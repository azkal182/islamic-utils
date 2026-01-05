/**
 * @fileoverview Re-exports all utility functions
 * @module core/utils
 *
 * @example
 * ```typescript
 * import { toRadians, sinDeg, roundToMinute, clamp } from 'islamic-utils';
 * ```
 */

// Math utilities
export {
  roundByRule,
  roundToMinute,
  toFractionalHours,
  fromFractionalHours,
  clamp,
  lerp,
  frac,
  wrap,
  fixPrecision,
} from './math';
export type { RoundingRule } from './math';

// Trigonometry utilities
export {
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
} from './trigonometry';
