# Hijri Calendar API Reference

## Core

### `computeHijriDate(input, options?)`

- Input: `{ date: { year, month, day } }`
- Options:
  - `method?: 'ummul_qura' | 'nu_falakiyah'`
  - `adjustments?: { mode: 'none' | 'memory' | 'json' | 'provider', ... }`
  - `weekStartsOn?: 0|1|2|3|4|5|6`

### `computeHijriMonth(query, options?)`

- Query:
  - `{ hijri: { year, month } }` atau
  - `{ gregorian: { year, month } }`

### `computeHijriRange(input, options?)`

- Input: `{ start: {y,m,d}, end: {y,m,d} }`

## Utils

### `formatters`

- `formatGregorianDate(date)`
- `formatHijriDate(date)`
- `formatHijriDateLong(date, monthFormat?)`
- `getHijriMonthName(month, format?)`

### `grid-builder`

- `buildHijriCalendarGrid(days, weekStartsOn)`
