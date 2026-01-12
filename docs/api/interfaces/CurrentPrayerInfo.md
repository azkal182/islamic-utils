[**Islamic Utilities API v0.2.2**](../README.md)

***

[Islamic Utilities API](../README.md) / CurrentPrayerInfo

# Interface: CurrentPrayerInfo

Defined in: [src/prayer-times/next-prayer.ts:75](https://github.com/azkal182/islamic-utils/blob/f548f22580afc5800e32e3785eef49f3fce9f58a/src/prayer-times/next-prayer.ts#L75)

Information about the current prayer period.

## Properties

### current

> `readonly` **current**: [`PrayerName`](../type-aliases/PrayerName.md) \| `null`

Defined in: [src/prayer-times/next-prayer.ts:83](https://github.com/azkal182/islamic-utils/blob/f548f22580afc5800e32e3785eef49f3fce9f58a/src/prayer-times/next-prayer.ts#L83)

Current prayer period.

#### Remarks

The prayer whose time has most recently passed.
null if before Fajr (or if times are invalid).

***

### prayerTimes

> `readonly` **prayerTimes**: [`PrayerTimesResult`](PrayerTimesResult.md)

Defined in: [src/prayer-times/next-prayer.ts:93](https://github.com/azkal182/islamic-utils/blob/f548f22580afc5800e32e3785eef49f3fce9f58a/src/prayer-times/next-prayer.ts#L93)

Prayer times for the current day.

***

### previous

> `readonly` **previous**: [`PrayerName`](../type-aliases/PrayerName.md) \| `null`

Defined in: [src/prayer-times/next-prayer.ts:88](https://github.com/azkal182/islamic-utils/blob/f548f22580afc5800e32e3785eef49f3fce9f58a/src/prayer-times/next-prayer.ts#L88)

Previous prayer (the one before current).
