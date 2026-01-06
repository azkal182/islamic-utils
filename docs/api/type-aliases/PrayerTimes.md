[**Islamic Utilities API v0.2.0**](../README.md)

***

[Islamic Utilities API](../README.md) / PrayerTimes

# Type Alias: PrayerTimes

> **PrayerTimes** = `Record`\<[`PrayerName`](PrayerName.md), `number` \| `null`\>

Defined in: [src/prayer-times/types.ts:483](https://github.com/azkal182/islamic-utils/blob/ddd04bee89289da73cadadfcee51cdeac187e097/src/prayer-times/types.ts#L483)

Calculated prayer times for a single day.

## Remarks

Times are in fractional hours (0-24).
A null value indicates the time could not be calculated
(e.g., polar regions without high latitude rule).
