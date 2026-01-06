[**Islamic Utilities API v0.2.1**](../README.md)

***

[Islamic Utilities API](../README.md) / NextPrayerInfo

# Interface: NextPrayerInfo

Defined in: src/prayer-times/next-prayer.ts:21

Information about the next upcoming prayer.

## Properties

### isNextDay

> `readonly` **isNextDay**: `boolean`

Defined in: src/prayer-times/next-prayer.ts:52

Whether the next prayer is on the following day.

#### Remarks

True if we've passed Isha and the next prayer is tomorrow's Imsak/Fajr.

***

### minutesUntil

> `readonly` **minutesUntil**: `number`

Defined in: src/prayer-times/next-prayer.ts:44

Minutes until the next prayer.

#### Remarks

Always positive. If the next prayer is tomorrow, this includes
the remaining minutes of today plus the time into tomorrow.

***

### name

> `readonly` **name**: [`PrayerName`](../type-aliases/PrayerName.md)

Defined in: src/prayer-times/next-prayer.ts:25

Name of the next prayer.

***

### time

> `readonly` **time**: `string`

Defined in: src/prayer-times/next-prayer.ts:30

Formatted time string (HH:MM).

***

### timeNumeric

> `readonly` **timeNumeric**: `number`

Defined in: src/prayer-times/next-prayer.ts:35

Time as fractional hours (for calculations).
