[**Islamic Utilities API v0.2.1**](../README.md)

***

[Islamic Utilities API](../README.md) / PrayerTimes

# Type Alias: PrayerTimes

> **PrayerTimes** = `Record`\<[`PrayerName`](PrayerName.md), `number` \| `null`\>

Defined in: [src/prayer-times/types.ts:483](https://github.com/azkal182/islamic-utils/blob/6511551c69fa725f6e44569e9e1278849e32f702/src/prayer-times/types.ts#L483)

Calculated prayer times for a single day.

## Remarks

Times are in fractional hours (0-24).
A null value indicates the time could not be calculated
(e.g., polar regions without high latitude rule).
