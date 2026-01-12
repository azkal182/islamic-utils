/**
 * @fileoverview Internal conversion utilities bridging Gregorian and Hijri dates.
 * @module hijri-calendar/core/conversion
 */

import type { GregorianDate, HijriDate, HijriMonthIdentifier } from '../types';

const ISLAMIC_EPOCH = 1948439;

/**
 * Converts a Gregorian date to a Julian Day number (Gregorian calendar).
 */
export function gregorianToJulianDay({ year, month, day }: GregorianDate): number {
  const a = Math.floor((14 - month) / 12);
  const y = year + 4800 - a;
  const m = month + 12 * a - 3;

  return (
    day +
    Math.floor((153 * m + 2) / 5) +
    365 * y +
    Math.floor(y / 4) -
    Math.floor(y / 100) +
    Math.floor(y / 400) -
    32045
  );
}

/**
 * Converts a Julian Day number to a Gregorian date (proleptic Gregorian calendar).
 */
export function julianDayToGregorian(julianDay: number): GregorianDate {
  let a = julianDay + 32044;
  const b = Math.floor((4 * a + 3) / 146097);
  a = a - Math.floor((146097 * b) / 4);
  const d = Math.floor((4 * a + 3) / 1461);
  const e = a - Math.floor((1461 * d) / 4);
  const m = Math.floor((5 * e + 2) / 153);

  const day = e - Math.floor((153 * m + 2) / 5) + 1;
  const month = m + 3 - 12 * Math.floor(m / 10);
  const year = b * 100 + d - 4800 + Math.floor(m / 10);

  return { year, month, day };
}

/**
 * Converts a Hijri date to Julian Day (Tabular Islamic calendar approximation).
 */
export function hijriToJulianDay(year: number, month: number, day: number): number {
  return (
    day +
    Math.ceil(29.5 * (month - 1)) +
    (year - 1) * 354 +
    Math.floor((3 + 11 * year) / 30) +
    ISLAMIC_EPOCH -
    1
  );
}

/**
 * Converts a Julian Day to a Hijri date (Tabular Islamic calendar approximation).
 */
export function julianDayToHijri(julianDay: number): HijriDate {
  const daysSinceEpoch = julianDay - ISLAMIC_EPOCH + 1;
  let year = Math.floor((30 * daysSinceEpoch + 10646) / 10631);

  if (year < 1) {
    year = 1;
  }

  let month = Math.ceil((julianDay - hijriToJulianDay(year, 1, 1) + 1) / 29.5);
  if (month < 1) {
    month = 1;
  } else if (month > 12) {
    month = 12;
  }

  let firstDayOfMonth = hijriToJulianDay(year, month, 1);

  while (firstDayOfMonth > julianDay) {
    month -= 1;
    if (month < 1) {
      year -= 1;
      month = 12;
    }
    firstDayOfMonth = hijriToJulianDay(year, month, 1);
  }

  let day = julianDay - firstDayOfMonth + 1;

  if (day < 1) {
    month -= 1;
    if (month < 1) {
      year -= 1;
      month = 12;
    }
    const newFirstDay = hijriToJulianDay(year, month, 1);
    day = julianDay - newFirstDay + 1;
  }

  if (day > 30) {
    day = 30;
  }

  return { year, month, day };
}

/**
 * Converts a Gregorian date to its Hijri counterpart (tabular approximation).
 */
export function convertGregorianToHijri(date: GregorianDate): HijriDate {
  const jd = gregorianToJulianDay(date);
  return julianDayToHijri(jd);
}

/**
 * Converts a Hijri date to its Gregorian equivalent (tabular approximation).
 */
export function convertHijriToGregorian(date: HijriDate): GregorianDate {
  const julian = hijriToJulianDay(date.year, date.month, date.day);
  return julianDayToGregorian(julian);
}

/**
 * Gets the nominal length (29 or 30 days) of a Hijri month.
 */
export function getHijriMonthLength(identifier: HijriMonthIdentifier): 29 | 30 {
  const start = hijriToJulianDay(identifier.year, identifier.month, 1);
  const nextMonth = identifier.month === 12
    ? { year: identifier.year + 1, month: 1 }
    : { year: identifier.year, month: identifier.month + 1 };
  const next = hijriToJulianDay(nextMonth.year, nextMonth.month, 1);
  const length = next - start;
  return length === 30 ? 30 : 29;
}
