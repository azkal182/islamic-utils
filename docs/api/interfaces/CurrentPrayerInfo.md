[**Islamic Utilities API v0.2.1**](../README.md)

***

[Islamic Utilities API](../README.md) / CurrentPrayerInfo

# Interface: CurrentPrayerInfo

Defined in: src/prayer-times/next-prayer.ts:58

Information about the current prayer period.

## Properties

### current

> `readonly` **current**: [`PrayerName`](../type-aliases/PrayerName.md) \| `null`

Defined in: src/prayer-times/next-prayer.ts:66

Current prayer period.

#### Remarks

The prayer whose time has most recently passed.
null if before Fajr (or if times are invalid).

***

### previous

> `readonly` **previous**: [`PrayerName`](../type-aliases/PrayerName.md) \| `null`

Defined in: src/prayer-times/next-prayer.ts:71

Previous prayer (the one before current).
