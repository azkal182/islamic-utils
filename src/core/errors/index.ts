/**
 * @fileoverview Re-exports all error-related types and utilities
 * @module core/errors
 *
 * This module serves as the public API for error handling.
 *
 * @example
 * ```typescript
 * import { ErrorCodes, createError, LibraryError, Errors } from 'islamic-utils';
 *
 * // Using error code constants
 * if (error.code === ErrorCodes.INVALID_COORDINATES) { ... }
 *
 * // Creating custom errors
 * const error = createError(ErrorCodes.INVALID_DATE, 'Invalid date');
 *
 * // Using pre-built error factories
 * const error = Errors.invalidCoordinates('Latitude out of range', { latitude: 100 });
 * ```
 */

// Error codes
export { ErrorCodes, isValidErrorCode } from './codes';
export type { ErrorCode } from './codes';

// Error class and utilities
export { LibraryError, createError, Errors } from './error';
