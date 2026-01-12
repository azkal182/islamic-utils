/**
 * @fileoverview Performance benchmarks for Hijri Calendar module
 *
 * Run: npx vitest bench benchmarks/hijri-calendar.bench.ts
 */

import { bench, describe } from 'vitest';

import { computeHijriDate, computeHijriMonth, computeHijriRange } from '../src/hijri-calendar';

describe('Hijri Calendar Performance', () => {
  bench('computeHijriDate - ummul_qura', () => {
    computeHijriDate({ date: { year: 2026, month: 1, day: 12 } }, { method: 'ummul_qura' });
  });

  bench('computeHijriDate - nu_falakiyah', () => {
    computeHijriDate({ date: { year: 2026, month: 1, day: 12 } }, { method: 'nu_falakiyah' });
  });

  bench('computeHijriMonth - Hijri query', () => {
    computeHijriMonth({ hijri: { year: 1447, month: 7 } }, { method: 'ummul_qura' });
  });

  bench('computeHijriMonth - Gregorian query', () => {
    computeHijriMonth({ gregorian: { year: 2026, month: 1 } }, { method: 'ummul_qura' });
  });

  bench('computeHijriRange - 30 days', () => {
    computeHijriRange(
      {
        start: { year: 2026, month: 1, day: 1 },
        end: { year: 2026, month: 1, day: 30 },
      },
      { method: 'ummul_qura' }
    );
  });
});
