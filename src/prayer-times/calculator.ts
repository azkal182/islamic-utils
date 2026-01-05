/**
 * @fileoverview Main Prayer Times Calculator
 * @module prayer-times/calculator
 *
 * This module provides the main `computePrayerTimes` function that
 * calculates all 8 prayer times for a given location, date, and parameters.
 */

import type { Result, TraceStep } from '../core/types/result';
import { success, failure } from '../core/types/result';
import { validateCoordinates } from '../core/validators/coordinates';
import { validateDate } from '../core/validators/date';
import { validateTimezone, getUtcOffset } from '../core/validators/timezone';
import { formatTime } from '../astronomy/time';

import type {
  LocationInput,
  TimeContext,
  PrayerCalculationParams,
  CalculatorOptions,
  PrayerTimesResult,
  PrayerTimes,
  PrayerTimeStrings,
  PrayerTimesMeta,
  PrayerName as PrayerNameType,
} from './types';
import {
  PrayerName,
  PRAYER_NAMES_ORDERED,
  AsrMadhhab,
  HighLatitudeRule,
  PrayerRoundingRule,
  DEFAULT_IMSAK_RULE,
  DEFAULT_DHUHA_RULE,
} from './types';
import { calculateCorePrayerTimes, calculateImsak, calculateDhuha } from './calculations';
import { applyHighLatitudeRule, needsHighLatitudeAdjustment } from './high-latitude';
import { applyAllAdjustments } from './adjustments';
import { validatePrayerTimes } from './validation';

// ═══════════════════════════════════════════════════════════════════════════
// Helper Functions
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Fills in default values for calculation parameters.
 */
function getDefaultParams(params: PrayerCalculationParams): Required<PrayerCalculationParams> {
  return {
    method: params.method,
    asrMadhhab: params.asrMadhhab ?? AsrMadhhab.STANDARD,
    highLatitudeRule: params.highLatitudeRule ?? HighLatitudeRule.MIDDLE_OF_NIGHT,
    imsakRule: params.imsakRule ?? DEFAULT_IMSAK_RULE,
    dhuhaRule: params.dhuhaRule ?? DEFAULT_DHUHA_RULE,
    roundingRule: params.roundingRule ?? PrayerRoundingRule.NEAREST,
    adjustments: params.adjustments ?? {},
    safetyBuffer: params.safetyBuffer ?? 0,
  };
}

/**
 * Formats prayer times as strings.
 */
function formatPrayerTimes(times: Partial<PrayerTimes>): PrayerTimeStrings {
  const formatted: Partial<PrayerTimeStrings> = {};

  for (const prayer of PRAYER_NAMES_ORDERED) {
    const time = times[prayer];
    if (time === null || time === undefined) {
      formatted[prayer] = null;
    } else {
      formatted[prayer] = formatTime(time, '24h');
    }
  }

  return formatted as PrayerTimeStrings;
}

/**
 * Creates trace steps for the calculation.
 */
function createTrace(times: Partial<PrayerTimes>, meta: PrayerTimesMeta): TraceStep[] {
  const trace: TraceStep[] = [];

  trace.push({
    step: 1,
    description: 'Input validation passed',
    value: {
      coordinates: meta.coordinates,
      date: meta.date,
      timezone: meta.timezone,
    },
  });

  trace.push({
    step: 2,
    description: `Using calculation method: ${meta.method.name}`,
    value: {
      fajrAngle: meta.method.fajrAngle,
      ishaAngle: meta.method.ishaAngle,
      ishaInterval: meta.method.ishaIntervalMinutes,
    },
  });

  trace.push({
    step: 3,
    description: 'Calculated prayer times',
    value: times,
  });

  if (meta.highLatitudeAdjusted) {
    trace.push({
      step: 4,
      description: `High latitude adjustment applied (${meta.params.highLatitudeRule})`,
      value: {
        adjustedPrayers: meta.adjustedPrayers,
      },
    });
  }

  return trace;
}

// ═══════════════════════════════════════════════════════════════════════════
// Main Calculator
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Computes all prayer times for a given location, date, and parameters.
 *
 * @param location - Geographic location (latitude, longitude, optional altitude)
 * @param timeContext - Date and timezone
 * @param params - Calculation parameters (method, madhhab, rules, adjustments)
 * @param options - Calculator options (includeTrace)
 * @returns Result containing prayer times or error
 *
 * @remarks
 * This is the main entry point for prayer time calculations.
 *
 * **Calculation Flow:**
 * 1. Validate all inputs
 * 2. Calculate solar position for the date
 * 3. Calculate core times (Fajr, Sunrise, Dhuhr, Asr, Maghrib, Isha)
 * 4. Apply high latitude rules if needed
 * 5. Calculate Imsak and Dhuha
 * 6. Apply adjustments and safety buffer
 * 7. Apply rounding
 * 8. Validate time sequence
 * 9. Return formatted result
 *
 * @example
 * ```typescript
 * import { computePrayerTimes, CALCULATION_METHODS } from 'islamic-utils';
 *
 * const result = computePrayerTimes(
 *   { latitude: -6.2088, longitude: 106.8456 },
 *   { date: { year: 2024, month: 1, day: 15 }, timezone: 'Asia/Jakarta' },
 *   { method: CALCULATION_METHODS.KEMENAG }
 * );
 *
 * if (result.success) {
 *   console.log('Fajr:', result.data.formatted.fajr);
 *   console.log('Maghrib:', result.data.formatted.maghrib);
 * }
 * ```
 */
export function computePrayerTimes(
  location: LocationInput,
  timeContext: TimeContext,
  params: PrayerCalculationParams,
  options: CalculatorOptions = {}
): Result<PrayerTimesResult> {
  // ─────────────────────────────────────────────────────────────────────────
  // Step 1: Validate inputs
  // ─────────────────────────────────────────────────────────────────────────

  const coordsResult = validateCoordinates({
    latitude: location.latitude,
    longitude: location.longitude,
    altitude: location.altitude,
  });
  if (!coordsResult.success) {
    return failure(coordsResult.error);
  }
  const coords = coordsResult.data;

  const dateResult = validateDate(timeContext.date);
  if (!dateResult.success) {
    return failure(dateResult.error);
  }
  const date = dateResult.data;

  const tzResult = validateTimezone(timeContext.timezone);
  if (!tzResult.success) {
    return failure(tzResult.error);
  }

  // Get numeric timezone offset
  const timezone = getUtcOffset(timeContext.timezone);

  // Fill in default parameters
  const fullParams = getDefaultParams(params);

  // ─────────────────────────────────────────────────────────────────────────
  // Step 2: Calculate core prayer times
  // ─────────────────────────────────────────────────────────────────────────

  let times = calculateCorePrayerTimes({
    date,
    coords,
    timezone,
    method: fullParams.method,
    asrMadhhab: fullParams.asrMadhhab,
  });

  // Track if high latitude adjustment was applied
  let highLatitudeAdjusted = false;
  let adjustedPrayers: PrayerNameType[] = [];

  // ─────────────────────────────────────────────────────────────────────────
  // Step 3: Apply high latitude rules if needed
  // ─────────────────────────────────────────────────────────────────────────

  if (needsHighLatitudeAdjustment(times) && fullParams.highLatitudeRule !== HighLatitudeRule.NONE) {
    const sunset = times[PrayerName.MAGHRIB];
    const sunrise = times[PrayerName.SUNRISE];

    if (sunset !== null && sunset !== undefined && sunrise !== null && sunrise !== undefined) {
      const hlResult = applyHighLatitudeRule(times, {
        rule: fullParams.highLatitudeRule,
        sunset: sunset,
        sunrise: sunrise,
        method: fullParams.method,
        latitude: coords.latitude,
      });

      times = hlResult.times;
      adjustedPrayers = hlResult.adjustedPrayers;
      highLatitudeAdjusted = adjustedPrayers.length > 0;
    }
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Step 4: Calculate Imsak and Dhuha
  // ─────────────────────────────────────────────────────────────────────────

  const fajrTime = times[PrayerName.FAJR];
  const sunriseTime = times[PrayerName.SUNRISE];
  const dhuhrTime = times[PrayerName.DHUHR] ?? 12;

  // Calculate Imsak
  times[PrayerName.IMSAK] = calculateImsak(
    date,
    coords,
    timezone,
    fajrTime ?? null,
    fullParams.imsakRule
  );

  // Calculate Dhuha
  const dhuha = calculateDhuha(
    date,
    coords,
    timezone,
    sunriseTime ?? null,
    dhuhrTime,
    fullParams.dhuhaRule
  );
  times[PrayerName.DHUHA_START] = dhuha.start;
  times[PrayerName.DHUHA_END] = dhuha.end;

  // ─────────────────────────────────────────────────────────────────────────
  // Step 5: Apply adjustments, safety buffer, and rounding
  // ─────────────────────────────────────────────────────────────────────────

  times = applyAllAdjustments(
    times,
    fullParams.adjustments,
    fullParams.safetyBuffer,
    fullParams.roundingRule
  );

  // ─────────────────────────────────────────────────────────────────────────
  // Step 6: Validate time sequence
  // ─────────────────────────────────────────────────────────────────────────

  const validationResult = validatePrayerTimes(times);
  if (!validationResult.success) {
    return failure(validationResult.error);
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Step 7: Build result
  // ─────────────────────────────────────────────────────────────────────────

  const meta: PrayerTimesMeta = {
    coordinates: coords,
    date,
    timezone: timeContext.timezone,
    method: fullParams.method,
    params: fullParams,
    highLatitudeAdjusted,
    adjustedPrayers: highLatitudeAdjusted ? adjustedPrayers : undefined,
  };

  // Build result with optional trace
  const trace = options.includeTrace ? createTrace(times, meta) : undefined;

  const result: PrayerTimesResult = {
    times: times as PrayerTimes,
    formatted: formatPrayerTimes(times),
    meta,
    trace,
  };

  return success(result);
}
