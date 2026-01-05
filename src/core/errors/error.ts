/**
 * @fileoverview Library error class and factory functions
 * @module core/errors/error
 *
 * This module provides the error class and helper functions for creating
 * structured errors throughout the library.
 *
 * @remarks
 * All errors in this library extend LibraryError, which provides:
 * - Structured error information (code, message, details)
 * - Proper stack trace
 * - JSON serialization support
 *
 * @example
 * ```typescript
 * import { createError, ErrorCodes } from 'islamic-utils';
 *
 * const error = createError(
 *   ErrorCodes.INVALID_COORDINATES,
 *   'Latitude must be between -90 and 90',
 *   { provided: 100, field: 'latitude' }
 * );
 * ```
 */

import { ErrorCode, ErrorCodes } from './codes';

/**
 * Base error class for all library errors.
 *
 * @remarks
 * This class extends the native Error class and adds:
 * - `code`: A string identifier for the error type
 * - `details`: Additional structured information about the error
 *
 * @example
 * ```typescript
 * try {
 *   const data = unwrap(result);
 * } catch (error) {
 *   if (error instanceof LibraryError) {
 *     console.log('Error code:', error.code);
 *     console.log('Details:', error.details);
 *   }
 * }
 * ```
 */
export class LibraryError extends Error {
  /**
   * Error code identifying the type of error.
   *
   * @see ErrorCodes for all possible values
   */
  public readonly code: ErrorCode;

  /**
   * Additional details about the error.
   *
   * @remarks
   * Can contain any relevant information such as:
   * - The invalid value that caused the error
   * - The expected value or range
   * - Field names
   * - Calculation step where the error occurred
   */
  public readonly details?: Record<string, unknown>;

  /**
   * Timestamp when the error was created.
   */
  public readonly timestamp: Date;

  /**
   * Creates a new LibraryError.
   *
   * @param code - Error code from ErrorCodes
   * @param message - Human-readable error message
   * @param details - Optional additional error details
   */
  constructor(code: ErrorCode, message: string, details?: Record<string, unknown>) {
    super(message);

    // Maintains proper prototype chain for instanceof checks
    Object.setPrototypeOf(this, new.target.prototype);

    this.name = 'IslamicUtilsError';
    this.code = code;
    this.details = details;
    this.timestamp = new Date();

    // Captures stack trace, excluding constructor call from it
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }

  /**
   * Converts the error to a plain object for JSON serialization.
   *
   * @returns Plain object representation of the error
   *
   * @example
   * ```typescript
   * const error = createError(ErrorCodes.INVALID_DATE, 'Invalid date');
   * console.log(JSON.stringify(error.toJSON(), null, 2));
   * // {
   * //   "name": "IslamicUtilsError",
   * //   "code": "INVALID_DATE",
   * //   "message": "Invalid date",
   * //   "timestamp": "2024-01-15T10:30:00.000Z"
   * // }
   * ```
   */
  public toJSON(): Record<string, unknown> {
    return {
      name: this.name,
      code: this.code,
      message: this.message,
      details: this.details,
      timestamp: this.timestamp.toISOString(),
    };
  }

  /**
   * Creates a string representation of the error.
   *
   * @returns Formatted error string
   */
  public override toString(): string {
    const detailsStr = this.details ? ` | Details: ${JSON.stringify(this.details)}` : '';
    return `[${this.code}] ${this.message}${detailsStr}`;
  }
}

/**
 * Factory function to create a LibraryError.
 *
 * @param code - Error code from ErrorCodes
 * @param message - Human-readable error message
 * @param details - Optional additional error details
 * @returns A new LibraryError instance
 *
 * @example
 * ```typescript
 * // Simple error
 * const error1 = createError(ErrorCodes.INVALID_DATE, 'Day 32 does not exist');
 *
 * // Error with details
 * const error2 = createError(
 *   ErrorCodes.INVALID_COORDINATES,
 *   'Latitude out of valid range',
 *   { provided: 100, min: -90, max: 90 }
 * );
 * ```
 */
export function createError(
  code: ErrorCode,
  message: string,
  details?: Record<string, unknown>
): LibraryError {
  return new LibraryError(code, message, details);
}

/**
 * Pre-built error factory functions for common error types.
 *
 * @remarks
 * Use these for convenience when creating common errors.
 */
export const Errors = {
  /**
   * Creates an INVALID_COORDINATES error.
   *
   * @param message - Error message
   * @param details - Coordinate details
   */
  invalidCoordinates: (message: string, details?: Record<string, unknown>): LibraryError =>
    createError(ErrorCodes.INVALID_COORDINATES, message, details),

  /**
   * Creates an INVALID_DATE error.
   *
   * @param message - Error message
   * @param details - Date details
   */
  invalidDate: (message: string, details?: Record<string, unknown>): LibraryError =>
    createError(ErrorCodes.INVALID_DATE, message, details),

  /**
   * Creates an INVALID_TIMEZONE error.
   *
   * @param message - Error message
   * @param details - Timezone details
   */
  invalidTimezone: (message: string, details?: Record<string, unknown>): LibraryError =>
    createError(ErrorCodes.INVALID_TIMEZONE, message, details),

  /**
   * Creates a POLAR_DAY_UNRESOLVED error.
   *
   * @param latitude - The problematic latitude
   * @param date - The date when the issue occurred
   */
  polarDayUnresolved: (latitude: number, date?: string): LibraryError =>
    createError(
      ErrorCodes.POLAR_DAY_UNRESOLVED,
      `Cannot calculate prayer times for latitude ${latitude}° without a high latitude rule`,
      { latitude, date, suggestion: 'Specify a highLatitudeRule in params' }
    ),

  /**
   * Creates a PRAYER_TIMES_INCONSISTENT error.
   *
   * @param details - Details about the inconsistency
   */
  prayerTimesInconsistent: (details: Record<string, unknown>): LibraryError =>
    createError(
      ErrorCodes.PRAYER_TIMES_INCONSISTENT,
      'Calculated prayer times are in an invalid order',
      details
    ),

  /**
   * Creates an INHERITANCE_INVALID_ESTATE error.
   *
   * @param message - Error message
   * @param details - Estate details
   */
  invalidEstate: (message: string, details?: Record<string, unknown>): LibraryError =>
    createError(ErrorCodes.INHERITANCE_INVALID_ESTATE, message, details),

  /**
   * Creates an INHERITANCE_INVALID_HEIRS error.
   *
   * @param message - Error message
   * @param details - Heir details
   */
  invalidHeirs: (message: string, details?: Record<string, unknown>): LibraryError =>
    createError(ErrorCodes.INHERITANCE_INVALID_HEIRS, message, details),

  /**
   * Creates an INTERNAL_ERROR.
   *
   * @param message - Error message
   * @param details - Additional context
   */
  internal: (message: string, details?: Record<string, unknown>): LibraryError =>
    createError(ErrorCodes.INTERNAL_ERROR, message, details),

  /**
   * Creates a MISSING_PARAMETER error.
   *
   * @param paramName - Name of the missing parameter
   */
  missingParameter: (paramName: string): LibraryError =>
    createError(ErrorCodes.MISSING_PARAMETER, `Required parameter '${paramName}' is missing`, {
      parameter: paramName,
    }),
} as const;
