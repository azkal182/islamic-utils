import type { GregorianDate, HijriMonthIdentifier } from '../types';
import { gregorianToJulianDay, julianDayToGregorian } from '../core/conversion';
import type { AdjustmentMeta, ResolvedHijriMonthAdjustment } from './types';

export function applyShiftToGregorianDate(date: GregorianDate, shiftDays: number): GregorianDate {
  const jd = gregorianToJulianDay(date);
  return julianDayToGregorian(jd - shiftDays);
}

export function createAdjustmentMeta(adjustment?: ResolvedHijriMonthAdjustment): AdjustmentMeta {
  if (!adjustment || adjustment.shiftDays === 0) {
    return { isAdjusted: false, shiftDays: 0 };
  }

  return {
    isAdjusted: true,
    shiftDays: adjustment.shiftDays,
    source: adjustment.source,
  };
}

export function isSameHijriMonth(a: HijriMonthIdentifier, b: HijriMonthIdentifier): boolean {
  return a.year === b.year && a.month === b.month;
}
