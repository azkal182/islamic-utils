/**
 * @fileoverview Error code constants for the library
 * @module core/errors/codes
 *
 * This module defines all error codes used throughout the library.
 * Error codes are organized by module/category for easy reference.
 *
 * @remarks
 * Error codes follow the pattern: MODULE_ERROR_TYPE
 * - INVALID_* - Validation errors
 * - *_UNRESOLVED - Calculation errors that couldn't complete
 * - *_INCONSISTENT - Logic/consistency errors
 *
 * @example
 * ```typescript
 * import { ErrorCodes } from 'islamic-utils';
 *
 * if (result.error.code === ErrorCodes.INVALID_COORDINATES) {
 *   console.log('Please check latitude and longitude values');
 * }
 * ```
 */

/**
 * All error codes used by the library.
 *
 * @remarks
 * Use these constants instead of string literals to avoid typos
 * and enable IDE autocompletion.
 */
export const ErrorCodes = {
  // ───────────────────────────────────────────────────────────────
  // Validation Errors (shared across modules)
  // ───────────────────────────────────────────────────────────────

  /**
   * Coordinates are invalid (latitude/longitude out of range).
   *
   * @remarks
   * - Latitude must be between -90 and +90
   * - Longitude must be between -180 and +180
   * - Altitude must be >= 0 if provided
   */
  INVALID_COORDINATES: 'INVALID_COORDINATES',

  /**
   * Date is invalid or doesn't exist.
   *
   * @remarks
   * Examples: February 30, month 13, day 0, etc.
   */
  INVALID_DATE: 'INVALID_DATE',

  /**
   * Timezone is invalid or unrecognized.
   *
   * @remarks
   * - UTC offset must be between -12 and +14
   * - IANA timezone name must be valid
   */
  INVALID_TIMEZONE: 'INVALID_TIMEZONE',

  // ───────────────────────────────────────────────────────────────
  // Prayer Times Errors (Module A)
  // ───────────────────────────────────────────────────────────────

  /**
   * High latitude location where Fajr/Isha cannot be calculated
   * and no high latitude rule was specified.
   *
   * @remarks
   * Occurs when:
   * - Location is above ~48.5° latitude in summer
   * - Sun doesn't reach required angles for Fajr/Isha
   * - highLatitudeRule is set to 'NONE'
   *
   * Solution: Use a high latitude rule (MIDDLE_OF_NIGHT, ONE_SEVENTH, etc.)
   */
  POLAR_DAY_UNRESOLVED: 'POLAR_DAY_UNRESOLVED',

  /**
   * Calculated prayer times are in an inconsistent order.
   *
   * @remarks
   * Expected order: imsak < fajr < sunrise < dhuha_start < dhuhr < asr < maghrib < isha
   *
   * This usually indicates a bug or extreme edge case.
   * Check adjustments and safety buffers for conflicts.
   */
  PRAYER_TIMES_INCONSISTENT: 'PRAYER_TIMES_INCONSISTENT',

  /**
   * The specified calculation method is not recognized.
   */
  INVALID_CALCULATION_METHOD: 'INVALID_CALCULATION_METHOD',

  /**
   * Invalid adjustment value provided.
   */
  INVALID_ADJUSTMENT: 'INVALID_ADJUSTMENT',

  // ───────────────────────────────────────────────────────────────
  // Qibla Errors (Module B)
  // ───────────────────────────────────────────────────────────────

  /**
   * User is at or very close to the Ka'bah.
   *
   * @remarks
   * When the user is at the Ka'bah itself, any direction is valid.
   * This is technically not an error but a special case.
   */
  QIBLA_AT_KAABA: 'QIBLA_AT_KAABA',

  // ───────────────────────────────────────────────────────────────
  // Inheritance Errors (Module C)
  // ───────────────────────────────────────────────────────────────

  /**
   * Estate values are invalid.
   *
   * @remarks
   * - Estate value must be positive
   * - Debts cannot exceed estate
   * - Funeral costs cannot exceed estate
   * - Wasiyyah cannot exceed 1/3 of estate (after debts and funeral)
   */
  INHERITANCE_INVALID_ESTATE: 'INHERITANCE_INVALID_ESTATE',

  /**
   * Heir information is invalid.
   *
   * @remarks
   * - Unknown heir type
   * - Invalid count (must be positive integer)
   * - Conflicting heirs (e.g., husband AND wife)
   */
  INHERITANCE_INVALID_HEIRS: 'INHERITANCE_INVALID_HEIRS',

  /**
   * No heirs provided for inheritance calculation.
   */
  INHERITANCE_NO_HEIRS: 'INHERITANCE_NO_HEIRS',

  /**
   * Total distribution doesn't match net estate.
   *
   * @remarks
   * This is an internal consistency error and should not occur.
   * If it does, please report it as a bug.
   */
  INHERITANCE_DISTRIBUTION_MISMATCH: 'INHERITANCE_DISTRIBUTION_MISMATCH',

  // ───────────────────────────────────────────────────────────────
  // General Errors
  // ───────────────────────────────────────────────────────────────

  /**
   * An unexpected internal error occurred.
   *
   * @remarks
   * This indicates a bug in the library. Please report it.
   */
  INTERNAL_ERROR: 'INTERNAL_ERROR',

  /**
   * A required parameter is missing.
   */
  MISSING_PARAMETER: 'MISSING_PARAMETER',

  /**
   * A value falls outside the supported range for the current context.
   */
  OUT_OF_SUPPORTED_RANGE: 'OUT_OF_SUPPORTED_RANGE',

  /**
   * A parameter has an invalid type.
   */
  INVALID_PARAMETER_TYPE: 'INVALID_PARAMETER_TYPE',

  /**
   * The requested method is not supported by the active module.
   */
  METHOD_NOT_SUPPORTED: 'METHOD_NOT_SUPPORTED',
} as const;

/**
 * Type representing all valid error codes.
 *
 * @example
 * ```typescript
 * function handleError(code: ErrorCode) {
 *   switch (code) {
 *     case ErrorCodes.INVALID_COORDINATES:
 *       // handle coordinates error
 *       break;
 *     // ... other cases
 *   }
 * }
 * ```
 */
export type ErrorCode = (typeof ErrorCodes)[keyof typeof ErrorCodes];

/**
 * Checks if a string is a valid error code.
 *
 * @param code - The string to check
 * @returns True if the string is a valid ErrorCode
 */
export function isValidErrorCode(code: string): code is ErrorCode {
  return Object.values(ErrorCodes).includes(code as ErrorCode);
}
