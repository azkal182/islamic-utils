/**
 * @fileoverview Ka'bah coordinates constant
 * @module core/constants/kaaba
 *
 * This module provides the official coordinates of the Ka'bah,
 * used as the reference point for all Qibla calculations.
 */

import type { Coordinates } from '../types/coordinates';

/**
 * Precise coordinates of the Ka'bah in Masjid al-Haram, Makkah.
 *
 * @remarks
 * The Ka'bah is the holiest site in Islam and the direction (Qibla)
 * that Muslims face during prayer.
 *
 * These coordinates point to the center of the Ka'bah structure.
 * The values are based on modern GPS measurements and satellite imagery.
 *
 * Location: Masjid al-Haram, Makkah, Saudi Arabia
 *
 * @example
 * ```typescript
 * import { KAABA_COORDINATES } from 'islamic-utils';
 *
 * console.log(`Ka'bah is at ${KAABA_COORDINATES.latitude}°N, ${KAABA_COORDINATES.longitude}°E`);
 * // Output: Ka'bah is at 21.4225°N, 39.8262°E
 * ```
 */
export const KAABA_COORDINATES: Readonly<Required<Coordinates>> = {
  /**
   * Latitude of the Ka'bah.
   *
   * @remarks
   * 21° 25' 21" N = 21.4225°
   */
  latitude: 21.4225,

  /**
   * Longitude of the Ka'bah.
   *
   * @remarks
   * 39° 49' 34" E = 39.8262°
   */
  longitude: 39.8262,

  /**
   * Altitude of the Ka'bah above sea level.
   *
   * @remarks
   * The Ka'bah sits at approximately 277 meters above sea level.
   * This value is not typically used in Qibla calculations but
   * is provided for completeness.
   */
  altitude: 277,
} as const;

/**
 * Precision threshold for determining if a location is "at" the Ka'bah.
 *
 * @remarks
 * If the user's distance to the Ka'bah is less than this value (in km),
 * they are considered to be at the Ka'bah and any direction is valid.
 *
 * 100 meters is approximately the size of the Mataf (circumambulation area).
 */
export const KAABA_PROXIMITY_THRESHOLD_KM = 0.1;

/**
 * Earth's mean radius in kilometers.
 *
 * @remarks
 * Used for great-circle distance calculations.
 * WGS84 mean radius.
 */
export const EARTH_RADIUS_KM = 6371.0088;

/**
 * Calculates great-circle distance between two points on Earth.
 *
 * @param from - Starting coordinates
 * @param to - Ending coordinates
 * @returns Distance in kilometers
 *
 * @remarks
 * Uses the Haversine formula, which is accurate for most distances.
 * For very short distances, may have minor floating-point errors.
 *
 * @example
 * ```typescript
 * import { calculateDistance, KAABA_COORDINATES } from 'islamic-utils';
 *
 * const jakarta = { latitude: -6.2088, longitude: 106.8456 };
 * const distance = calculateDistance(jakarta, KAABA_COORDINATES);
 * console.log(`Distance to Makkah: ${distance.toFixed(0)} km`);
 * // Output: Distance to Makkah: 7803 km
 * ```
 */
export function calculateDistance(from: Coordinates, to: Coordinates): number {
  const R = EARTH_RADIUS_KM;

  // Convert to radians
  const φ1 = (from.latitude * Math.PI) / 180;
  const φ2 = (to.latitude * Math.PI) / 180;
  const Δφ = ((to.latitude - from.latitude) * Math.PI) / 180;
  const Δλ = ((to.longitude - from.longitude) * Math.PI) / 180;

  // Haversine formula
  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

/**
 * Checks if a location is at or very near the Ka'bah.
 *
 * @param coords - The location to check
 * @returns True if within the proximity threshold
 *
 * @example
 * ```typescript
 * import { isAtKaaba, KAABA_COORDINATES } from 'islamic-utils';
 *
 * isAtKaaba(KAABA_COORDINATES);  // true
 * isAtKaaba({ latitude: -6.2, longitude: 106.8 });  // false
 * ```
 */
export function isAtKaaba(coords: Coordinates): boolean {
  const distance = calculateDistance(coords, KAABA_COORDINATES);
  return distance < KAABA_PROXIMITY_THRESHOLD_KM;
}
