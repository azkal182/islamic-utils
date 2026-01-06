[**Islamic Utilities API v0.2.1**](../README.md)

***

[Islamic Utilities API](../README.md) / computePrayerTimes

# Function: computePrayerTimes()

> **computePrayerTimes**(`location`, `timeContext`, `params`, `options`): [`Result`](../type-aliases/Result.md)\<[`PrayerTimesResult`](../interfaces/PrayerTimesResult.md)\>

Defined in: [src/prayer-times/calculator.ts:167](https://github.com/azkal182/islamic-utils/blob/6511551c69fa725f6e44569e9e1278849e32f702/src/prayer-times/calculator.ts#L167)

Computes all prayer times for a given location, date, and parameters.

## Parameters

### location

[`LocationInput`](../interfaces/LocationInput.md)

Geographic location (latitude, longitude, optional altitude)

### timeContext

[`PrayerTimeContext`](../interfaces/PrayerTimeContext.md)

Date and timezone

### params

[`PrayerCalculationParams`](../interfaces/PrayerCalculationParams.md)

Calculation parameters (method, madhhab, rules, adjustments)

### options

[`CalculatorOptions`](../interfaces/CalculatorOptions.md) = `{}`

Calculator options (includeTrace)

## Returns

[`Result`](../type-aliases/Result.md)\<[`PrayerTimesResult`](../interfaces/PrayerTimesResult.md)\>

Result containing prayer times or error

## Remarks

This is the main entry point for prayer time calculations.

**Calculation Flow:**
1. Validate all inputs
2. Calculate solar position for the date
3. Calculate core times (Fajr, Sunrise, Dhuhr, Asr, Maghrib, Isha)
4. Apply high latitude rules if needed
5. Calculate Imsak and Dhuha
6. Apply adjustments and safety buffer
7. Apply rounding
8. Validate time sequence
9. Return formatted result

## Example

```typescript
import { computePrayerTimes, CALCULATION_METHODS } from 'islamic-utils';

const result = computePrayerTimes(
  { latitude: -6.2088, longitude: 106.8456 },
  { date: { year: 2024, month: 1, day: 15 }, timezone: 'Asia/Jakarta' },
  { method: CALCULATION_METHODS.KEMENAG }
);

if (result.success) {
  console.log('Fajr:', result.data.formatted.fajr);
  console.log('Maghrib:', result.data.formatted.maghrib);
}
```
