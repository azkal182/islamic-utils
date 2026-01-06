[**Islamic Utilities API v0.2.2**](../README.md)

***

[Islamic Utilities API](../README.md) / computeMonthlyPrayerTimes

# Function: computeMonthlyPrayerTimes()

> **computeMonthlyPrayerTimes**(`input`, `options`): [`Result`](../type-aliases/Result.md)\<[`MonthlyPrayerTimesResult`](../interfaces/MonthlyPrayerTimesResult.md)\>

Defined in: [src/prayer-times/monthly.ts:179](https://github.com/azkal182/islamic-utils/blob/a30827e72f5e43f868fff9ce519ca224296e663c/src/prayer-times/monthly.ts#L179)

Computes prayer times for an entire month.

## Parameters

### input

[`MonthlyPrayerTimesInput`](../interfaces/MonthlyPrayerTimesInput.md)

Monthly calculation input

### options

[`CalculatorOptions`](../interfaces/CalculatorOptions.md) = `{}`

Optional calculator options

## Returns

[`Result`](../type-aliases/Result.md)\<[`MonthlyPrayerTimesResult`](../interfaces/MonthlyPrayerTimesResult.md)\>

Result containing prayer times for each day or error

## Example

```typescript
import { computeMonthlyPrayerTimes, CALCULATION_METHODS } from '@azkal182/islamic-utils';

const result = computeMonthlyPrayerTimes({
  year: 2024,
  month: 1, // January
  location: { latitude: -6.2088, longitude: 106.8456 },
  timezone: 7,
  params: { method: CALCULATION_METHODS.KEMENAG },
});

if (result.success) {
  for (const day of result.data.days) {
    console.log(`Day ${day.day}: Fajr ${day.formatted.fajr}`);
  }
}
```
