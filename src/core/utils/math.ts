/**
 * @fileoverview Mathematical utility functions
 * @module core/utils/math
 *
 * This module provides general mathematical utilities used throughout
 * the library, including rounding functions and time conversions.
 */

/**
 * Rounding rule for prayer times.
 */
export type RoundingRule = 'none' | 'nearest' | 'ceil' | 'floor';

/**
 * Rounds a number to the nearest integer based on the specified rule.
 *
 * @param value - The value to round
 * @param rule - The rounding rule to apply
 * @returns Rounded value
 *
 * @example
 * ```typescript
 * roundByRule(5.4, 'none');     // 5.4
 * roundByRule(5.4, 'nearest');  // 5
 * roundByRule(5.4, 'ceil');     // 6
 * roundByRule(5.4, 'floor');    // 5
 *
 * roundByRule(5.6, 'nearest');  // 6
 * roundByRule(5.5, 'nearest');  // 6 (rounds up on .5)
 * ```
 */
export function roundByRule(value: number, rule: RoundingRule): number {
  switch (rule) {
    case 'none':
      return value;
    case 'nearest':
      return Math.round(value);
    case 'ceil':
      return Math.ceil(value);
    case 'floor':
      return Math.floor(value);
    default:
      return value;
  }
}

/**
 * Rounds a time value (in hours) to the nearest minute.
 *
 * @param hours - Time in fractional hours
 * @param rule - The rounding rule to apply
 * @returns Time in hours, rounded to nearest minute precision
 *
 * @example
 * ```typescript
 * // 5.425 hours = 5h 25.5m
 * roundToMinute(5.425, 'nearest');  // 5.416... (5h 25m)
 * roundToMinute(5.425, 'ceil');     // 5.433... (5h 26m)
 * roundToMinute(5.425, 'floor');    // 5.416... (5h 25m)
 * ```
 */
export function roundToMinute(hours: number, rule: RoundingRule): number {
  if (rule === 'none') {
    return hours;
  }

  // Convert to minutes, round, convert back to hours
  const minutes = hours * 60;
  const roundedMinutes = roundByRule(minutes, rule);
  return roundedMinutes / 60;
}

/**
 * Converts hours and minutes to fractional hours.
 *
 * @param hours - Whole hours
 * @param minutes - Minutes (can be > 60)
 * @param seconds - Seconds (optional, default 0)
 * @returns Fractional hours
 *
 * @example
 * ```typescript
 * toFractionalHours(5, 30);      // 5.5
 * toFractionalHours(12, 15);     // 12.25
 * toFractionalHours(0, 90);      // 1.5
 * toFractionalHours(12, 30, 30); // 12.508333...
 * ```
 */
export function toFractionalHours(hours: number, minutes: number, seconds: number = 0): number {
  return hours + minutes / 60 + seconds / 3600;
}

/**
 * Converts fractional hours to hours, minutes, and seconds.
 *
 * @param fractionalHours - Time in fractional hours
 * @returns Object with hours, minutes, and seconds
 *
 * @example
 * ```typescript
 * fromFractionalHours(5.5);
 * // { hours: 5, minutes: 30, seconds: 0 }
 *
 * fromFractionalHours(12.2583);
 * // { hours: 12, minutes: 15, seconds: 29.88 }
 * ```
 */
export function fromFractionalHours(fractionalHours: number): {
  hours: number;
  minutes: number;
  seconds: number;
} {
  const sign = fractionalHours >= 0 ? 1 : -1;
  const abs = Math.abs(fractionalHours);

  const hours = Math.floor(abs);
  const remainingMinutes = (abs - hours) * 60;
  const minutes = Math.floor(remainingMinutes);
  const seconds = (remainingMinutes - minutes) * 60;

  return {
    hours: sign * hours,
    minutes,
    seconds: Math.round(seconds * 100) / 100, // Round to 2 decimal places
  };
}

/**
 * Clamps a value between a minimum and maximum.
 *
 * @param value - The value to clamp
 * @param min - Minimum allowed value
 * @param max - Maximum allowed value
 * @returns Clamped value
 *
 * @example
 * ```typescript
 * clamp(5, 0, 10);   // 5
 * clamp(-5, 0, 10);  // 0
 * clamp(15, 0, 10);  // 10
 * ```
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

/**
 * Linear interpolation between two values.
 *
 * @param a - Start value
 * @param b - End value
 * @param t - Interpolation factor (0 to 1)
 * @returns Interpolated value
 *
 * @example
 * ```typescript
 * lerp(0, 100, 0.0);   // 0
 * lerp(0, 100, 0.5);   // 50
 * lerp(0, 100, 1.0);   // 100
 * lerp(0, 100, 0.25);  // 25
 * ```
 */
export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

/**
 * Calculates the fractional part of a number.
 *
 * @param x - The number
 * @returns Fractional part (always positive)
 *
 * @example
 * ```typescript
 * frac(5.7);   // 0.7
 * frac(-5.7);  // 0.3 (positive fractional part)
 * frac(5.0);   // 0.0
 * ```
 */
export function frac(x: number): number {
  const result = x % 1;
  return result < 0 ? result + 1 : result;
}

/**
 * Wraps a value to be within a range [min, max).
 *
 * @param value - The value to wrap
 * @param min - Minimum value (inclusive)
 * @param max - Maximum value (exclusive)
 * @returns Wrapped value
 *
 * @example
 * ```typescript
 * wrap(370, 0, 360);   // 10
 * wrap(-10, 0, 360);   // 350
 * wrap(360, 0, 360);   // 0
 * wrap(25, 0, 24);     // 1
 * ```
 */
export function wrap(value: number, min: number, max: number): number {
  const range = max - min;
  const normalized = value - min;
  const wrapped = ((normalized % range) + range) % range;
  return wrapped + min;
}

/**
 * Fixes floating-point precision issues by rounding to a specified number of decimal places.
 *
 * @param value - The value to fix
 * @param decimals - Number of decimal places (default: 10)
 * @returns Fixed value
 *
 * @remarks
 * JavaScript floating-point arithmetic can produce results like 0.1 + 0.2 = 0.30000000000000004.
 * This function rounds to a reasonable precision to avoid such issues in comparisons.
 *
 * @example
 * ```typescript
 * fixPrecision(0.1 + 0.2);              // 0.3
 * fixPrecision(1.0000000001);           // 1
 * fixPrecision(3.14159265359, 4);       // 3.1416
 * ```
 */
export function fixPrecision(value: number, decimals: number = 10): number {
  const multiplier = Math.pow(10, decimals);
  return Math.round(value * multiplier) / multiplier;
}
