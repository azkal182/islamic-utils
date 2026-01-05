/**
 * @fileoverview Core type definitions for geographic coordinates
 * @module core/types/coordinates
 *
 * This module provides type definitions for geographic coordinates used
 * throughout the Islamic utilities library. All modules (Prayer Times, Qibla,
 * and Inheritance) that require location data use these types.
 *
 * @example
 * ```typescript
 * import { Coordinates } from 'islamic-utils';
 *
 * const makkah: Coordinates = {
 *   latitude: 21.4225,
 *   longitude: 39.8262,
 *   altitude: 277
 * };
 * ```
 */

/**
 * Represents geographic coordinates on Earth.
 *
 * @remarks
 * Coordinates follow the WGS84 standard used by GPS systems.
 * - Latitude: Positive values indicate North, negative indicate South
 * - Longitude: Positive values indicate East, negative indicate West
 * - Altitude: Height above sea level in meters (optional)
 *
 * @example
 * ```typescript
 * // Jakarta, Indonesia
 * const jakarta: Coordinates = {
 *   latitude: -6.2088,   // South of equator
 *   longitude: 106.8456, // East of Prime Meridian
 *   altitude: 8          // 8 meters above sea level
 * };
 *
 * // London, UK
 * const london: Coordinates = {
 *   latitude: 51.5074,   // North
 *   longitude: -0.1278   // West (no altitude specified)
 * };
 * ```
 */
export interface Coordinates {
  /**
   * Latitude in decimal degrees.
   *
   * @remarks
   * Valid range: -90 (South Pole) to +90 (North Pole)
   *
   * Common reference points:
   * - 0° = Equator
   * - 23.5° = Tropic of Cancer
   * - -23.5° = Tropic of Capricorn
   * - 66.5° = Arctic Circle
   * - -66.5° = Antarctic Circle
   */
  readonly latitude: number;

  /**
   * Longitude in decimal degrees.
   *
   * @remarks
   * Valid range: -180 to +180
   * - 0° = Prime Meridian (Greenwich, London)
   * - +180° / -180° = International Date Line
   *
   * Values exactly at +180 and -180 refer to the same meridian.
   */
  readonly longitude: number;

  /**
   * Altitude above sea level in meters.
   *
   * @remarks
   * Optional field. If not provided, sea level (0) is assumed.
   * Altitude can affect prayer time calculations due to:
   * - Earlier sunrise/later sunset at higher elevations
   * - Atmospheric refraction differences
   *
   * @defaultValue 0
   */
  readonly altitude?: number;
}

/**
 * Type guard to check if an object is a valid Coordinates interface.
 *
 * @param obj - The object to check
 * @returns True if the object matches the Coordinates interface structure
 *
 * @example
 * ```typescript
 * const data = JSON.parse(userInput);
 * if (isCoordinatesLike(data)) {
 *   // TypeScript now knows data is Coordinates
 *   console.log(data.latitude);
 * }
 * ```
 */
export function isCoordinatesLike(obj: unknown): obj is Coordinates {
  if (typeof obj !== 'object' || obj === null) {
    return false;
  }

  const coords = obj as Record<string, unknown>;

  return (
    typeof coords['latitude'] === 'number' &&
    typeof coords['longitude'] === 'number' &&
    (coords['altitude'] === undefined || typeof coords['altitude'] === 'number')
  );
}
