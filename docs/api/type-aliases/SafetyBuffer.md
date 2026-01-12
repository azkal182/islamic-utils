[**Islamic Utilities API v0.2.2**](../README.md)

***

[Islamic Utilities API](../README.md) / SafetyBuffer

# Type Alias: SafetyBuffer

> **SafetyBuffer** = `number` \| `Partial`\<`Record`\<[`PrayerName`](PrayerName.md), `number`\>\>

Defined in: [src/prayer-times/types.ts:391](https://github.com/azkal182/islamic-utils/blob/f548f22580afc5800e32e3785eef49f3fce9f58a/src/prayer-times/types.ts#L391)

Safety buffer (ihtiyath) configuration.

## Remarks

Safety buffer is added to prayer times as a precaution.
Can be a single value applied to all prayers or per-prayer values.
