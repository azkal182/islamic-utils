[**Islamic Utilities API v0.2.0**](../README.md)

***

[Islamic Utilities API](../README.md) / PrayerTimesResult

# Interface: PrayerTimesResult

Defined in: [src/prayer-times/types.ts:536](https://github.com/azkal182/islamic-utils/blob/ddd04bee89289da73cadadfcee51cdeac187e097/src/prayer-times/types.ts#L536)

Complete result of prayer time calculation.

## Remarks

Contains the calculated times, metadata, and optional trace.

## Properties

### formatted

> `readonly` **formatted**: [`PrayerTimeStrings`](../type-aliases/PrayerTimeStrings.md)

Defined in: [src/prayer-times/types.ts:545](https://github.com/azkal182/islamic-utils/blob/ddd04bee89289da73cadadfcee51cdeac187e097/src/prayer-times/types.ts#L545)

Formatted time strings (HH:MM format).

***

### meta

> `readonly` **meta**: [`PrayerTimesMeta`](PrayerTimesMeta.md)

Defined in: [src/prayer-times/types.ts:550](https://github.com/azkal182/islamic-utils/blob/ddd04bee89289da73cadadfcee51cdeac187e097/src/prayer-times/types.ts#L550)

Metadata about the calculation.

***

### times

> `readonly` **times**: [`PrayerTimes`](../type-aliases/PrayerTimes.md)

Defined in: [src/prayer-times/types.ts:540](https://github.com/azkal182/islamic-utils/blob/ddd04bee89289da73cadadfcee51cdeac187e097/src/prayer-times/types.ts#L540)

Calculated prayer times in fractional hours.

***

### trace?

> `readonly` `optional` **trace**: [`TraceStep`](TraceStep.md)[]

Defined in: [src/prayer-times/types.ts:558](https://github.com/azkal182/islamic-utils/blob/ddd04bee89289da73cadadfcee51cdeac187e097/src/prayer-times/types.ts#L558)

Optional trace of calculation steps.

#### Remarks

Only included if `includeTrace: true` was specified.
