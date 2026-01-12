/**
 * @fileoverview Unit tests for Ummul Qura method table engine.
 */

import { describe, expect, it } from 'vitest';

import { gregorianToJulianDay } from '../../../src/hijri-calendar/core/conversion';
import {
  ummulQuraConvertGregorianToHijri,
  ummulQuraConvertHijriToGregorian,
  ummulQuraGetHijriMonthLength,
} from '../../../src/hijri-calendar/methods/ummul-qura/lookup';
import { UMMUL_QURA_MONTH_STARTS } from '../../../src/hijri-calendar/methods/ummul-qura/data';

describe('Ummul Qura lookup engine', () => {
  it('should map table startJd to day=1 Hijri date', () => {
    const entry = UMMUL_QURA_MONTH_STARTS[0];
    expect(entry).toBeDefined();
    if (!entry) return;

    const gregorian = ummulQuraConvertHijriToGregorian({ year: entry.year, month: entry.month, day: 1 });
    const jd = gregorianToJulianDay(gregorian);

    expect(jd).toBe(entry.startJd);

    const hijri = ummulQuraConvertGregorianToHijri(gregorian);
    expect(hijri).toEqual({ year: entry.year, month: entry.month, day: 1 });
  });

  it('should compute month length as 29 or 30 based on adjacent startJd', () => {
    const entry = UMMUL_QURA_MONTH_STARTS[0];
    const next = UMMUL_QURA_MONTH_STARTS[1];
    expect(entry).toBeDefined();
    expect(next).toBeDefined();
    if (!entry || !next) return;

    const expected = (next.startJd - entry.startJd) === 30 ? 30 : 29;
    const length = ummulQuraGetHijriMonthLength({ year: entry.year, month: entry.month });

    expect(length === 29 || length === 30).toBe(true);
    expect(length).toBe(expected);
  });

  it('should roundtrip Hijri -> Gregorian -> Hijri for a valid day in table range', () => {
    const entry = UMMUL_QURA_MONTH_STARTS[0];
    const next = UMMUL_QURA_MONTH_STARTS[1];
    expect(entry).toBeDefined();
    expect(next).toBeDefined();
    if (!entry || !next) return;

    const length = (next.startJd - entry.startJd) === 30 ? 30 : 29;

    const hijri = { year: entry.year, month: entry.month, day: length };
    const gregorian = ummulQuraConvertHijriToGregorian(hijri);
    const back = ummulQuraConvertGregorianToHijri(gregorian);

    expect(back).toEqual(hijri);
  });
});
