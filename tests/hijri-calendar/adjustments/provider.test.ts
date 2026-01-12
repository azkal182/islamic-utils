/**
 * @fileoverview Unit tests for Hijri adjustments (provider mode - sync).
 */

import { describe, expect, it } from 'vitest';

import { computeHijriDate } from '../../../src/hijri-calendar/core/compute-date';

describe('Hijri adjustments (provider mode - sync)', () => {
  it('should apply provider adjustments for the requested Hijri year', () => {
    const base = computeHijriDate({ date: { year: 2025, month: 3, day: 15 } }, { method: 'ummul_qura' });
    expect(base.success).toBe(true);
    if (!base.success) return;

    const month = { year: base.data.hijri.year, month: base.data.hijri.month };

    const adjusted = computeHijriDate(
      { date: { year: 2025, month: 3, day: 15 } },
      {
        method: 'ummul_qura',
        adjustments: {
          mode: 'provider',
          getAdjustments: (hijriYear, method) => {
            if (hijriYear !== month.year || method !== 'ummul_qura') return [];
            return [
              {
                method: 'ummul_qura',
                hijriYear: month.year,
                hijriMonth: month.month,
                shiftDays: 1,
                source: 'provider-test',
                revision: 1,
              },
            ];
          },
        },
      }
    );

    expect(adjusted.success).toBe(true);
    if (!adjusted.success) return;

    expect(adjusted.data.isAdjusted).toBe(true);
    expect(adjusted.data.adjustmentSource).toBe('provider-test');
    expect(adjusted.data.hijri.day).toBe(base.data.hijri.day + 1);
  });
});
