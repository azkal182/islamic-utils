/**
 * @fileoverview Timezone validation functions
 * @module core/validators/timezone
 *
 * This module provides validation functions for timezone values.
 * Timezones can be specified as IANA names or UTC offsets.
 */

import type { Timezone } from '../types/date';
import type { Result } from '../types/result';
import { success, failure } from '../types/result';
import { Errors } from '../errors';

/**
 * Valid UTC offset range.
 *
 * @remarks
 * UTC offsets range from -12 (Baker Island) to +14 (Line Islands).
 * Some regions use half-hour or 45-minute offsets (e.g., Nepal, India).
 */
export const UTC_OFFSET_RANGE = {
  MIN: -12,
  MAX: 14,
} as const;

/**
 * Common timezone offset increments (in hours).
 *
 * @remarks
 * Most timezones use hour increments, but some use:
 * - 30 minutes: India (UTC+5:30), Iran (UTC+3:30)
 * - 45 minutes: Nepal (UTC+5:45), Chatham Islands (UTC+12:45)
 */
export const VALID_OFFSET_INCREMENTS = [0, 0.25, 0.5, 0.75] as const;

/**
 * List of commonly used IANA timezone names.
 *
 * @remarks
 * This is not exhaustive. The full validation uses Intl.DateTimeFormat.
 */
export const COMMON_TIMEZONES = [
  'UTC',
  'Asia/Jakarta',
  'Asia/Makassar',
  'Asia/Jayapura',
  'Asia/Singapore',
  'Asia/Kuala_Lumpur',
  'Asia/Tokyo',
  'Asia/Seoul',
  'Asia/Shanghai',
  'Asia/Hong_Kong',
  'Asia/Dubai',
  'Asia/Riyadh',
  'Asia/Karachi',
  'Asia/Kolkata',
  'Asia/Dhaka',
  'Europe/London',
  'Europe/Paris',
  'Europe/Berlin',
  'Europe/Moscow',
  'Europe/Istanbul',
  'America/New_York',
  'America/Chicago',
  'America/Los_Angeles',
  'America/Sao_Paulo',
  'Australia/Sydney',
  'Australia/Melbourne',
  'Africa/Cairo',
  'Africa/Johannesburg',
] as const;

/**
 * Validates a timezone value.
 *
 * @param timezone - The timezone to validate (IANA name or UTC offset)
 * @returns Success with validated timezone, or failure with error details
 *
 * @remarks
 * Accepts two formats:
 * 1. IANA timezone name (string): "Asia/Jakarta", "America/New_York"
 * 2. UTC offset (number): 7 (UTC+7), -5 (UTC-5), 5.5 (UTC+5:30)
 *
 * @example
 * ```typescript
 * // IANA timezone name
 * validateTimezone('Asia/Jakarta');  // success
 * validateTimezone('Invalid/Zone');  // failure
 *
 * // UTC offset
 * validateTimezone(7);    // success (UTC+7)
 * validateTimezone(-5);   // success (UTC-5)
 * validateTimezone(5.5);  // success (UTC+5:30)
 * validateTimezone(20);   // failure (out of range)
 * ```
 */
export function validateTimezone(timezone: Timezone): Result<Timezone> {
  // Handle numeric offset
  if (typeof timezone === 'number') {
    return validateUtcOffset(timezone);
  }

  // Handle string timezone name
  if (typeof timezone === 'string') {
    return validateIanaTimezone(timezone);
  }

  // Invalid type
  return failure(
    Errors.invalidTimezone('Timezone must be a string (IANA name) or number (UTC offset)', {
      provided: timezone,
      type: typeof timezone,
    })
  );
}

/**
 * Validates a UTC offset.
 *
 * @param offset - The UTC offset in hours
 * @returns Success with validated offset, or failure with error details
 *
 * @example
 * ```typescript
 * validateUtcOffset(7);     // success
 * validateUtcOffset(-5);    // success
 * validateUtcOffset(5.5);   // success (UTC+5:30)
 * validateUtcOffset(5.75);  // success (UTC+5:45)
 * validateUtcOffset(20);    // failure
 * ```
 */
export function validateUtcOffset(offset: number): Result<number> {
  // Check if it's a finite number
  if (!Number.isFinite(offset)) {
    return failure(
      Errors.invalidTimezone('UTC offset must be a finite number', {
        provided: offset,
      })
    );
  }

  // Check range
  if (offset < UTC_OFFSET_RANGE.MIN || offset > UTC_OFFSET_RANGE.MAX) {
    return failure(
      Errors.invalidTimezone(
        `UTC offset must be between ${UTC_OFFSET_RANGE.MIN} and ${UTC_OFFSET_RANGE.MAX}`,
        {
          provided: offset,
          min: UTC_OFFSET_RANGE.MIN,
          max: UTC_OFFSET_RANGE.MAX,
        }
      )
    );
  }

  // Check for valid increment (0, 0.25, 0.5, 0.75)
  const fractionalPart = Math.abs(offset) % 1;
  const isValidIncrement = VALID_OFFSET_INCREMENTS.includes(
    fractionalPart as (typeof VALID_OFFSET_INCREMENTS)[number]
  );

  if (!isValidIncrement) {
    return failure(
      Errors.invalidTimezone('UTC offset must be in increments of 15 minutes (0.25 hours)', {
        provided: offset,
        fractionalPart,
        validIncrements: VALID_OFFSET_INCREMENTS,
      })
    );
  }

  return success(offset);
}

/**
 * Validates an IANA timezone name.
 *
 * @param name - The IANA timezone name
 * @returns Success with validated name, or failure with error details
 *
 * @remarks
 * Uses Intl.DateTimeFormat to validate the timezone name.
 * This is the most reliable cross-platform validation method.
 *
 * @example
 * ```typescript
 * validateIanaTimezone('Asia/Jakarta');  // success
 * validateIanaTimezone('UTC');           // success
 * validateIanaTimezone('Invalid/Zone');  // failure
 * ```
 */
export function validateIanaTimezone(name: string): Result<string> {
  // Empty string check
  if (!name || name.trim() === '') {
    return failure(
      Errors.invalidTimezone('Timezone name cannot be empty', {
        provided: name,
      })
    );
  }

  // Try to create a DateTimeFormat with the timezone
  // This throws if the timezone is invalid
  try {
    Intl.DateTimeFormat('en-US', { timeZone: name });
    return success(name);
  } catch {
    return failure(
      Errors.invalidTimezone(`Unknown timezone: ${name}`, {
        provided: name,
        suggestion: 'Use a valid IANA timezone name like "Asia/Jakarta" or "America/New_York"',
      })
    );
  }
}

/**
 * Converts a timezone to its UTC offset for a given date.
 *
 * @param timezone - The timezone (IANA name or offset)
 * @param date - The date to get the offset for (needed for DST)
 * @returns UTC offset in hours
 *
 * @remarks
 * For IANA timezones, the offset may vary due to DST.
 * For numeric offsets, the value is returned as-is.
 *
 * @example
 * ```typescript
 * // Numeric offset - returns as-is
 * getUtcOffset(7, date);  // 7
 *
 * // IANA timezone - calculates offset
 * getUtcOffset('America/New_York', new Date('2024-07-01'));  // -4 (EDT)
 * getUtcOffset('America/New_York', new Date('2024-01-01'));  // -5 (EST)
 * ```
 */
export function getUtcOffset(timezone: Timezone, date: Date = new Date()): number {
  // If it's already a number, return it
  if (typeof timezone === 'number') {
    return timezone;
  }

  // For IANA names, calculate the offset
  try {
    // Get the timezone offset using Intl
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      timeZoneName: 'shortOffset',
    });

    const parts = formatter.formatToParts(date);
    const tzPart = parts.find((p) => p.type === 'timeZoneName');

    if (tzPart) {
      // Parse offset like "GMT+7" or "GMT-5:30"
      const match = tzPart.value.match(/GMT([+-])(\d{1,2})(?::(\d{2}))?/);
      if (match) {
        const sign = match[1] === '+' ? 1 : -1;
        const hours = parseInt(match[2] ?? '0', 10);
        const minutes = parseInt(match[3] ?? '0', 10);
        return sign * (hours + minutes / 60);
      }
    }

    // Fallback: calculate offset from Date
    const utcDate = new Date(date.toLocaleString('en-US', { timeZone: 'UTC' }));
    const tzDate = new Date(date.toLocaleString('en-US', { timeZone: timezone }));
    return (tzDate.getTime() - utcDate.getTime()) / (1000 * 60 * 60);
  } catch {
    // If all else fails, assume UTC
    return 0;
  }
}

/**
 * Formats a UTC offset as a string.
 *
 * @param offset - The UTC offset in hours
 * @returns Formatted string like "UTC+7" or "UTC-5:30"
 *
 * @example
 * ```typescript
 * formatUtcOffset(7);     // "UTC+7"
 * formatUtcOffset(-5);    // "UTC-5"
 * formatUtcOffset(5.5);   // "UTC+5:30"
 * formatUtcOffset(-9.75); // "UTC-9:45"
 * ```
 */
export function formatUtcOffset(offset: number): string {
  const sign = offset >= 0 ? '+' : '-';
  const absOffset = Math.abs(offset);
  const hours = Math.floor(absOffset);
  const minutes = Math.round((absOffset - hours) * 60);

  if (minutes === 0) {
    return `UTC${sign}${hours}`;
  }

  const minuteStr = minutes.toString().padStart(2, '0');
  return `UTC${sign}${hours}:${minuteStr}`;
}
