/**
 * @fileoverview Core result type for library operations
 * @module core/types/result
 *
 * This module provides a standardized Result type that wraps all library
 * operations. It follows the "Result" pattern (similar to Rust's Result
 * or functional programming's Either) to handle success and error cases
 * explicitly without throwing exceptions.
 *
 * @remarks
 * All public functions in this library return a Result type. This ensures:
 * 1. Errors are explicit and must be handled
 * 2. No unexpected exceptions are thrown
 * 3. Error details are structured and typed
 * 4. Optional trace information for debugging
 *
 * @example
 * ```typescript
 * import { computePrayerTimes } from 'islamic-utils';
 *
 * const result = computePrayerTimes(location, timeContext, params);
 *
 * if (result.success) {
 *   console.log('Fajr:', result.data.times.fajr);
 * } else {
 *   console.error('Error:', result.error.message);
 * }
 * ```
 */

import type { LibraryError } from '../errors/error';

/**
 * Represents a single step in a calculation trace.
 *
 * @remarks
 * Traces are used to explain how a result was calculated.
 * This is especially important for:
 * - Inheritance calculations (fiqh rules applied)
 * - Prayer times (high latitude adjustments)
 * - Debugging and verification
 *
 * @example
 * ```typescript
 * const trace: TraceStep = {
 *   step: 1,
 *   description: 'Calculate solar noon for longitude 106.8456',
 *   calculation: 'solarNoon = 12 - (106.8456 / 15) + EoT',
 *   value: 11.54
 * };
 * ```
 */
export interface TraceStep {
  /**
   * Sequential step number (1-indexed).
   */
  readonly step: number;

  /**
   * Human-readable description of what this step does.
   */
  readonly description: string;

  /**
   * Optional formula or calculation performed.
   *
   * @remarks
   * Use this to show the mathematical formula applied.
   */
  readonly calculation?: string;

  /**
   * Optional result value of this step.
   *
   * @remarks
   * Can be any type: number, string, object, etc.
   */
  readonly value?: unknown;

  /**
   * Optional sub-steps for complex calculations.
   */
  readonly subSteps?: TraceStep[];
}

/**
 * Successful result with data.
 *
 * @typeParam T - The type of the successful data
 */
export interface SuccessResult<T> {
  /**
   * Indicates this is a successful result.
   */
  readonly success: true;

  /**
   * The actual result data.
   */
  readonly data: T;

  /**
   * Optional trace of calculation steps.
   *
   * @remarks
   * Only included if trace mode was enabled in the options.
   */
  readonly trace?: TraceStep[];
}

/**
 * Failed result with error information.
 */
export interface ErrorResult {
  /**
   * Indicates this is an error result.
   */
  readonly success: false;

  /**
   * Structured error information.
   */
  readonly error: LibraryError;

  /**
   * Optional partial trace up to the point of failure.
   *
   * @remarks
   * Useful for debugging to see what steps succeeded before the error.
   */
  readonly trace?: TraceStep[];
}

/**
 * Union type representing either success or error.
 *
 * @typeParam T - The type of the successful data
 *
 * @remarks
 * This is the main return type for all library functions.
 * Use TypeScript's type narrowing to handle both cases:
 *
 * @example
 * ```typescript
 * function handleResult(result: Result<PrayerTimesResult>) {
 *   if (result.success) {
 *     // TypeScript knows result.data exists here
 *     console.log(result.data.times);
 *   } else {
 *     // TypeScript knows result.error exists here
 *     console.error(result.error.code);
 *   }
 * }
 * ```
 */
export type Result<T> = SuccessResult<T> | ErrorResult;

/**
 * Creates a successful result.
 *
 * @typeParam T - The type of the data
 * @param data - The successful result data
 * @param trace - Optional calculation trace
 * @returns A SuccessResult containing the data
 *
 * @example
 * ```typescript
 * const result = success({ bearing: 295.5 }, [{ step: 1, description: 'calculated' }]);
 * console.log(result.success); // true
 * console.log(result.data.bearing); // 295.5
 * ```
 */
export function success<T>(data: T, trace?: TraceStep[]): SuccessResult<T> {
  return {
    success: true,
    data,
    trace,
  };
}

/**
 * Creates an error result.
 *
 * @param error - The error information
 * @param trace - Optional partial trace up to failure point
 * @returns An ErrorResult containing the error
 *
 * @example
 * ```typescript
 * import { createError, ErrorCodes } from '../errors';
 *
 * const result = failure(
 *   createError(ErrorCodes.INVALID_COORDINATES, 'Latitude out of range'),
 *   [{ step: 1, description: 'validation failed' }]
 * );
 * console.log(result.success); // false
 * console.log(result.error.code); // 'INVALID_COORDINATES'
 * ```
 */
export function failure(error: LibraryError, trace?: TraceStep[]): ErrorResult {
  return {
    success: false,
    error,
    trace,
  };
}

/**
 * Type guard to check if a result is successful.
 *
 * @param result - The result to check
 * @returns True if the result is successful
 *
 * @example
 * ```typescript
 * if (isSuccess(result)) {
 *   // result.data is now accessible
 *   processData(result.data);
 * }
 * ```
 */
export function isSuccess<T>(result: Result<T>): result is SuccessResult<T> {
  return result.success === true;
}

/**
 * Type guard to check if a result is an error.
 *
 * @param result - The result to check
 * @returns True if the result is an error
 *
 * @example
 * ```typescript
 * if (isError(result)) {
 *   // result.error is now accessible
 *   logError(result.error);
 * }
 * ```
 */
export function isError<T>(result: Result<T>): result is ErrorResult {
  return result.success === false;
}

/**
 * Unwraps a result, returning the data or throwing the error.
 *
 * @typeParam T - The type of the successful data
 * @param result - The result to unwrap
 * @returns The successful data
 * @throws The library error if the result is an error
 *
 * @remarks
 * Use this when you want to convert from Result pattern to exception pattern.
 * Not recommended for normal library usage, but useful for quick scripts.
 *
 * @example
 * ```typescript
 * try {
 *   const data = unwrap(computePrayerTimes(...));
 *   console.log(data.times.fajr);
 * } catch (error) {
 *   console.error('Failed:', error.message);
 * }
 * ```
 */
export function unwrap<T>(result: Result<T>): T {
  if (result.success) {
    return result.data;
  }
  throw result.error;
}

/**
 * Unwraps a result, returning the data or a default value.
 *
 * @typeParam T - The type of the successful data
 * @param result - The result to unwrap
 * @param defaultValue - The value to return if the result is an error
 * @returns The successful data or the default value
 *
 * @example
 * ```typescript
 * const bearing = unwrapOr(computeQiblaDirection(...), { bearing: 0 });
 * console.log(bearing.bearing); // Either the calculated value or 0
 * ```
 */
export function unwrapOr<T>(result: Result<T>, defaultValue: T): T {
  if (result.success) {
    return result.data;
  }
  return defaultValue;
}
