/**
 * @fileoverview Unit tests for computeHijriMonth.
 */

import { describe, expect, it } from 'vitest';

import { computeHijriMonth } from '../../../src/hijri-calendar/core/compute-month';

describe('computeHijriMonth', () => {
  it('should generate a month from Hijri query', () => {
    const result = computeHijriMonth({ hijri: { year: 1446, month: 9 } });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.hijriMonth).toEqual({ year: 1446, month: 9 });
      expect(result.data.days.length).toBeGreaterThanOrEqual(29);
      expect(result.data.days.length).toBeLessThanOrEqual(30);
      expect(result.data.meta.generatedFrom).toBe('hijri');
      expect(result.data.grid).toBeDefined();
    }
  });

  it('should reject invalid Hijri query', () => {
    const result = computeHijriMonth({ hijri: { year: 1446, month: 13 } } as unknown as {
      hijri: { year: number; month: number };
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.code).toBe('OUT_OF_SUPPORTED_RANGE');
    }
  });

  it('should generate a month from Gregorian query', () => {
    const result = computeHijriMonth({ gregorian: { year: 2025, month: 3 } });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.meta.generatedFrom).toBe('gregorian');
      expect(result.data.days.length).toBeGreaterThanOrEqual(29);
      expect(result.data.days.length).toBeLessThanOrEqual(30);
    }
  });
});
