[**Islamic Utilities API v0.2.2**](../README.md)

***

[Islamic Utilities API](../README.md) / PrayerTimes

# Type Alias: PrayerTimes

> **PrayerTimes** = `Record`\<[`PrayerName`](PrayerName.md), `number` \| `null`\>

Defined in: [src/prayer-times/types.ts:483](https://github.com/azkal182/islamic-utils/blob/a30827e72f5e43f868fff9ce519ca224296e663c/src/prayer-times/types.ts#L483)

Calculated prayer times for a single day.

## Remarks

Times are in fractional hours (0-24).
A null value indicates the time could not be calculated
(e.g., polar regions without high latitude rule).
