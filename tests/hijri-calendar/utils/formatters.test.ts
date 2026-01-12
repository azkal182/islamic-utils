import { describe, expect, it } from 'vitest';

import {
  formatGregorianDate,
  formatHijriDate,
  formatHijriDateLong,
  getHijriMonthName,
} from '../../../src/hijri-calendar/utils/formatters';

describe('hijri-calendar/utils/formatters', () => {
  it('should format Gregorian date as YYYY-MM-DD', () => {
    expect(formatGregorianDate({ year: 2025, month: 3, day: 5 })).toBe('2025-03-05');
  });

  it('should format Hijri date as YYYY-MM-DD', () => {
    expect(formatHijriDate({ year: 1446, month: 9, day: 3 })).toBe('1446-09-03');
  });

  it('should return Hijri month names', () => {
    expect(getHijriMonthName(9, 'latin')).toBe('Ramadan');
    expect(getHijriMonthName(9, 'arabic')).toBe('رمضان');
  });

  it('should format Hijri long date', () => {
    expect(formatHijriDateLong({ year: 1446, month: 9, day: 1 }, 'latin')).toBe('1 Ramadan 1446H');
  });
});
