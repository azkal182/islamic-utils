import type { GregorianDate, HijriDate } from '../types';
import { HIJRI_MONTH_NAME_MAP } from '../constants';

function pad2(value: number): string {
  return value.toString().padStart(2, '0');
}

export type HijriMonthNameFormat = 'latin' | 'arabic';

export function getHijriMonthName(month: number, format: HijriMonthNameFormat = 'latin'): string {
  const meta = HIJRI_MONTH_NAME_MAP[month];
  if (!meta) {
    return String(month);
  }
  return format === 'arabic' ? meta.arabic : meta.latin;
}

export function formatGregorianDate(date: GregorianDate): string {
  return `${date.year}-${pad2(date.month)}-${pad2(date.day)}`;
}

export function formatHijriDate(date: HijriDate): string {
  return `${date.year}-${pad2(date.month)}-${pad2(date.day)}`;
}

export function formatHijriDateLong(date: HijriDate, monthFormat: HijriMonthNameFormat = 'latin'): string {
  const monthName = getHijriMonthName(date.month, monthFormat);
  return `${date.day} ${monthName} ${date.year}H`;
}
