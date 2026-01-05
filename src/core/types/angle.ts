/**
 * @fileoverview Core type definitions for angles and angular measurements
 * @module core/types/angle
 *
 * This module provides type definitions for angular measurements used
 * in astronomical calculations (sun position, qibla direction, etc.).
 *
 * @remarks
 * All angle values in this library use decimal degrees as the primary unit.
 * The Angle interface provides flexibility for degrees-minutes-seconds (DMS)
 * input when needed.
 */

/**
 * Represents an angle in Degrees-Minutes-Seconds format.
 *
 * @remarks
 * This format is commonly used in:
 * - Geographic coordinates (e.g., 21° 25' 21" N)
 * - Astronomical observations
 * - Navigation charts
 *
 * For negative angles, only the degrees component should be negative.
 *
 * @example
 * ```typescript
 * // Ka'bah latitude: 21° 25' 21" N
 * const kaabaLat: AngleDMS = {
 *   degrees: 21,
 *   minutes: 25,
 *   seconds: 21
 * };
 *
 * // Negative latitude (South): 6° 12' 31.68" S
 * const jakartaLat: AngleDMS = {
 *   degrees: -6,
 *   minutes: 12,
 *   seconds: 31.68
 * };
 * ```
 */
export interface AngleDMS {
  /**
   * Whole degrees component.
   *
   * @remarks
   * Can be positive or negative.
   * For negative angles, only this component is negative.
   */
  readonly degrees: number;

  /**
   * Minutes component (0-59).
   *
   * @remarks
   * Always positive (0 to 59).
   * 1 degree = 60 minutes
   *
   * @defaultValue 0
   */
  readonly minutes?: number;

  /**
   * Seconds component (0-59.999...).
   *
   * @remarks
   * Always positive (0 to 59.999...).
   * 1 minute = 60 seconds
   * Can include fractional seconds.
   *
   * @defaultValue 0
   */
  readonly seconds?: number;
}

/**
 * Represents an angle that can be in decimal degrees or DMS format.
 *
 * @remarks
 * Use decimal degrees (number) for calculations.
 * Use AngleDMS for display or when input is in DMS format.
 *
 * @example
 * ```typescript
 * // Decimal degrees (preferred for calculations)
 * const angle1: Angle = 21.4225;
 *
 * // DMS format (for display or input)
 * const angle2: Angle = { degrees: 21, minutes: 25, seconds: 21 };
 * ```
 */
export type Angle = number | AngleDMS;

/**
 * Converts an angle from DMS format to decimal degrees.
 *
 * @param dms - Angle in Degrees-Minutes-Seconds format
 * @returns Angle in decimal degrees
 *
 * @example
 * ```typescript
 * // Convert 21° 25' 21" to decimal degrees
 * const decimal = dmsToDecimal({ degrees: 21, minutes: 25, seconds: 21 });
 * // Result: 21.4225
 *
 * // Negative angle: -6° 12' 31.68"
 * const negative = dmsToDecimal({ degrees: -6, minutes: 12, seconds: 31.68 });
 * // Result: -6.2088
 * ```
 */
export function dmsToDecimal(dms: AngleDMS): number {
  const sign = dms.degrees >= 0 ? 1 : -1;
  const degrees = Math.abs(dms.degrees);
  const minutes = dms.minutes ?? 0;
  const seconds = dms.seconds ?? 0;

  return sign * (degrees + minutes / 60 + seconds / 3600);
}

/**
 * Converts an angle from decimal degrees to DMS format.
 *
 * @param decimal - Angle in decimal degrees
 * @returns Angle in Degrees-Minutes-Seconds format
 *
 * @example
 * ```typescript
 * // Convert 21.4225° to DMS
 * const dms = decimalToDms(21.4225);
 * // Result: { degrees: 21, minutes: 25, seconds: 21 }
 *
 * // Negative angle
 * const negative = decimalToDms(-6.2088);
 * // Result: { degrees: -6, minutes: 12, seconds: 31.68 }
 * ```
 */
export function decimalToDms(decimal: number): AngleDMS {
  const sign = decimal >= 0 ? 1 : -1;
  const absolute = Math.abs(decimal);

  const degrees = Math.floor(absolute);
  const minutesFull = (absolute - degrees) * 60;
  const minutes = Math.floor(minutesFull);
  const seconds = (minutesFull - minutes) * 60;

  return {
    degrees: sign * degrees,
    minutes,
    seconds: Math.round(seconds * 100) / 100, // Round to 2 decimal places
  };
}

/**
 * Normalizes an angle to be within the range [0, 360).
 *
 * @param degrees - Angle in decimal degrees (any value)
 * @returns Normalized angle in range [0, 360)
 *
 * @example
 * ```typescript
 * normalizeAngle(450);   // Returns: 90
 * normalizeAngle(-90);   // Returns: 270
 * normalizeAngle(360);   // Returns: 0
 * normalizeAngle(720);   // Returns: 0
 * ```
 */
export function normalizeAngle(degrees: number): number {
  const normalized = degrees % 360;
  return normalized < 0 ? normalized + 360 : normalized;
}

/**
 * Normalizes an angle to be within the range [-180, 180).
 *
 * @param degrees - Angle in decimal degrees (any value)
 * @returns Normalized angle in range [-180, 180)
 *
 * @remarks
 * This is useful for representing relative angles or bearings
 * where you want to distinguish between "turn left" and "turn right".
 *
 * @example
 * ```typescript
 * normalizeAngleSigned(270);   // Returns: -90
 * normalizeAngleSigned(-270);  // Returns: 90
 * normalizeAngleSigned(180);   // Returns: 180
 * normalizeAngleSigned(450);   // Returns: 90
 * ```
 */
export function normalizeAngleSigned(degrees: number): number {
  const normalized = normalizeAngle(degrees);
  return normalized >= 180 ? normalized - 360 : normalized;
}

/**
 * Converts any Angle type to decimal degrees.
 *
 * @param angle - Angle in either decimal degrees or DMS format
 * @returns Angle in decimal degrees
 *
 * @example
 * ```typescript
 * // Already decimal - returns as-is
 * toDecimalDegrees(21.4225); // Returns: 21.4225
 *
 * // DMS format - converts to decimal
 * toDecimalDegrees({ degrees: 21, minutes: 25, seconds: 21 }); // Returns: 21.4225
 * ```
 */
export function toDecimalDegrees(angle: Angle): number {
  if (typeof angle === 'number') {
    return angle;
  }
  return dmsToDecimal(angle);
}
