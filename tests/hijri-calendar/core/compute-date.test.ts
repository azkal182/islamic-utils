/**
 * @fileoverview Unit tests for computeHijriDate.
 */

import { describe, expect, it } from 'vitest';

import { computeHijriDate } from '../../../src/hijri-calendar/core/compute-date';

describe('computeHijriDate', () => {
  it('should return success for a valid Gregorian date', () => {
    const result = computeHijriDate({ date: { year: 2025, month: 3, day: 15 } });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.gregorian).toEqual({ year: 2025, month: 3, day: 15 });
      expect(result.data.hijri.year).toBeGreaterThan(0);
      expect(result.data.hijri.month).toBeGreaterThanOrEqual(1);
      expect(result.data.hijri.month).toBeLessThanOrEqual(12);
      expect(result.data.hijri.day).toBeGreaterThanOrEqual(1);
      expect(result.data.hijri.day).toBeLessThanOrEqual(30);
      expect(result.data.method).toBe('ummul_qura');
      expect(result.data.isAdjusted).toBe(false);
    }
  });

  it('should support nu_falakiyah method option', () => {
    const result = computeHijriDate({ date: { year: 2025, month: 3, day: 15 } }, { method: 'nu_falakiyah' });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.method).toBe('nu_falakiyah');
      expect(result.data.hijri.year).toBeGreaterThan(0);
      expect(result.data.hijri.month).toBeGreaterThanOrEqual(1);
      expect(result.data.hijri.month).toBeLessThanOrEqual(12);
      expect(result.data.hijri.day).toBeGreaterThanOrEqual(1);
      expect(result.data.hijri.day).toBeLessThanOrEqual(30);
    }
  });

  it('should fail when date is missing', () => {
    const result = computeHijriDate({} as unknown as { date: { year: number; month: number; day: number } });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.code).toBe('MISSING_PARAMETER');
    }
  });

  it('should fail for invalid Gregorian month', () => {
    const result = computeHijriDate({ date: { year: 2025, month: 13, day: 1 } });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.code).toBe('INVALID_PARAMETER_TYPE');
    }
  });
});
