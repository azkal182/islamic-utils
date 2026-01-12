import type { GregorianDate, HijriDate, HijriMonthIdentifier } from '../../types';
import {
  convertGregorianToHijri as fallbackConvertGregorianToHijri,
  convertHijriToGregorian as fallbackConvertHijriToGregorian,
  getHijriMonthLength as fallbackGetHijriMonthLength,
  gregorianToJulianDay,
  julianDayToGregorian,
} from '../../core/conversion';

import { UMMUL_QURA_MONTH_STARTS } from './data';

const monthIndexByKey = new Map<string, number>();

for (let i = 0; i < UMMUL_QURA_MONTH_STARTS.length; i += 1) {
  const entry = UMMUL_QURA_MONTH_STARTS[i];
  monthIndexByKey.set(`${entry.year}-${entry.month}`, i);
}

function findMonthIndexByJulianDay(jd: number): number {
  const first = UMMUL_QURA_MONTH_STARTS[0];
  const last = UMMUL_QURA_MONTH_STARTS[UMMUL_QURA_MONTH_STARTS.length - 1];

  if (!first || !last) return -1;
  if (jd < first.startJd) return -1;
  if (jd >= last.startJd) return UMMUL_QURA_MONTH_STARTS.length - 1;

  let low = 0;
  let high = UMMUL_QURA_MONTH_STARTS.length - 1;

  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    const current = UMMUL_QURA_MONTH_STARTS[mid];
    const next = UMMUL_QURA_MONTH_STARTS[mid + 1];

    if (!current) return -1;

    const start = current.startJd;
    const end = next ? next.startJd : Number.POSITIVE_INFINITY;

    if (jd >= start && jd < end) {
      return mid;
    }

    if (jd < start) {
      high = mid - 1;
    } else {
      low = mid + 1;
    }
  }

  return -1;
}

export function ummulQuraConvertGregorianToHijri(date: GregorianDate): HijriDate {
  const jd = gregorianToJulianDay(date);
  const idx = findMonthIndexByJulianDay(jd);

  if (idx < 0) {
    return fallbackConvertGregorianToHijri(date);
  }

  const entry = UMMUL_QURA_MONTH_STARTS[idx];
  if (!entry) {
    return fallbackConvertGregorianToHijri(date);
  }

  const day = jd - entry.startJd + 1;
  return { year: entry.year, month: entry.month, day };
}

export function ummulQuraConvertHijriToGregorian(date: HijriDate): GregorianDate {
  const idx = monthIndexByKey.get(`${date.year}-${date.month}`);
  if (idx === undefined) {
    return fallbackConvertHijriToGregorian(date);
  }

  const entry = UMMUL_QURA_MONTH_STARTS[idx];
  const next = UMMUL_QURA_MONTH_STARTS[idx + 1];

  if (!entry || !next) {
    return fallbackConvertHijriToGregorian(date);
  }

  const length = next.startJd - entry.startJd;
  const maxDay = length === 30 ? 30 : 29;

  if (date.day < 1 || date.day > maxDay) {
    return fallbackConvertHijriToGregorian(date);
  }

  const jd = entry.startJd + (date.day - 1);
  return julianDayToGregorian(jd);
}

export function ummulQuraGetHijriMonthLength(identifier: HijriMonthIdentifier): 29 | 30 {
  const idx = monthIndexByKey.get(`${identifier.year}-${identifier.month}`);
  if (idx === undefined) {
    return fallbackGetHijriMonthLength(identifier);
  }

  const entry = UMMUL_QURA_MONTH_STARTS[idx];
  const next = UMMUL_QURA_MONTH_STARTS[idx + 1];

  if (!entry || !next) {
    return fallbackGetHijriMonthLength(identifier);
  }

  const length = next.startJd - entry.startJd;
  return length === 30 ? 30 : 29;
}
