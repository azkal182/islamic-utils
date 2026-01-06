[**Islamic Utilities API v0.2.0**](../README.md)

***

[Islamic Utilities API](../README.md) / PrayerTimes

# Type Alias: PrayerTimes

> **PrayerTimes** = `Record`\<[`PrayerName`](PrayerName.md), `number` \| `null`\>

Defined in: [src/prayer-times/types.ts:483](https://github.com/azkal182/islamic-utils/blob/0df9a3737b1fb38d644e36b5ae34cdf225bc89df/src/prayer-times/types.ts#L483)

Calculated prayer times for a single day.

## Remarks

Times are in fractional hours (0-24).
A null value indicates the time could not be calculated
(e.g., polar regions without high latitude rule).
