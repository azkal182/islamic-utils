[**Islamic Utilities API v0.2.2**](../README.md)

***

[Islamic Utilities API](../README.md) / NextPrayerInfo

# Interface: NextPrayerInfo

Defined in: [src/prayer-times/next-prayer.ts:30](https://github.com/azkal182/islamic-utils/blob/f548f22580afc5800e32e3785eef49f3fce9f58a/src/prayer-times/next-prayer.ts#L30)

Information about the next upcoming prayer.

## Properties

### isNextDay

> `readonly` **isNextDay**: `boolean`

Defined in: [src/prayer-times/next-prayer.ts:61](https://github.com/azkal182/islamic-utils/blob/f548f22580afc5800e32e3785eef49f3fce9f58a/src/prayer-times/next-prayer.ts#L61)

Whether the next prayer is on the following day.

#### Remarks

True if we've passed Isha and the next prayer is tomorrow's Imsak/Fajr.

***

### minutesUntil

> `readonly` **minutesUntil**: `number`

Defined in: [src/prayer-times/next-prayer.ts:53](https://github.com/azkal182/islamic-utils/blob/f548f22580afc5800e32e3785eef49f3fce9f58a/src/prayer-times/next-prayer.ts#L53)

Minutes until the next prayer.

#### Remarks

Always positive. If the next prayer is tomorrow, this includes
the remaining minutes of today plus the time into tomorrow.

***

### name

> `readonly` **name**: [`PrayerName`](../type-aliases/PrayerName.md)

Defined in: [src/prayer-times/next-prayer.ts:34](https://github.com/azkal182/islamic-utils/blob/f548f22580afc5800e32e3785eef49f3fce9f58a/src/prayer-times/next-prayer.ts#L34)

Name of the next prayer.

***

### prayerTimes

> `readonly` **prayerTimes**: [`PrayerTimesResult`](PrayerTimesResult.md)

Defined in: [src/prayer-times/next-prayer.ts:69](https://github.com/azkal182/islamic-utils/blob/f548f22580afc5800e32e3785eef49f3fce9f58a/src/prayer-times/next-prayer.ts#L69)

Prayer times for the current day.

#### Remarks

Included for convenience if you want to display all times.

***

### time

> `readonly` **time**: `string`

Defined in: [src/prayer-times/next-prayer.ts:39](https://github.com/azkal182/islamic-utils/blob/f548f22580afc5800e32e3785eef49f3fce9f58a/src/prayer-times/next-prayer.ts#L39)

Formatted time string (HH:MM).

***

### timeNumeric

> `readonly` **timeNumeric**: `number`

Defined in: [src/prayer-times/next-prayer.ts:44](https://github.com/azkal182/islamic-utils/blob/f548f22580afc5800e32e3785eef49f3fce9f58a/src/prayer-times/next-prayer.ts#L44)

Time as fractional hours (for calculations).
