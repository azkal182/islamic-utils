[**Islamic Utilities API v0.2.0**](../README.md)

***

[Islamic Utilities API](../README.md) / MonthlyPrayerTimesResult

# Interface: MonthlyPrayerTimesResult

Defined in: src/prayer-times/monthly.ts:131

Complete result of monthly prayer times calculation.

## Properties

### days

> `readonly` **days**: [`MonthlyPrayerTimesDayResult`](MonthlyPrayerTimesDayResult.md)[]

Defined in: src/prayer-times/monthly.ts:136

Array of prayer times for each day of the month.
Index 0 = Day 1, Index 29 = Day 30, etc.

***

### meta

> `readonly` **meta**: [`MonthlyPrayerTimesMeta`](MonthlyPrayerTimesMeta.md)

Defined in: src/prayer-times/monthly.ts:141

Metadata about the calculation.

***

### trace?

> `readonly` `optional` **trace**: [`TraceStep`](TraceStep.md)[]

Defined in: src/prayer-times/monthly.ts:146

Optional trace of calculation steps.
