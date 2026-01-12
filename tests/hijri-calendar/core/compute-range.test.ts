/**
 * @fileoverview Unit tests for computeHijriRange.
 */

import { describe, expect, it } from 'vitest';

import { computeHijriRange } from '../../../src/hijri-calendar/core/compute-range';

describe('computeHijriRange', () => {
  it('should return days for a valid range', () => {
    const result = computeHijriRange({
      start: { year: 2025, month: 3, day: 1 },
      end: { year: 2025, month: 3, day: 3 },
    });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.days).toHaveLength(3);
      expect(result.data.meta.dayCount).toBe(3);
    }
  });

  it('should fail if start is after end', () => {
    const result = computeHijriRange({
      start: { year: 2025, month: 3, day: 10 },
      end: { year: 2025, month: 3, day: 1 },
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.code).toBe('INVALID_DATE');
    }
  });
});
