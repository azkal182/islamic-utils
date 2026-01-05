/**
 * @fileoverview Prayer Times type definitions
 * @module prayer-times/types
 *
 * This module defines all types used for prayer time calculations including
 * prayer names, calculation methods, input parameters, and output formats.
 *
 * @remarks
 * The Prayer Times module calculates 8 daily prayer times:
 * - Imsak (beginning of fasting time)
 * - Fajr (dawn prayer)
 * - Sunrise
 * - Dhuha (forenoon prayer)
 * - Dhuhr (noon prayer)
 * - Asr (afternoon prayer)
 * - Maghrib (sunset prayer)
 * - Isha (night prayer)
 *
 * @example
 * ```typescript
 * import { PrayerName, AsrMadhhab, CALCULATION_METHODS } from 'islamic-utils';
 *
 * const params: PrayerCalculationParams = {
 *   method: CALCULATION_METHODS.KEMENAG,
 *   asrMadhhab: AsrMadhhab.STANDARD,
 * };
 * ```
 */

import type { Coordinates } from '../core/types/coordinates';
import type { DateOnly, Timezone } from '../core/types/date';
import type { TraceStep } from '../core/types/result';

// ═══════════════════════════════════════════════════════════════════════════
// Prayer Names
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Names of the prayer times calculated by this module.
 *
 * @remarks
 * The order of these values represents the chronological order
 * of prayer times in a day.
 */
export const PrayerName = {
  /** Time to stop eating before Fajr (beginning of fasting) */
  IMSAK: 'imsak',
  /** Dawn prayer time */
  FAJR: 'fajr',
  /** Sunrise time (Isyraq) */
  SUNRISE: 'sunrise',
  /** Start of Dhuha prayer time */
  DHUHA_START: 'dhuha_start',
  /** End of Dhuha prayer time (before solar noon) */
  DHUHA_END: 'dhuha_end',
  /** Noon prayer time */
  DHUHR: 'dhuhr',
  /** Afternoon prayer time */
  ASR: 'asr',
  /** Sunset prayer time */
  MAGHRIB: 'maghrib',
  /** Night prayer time */
  ISHA: 'isha',
} as const;

/**
 * Prayer name type.
 */
export type PrayerName = (typeof PrayerName)[keyof typeof PrayerName];

/**
 * Array of all prayer names in chronological order.
 */
export const PRAYER_NAMES_ORDERED: readonly PrayerName[] = [
  PrayerName.IMSAK,
  PrayerName.FAJR,
  PrayerName.SUNRISE,
  PrayerName.DHUHA_START,
  PrayerName.DHUHA_END,
  PrayerName.DHUHR,
  PrayerName.ASR,
  PrayerName.MAGHRIB,
  PrayerName.ISHA,
] as const;

// ═══════════════════════════════════════════════════════════════════════════
// Asr Calculation Madhhab
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Madhhab (school of thought) for Asr prayer calculation.
 *
 * @remarks
 * The difference is in when Asr begins based on shadow length:
 * - Standard (Shafi'i, Maliki, Hanbali): shadow = 1x object length + noon shadow
 * - Hanafi: shadow = 2x object length + noon shadow
 */
export const AsrMadhhab = {
  /**
   * Shafi'i, Maliki, and Hanbali calculation.
   * Asr begins when shadow equals object length plus noon shadow.
   */
  STANDARD: 'standard',

  /**
   * Hanafi calculation.
   * Asr begins when shadow equals 2x object length plus noon shadow.
   */
  HANAFI: 'hanafi',
} as const;

/**
 * Asr madhhab type.
 */
export type AsrMadhhab = (typeof AsrMadhhab)[keyof typeof AsrMadhhab];

/**
 * Gets the shadow factor for Asr calculation.
 *
 * @param madhhab - The Asr madhhab
 * @returns Shadow factor (1 for standard, 2 for Hanafi)
 */
export function getAsrShadowFactor(madhhab: AsrMadhhab): 1 | 2 {
  return madhhab === AsrMadhhab.HANAFI ? 2 : 1;
}

// ═══════════════════════════════════════════════════════════════════════════
// High Latitude Rules
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Rules for calculating Fajr and Isha at high latitudes.
 *
 * @remarks
 * At high latitudes (above ~48.5°), the sun may not descend far enough
 * below the horizon for Fajr or Isha angles to be reached.
 *
 * These rules provide alternatives for such situations.
 */
export const HighLatitudeRule = {
  /**
   * No adjustment - return null if time cannot be calculated.
   * Use this only if you have a specific fallback strategy.
   */
  NONE: 'none',

  /**
   * Middle of Night method.
   * - Fajr = Sunset + 1/2 night duration
   * - Isha = Sunset + 1/2 night duration (from the other end)
   */
  MIDDLE_OF_NIGHT: 'middle_of_night',

  /**
   * One-Seventh of Night method.
   * - Fajr = Sunrise - 1/7 night duration
   * - Isha = Sunset + 6/7 night duration
   */
  ONE_SEVENTH: 'one_seventh',

  /**
   * Angle-based method.
   * Time is proportional to the angle relative to the duration
   * from sunset to midnight.
   */
  ANGLE_BASED: 'angle_based',
} as const;

/**
 * High latitude rule type.
 */
export type HighLatitudeRule = (typeof HighLatitudeRule)[keyof typeof HighLatitudeRule];

// ═══════════════════════════════════════════════════════════════════════════
// Rounding Rules
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Rounding rules for prayer times.
 *
 * @remarks
 * Prayer times are typically displayed to the minute.
 * This setting controls how fractional minutes are handled.
 */
export const PrayerRoundingRule = {
  /** No rounding - keep full precision */
  NONE: 'none',

  /** Round to nearest minute */
  NEAREST: 'nearest',

  /** Always round up (ceiling) */
  CEIL: 'ceil',

  /** Always round down (floor) */
  FLOOR: 'floor',
} as const;

/**
 * Rounding rule type.
 */
export type PrayerRoundingRule = (typeof PrayerRoundingRule)[keyof typeof PrayerRoundingRule];

// ═══════════════════════════════════════════════════════════════════════════
// Imsak Rules
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Rule for calculating Imsak (beginning of fasting time).
 *
 * @remarks
 * Imsak is typically a few minutes before Fajr to provide a
 * safety margin for those who are fasting.
 */
export interface ImsakRule {
  /**
   * Type of Imsak calculation.
   * - 'minutes_before_fajr': Fixed minutes before Fajr (most common)
   * - 'angle_based': Based on sun angle (similar to Fajr)
   */
  readonly type: 'minutes_before_fajr' | 'angle_based';

  /**
   * Value for the calculation.
   * - For 'minutes_before_fajr': number of minutes (typically 10)
   * - For 'angle_based': sun angle in degrees (typically 19-20)
   */
  readonly value: number;
}

/**
 * Default Imsak rule: 10 minutes before Fajr.
 */
export const DEFAULT_IMSAK_RULE: ImsakRule = {
  type: 'minutes_before_fajr',
  value: 10,
} as const;

// ═══════════════════════════════════════════════════════════════════════════
// Dhuha Rules
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Rule for calculating Dhuha prayer time window.
 *
 * @remarks
 * Dhuha is a voluntary prayer performed after sunrise
 * and before the sun reaches its zenith (solar noon).
 */
export interface DhuhaRule {
  /**
   * Rule for calculating Dhuha start time.
   */
  readonly start: {
    /**
     * Type of calculation.
     * - 'minutes_after_sunrise': Fixed minutes after sunrise
     * - 'sun_altitude': When sun reaches specific altitude above horizon
     */
    readonly type: 'minutes_after_sunrise' | 'sun_altitude';

    /**
     * Value for the calculation.
     * - For 'minutes_after_sunrise': number of minutes (typically 15-20)
     * - For 'sun_altitude': altitude in degrees (typically 4.5-12)
     */
    readonly value: number;
  };

  /**
   * Rule for calculating Dhuha end time.
   */
  readonly end: {
    /**
     * Type of calculation.
     * Currently only supports minutes before Dhuhr.
     */
    readonly type: 'minutes_before_dhuhr';

    /**
     * Minutes before Dhuhr when Dhuha ends.
     * Default: 0 (Dhuha ends exactly at solar noon)
     */
    readonly value: number;
  };
}

/**
 * Default Dhuha rule: 15 minutes after sunrise, ends 1 minute before Dhuhr.
 */
export const DEFAULT_DHUHA_RULE: DhuhaRule = {
  start: {
    type: 'minutes_after_sunrise',
    value: 15,
  },
  end: {
    type: 'minutes_before_dhuhr',
    value: 1, // End 1 minute before Dhuhr to ensure proper ordering
  },
} as const;

// ═══════════════════════════════════════════════════════════════════════════
// Calculation Method
// ═══════════════════════════════════════════════════════════════════════════

/**
 * A calculation method defines the angles/intervals used for Fajr and Isha.
 *
 * @remarks
 * Different Islamic organizations and regions use different conventions
 * for determining when Fajr and Isha occur. This interface allows
 * specifying these conventions.
 */
export interface CalculationMethod {
  /**
   * Display name of the method.
   */
  readonly name: string;

  /**
   * Angle below horizon for Fajr.
   *
   * @remarks
   * Fajr begins when the sun is this many degrees below the horizon.
   * Values typically range from 15° to 20°.
   */
  readonly fajrAngle: number;

  /**
   * Angle below horizon for Isha.
   *
   * @remarks
   * Isha begins when the sun is this many degrees below the horizon.
   * Values typically range from 15° to 18°.
   *
   * If undefined, `ishaIntervalMinutes` must be specified.
   */
  readonly ishaAngle?: number;

  /**
   * Fixed interval in minutes after Maghrib for Isha.
   *
   * @remarks
   * Some methods (e.g., Makkah) use a fixed time after Maghrib
   * instead of an angle. Typically 90 minutes.
   *
   * If specified, takes precedence over `ishaAngle`.
   */
  readonly ishaIntervalMinutes?: number;

  /**
   * Optional custom Maghrib angle.
   *
   * @remarks
   * Most methods use 0° (sun at horizon), but some use a
   * slightly different angle. If undefined, uses default (-0.833°).
   */
  readonly maghribAngle?: number;

  /**
   * Optional description of the method.
   */
  readonly description?: string;

  /**
   * Regions where this method is commonly used.
   */
  readonly regions?: readonly string[];
}

// ═══════════════════════════════════════════════════════════════════════════
// Input Parameters
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Adjustments to apply to individual prayer times.
 *
 * @remarks
 * Values are in minutes. Positive values delay the prayer time,
 * negative values make it earlier.
 */
export type PrayerAdjustments = Partial<Record<PrayerName, number>>;

/**
 * Safety buffer (ihtiyath) configuration.
 *
 * @remarks
 * Safety buffer is added to prayer times as a precaution.
 * Can be a single value applied to all prayers or per-prayer values.
 */
export type SafetyBuffer = number | Partial<Record<PrayerName, number>>;

/**
 * Parameters for prayer time calculation.
 *
 * @remarks
 * These parameters control how prayer times are calculated.
 * Only `method` is required; all others have sensible defaults.
 */
export interface PrayerCalculationParams {
  /**
   * The calculation method to use.
   *
   * @remarks
   * Use one of the built-in methods from `CALCULATION_METHODS`
   * or define a custom method.
   */
  readonly method: CalculationMethod;

  /**
   * Madhhab for Asr calculation.
   *
   * @remarks
   * Defaults to STANDARD (Shafi'i shadow factor of 1).
   */
  readonly asrMadhhab?: AsrMadhhab;

  /**
   * Rule for high latitude locations.
   *
   * @remarks
   * Applied when Fajr or Isha cannot be calculated
   * due to the sun not reaching the required angle.
   *
   * Defaults to MIDDLE_OF_NIGHT.
   */
  readonly highLatitudeRule?: HighLatitudeRule;

  /**
   * Rule for calculating Imsak.
   *
   * @remarks
   * Defaults to 10 minutes before Fajr.
   */
  readonly imsakRule?: ImsakRule;

  /**
   * Rule for calculating Dhuha time window.
   *
   * @remarks
   * Defaults to 15 minutes after sunrise, ending at Dhuhr.
   */
  readonly dhuhaRule?: DhuhaRule;

  /**
   * Rounding rule for final times.
   *
   * @remarks
   * Defaults to NEAREST (round to nearest minute).
   */
  readonly roundingRule?: PrayerRoundingRule;

  /**
   * Manual adjustments in minutes for each prayer.
   *
   * @remarks
   * Applied after all calculations but before rounding.
   */
  readonly adjustments?: PrayerAdjustments;

  /**
   * Safety buffer (ihtiyath) in minutes.
   *
   * @remarks
   * Applied after adjustments, before rounding.
   * Can be a single value or per-prayer configuration.
   */
  readonly safetyBuffer?: SafetyBuffer;
}

// ═══════════════════════════════════════════════════════════════════════════
// Prayer Times Output
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Calculated prayer times for a single day.
 *
 * @remarks
 * Times are in fractional hours (0-24).
 * A null value indicates the time could not be calculated
 * (e.g., polar regions without high latitude rule).
 */
export type PrayerTimes = Record<PrayerName, number | null>;

/**
 * Prayer times as formatted time strings.
 */
export type PrayerTimeStrings = Record<PrayerName, string | null>;

/**
 * Metadata about the calculation.
 */
export interface PrayerTimesMeta {
  /**
   * The coordinates used for calculation.
   */
  readonly coordinates: Coordinates;

  /**
   * The date for which times were calculated.
   */
  readonly date: DateOnly;

  /**
   * The timezone used for calculation.
   */
  readonly timezone: Timezone;

  /**
   * The calculation method used.
   */
  readonly method: CalculationMethod;

  /**
   * Full parameters used (including defaults).
   */
  readonly params: Required<PrayerCalculationParams>;

  /**
   * Whether high latitude rules were applied.
   */
  readonly highLatitudeAdjusted: boolean;

  /**
   * Which prayer times needed high latitude adjustment.
   */
  readonly adjustedPrayers?: PrayerName[];
}

/**
 * Complete result of prayer time calculation.
 *
 * @remarks
 * Contains the calculated times, metadata, and optional trace.
 */
export interface PrayerTimesResult {
  /**
   * Calculated prayer times in fractional hours.
   */
  readonly times: PrayerTimes;

  /**
   * Formatted time strings (HH:MM format).
   */
  readonly formatted: PrayerTimeStrings;

  /**
   * Metadata about the calculation.
   */
  readonly meta: PrayerTimesMeta;

  /**
   * Optional trace of calculation steps.
   *
   * @remarks
   * Only included if `includeTrace: true` was specified.
   */
  readonly trace?: TraceStep[];
}

// ═══════════════════════════════════════════════════════════════════════════
// Input Types
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Location input for prayer time calculation.
 *
 * @remarks
 * A simple object with latitude and longitude is sufficient.
 * Altitude is optional and used for more precise sunrise/sunset.
 */
export interface LocationInput {
  /**
   * Latitude in degrees (-90 to 90, positive = North).
   */
  readonly latitude: number;

  /**
   * Longitude in degrees (-180 to 180, positive = East).
   */
  readonly longitude: number;

  /**
   * Optional altitude in meters above sea level.
   */
  readonly altitude?: number;
}

/**
 * Time context for prayer time calculation.
 */
export interface TimeContext {
  /**
   * The date for which to calculate prayer times.
   */
  readonly date: DateOnly;

  /**
   * The timezone (IANA name or UTC offset in hours).
   */
  readonly timezone: Timezone;
}

/**
 * Options for the calculator.
 */
export interface CalculatorOptions {
  /**
   * Whether to include a trace of calculation steps.
   *
   * @remarks
   * Useful for debugging and verification.
   * Defaults to false for performance.
   */
  readonly includeTrace?: boolean;
}
