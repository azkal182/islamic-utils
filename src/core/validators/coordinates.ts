/**
 * @fileoverview Coordinate validation functions
 * @module core/validators/coordinates
 *
 * This module provides validation functions for geographic coordinates.
 * All validation functions return a Result type for consistent error handling.
 */

import type { Coordinates } from '../types/coordinates';
import type { Result } from '../types/result';
import { success, failure } from '../types/result';
import { Errors } from '../errors';

/**
 * Valid latitude range constants.
 */
export const LATITUDE_RANGE = {
  MIN: -90,
  MAX: 90,
} as const;

/**
 * Valid longitude range constants.
 */
export const LONGITUDE_RANGE = {
  MIN: -180,
  MAX: 180,
} as const;

/**
 * Validates geographic coordinates.
 *
 * @param coords - The coordinates to validate
 * @returns Success with validated coordinates, or failure with error details
 *
 * @remarks
 * Validation rules:
 * - Latitude must be between -90 (South Pole) and +90 (North Pole)
 * - Longitude must be between -180 and +180
 * - Altitude, if provided, must be >= 0
 * - Latitude and longitude must be finite numbers (not NaN, not Infinity)
 *
 * @example
 * ```typescript
 * // Valid coordinates
 * const result1 = validateCoordinates({ latitude: -6.2088, longitude: 106.8456 });
 * // result1.success === true
 *
 * // Invalid latitude
 * const result2 = validateCoordinates({ latitude: 100, longitude: 0 });
 * // result2.success === false
 * // result2.error.code === 'INVALID_COORDINATES'
 * ```
 */
export function validateCoordinates(coords: Coordinates): Result<Coordinates> {
  // Check if latitude is a valid number
  if (typeof coords.latitude !== 'number' || !Number.isFinite(coords.latitude)) {
    return failure(
      Errors.invalidCoordinates('Latitude must be a finite number', {
        field: 'latitude',
        provided: coords.latitude,
      })
    );
  }

  // Check if longitude is a valid number
  if (typeof coords.longitude !== 'number' || !Number.isFinite(coords.longitude)) {
    return failure(
      Errors.invalidCoordinates('Longitude must be a finite number', {
        field: 'longitude',
        provided: coords.longitude,
      })
    );
  }

  // Validate latitude range
  if (coords.latitude < LATITUDE_RANGE.MIN || coords.latitude > LATITUDE_RANGE.MAX) {
    return failure(
      Errors.invalidCoordinates(
        `Latitude must be between ${LATITUDE_RANGE.MIN} and ${LATITUDE_RANGE.MAX}`,
        {
          field: 'latitude',
          provided: coords.latitude,
          min: LATITUDE_RANGE.MIN,
          max: LATITUDE_RANGE.MAX,
        }
      )
    );
  }

  // Validate longitude range
  if (coords.longitude < LONGITUDE_RANGE.MIN || coords.longitude > LONGITUDE_RANGE.MAX) {
    return failure(
      Errors.invalidCoordinates(
        `Longitude must be between ${LONGITUDE_RANGE.MIN} and ${LONGITUDE_RANGE.MAX}`,
        {
          field: 'longitude',
          provided: coords.longitude,
          min: LONGITUDE_RANGE.MIN,
          max: LONGITUDE_RANGE.MAX,
        }
      )
    );
  }

  // Validate altitude if provided
  if (coords.altitude !== undefined) {
    if (typeof coords.altitude !== 'number' || !Number.isFinite(coords.altitude)) {
      return failure(
        Errors.invalidCoordinates('Altitude must be a finite number', {
          field: 'altitude',
          provided: coords.altitude,
        })
      );
    }

    if (coords.altitude < 0) {
      return failure(
        Errors.invalidCoordinates('Altitude must be greater than or equal to 0', {
          field: 'altitude',
          provided: coords.altitude,
          min: 0,
        })
      );
    }
  }

  // All validations passed
  return success(coords);
}

/**
 * Checks if coordinates are in a high-latitude region.
 *
 * @param coords - The coordinates to check
 * @param threshold - Latitude threshold in degrees (default: 48.5)
 * @returns True if absolute latitude exceeds the threshold
 *
 * @remarks
 * High latitude regions may have issues with Fajr/Isha calculations
 * because the sun may not reach the required angles.
 *
 * Common thresholds:
 * - 48.5° - Fajr/Isha may be undefined in summer
 * - 60° - Midnight sun region
 * - 66.5° - Arctic/Antarctic circle
 *
 * @example
 * ```typescript
 * // London (51.5°N) - high latitude
 * isHighLatitude({ latitude: 51.5, longitude: -0.1 }); // true
 *
 * // Jakarta (6°S) - not high latitude
 * isHighLatitude({ latitude: -6.2, longitude: 106.8 }); // false
 *
 * // Custom threshold
 * isHighLatitude({ latitude: 55, longitude: 0 }, 60); // false
 * ```
 */
export function isHighLatitude(coords: Coordinates, threshold: number = 48.5): boolean {
  return Math.abs(coords.latitude) > threshold;
}

/**
 * Normalizes coordinates to standard ranges.
 *
 * @param coords - The coordinates to normalize
 * @returns Normalized coordinates with altitude defaulted to 0 if not provided
 *
 * @remarks
 * This function:
 * - Ensures longitude wraps around at the date line
 * - Defaults altitude to 0 if not provided
 * - Does NOT validate - use validateCoordinates first
 *
 * @example
 * ```typescript
 * // Normalize longitude at date line
 * normalizeCoordinates({ latitude: 0, longitude: 181 });
 * // Result: { latitude: 0, longitude: -179, altitude: 0 }
 *
 * // Default altitude
 * normalizeCoordinates({ latitude: 0, longitude: 0 });
 * // Result: { latitude: 0, longitude: 0, altitude: 0 }
 * ```
 */
export function normalizeCoordinates(coords: Coordinates): Required<Coordinates> {
  let longitude = coords.longitude;

  // Wrap longitude to [-180, 180]
  while (longitude > 180) {
    longitude -= 360;
  }
  while (longitude < -180) {
    longitude += 360;
  }

  return {
    latitude: coords.latitude,
    longitude,
    altitude: coords.altitude ?? 0,
  };
}
