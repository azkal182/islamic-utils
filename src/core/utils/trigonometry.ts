/**
 * @fileoverview Trigonometry utility functions
 * @module core/utils/trigonometry
 *
 * This module provides trigonometric functions that work with degrees
 * instead of radians, making the code more readable for astronomical
 * calculations where degrees are the standard unit.
 */

import { TRIG } from '../constants/astronomical';

/**
 * Converts degrees to radians.
 *
 * @param degrees - Angle in degrees
 * @returns Angle in radians
 *
 * @example
 * ```typescript
 * toRadians(180);  // π (3.14159...)
 * toRadians(90);   // π/2 (1.5708...)
 * toRadians(360);  // 2π (6.2832...)
 * ```
 */
export function toRadians(degrees: number): number {
  return degrees * TRIG.DEG_TO_RAD;
}

/**
 * Converts radians to degrees.
 *
 * @param radians - Angle in radians
 * @returns Angle in degrees
 *
 * @example
 * ```typescript
 * toDegrees(Math.PI);     // 180
 * toDegrees(Math.PI / 2); // 90
 * toDegrees(2 * Math.PI); // 360
 * ```
 */
export function toDegrees(radians: number): number {
  return radians * TRIG.RAD_TO_DEG;
}

/**
 * Sine function that takes degrees.
 *
 * @param degrees - Angle in degrees
 * @returns Sine of the angle
 *
 * @example
 * ```typescript
 * sinDeg(0);    // 0
 * sinDeg(30);   // 0.5
 * sinDeg(90);   // 1
 * sinDeg(180);  // 0
 * sinDeg(270);  // -1
 * ```
 */
export function sinDeg(degrees: number): number {
  return Math.sin(toRadians(degrees));
}

/**
 * Cosine function that takes degrees.
 *
 * @param degrees - Angle in degrees
 * @returns Cosine of the angle
 *
 * @example
 * ```typescript
 * cosDeg(0);    // 1
 * cosDeg(60);   // 0.5
 * cosDeg(90);   // 0
 * cosDeg(180);  // -1
 * cosDeg(270);  // 0
 * ```
 */
export function cosDeg(degrees: number): number {
  return Math.cos(toRadians(degrees));
}

/**
 * Tangent function that takes degrees.
 *
 * @param degrees - Angle in degrees
 * @returns Tangent of the angle
 *
 * @example
 * ```typescript
 * tanDeg(0);    // 0
 * tanDeg(45);   // 1
 * tanDeg(60);   // 1.732... (√3)
 * ```
 */
export function tanDeg(degrees: number): number {
  return Math.tan(toRadians(degrees));
}

/**
 * Cotangent function that takes degrees.
 *
 * @param degrees - Angle in degrees
 * @returns Cotangent of the angle (1/tan)
 *
 * @example
 * ```typescript
 * cotDeg(45);   // 1
 * cotDeg(30);   // 1.732... (√3)
 * cotDeg(60);   // 0.577... (1/√3)
 * ```
 */
export function cotDeg(degrees: number): number {
  return 1 / Math.tan(toRadians(degrees));
}

/**
 * Arcsine function that returns degrees.
 *
 * @param x - Value between -1 and 1
 * @returns Angle in degrees (-90 to 90)
 *
 * @example
 * ```typescript
 * asinDeg(0);     // 0
 * asinDeg(0.5);   // 30
 * asinDeg(1);     // 90
 * asinDeg(-1);    // -90
 * ```
 */
export function asinDeg(x: number): number {
  return toDegrees(Math.asin(x));
}

/**
 * Arccosine function that returns degrees.
 *
 * @param x - Value between -1 and 1
 * @returns Angle in degrees (0 to 180)
 *
 * @example
 * ```typescript
 * acosDeg(1);     // 0
 * acosDeg(0.5);   // 60
 * acosDeg(0);     // 90
 * acosDeg(-1);    // 180
 * ```
 */
export function acosDeg(x: number): number {
  return toDegrees(Math.acos(x));
}

/**
 * Arctangent function that returns degrees.
 *
 * @param x - Any real number
 * @returns Angle in degrees (-90 to 90)
 *
 * @example
 * ```typescript
 * atanDeg(0);     // 0
 * atanDeg(1);     // 45
 * atanDeg(-1);    // -45
 * ```
 */
export function atanDeg(x: number): number {
  return toDegrees(Math.atan(x));
}

/**
 * Two-argument arctangent that returns degrees.
 *
 * @param y - Y coordinate
 * @param x - X coordinate
 * @returns Angle in degrees (-180 to 180)
 *
 * @remarks
 * atan2 is preferred over atan for computing the angle of a vector
 * because it handles all quadrants correctly and avoids division by zero.
 *
 * @example
 * ```typescript
 * atan2Deg(1, 1);    // 45 (first quadrant)
 * atan2Deg(1, -1);   // 135 (second quadrant)
 * atan2Deg(-1, -1);  // -135 (third quadrant)
 * atan2Deg(-1, 1);   // -45 (fourth quadrant)
 * atan2Deg(0, 1);    // 0 (positive x-axis)
 * atan2Deg(1, 0);    // 90 (positive y-axis)
 * ```
 */
export function atan2Deg(y: number, x: number): number {
  return toDegrees(Math.atan2(y, x));
}

/**
 * Arccotangent function that returns degrees.
 *
 * @param x - Any real number
 * @returns Angle in degrees (0 to 180)
 *
 * @example
 * ```typescript
 * acotDeg(1);     // 45
 * acotDeg(0);     // 90
 * acotDeg(-1);    // 135
 * ```
 */
export function acotDeg(x: number): number {
  // acot(x) = atan(1/x) but we need to handle the sign properly
  // For x > 0: acot(x) = atan(1/x)
  // For x < 0: acot(x) = atan(1/x) + 180
  // For x = 0: acot(0) = 90
  if (x === 0) {
    return 90;
  }
  const result = atanDeg(1 / x);
  return x < 0 ? result + 180 : result;
}

/**
 * Safe arccosine that handles out-of-range values.
 *
 * @param x - Value (will be clamped to [-1, 1])
 * @returns Angle in degrees (0 to 180)
 *
 * @remarks
 * Due to floating-point precision issues, calculated values may slightly
 * exceed the valid range [-1, 1]. This function clamps the input to avoid NaN.
 *
 * @example
 * ```typescript
 * safeAcosDeg(0.5);    // 60
 * safeAcosDeg(1.001);  // 0 (clamped to 1)
 * safeAcosDeg(-1.001); // 180 (clamped to -1)
 * ```
 */
export function safeAcosDeg(x: number): number {
  const clamped = Math.max(-1, Math.min(1, x));
  return acosDeg(clamped);
}

/**
 * Safe arcsine that handles out-of-range values.
 *
 * @param x - Value (will be clamped to [-1, 1])
 * @returns Angle in degrees (-90 to 90)
 *
 * @example
 * ```typescript
 * safeAsinDeg(0.5);    // 30
 * safeAsinDeg(1.001);  // 90 (clamped to 1)
 * safeAsinDeg(-1.001); // -90 (clamped to -1)
 * ```
 */
export function safeAsinDeg(x: number): number {
  const clamped = Math.max(-1, Math.min(1, x));
  return asinDeg(clamped);
}
