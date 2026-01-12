import { describe, expect, it } from 'vitest';

import { buildHijriCalendarGrid } from '../../../src/hijri-calendar/utils/grid-builder';

describe('hijri-calendar/utils/grid-builder', () => {
  it('should build a 7-column grid with correct offset', () => {
    const days = [
      {
        hijri: { year: 1446, month: 9, day: 1 },
        gregorian: { year: 2025, month: 3, day: 1 },
        weekday: 6,
        isAdjusted: false,
      },
      {
        hijri: { year: 1446, month: 9, day: 2 },
        gregorian: { year: 2025, month: 3, day: 2 },
        weekday: 0,
        isAdjusted: false,
      },
    ] as const;

    const grid = buildHijriCalendarGrid(days, 0);

    expect(grid.length).toBeGreaterThanOrEqual(1);
    expect(grid[0]!.length).toBe(7);

    // weekStartsOn=Sunday (0), first weekday=Saturday (6) => offset 6
    expect(grid[0]![0]).toBeNull();
    expect(grid[0]![5]).toBeNull();
    expect(grid[0]![6]?.hijri.day).toBe(1);
  });
});
