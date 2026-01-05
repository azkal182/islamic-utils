/**
 * @fileoverview Qibla Direction Module entry point
 * @module qibla
 *
 * This module exports the public API for Qibla direction calculations.
 */

// Main calculator
export { computeQiblaDirection } from './calculator';

// Types
export type { QiblaInput, QiblaOptions, QiblaResult, QiblaMeta } from './types';

export { CompassDirection, bearingToCompassDirection } from './types';

// Great circle utilities (for advanced users)
export {
  calculateInitialBearing,
  calculateFinalBearing,
  calculateGreatCircleDistance,
  calculateMidpoint,
} from './great-circle';
