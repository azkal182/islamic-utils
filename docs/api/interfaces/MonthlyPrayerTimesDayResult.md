[**Islamic Utilities API v0.2.2**](../README.md)

***

[Islamic Utilities API](../README.md) / MonthlyPrayerTimesDayResult

# Interface: MonthlyPrayerTimesDayResult

Defined in: [src/prayer-times/monthly.ts:61](https://github.com/azkal182/islamic-utils/blob/a30827e72f5e43f868fff9ce519ca224296e663c/src/prayer-times/monthly.ts#L61)

Prayer times result for a single day within the month.

## Properties

### date

> `readonly` **date**: [`DateOnly`](DateOnly.md)

Defined in: [src/prayer-times/monthly.ts:70](https://github.com/azkal182/islamic-utils/blob/a30827e72f5e43f868fff9ce519ca224296e663c/src/prayer-times/monthly.ts#L70)

Full date object.

***

### day

> `readonly` **day**: `number`

Defined in: [src/prayer-times/monthly.ts:65](https://github.com/azkal182/islamic-utils/blob/a30827e72f5e43f868fff9ce519ca224296e663c/src/prayer-times/monthly.ts#L65)

Day of the month (1-31).

***

### formatted

> `readonly` **formatted**: [`PrayerTimeStrings`](../type-aliases/PrayerTimeStrings.md)

Defined in: [src/prayer-times/monthly.ts:80](https://github.com/azkal182/islamic-utils/blob/a30827e72f5e43f868fff9ce519ca224296e663c/src/prayer-times/monthly.ts#L80)

Formatted time strings (HH:MM format).

***

### times

> `readonly` **times**: [`PrayerTimes`](../type-aliases/PrayerTimes.md)

Defined in: [src/prayer-times/monthly.ts:75](https://github.com/azkal182/islamic-utils/blob/a30827e72f5e43f868fff9ce519ca224296e663c/src/prayer-times/monthly.ts#L75)

Calculated prayer times in fractional hours.
