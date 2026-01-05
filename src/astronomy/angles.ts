/**
 * @fileoverview Angular calculation utilities for astronomy
 * @module astronomy/angles
 *
 * This module provides angle-related calculations for astronomical purposes,
 * particularly for Qibla direction calculations.
 */

import { toRadians, toDegrees } from '../core/utils/trigonometry';
import { normalizeAngle } from '../core/types/angle';
import type { Coordinates } from '../core/types/coordinates';

/**
 * Calculates the initial bearing (forward azimuth) for navigation.
 *
 * @param from - Starting coordinates
 * @param to - Destination coordinates
 * @returns Initial bearing in degrees (0-360, where 0 = North)
 *
 * @remarks
 * Uses the spherical law of cosines to calculate the great-circle
 * initial bearing. This is the direction to face at the starting
 * point to travel along the shortest path to the destination.
 *
 * The formula is:
 * ```
 * θ = atan2(sin(Δλ) × cos(φ₂),
 *           cos(φ₁) × sin(φ₂) − sin(φ₁) × cos(φ₂) × cos(Δλ))
 * ```
 *
 * Where:
 * - φ₁ = starting latitude
 * - φ₂ = ending latitude
 * - Δλ = difference in longitude
 *
 * @example
 * ```typescript
 * // Jakarta to Makkah
 * const jakarta = { latitude: -6.2088, longitude: 106.8456 };
 * const makkah = { latitude: 21.4225, longitude: 39.8262 };
 *
 * initialBearing(jakarta, makkah);  // approximately 295°
 * ```
 */
export function initialBearing(from: Coordinates, to: Coordinates): number {
  // Convert to radians
  const φ1 = toRadians(from.latitude);
  const φ2 = toRadians(to.latitude);
  const Δλ = toRadians(to.longitude - from.longitude);

  // Calculate bearing components
  const x = Math.sin(Δλ) * Math.cos(φ2);
  const y = Math.cos(φ1) * Math.sin(φ2) - Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ);

  // Calculate bearing
  const θ = Math.atan2(x, y);

  // Convert to degrees and normalize to 0-360
  return normalizeAngle(toDegrees(θ));
}

/**
 * Calculates the final bearing (back azimuth) at the destination.
 *
 * @param from - Starting coordinates
 * @param to - Destination coordinates
 * @returns Final bearing in degrees (0-360)
 *
 * @remarks
 * The final bearing is the direction you'd be facing when you arrive
 * at the destination after traveling along the great circle.
 * It's calculated as the reverse of the initial bearing from the destination.
 *
 * @example
 * ```typescript
 * const jakarta = { latitude: -6.2088, longitude: 106.8456 };
 * const makkah = { latitude: 21.4225, longitude: 39.8262 };
 *
 * finalBearing(jakarta, makkah);  // Direction facing when arriving at Makkah
 * ```
 */
export function finalBearing(from: Coordinates, to: Coordinates): number {
  // Final bearing = reverse of initial bearing from destination to origin
  const reverseBearing = initialBearing(to, from);
  return normalizeAngle(reverseBearing + 180);
}

/**
 * Calculates the midpoint between two coordinates on a great circle.
 *
 * @param from - Starting coordinates
 * @param to - Ending coordinates
 * @returns Midpoint coordinates
 *
 * @remarks
 * The midpoint is the point exactly halfway along the great circle path.
 * This is NOT the same as averaging the coordinates.
 *
 * @example
 * ```typescript
 * const london = { latitude: 51.5, longitude: -0.1 };
 * const tokyo = { latitude: 35.7, longitude: 139.7 };
 *
 * midpoint(london, tokyo);
 * // Returns coordinates somewhere over Russia
 * ```
 */
export function midpoint(from: Coordinates, to: Coordinates): Coordinates {
  const φ1 = toRadians(from.latitude);
  const λ1 = toRadians(from.longitude);
  const φ2 = toRadians(to.latitude);
  const Δλ = toRadians(to.longitude - from.longitude);

  const Bx = Math.cos(φ2) * Math.cos(Δλ);
  const By = Math.cos(φ2) * Math.sin(Δλ);

  const φ3 = Math.atan2(Math.sin(φ1) + Math.sin(φ2), Math.sqrt((Math.cos(φ1) + Bx) ** 2 + By ** 2));
  const λ3 = λ1 + Math.atan2(By, Math.cos(φ1) + Bx);

  return {
    latitude: toDegrees(φ3),
    longitude: normalizeAngle(toDegrees(λ3) + 540) - 180, // Normalize to -180..+180
  };
}

/**
 * Calculates the destination point given start, bearing, and distance.
 *
 * @param start - Starting coordinates
 * @param bearing - Initial bearing in degrees (0-360)
 * @param distance - Distance in kilometers
 * @returns Destination coordinates
 *
 * @remarks
 * Uses the spherical law of cosines to calculate the destination point.
 * Assumes Earth is a sphere with radius 6371 km.
 *
 * @example
 * ```typescript
 * // 100 km due north from Jakarta
 * destinationPoint(
 *   { latitude: -6.2088, longitude: 106.8456 },
 *   0,     // North
 *   100    // 100 km
 * );
 * ```
 */
export function destinationPoint(
  start: Coordinates,
  bearing: number,
  distance: number
): Coordinates {
  const R = 6371; // Earth's radius in km
  const δ = distance / R; // Angular distance in radians
  const θ = toRadians(bearing);
  const φ1 = toRadians(start.latitude);
  const λ1 = toRadians(start.longitude);

  const sinφ2 = Math.sin(φ1) * Math.cos(δ) + Math.cos(φ1) * Math.sin(δ) * Math.cos(θ);
  const φ2 = Math.asin(sinφ2);

  const y = Math.sin(θ) * Math.sin(δ) * Math.cos(φ1);
  const x = Math.cos(δ) - Math.sin(φ1) * sinφ2;
  const λ2 = λ1 + Math.atan2(y, x);

  return {
    latitude: toDegrees(φ2),
    longitude: normalizeAngle(toDegrees(λ2) + 540) - 180,
  };
}

/**
 * Formats a bearing as a compass direction.
 *
 * @param bearing - Bearing in degrees (0-360)
 * @param precision - Number of characters (1, 2, or 3)
 * @returns Compass direction string
 *
 * @remarks
 * Precision levels:
 * - 1: N, S, E, W (4 directions)
 * - 2: N, NE, E, SE, S, SW, W, NW (8 directions)
 * - 3: N, NNE, NE, ENE, E, ESE, SE, SSE, S, SSW, SW, WSW, W, WNW, NW, NNW (16 directions)
 *
 * @example
 * ```typescript
 * bearingToCompass(0, 1);     // "N"
 * bearingToCompass(45, 2);    // "NE"
 * bearingToCompass(295, 2);   // "NW"
 * bearingToCompass(295, 3);   // "WNW"
 * ```
 */
export function bearingToCompass(bearing: number, precision: 1 | 2 | 3 = 2): string {
  const directions1 = ['N', 'E', 'S', 'W'];
  const directions2 = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  const directions3 = [
    'N',
    'NNE',
    'NE',
    'ENE',
    'E',
    'ESE',
    'SE',
    'SSE',
    'S',
    'SSW',
    'SW',
    'WSW',
    'W',
    'WNW',
    'NW',
    'NNW',
  ];

  const normalized = normalizeAngle(bearing);
  let directions: string[];
  let segment: number;

  switch (precision) {
    case 1:
      directions = directions1;
      segment = 90;
      break;
    case 2:
      directions = directions2;
      segment = 45;
      break;
    case 3:
      directions = directions3;
      segment = 22.5;
      break;
  }

  const index = Math.round(normalized / segment) % directions.length;
  return directions[index] ?? 'N';
}
