import type { HijriCalendarGrid, HijriDayItem, HijriWeekday } from '../types';

export function buildHijriCalendarGrid(days: readonly HijriDayItem[], weekStartsOn: HijriWeekday): HijriCalendarGrid {
  if (days.length === 0) return [];

  const firstWeekday = days[0]!.weekday;
  const offset = (firstWeekday - weekStartsOn + 7) % 7;

  const grid: Array<Array<HijriDayItem | null>> = [];
  let week: Array<HijriDayItem | null> = [];

  for (let i = 0; i < offset; i += 1) {
    week.push(null);
  }

  for (const day of days) {
    week.push(day);
    if (week.length === 7) {
      grid.push(week);
      week = [];
    }
  }

  if (week.length > 0) {
    while (week.length < 7) {
      week.push(null);
    }
    grid.push(week);
  }

  return grid;
}
