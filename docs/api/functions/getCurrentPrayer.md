[**Islamic Utilities API v0.2.2**](../README.md)

***

[Islamic Utilities API](../README.md) / getCurrentPrayer

# Function: getCurrentPrayer()

> **getCurrentPrayer**(`location`, `timezone`, `params`, `currentTime`): [`Result`](../type-aliases/Result.md)\<[`CurrentPrayerInfo`](../interfaces/CurrentPrayerInfo.md)\>

Defined in: [src/prayer-times/next-prayer.ts:247](https://github.com/azkal182/islamic-utils/blob/a30827e72f5e43f868fff9ce519ca224296e663c/src/prayer-times/next-prayer.ts#L247)

Determines the current prayer period.

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

[`Result`](../type-aliases/Result.md)\<[`CurrentPrayerInfo`](../interfaces/CurrentPrayerInfo.md)\>

Result containing current prayer info or error

## Example

```typescript
const result = getCurrentPrayer(
  { latitude: -6.2088, longitude: 106.8456 },
  'Asia/Jakarta',
  { method: KEMENAG }
);

if (result.success && result.data.current) {
  console.log(`Current period: ${result.data.current}`);
}
```
