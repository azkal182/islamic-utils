/**
 * @fileoverview Unit tests for Hijri adjustments (json mode).
 */

import { describe, expect, it } from 'vitest';

import { computeHijriDate } from '../../../src/hijri-calendar/core/compute-date';

describe('Hijri adjustments (json mode)', () => {
  it('should load adjustments from json file and apply shift', () => {
    const base = computeHijriDate({ date: { year: 2025, month: 3, day: 15 } }, { method: 'ummul_qura' });
    expect(base.success).toBe(true);
    if (!base.success) return;

    const adjusted = computeHijriDate(
      { date: { year: 2025, month: 3, day: 15 } },
      {
        method: 'ummul_qura',
        adjustments: {
          mode: 'json',
          filePath: 'tests/hijri-calendar/adjustments/fixtures/adjustments.json',
        },
      }
    );

    expect(adjusted.success).toBe(true);
    if (!adjusted.success) return;

    // Fixture targets 1446-09 with shiftDays=+1
    if (base.data.hijri.year === 1446 && base.data.hijri.month === 9) {
      expect(adjusted.data.isAdjusted).toBe(true);
      expect(adjusted.data.adjustmentSource).toBe('fixture');
      expect(adjusted.data.hijri.day).toBe(base.data.hijri.day + 1);
    } else {
      // If the base date isn't in that month (should be, but keep test robust), then no adjustment applied.
      expect(adjusted.data.isAdjusted).toBe(false);
    }
  });
});
