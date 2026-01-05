/**
 * @fileoverview Qibla Direction type definitions
 * @module qibla/types
 *
 * This module defines all types used for Qibla direction calculations.
 *
 * @remarks
 * The Qibla module calculates the direction (bearing) from any location
 * on Earth towards the Ka'bah in Makkah, Saudi Arabia.
 *
 * @example
 * ```typescript
 * import { computeQiblaDirection } from 'islamic-utils';
 *
 * const result = computeQiblaDirection({
 *   coordinates: { latitude: -6.2088, longitude: 106.8456 }
 * });
 *
 * if (result.success) {
 *   console.log(`Qibla: ${result.data.bearing}°`);
 * }
 * ```
 */

import type { Coordinates } from '../core/types/coordinates';
import type { TraceStep } from '../core/types/result';

// ═══════════════════════════════════════════════════════════════════════════
// Input Types
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Input for Qibla direction calculation.
 */
export interface QiblaInput {
  /**
   * Geographic coordinates of the user's location.
   */
  readonly coordinates: Coordinates;
}

/**
 * Options for Qibla calculation.
 */
export interface QiblaOptions {
  /**
   * Whether to include a trace of calculation steps.
   *
   * @remarks
   * Useful for debugging and verification.
   * Defaults to false for performance.
   */
  readonly includeTrace?: boolean;

  /**
   * Whether to include the distance to Ka'bah.
   *
   * @remarks
   * Calculates the great-circle distance in kilometers.
   * Defaults to false.
   */
  readonly includeDistance?: boolean;
}

// ═══════════════════════════════════════════════════════════════════════════
// Output Types
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Compass direction name.
 */
export const CompassDirection = {
  N: 'N',
  NNE: 'NNE',
  NE: 'NE',
  ENE: 'ENE',
  E: 'E',
  ESE: 'ESE',
  SE: 'SE',
  SSE: 'SSE',
  S: 'S',
  SSW: 'SSW',
  SW: 'SW',
  WSW: 'WSW',
  W: 'W',
  WNW: 'WNW',
  NW: 'NW',
  NNW: 'NNW',
} as const;

/**
 * Compass direction type.
 */
export type CompassDirection = (typeof CompassDirection)[keyof typeof CompassDirection];

/**
 * Converts a bearing to a compass direction.
 *
 * @param bearing - Bearing in degrees (0-360)
 * @returns 16-point compass direction
 */
export function bearingToCompassDirection(bearing: number): CompassDirection {
  const normalized = ((bearing % 360) + 360) % 360;
  const index = Math.round(normalized / 22.5) % 16;

  const directions: CompassDirection[] = [
    CompassDirection.N,
    CompassDirection.NNE,
    CompassDirection.NE,
    CompassDirection.ENE,
    CompassDirection.E,
    CompassDirection.ESE,
    CompassDirection.SE,
    CompassDirection.SSE,
    CompassDirection.S,
    CompassDirection.SSW,
    CompassDirection.SW,
    CompassDirection.WSW,
    CompassDirection.W,
    CompassDirection.WNW,
    CompassDirection.NW,
    CompassDirection.NNW,
  ];

  return directions[index];
}

/**
 * Metadata about the Qibla calculation.
 */
export interface QiblaMeta {
  /**
   * The user's input coordinates.
   */
  readonly userLocation: Coordinates;

  /**
   * The Ka'bah coordinates used in calculation.
   */
  readonly kaabaLocation: Coordinates;

  /**
   * Distance to Ka'bah in kilometers.
   *
   * @remarks
   * Only included if `includeDistance: true` was specified.
   */
  readonly distance?: number;

  /**
   * Whether the user is at or very near the Ka'bah.
   */
  readonly atKaaba?: boolean;

  /**
   * Note about the calculation (for edge cases).
   */
  readonly note?: string;
}

/**
 * Result of Qibla direction calculation.
 */
export interface QiblaResult {
  /**
   * Bearing to Ka'bah in degrees.
   *
   * @remarks
   * - Value is 0-360 degrees from true north
   * - Clockwise direction
   * - 0° = North, 90° = East, 180° = South, 270° = West
   */
  readonly bearing: number;

  /**
   * Compass direction (16-point).
   *
   * @remarks
   * e.g., "NNE", "WNW", "SE", etc.
   */
  readonly compassDirection: CompassDirection;

  /**
   * Metadata about the calculation.
   */
  readonly meta: QiblaMeta;

  /**
   * Optional trace of calculation steps.
   *
   * @remarks
   * Only included if `includeTrace: true` was specified.
   */
  readonly trace?: TraceStep[];
}
