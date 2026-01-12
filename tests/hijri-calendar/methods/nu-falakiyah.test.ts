/**
 * @fileoverview Unit tests for NU Falakiyah method engine.
 */

import { describe, expect, it } from 'vitest';

import {
  nuFalakiyahConvertGregorianToHijri,
  nuFalakiyahConvertHijriToGregorian,
  nuFalakiyahGetHijriMonthLength,
} from '../../../src/hijri-calendar/methods/nu-falakiyah/engine';

describe('NU Falakiyah (IRNU) engine', () => {
  it('should return month length 29 or 30', () => {
    const length = nuFalakiyahGetHijriMonthLength({ year: 1446, month: 9 });
    expect(length === 29 || length === 30).toBe(true);
  });

  it('should roundtrip Hijri -> Gregorian -> Hijri for a valid Hijri date', () => {
    const length = nuFalakiyahGetHijriMonthLength({ year: 1446, month: 9 });
    const hijri = { year: 1446, month: 9, day: length };

    const gregorian = nuFalakiyahConvertHijriToGregorian(hijri);
    const back = nuFalakiyahConvertGregorianToHijri(gregorian);

    expect(back).toEqual(hijri);
  });

  it('should roundtrip Gregorian -> Hijri -> Gregorian for a typical Gregorian date', () => {
    const gregorian = { year: 2025, month: 3, day: 15 };
    const hijri = nuFalakiyahConvertGregorianToHijri(gregorian);
    const back = nuFalakiyahConvertHijriToGregorian(hijri);

    expect(back).toEqual(gregorian);
  });
});
