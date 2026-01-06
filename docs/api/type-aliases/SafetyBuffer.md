[**Islamic Utilities API v0.2.0**](../README.md)

***

[Islamic Utilities API](../README.md) / SafetyBuffer

# Type Alias: SafetyBuffer

> **SafetyBuffer** = `number` \| `Partial`\<`Record`\<[`PrayerName`](PrayerName.md), `number`\>\>

Defined in: [src/prayer-times/types.ts:391](https://github.com/azkal182/islamic-utils/blob/0df9a3737b1fb38d644e36b5ae34cdf225bc89df/src/prayer-times/types.ts#L391)

Safety buffer (ihtiyath) configuration.

## Remarks

Safety buffer is added to prayer times as a precaution.
Can be a single value applied to all prayers or per-prayer values.
