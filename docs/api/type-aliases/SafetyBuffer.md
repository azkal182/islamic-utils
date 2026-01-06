[**Islamic Utilities API v0.2.1**](../README.md)

***

[Islamic Utilities API](../README.md) / SafetyBuffer

# Type Alias: SafetyBuffer

> **SafetyBuffer** = `number` \| `Partial`\<`Record`\<[`PrayerName`](PrayerName.md), `number`\>\>

Defined in: [src/prayer-times/types.ts:391](https://github.com/azkal182/islamic-utils/blob/6511551c69fa725f6e44569e9e1278849e32f702/src/prayer-times/types.ts#L391)

Safety buffer (ihtiyath) configuration.

## Remarks

Safety buffer is added to prayer times as a precaution.
Can be a single value applied to all prayers or per-prayer values.
