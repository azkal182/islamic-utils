/**
 * @fileoverview Great Circle calculations
 * @module qibla/great-circle
 *
 * This module provides great-circle navigation calculations
 * for determining bearing and distance between two points on Earth.
 *
 * @remarks
 * Uses the Haversine formula for distance and the spherical law of cosines
 * for initial bearing calculation.
 */

import { toRadians, toDegrees, sinDeg, cosDeg, atan2Deg } from '../core/utils/trigonometry';
import { normalizeAngle } from '../core/types/angle';
import type { Coordinates } from '../core/types/coordinates';
import { EARTH_RADIUS_KM } from '../core/constants/kaaba';

// ═══════════════════════════════════════════════════════════════════════════
// Initial Bearing Calculation
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Calculates the initial bearing (forward azimuth) from one point to another.
 *
 * @param from - Starting coordinates
 * @param to - Destination coordinates
 * @returns Initial bearing in degrees (0-360, clockwise from north)
 *
 * @remarks
 * The initial bearing is the direction to travel at the START of the journey.
 * For a great-circle route, the bearing changes continuously along the path.
 *
 * Formula:
 * ```
 * θ = atan2(sin(Δλ) × cos(φ₂),
 *           cos(φ₁) × sin(φ₂) − sin(φ₁) × cos(φ₂) × cos(Δλ))
 * ```
 *
 * @example
 * ```typescript
 * // Bearing from Jakarta to Makkah
 * const bearing = calculateInitialBearing(
 *   { latitude: -6.2088, longitude: 106.8456 },
 *   { latitude: 21.4225, longitude: 39.8262 }
 * );
 * console.log(bearing); // ~295° (WNW)
 * ```
 */
export function calculateInitialBearing(from: Coordinates, to: Coordinates): number {
  const φ1 = from.latitude;
  const φ2 = to.latitude;
  const Δλ = to.longitude - from.longitude;

  const x = sinDeg(Δλ) * cosDeg(φ2);
  const y = cosDeg(φ1) * sinDeg(φ2) - sinDeg(φ1) * cosDeg(φ2) * cosDeg(Δλ);

  const θ = atan2Deg(x, y);

  // Normalize to 0-360
  return normalizeAngle(θ);
}

/**
 * Calculates the final bearing (arrival azimuth) from one point to another.
 *
 * @param from - Starting coordinates
 * @param to - Destination coordinates
 * @returns Final bearing in degrees (0-360)
 *
 * @remarks
 * The final bearing is the direction of travel at the END of the journey.
 * It's calculated as the reverse of the initial bearing from destination to start.
 */
export function calculateFinalBearing(from: Coordinates, to: Coordinates): number {
  const reverseBearing = calculateInitialBearing(to, from);
  return normalizeAngle(reverseBearing + 180);
}

// ═══════════════════════════════════════════════════════════════════════════
// Distance Calculation
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Calculates the great-circle distance between two points using Haversine formula.
 *
 * @param from - Starting coordinates
 * @param to - Destination coordinates
 * @returns Distance in kilometers
 *
 * @remarks
 * The Haversine formula is numerically stable for small distances.
 *
 * Formula:
 * ```
 * a = sin²(Δφ/2) + cos(φ₁) × cos(φ₂) × sin²(Δλ/2)
 * c = 2 × atan2(√a, √(1−a))
 * d = R × c
 * ```
 *
 * @example
 * ```typescript
 * const distance = calculateGreatCircleDistance(
 *   { latitude: -6.2088, longitude: 106.8456 },
 *   { latitude: 21.4225, longitude: 39.8262 }
 * );
 * console.log(distance); // ~7985 km
 * ```
 */
export function calculateGreatCircleDistance(from: Coordinates, to: Coordinates): number {
  const φ1 = toRadians(from.latitude);
  const φ2 = toRadians(to.latitude);
  const Δφ = toRadians(to.latitude - from.latitude);
  const Δλ = toRadians(to.longitude - from.longitude);

  const sinHalfΔφ = Math.sin(Δφ / 2);
  const sinHalfΔλ = Math.sin(Δλ / 2);

  const a = sinHalfΔφ * sinHalfΔφ + Math.cos(φ1) * Math.cos(φ2) * sinHalfΔλ * sinHalfΔλ;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return EARTH_RADIUS_KM * c;
}

// ═══════════════════════════════════════════════════════════════════════════
// Midpoint Calculation
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Calculates the midpoint along a great-circle path between two points.
 *
 * @param from - Starting coordinates
 * @param to - Destination coordinates
 * @returns Midpoint coordinates
 */
export function calculateMidpoint(from: Coordinates, to: Coordinates): Coordinates {
  const φ1 = toRadians(from.latitude);
  const λ1 = toRadians(from.longitude);
  const φ2 = toRadians(to.latitude);
  const Δλ = toRadians(to.longitude - from.longitude);

  const Bx = Math.cos(φ2) * Math.cos(Δλ);
  const By = Math.cos(φ2) * Math.sin(Δλ);

  const φ3 = Math.atan2(
    Math.sin(φ1) + Math.sin(φ2),
    Math.sqrt((Math.cos(φ1) + Bx) * (Math.cos(φ1) + Bx) + By * By)
  );
  const λ3 = λ1 + Math.atan2(By, Math.cos(φ1) + Bx);

  return {
    latitude: toDegrees(φ3),
    longitude: toDegrees(λ3),
  };
}
