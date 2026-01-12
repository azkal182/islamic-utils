/**
 * @fileoverview Unit tests for Hijri adjustments (memory mode).
 */

import { describe, expect, it } from 'vitest';

import { computeHijriDate } from '../../../src/hijri-calendar/core/compute-date';

describe('Hijri adjustments (memory mode)', () => {
  it('should shift Hijri date by applying month adjustment', () => {
    const base = computeHijriDate({ date: { year: 2025, month: 3, day: 15 } }, { method: 'ummul_qura' });
    expect(base.success).toBe(true);
    if (!base.success) return;

    const month = { year: base.data.hijri.year, month: base.data.hijri.month };

    const adjusted = computeHijriDate(
      { date: { year: 2025, month: 3, day: 15 } },
      {
        method: 'ummul_qura',
        adjustments: {
          mode: 'memory',
          data: [
            {
              method: 'ummul_qura',
              hijriYear: month.year,
              hijriMonth: month.month,
              shiftDays: 1,
              source: 'test',
              revision: 1,
            },
          ],
        },
      }
    );

    expect(adjusted.success).toBe(true);
    if (!adjusted.success) return;

    expect(adjusted.data.isAdjusted).toBe(true);
    expect(adjusted.data.adjustmentSource).toBe('test');
    expect(adjusted.data.hijri.day).toBe(base.data.hijri.day + 1);
  });
});
