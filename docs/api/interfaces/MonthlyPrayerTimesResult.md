[**Islamic Utilities API v0.2.2**](../README.md)

***

[Islamic Utilities API](../README.md) / MonthlyPrayerTimesResult

# Interface: MonthlyPrayerTimesResult

Defined in: [src/prayer-times/monthly.ts:131](https://github.com/azkal182/islamic-utils/blob/f548f22580afc5800e32e3785eef49f3fce9f58a/src/prayer-times/monthly.ts#L131)

Complete result of monthly prayer times calculation.

## Properties

### days

> `readonly` **days**: [`MonthlyPrayerTimesDayResult`](MonthlyPrayerTimesDayResult.md)[]

Defined in: [src/prayer-times/monthly.ts:136](https://github.com/azkal182/islamic-utils/blob/f548f22580afc5800e32e3785eef49f3fce9f58a/src/prayer-times/monthly.ts#L136)

Array of prayer times for each day of the month.
Index 0 = Day 1, Index 29 = Day 30, etc.

***

### meta

> `readonly` **meta**: [`MonthlyPrayerTimesMeta`](MonthlyPrayerTimesMeta.md)

Defined in: [src/prayer-times/monthly.ts:141](https://github.com/azkal182/islamic-utils/blob/f548f22580afc5800e32e3785eef49f3fce9f58a/src/prayer-times/monthly.ts#L141)

Metadata about the calculation.

***

### trace?

> `readonly` `optional` **trace**: [`TraceStep`](TraceStep.md)[]

Defined in: [src/prayer-times/monthly.ts:146](https://github.com/azkal182/islamic-utils/blob/f548f22580afc5800e32e3785eef49f3fce9f58a/src/prayer-times/monthly.ts#L146)

Optional trace of calculation steps.
