[**Islamic Utilities API v0.2.2**](../README.md)

***

[Islamic Utilities API](../README.md) / getNextPrayer

# Function: getNextPrayer()

> **getNextPrayer**(`location`, `timezone`, `params`, `currentTime`): [`Result`](../type-aliases/Result.md)\<[`NextPrayerInfo`](../interfaces/NextPrayerInfo.md)\>

Defined in: [src/prayer-times/next-prayer.ts:143](https://github.com/azkal182/islamic-utils/blob/a30827e72f5e43f868fff9ce519ca224296e663c/src/prayer-times/next-prayer.ts#L143)

Determines the next prayer based on current time.

## Parameters

### location

[`LocationInput`](../interfaces/LocationInput.md)

Geographic location (latitude, longitude)

### timezone

[`Timezone`](../type-aliases/Timezone.md)

IANA timezone name or UTC offset

### params

[`PrayerCalculationParams`](../interfaces/PrayerCalculationParams.md)

Calculation parameters (method, madhhab, etc.)

### currentTime

`Date` = `...`

Optional, defaults to new Date()

## Returns

[`Result`](../type-aliases/Result.md)\<[`NextPrayerInfo`](../interfaces/NextPrayerInfo.md)\>

Result containing next prayer info or error

## Example

```typescript
import { getNextPrayer, KEMENAG } from '@azkal182/islamic-utils';

const result = getNextPrayer(
  { latitude: -6.2088, longitude: 106.8456 },
  'Asia/Jakarta',
  { method: KEMENAG }
);

if (result.success) {
  console.log(`Next: ${result.data.name} at ${result.data.time}`);
  console.log(`In ${result.data.minutesUntil} minutes`);
}
```
