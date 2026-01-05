/**
 * @fileoverview Re-exports all constants
 * @module core/constants
 *
 * @example
 * ```typescript
 * import {
 *   KAABA_COORDINATES,
 *   ASTRONOMICAL,
 *   PRAYER_ANGLES,
 *   EARTH_RADIUS_KM
 * } from 'islamic-utils';
 * ```
 */

// Astronomical constants
export { ASTRONOMICAL, PRAYER_ANGLES, TRIG } from './astronomical';

// Ka'bah and geographic constants
export {
  KAABA_COORDINATES,
  KAABA_PROXIMITY_THRESHOLD_KM,
  EARTH_RADIUS_KM,
  calculateDistance,
  isAtKaaba,
} from './kaaba';
