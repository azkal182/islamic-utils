/**
 * Hijri Calendar usage examples.
 */

import {
  computeHijriDate,
  computeHijriMonth,
  computeHijriRange,
  formatGregorianDate,
  formatHijriDateLong,
} from '../src/hijri-calendar';

function printTitle(title: string): void {
  console.log(`\n=== ${title} ===`);
}

printTitle('Gregorian → Hijri (default method)');
{
  const res = computeHijriDate({ date: { year: 2026, month: 1, day: 12 } });
  if (res.success) {
    console.log('Gregorian:', formatGregorianDate(res.data.gregorian));
    console.log('Hijri:', formatHijriDateLong(res.data.hijri, 'latin'));
    console.log('Method:', res.data.method);
  } else {
    console.error(res.error);
  }
}

printTitle('Gregorian → Hijri (NU Falakiyah)');
{
  const res = computeHijriDate(
    { date: { year: 2026, month: 1, day: 12 } },
    { method: 'nu_falakiyah' }
  );
  if (res.success) {
    console.log('Hijri:', formatHijriDateLong(res.data.hijri, 'latin'));
    console.log('Method:', res.data.method);
  } else {
    console.error(res.error);
  }
}

printTitle('Hijri month calendar');
{
  const res = computeHijriMonth({ hijri: { year: 1446, month: 9 } });
  if (res.success) {
    console.log('Hijri month:', res.data.hijriMonth);
    console.log('Days:', res.data.days.length);
    console.log('Generated from:', res.data.meta.generatedFrom);
  } else {
    console.error(res.error);
  }
}

printTitle('Gregorian range');
{
  const res = computeHijriRange({
    start: { year: 2026, month: 1, day: 2 },
    end: { year: 2026, month: 1, day: 12 },
  });
  if (res.success) {
    console.log('Days:', res.data.days.length);
    console.log('Any adjustment applied:', res.data.meta.adjustmentApplied);
  } else {
    console.error(res.error);
  }
}

printTitle('Adjustments (memory mode)');
{
  const res = computeHijriDate(
    { date: { year: 2025, month: 3, day: 15 } },
    {
      method: 'ummul_qura',
      adjustments: {
        mode: 'memory',
        data: [
          {
            method: 'ummul_qura',
            hijriYear: 1446,
            hijriMonth: 9,
            shiftDays: 1,
            source: 'example',
            revision: 1,
          },
        ],
      },
    }
  );
  if (res.success) {
    console.log('Hijri:', formatHijriDateLong(res.data.hijri, 'latin'));
    console.log('Adjusted:', res.data.isAdjusted, res.data.adjustmentSource);
  } else {
    console.error(res.error);
  }
}
