/**
 * @fileoverview Timezone utilities for converting Date objects
 * @module core/utils/timezone
 *
 * This module provides utilities for handling both IANA timezone names
 * (e.g., "Asia/Jakarta") and UTC offsets (e.g., 7 for UTC+7).
 */

import type { Timezone } from '../types';

/**
 * Result of converting a Date to local time.
 */
export interface LocalTime {
  /**
   * Hours in 24-hour format (0-23).
   */
  readonly hour: number;

  /**
   * Minutes (0-59).
   */
  readonly minute: number;

  /**
   * Seconds (0-59).
   */
  readonly second: number;

  /**
   * Total time as fractional hours (for comparison with prayer times).
   */
  readonly fractionalHours: number;
}

/**
 * Checks if a timezone string is a valid IANA timezone name.
 *
 * @param tz - Timezone string to check
 * @returns True if valid IANA timezone name
 *
 * @example
 * ```typescript
 * isIanaTimezone('Asia/Jakarta');  // true
 * isIanaTimezone('Invalid/Zone');  // false
 * ```
 */
export function isIanaTimezone(tz: string): boolean {
  try {
    Intl.DateTimeFormat(undefined, { timeZone: tz });
    return true;
  } catch {
    return false;
  }
}

/**
 * Converts a JavaScript Date to local time in the specified timezone.
 *
 * @param date - JavaScript Date object
 * @param timezone - IANA timezone name or UTC offset in hours
 * @returns Local time components and fractional hours
 *
 * @example
 * ```typescript
 * // Using IANA timezone
 * const local = dateToLocalTime(new Date(), 'Asia/Jakarta');
 * console.log(local.hour, local.minute); // e.g., 17, 15
 *
 * // Using UTC offset
 * const local2 = dateToLocalTime(new Date(), 7); // UTC+7
 * ```
 */
export function dateToLocalTime(date: Date, timezone: Timezone): LocalTime {
  if (typeof timezone === 'string') {
    return dateToLocalTimeIana(date, timezone);
  } else {
    return dateToLocalTimeOffset(date, timezone);
  }
}

/**
 * Converts Date to local time using IANA timezone name.
 */
function dateToLocalTimeIana(date: Date, tz: string): LocalTime {
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: tz,
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    hour12: false,
  });

  const parts = formatter.formatToParts(date);
  const hour = parseInt(parts.find((p) => p.type === 'hour')?.value ?? '0', 10);
  const minute = parseInt(parts.find((p) => p.type === 'minute')?.value ?? '0', 10);
  const second = parseInt(parts.find((p) => p.type === 'second')?.value ?? '0', 10);

  // Handle midnight edge case (Intl outputs 24 for midnight in some locales)
  const normalizedHour = hour === 24 ? 0 : hour;

  const fractionalHours = normalizedHour + minute / 60 + second / 3600;

  return { hour: normalizedHour, minute, second, fractionalHours };
}

/**
 * Converts Date to local time using UTC offset.
 */
function dateToLocalTimeOffset(date: Date, offsetHours: number): LocalTime {
  // Get UTC time
  const utcHours = date.getUTCHours();
  const utcMinutes = date.getUTCMinutes();
  const utcSeconds = date.getUTCSeconds();

  // Convert to fractional hours
  const utcFractional = utcHours + utcMinutes / 60 + utcSeconds / 3600;

  // Apply offset and normalize to 0-24
  let localFractional = utcFractional + offsetHours;
  if (localFractional < 0) localFractional += 24;
  if (localFractional >= 24) localFractional -= 24;

  // Extract components
  const hour = Math.floor(localFractional);
  const minuteFraction = (localFractional - hour) * 60;
  const minute = Math.floor(minuteFraction);
  const second = Math.floor((minuteFraction - minute) * 60);

  return { hour, minute, second, fractionalHours: localFractional };
}

/**
 * Gets the UTC offset in hours for a given timezone at a specific date.
 *
 * @param timezone - IANA timezone name or UTC offset
 * @param date - Date to check (for DST handling)
 * @returns UTC offset in hours
 *
 * @example
 * ```typescript
 * getTimezoneOffset('Asia/Jakarta', new Date()); // 7
 * getTimezoneOffset(7, new Date());              // 7
 * ```
 */
export function getTimezoneOffset(timezone: Timezone, date: Date): number {
  if (typeof timezone === 'number') {
    return timezone;
  }

  // For IANA timezone, calculate offset from UTC
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: timezone,
    timeZoneName: 'shortOffset',
  });

  const parts = formatter.formatToParts(date);
  const tzPart = parts.find((p) => p.type === 'timeZoneName')?.value ?? 'GMT';

  // Parse offset like "GMT+7" or "GMT-5" or "GMT+5:30"
  const match = tzPart.match(/GMT([+-]?)(\d{1,2})(?::(\d{2}))?/);
  if (!match) return 0;

  const sign = match[1] === '-' ? -1 : 1;
  const hours = parseInt(match[2], 10);
  const minutes = parseInt(match[3] ?? '0', 10);

  return sign * (hours + minutes / 60);
}
