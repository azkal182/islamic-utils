/**
 * @fileoverview Qibla Direction Calculator
 * @module qibla/calculator
 *
 * This module provides the main `computeQiblaDirection` function that
 * calculates the bearing from any location to the Ka'bah.
 */

import type { Result, TraceStep } from '../core/types/result';
import { success, failure } from '../core/types/result';
import { validateCoordinates } from '../core/validators/coordinates';
import { KAABA_COORDINATES, isAtKaaba } from '../core/constants/kaaba';
import { fixPrecision } from '../core/utils/math';

import type { QiblaInput, QiblaOptions, QiblaResult, QiblaMeta } from './types';
import { bearingToCompassDirection } from './types';
import { calculateInitialBearing, calculateGreatCircleDistance } from './great-circle';

// ═══════════════════════════════════════════════════════════════════════════
// Edge Case Handling
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Checks for edge cases in Qibla calculation.
 *
 * @param userCoords - User's coordinates
 * @returns Edge case info if applicable
 */
function checkEdgeCases(userCoords: { latitude: number; longitude: number }): {
  handled: boolean;
  bearing?: number;
  note?: string;
  atKaaba?: boolean;
} {
  // Check if user is at or very near the Ka'bah
  if (isAtKaaba(userCoords)) {
    return {
      handled: true,
      bearing: 0,
      note: "You are at or very near the Ka'bah. Any direction is valid.",
      atKaaba: true,
    };
  }

  return { handled: false };
}

// ═══════════════════════════════════════════════════════════════════════════
// Main Calculator
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Computes the Qibla direction (bearing to Ka'bah) from a given location.
 *
 * @param input - User's location
 * @param options - Calculation options
 * @returns Result containing Qibla direction or error
 *
 * @remarks
 * The bearing is calculated using the great-circle initial bearing formula.
 * This gives the direction to travel at the start of the journey to reach Ka'bah
 * via the shortest path on Earth's surface.
 *
 * **Calculation Flow:**
 * 1. Validate input coordinates
 * 2. Check for edge cases (at Ka'bah, etc.)
 * 3. Calculate initial bearing using great-circle formula
 * 4. Optionally calculate distance
 * 5. Convert to compass direction
 * 6. Return formatted result
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
 *   console.log(`Qibla: ${result.data.bearing}° (${result.data.compassDirection})`);
 *   // Output: Qibla: 295.14° (WNW)
 * }
 * ```
 *
 * @example
 * ```typescript
 * // With distance and trace
 * const result = computeQiblaDirection(
 *   { coordinates: { latitude: 51.5074, longitude: -0.1278 } },
 *   { includeDistance: true, includeTrace: true }
 * );
 *
 * if (result.success) {
 *   console.log(`Distance: ${result.data.meta.distance} km`);
 *   console.log('Trace:', result.data.trace);
 * }
 * ```
 */
export function computeQiblaDirection(
  input: QiblaInput,
  options: QiblaOptions = {}
): Result<QiblaResult> {
  const trace: TraceStep[] = [];

  // ─────────────────────────────────────────────────────────────────────────
  // Step 1: Validate coordinates
  // ─────────────────────────────────────────────────────────────────────────

  const coordsResult = validateCoordinates(input.coordinates);
  if (!coordsResult.success) {
    return failure(coordsResult.error);
  }
  const userCoords = coordsResult.data;

  if (options.includeTrace) {
    trace.push({
      step: 1,
      description: 'Validated user coordinates',
      value: { latitude: userCoords.latitude, longitude: userCoords.longitude },
    });
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Step 2: Check edge cases
  // ─────────────────────────────────────────────────────────────────────────

  const edgeCase = checkEdgeCases(userCoords);

  if (edgeCase.handled) {
    if (options.includeTrace) {
      trace.push({
        step: 2,
        description: 'Edge case detected',
        value: edgeCase.note,
      });
    }

    return success({
      bearing: edgeCase.bearing ?? 0,
      compassDirection: bearingToCompassDirection(edgeCase.bearing ?? 0),
      meta: {
        userLocation: userCoords,
        kaabaLocation: KAABA_COORDINATES,
        distance: options.includeDistance ? 0 : undefined,
        atKaaba: edgeCase.atKaaba,
        note: edgeCase.note,
      },
      trace: options.includeTrace ? trace : undefined,
    });
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Step 3: Calculate bearing
  // ─────────────────────────────────────────────────────────────────────────

  if (options.includeTrace) {
    trace.push({
      step: 2,
      description: "Using Ka'bah coordinates",
      value: { latitude: KAABA_COORDINATES.latitude, longitude: KAABA_COORDINATES.longitude },
    });
  }

  const rawBearing = calculateInitialBearing(userCoords, KAABA_COORDINATES);
  const bearing = fixPrecision(rawBearing, 2); // 2 decimal places

  if (options.includeTrace) {
    trace.push({
      step: 3,
      description: 'Calculated initial bearing using great-circle formula',
      value: bearing,
    });
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Step 4: Calculate distance (optional)
  // ─────────────────────────────────────────────────────────────────────────

  let distance: number | undefined;
  if (options.includeDistance) {
    distance = fixPrecision(calculateGreatCircleDistance(userCoords, KAABA_COORDINATES), 2);

    if (options.includeTrace) {
      trace.push({
        step: 4,
        description: 'Calculated great-circle distance',
        value: `${distance} km`,
      });
    }
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Step 5: Build result
  // ─────────────────────────────────────────────────────────────────────────

  const compassDirection = bearingToCompassDirection(bearing);

  const meta: QiblaMeta = {
    userLocation: userCoords,
    kaabaLocation: KAABA_COORDINATES,
    distance,
  };

  return success({
    bearing,
    compassDirection,
    meta,
    trace: options.includeTrace ? trace : undefined,
  });
}
