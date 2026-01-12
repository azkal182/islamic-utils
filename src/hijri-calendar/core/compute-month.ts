/**
 * @fileoverview Monthly calendar generation for Hijri calendar.
 * @module hijri-calendar/core/compute-month
 */

import { failure, success } from '../../core/types/result';
import type { Result, TraceStep } from '../../core/types/result';
import { Errors } from '../../core/errors';
import type {
  GregorianMonthQuery,
  HijriCalendarMonthQuery,
  HijriCalendarOptions,
  HijriDayItem,
  HijriMonthIdentifier,
  HijriMonthMeta,
  HijriMonthResult,
} from '../types';
import { getDaysInMonth, validateDate } from '../../core/validators/date';
import { getMethod } from '../methods';
import { loadHijriAdjustmentsForYear, resolveHijriMonthAdjustments } from '../adjustments';
import { gregorianToJulianDay, julianDayToGregorian } from './conversion';
import {
  createHijriDayItem,
  createTraceStep,
  deriveWeekdayFromGregorian,
  ensureGregorianMonth,
  ensureHijriMonthIdentifier,
  normalizeOptions,
} from './helpers';
import { computeHijriDate } from './compute-date';

function isHijriMonthQuery(query: HijriCalendarMonthQuery): query is { hijri: HijriMonthIdentifier } {
  return typeof (query as { hijri?: unknown }).hijri === 'object' && !!(query as { hijri?: unknown }).hijri;
}

function isGregorianMonthQuery(query: HijriCalendarMonthQuery): query is GregorianMonthQuery {
  return (
    typeof (query as { gregorian?: unknown }).gregorian === 'object' &&
    !!(query as { gregorian?: unknown }).gregorian
  );
}

function buildCalendarGrid(
  days: readonly HijriDayItem[],
  weekStartsOn: number
): ReadonlyArray<ReadonlyArray<HijriDayItem | null>> {
  if (days.length === 0) return [];

  const firstWeekday = days[0]!.weekday;
  const offset = (firstWeekday - weekStartsOn + 7) % 7;

  const grid: Array<Array<HijriDayItem | null>> = [];
  let week: Array<HijriDayItem | null> = [];

  for (let i = 0; i < offset; i++) {
    week.push(null);
  }

  for (const day of days) {
    week.push(day);
    if (week.length === 7) {
      grid.push(week);
      week = [];
    }
  }

  if (week.length > 0) {
    while (week.length < 7) {
      week.push(null);
    }
    grid.push(week);
  }

  return grid;
}

function generateHijriMonthDays(
  methodId: string,
  identifier: HijriMonthIdentifier,
  options: HijriCalendarOptions | undefined
): Result<readonly HijriDayItem[]> {
  const method = getMethod(methodId);
  if (!method) {
    return failure(
      Errors.methodNotSupported('Hijri calculation method is not yet available', {
        method: methodId,
      })
    );
  }

  const optionsResult = normalizeOptions(options);
  if (!optionsResult.success) {
    return failure(optionsResult.error);
  }

  const normalized = optionsResult.data;

  const startGregorian = method.convertHijriToGregorian({
    year: identifier.year,
    month: identifier.month,
    day: 1,
  });
  const length = method.getHijriMonthLength(identifier);

  let shiftedStartGregorian = startGregorian;
  let appliedShift = 0;

  const adjustmentsForYear = loadHijriAdjustmentsForYear(
    normalized.adjustments,
    identifier.year,
    normalized.method
  );

  if (!adjustmentsForYear.success) {
    return failure(adjustmentsForYear.error);
  }

  const resolved = resolveHijriMonthAdjustments(identifier, adjustmentsForYear.data);
  if (resolved.adjustment && resolved.adjustment.shiftDays !== 0) {
    appliedShift = resolved.adjustment.shiftDays;
    const jd = gregorianToJulianDay(startGregorian);
    shiftedStartGregorian = julianDayToGregorian(jd - appliedShift);
  }

  const startValidation = validateDate(shiftedStartGregorian);
  if (!startValidation.success) {
    return failure(startValidation.error);
  }

  const days: HijriDayItem[] = [];

  for (let day = 1; day <= length; day++) {
    const hijri = { year: identifier.year, month: identifier.month, day };
    const gregorian = julianDayToGregorian(gregorianToJulianDay(startValidation.data) + (day - 1));

    const gregorianValidation = validateDate(gregorian);
    if (!gregorianValidation.success) {
      return failure(gregorianValidation.error);
    }

    days.push(
      createHijriDayItem({
        hijri,
        gregorian: gregorianValidation.data,
        weekday: deriveWeekdayFromGregorian(gregorianValidation.data),
        isAdjusted: appliedShift !== 0,
      })
    );
  }

  return success(days);
}

function resolveDominantHijriMonth(days: readonly HijriDayItem[]): HijriMonthIdentifier {
  const counts = new Map<string, { identifier: HijriMonthIdentifier; count: number }>();

  for (const day of days) {
    const key = `${day.hijri.year}-${day.hijri.month}`;
    const existing = counts.get(key);
    if (existing) {
      existing.count += 1;
    } else {
      counts.set(key, { identifier: { year: day.hijri.year, month: day.hijri.month }, count: 1 });
    }
  }

  let best: { identifier: HijriMonthIdentifier; count: number } | undefined;
  for (const entry of counts.values()) {
    if (!best || entry.count > best.count) {
      best = entry;
    }
  }

  return best?.identifier ?? { year: days[0]!.hijri.year, month: days[0]!.hijri.month };
}

/**
 * Generates a Hijri month calendar based on Hijri month or Gregorian month query.
 */
export function computeHijriMonth(
  query: HijriCalendarMonthQuery,
  options?: HijriCalendarOptions
): Result<HijriMonthResult> {
  if (!query) {
    return failure(Errors.missingParameter('query'));
  }

  const optionsResult = normalizeOptions(options);
  if (!optionsResult.success) {
    return failure(optionsResult.error);
  }

  const normalized = optionsResult.data;
  const trace: TraceStep[] = [createTraceStep(1, 'Normalized options', normalized)];

  const method = getMethod(normalized.method);
  if (!method) {
    return failure(
      Errors.methodNotSupported('Hijri calculation method is not yet available', {
        method: normalized.method,
      }),
      trace
    );
  }

  if (isHijriMonthQuery(query)) {
    const identifierResult = ensureHijriMonthIdentifier(query.hijri);
    if (!identifierResult.success) {
      return failure(identifierResult.error, trace);
    }

    const daysResult = generateHijriMonthDays(normalized.method, identifierResult.data, options);
    if (!daysResult.success) {
      return failure(daysResult.error, trace);
    }

    const identifier = identifierResult.data;
    const length = method.getHijriMonthLength(identifier);

    const meta: HijriMonthMeta = {
      year: identifier.year,
      month: identifier.month,
      method: normalized.method,
      length,
      generatedFrom: 'hijri',
      adjustmentApplied: daysResult.data.some((day) => day.isAdjusted),
    };

    const grid = buildCalendarGrid(daysResult.data, normalized.weekStartsOn);

    trace.push(
      createTraceStep(2, 'Generated Hijri month from Hijri identifier', {
        hijriMonth: identifier,
        length,
      })
    );

    const result: HijriMonthResult = {
      method: normalized.method,
      hijriMonth: identifier,
      days: daysResult.data,
      meta,
      grid,
      trace,
    };

    return success(result, trace);
  }

  if (isGregorianMonthQuery(query)) {
    const monthQuery = query.gregorian;
    const monthValidation = ensureGregorianMonth(monthQuery);
    if (!monthValidation.success) {
      return failure(monthValidation.error, trace);
    }

    const dayCount = getDaysInMonth(monthValidation.data.year, monthValidation.data.month);
    if (dayCount === 0) {
      return failure(
        Errors.invalidDate('Invalid Gregorian month query', {
          year: monthValidation.data.year,
          month: monthValidation.data.month,
        }),
        trace
      );
    }

    const converted: HijriDayItem[] = [];
    for (let day = 1; day <= dayCount; day++) {
      const date = { year: monthValidation.data.year, month: monthValidation.data.month, day };
      const dateResult = computeHijriDate({ date }, options);
      if (!dateResult.success) {
        return failure(dateResult.error, trace);
      }

      converted.push(
        createHijriDayItem({
          hijri: dateResult.data.hijri,
          gregorian: date,
          weekday: deriveWeekdayFromGregorian(date),
          isAdjusted: dateResult.data.isAdjusted,
        })
      );
    }

    const dominantMonth = resolveDominantHijriMonth(converted);
    const fullMonthResult = computeHijriMonth({ hijri: dominantMonth }, options);
    if (!fullMonthResult.success) {
      return failure(fullMonthResult.error, trace);
    }

    trace.push(
      createTraceStep(2, 'Resolved dominant Hijri month for Gregorian query', {
        gregorian: monthValidation.data,
        dominantHijriMonth: dominantMonth,
      })
    );

    const mergedMeta: HijriMonthMeta = {
      ...fullMonthResult.data.meta,
      generatedFrom: 'gregorian',
    };

    const result: HijriMonthResult = {
      ...fullMonthResult.data,
      meta: mergedMeta,
      trace: [...trace, ...(fullMonthResult.data.trace ?? [])],
    };

    return success(result, result.trace as TraceStep[]);
  }

  return failure(
    Errors.invalidParameterType('Hijri month query must contain either hijri or gregorian property', {
      query,
    }),
    trace
  );
}
