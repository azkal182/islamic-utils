/**
 * @fileoverview Type definitions for the Hijri Calendar module.
 * @module hijri-calendar/types
 */

import type { DateOnly } from '../core/types/date';
import type { TraceStep } from '../core/types/result';

/**
 * Gregorian date representation. Alias of the shared {@link DateOnly} type.
 */
export type GregorianDate = DateOnly;

/**
 * Hijri date representation.
 */
export interface HijriDate {
  readonly year: number;
  readonly month: number;
  readonly day: number;
}

/**
 * Supported calculation methods for Hijri calendar conversion.
 */
export type HijriMethodId = 'ummul_qura' | 'nu_falakiyah';

/**
 * Weekday type used by the calendar grid (0 = Sunday, 6 = Saturday).
 */
export type HijriWeekday = 0 | 1 | 2 | 3 | 4 | 5 | 6;

/**
 * Minimal Hijri month identifier.
 */
export interface HijriMonthIdentifier {
  readonly year: number;
  readonly month: number;
}

/**
 * Hijri-based month query.
 */
export interface HijriMonthQuery {
  readonly hijri: HijriMonthIdentifier;
}

/**
 * Gregorian-based month query.
 */
export interface GregorianMonthQuery {
  readonly gregorian: {
    readonly year: number;
    readonly month: number;
  };
}

/**
 * Union type for legal month queries.
 */
export type HijriCalendarMonthQuery = HijriMonthQuery | GregorianMonthQuery;

/**
 * Metadata describing a calculation method.
 */
export interface HijriMethodMeta {
  readonly id: HijriMethodId;
  readonly name: string;
  readonly description: string;
  readonly region: string;
  readonly source?: string;
  readonly notes?: string;
  readonly supportedHijriYears?: {
    readonly start: number;
    readonly end: number;
  };
  readonly supportedGregorianYears?: {
    readonly start: number;
    readonly end: number;
  };
}

/**
 * Adjustment record applied to a Hijri month.
 */
export interface HijriMonthAdjustment {
  readonly method: HijriMethodId;
  readonly hijriYear: number;
  readonly hijriMonth: number;
  readonly shiftDays: number;
  readonly source: string;
  readonly issuedAt?: string;
  readonly revision?: number;
}

/**
 * Provider signature for dynamic adjustment loading.
 */
export type HijriAdjustmentProvider = (
  hijriYear: number,
  method: HijriMethodId
) => HijriMonthAdjustment[] | Promise<HijriMonthAdjustment[]>;

/**
 * Adjustment configuration modes.
 */
export type HijriAdjustmentsConfig =
  | { readonly mode: 'none' }
  | { readonly mode: 'memory'; readonly data: readonly HijriMonthAdjustment[] }
  | { readonly mode: 'json'; readonly filePath: string }
  | { readonly mode: 'provider'; readonly getAdjustments: HijriAdjustmentProvider };

/**
 * Options accepted by high-level Hijri calendar APIs.
 */
export interface HijriCalendarOptions {
  readonly method?: HijriMethodId;
  readonly adjustments?: HijriAdjustmentsConfig;
  readonly weekStartsOn?: HijriWeekday;
}

/**
 * Normalized options used internally by the Hijri calendar module.
 */
export interface HijriCalendarOptionsNormalized {
  readonly method: HijriMethodId;
  readonly adjustments: HijriAdjustmentsConfig;
  readonly weekStartsOn: HijriWeekday;
}

/**
 * Item returned for each day inside a Hijri calendar month.
 */
export interface HijriDayItem {
  readonly hijri: HijriDate;
  readonly gregorian: GregorianDate;
  readonly weekday: HijriWeekday;
  readonly isAdjusted: boolean;
}

/**
 * Calendar grid representation (weeks × days). Empty cells are null.
 */
export type HijriCalendarGrid = ReadonlyArray<ReadonlyArray<HijriDayItem | null>>;

/**
 * Metadata returned alongside monthly calendar calculations.
 */
export interface HijriMonthMeta {
  readonly year: number;
  readonly month: number;
  readonly method: HijriMethodId;
  readonly length: 29 | 30;
  readonly generatedFrom: 'hijri' | 'gregorian';
  readonly adjustmentApplied: boolean;
}

/**
 * Result payload for {@link computeHijriDate}.
 */
export interface HijriDateResult {
  readonly gregorian: GregorianDate;
  readonly hijri: HijriDate;
  readonly method: HijriMethodId;
  readonly isAdjusted: boolean;
  readonly adjustmentSource?: string;
  readonly trace?: readonly TraceStep[];
}

/**
 * Result payload for {@link computeHijriMonth}.
 */
export interface HijriMonthResult {
  readonly method: HijriMethodId;
  readonly hijriMonth: HijriMonthIdentifier;
  readonly days: readonly HijriDayItem[];
  readonly meta: HijriMonthMeta;
  readonly grid?: HijriCalendarGrid;
  readonly trace?: readonly TraceStep[];
}

/**
 * Metadata returned alongside range calculations.
 */
export interface HijriRangeMeta {
  readonly dayCount: number;
  readonly adjustmentApplied: boolean;
}

/**
 * Result payload for {@link computeHijriRange}.
 */
export interface HijriRangeResult {
  readonly method: HijriMethodId;
  readonly start: GregorianDate;
  readonly end: GregorianDate;
  readonly days: readonly HijriDayItem[];
  readonly meta: HijriRangeMeta;
  readonly trace?: readonly TraceStep[];
}
