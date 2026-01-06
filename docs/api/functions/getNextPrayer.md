[**Islamic Utilities API v0.2.1**](../README.md)

***

[Islamic Utilities API](../README.md) / getNextPrayer

# Function: getNextPrayer()

> **getNextPrayer**(`currentTime`, `prayerTimes`, `timezone`): [`NextPrayerInfo`](../interfaces/NextPrayerInfo.md)

Defined in: src/prayer-times/next-prayer.ts:121

Determines the next prayer based on current time.

## Parameters

### currentTime

`Date`

JavaScript Date object representing current time

### prayerTimes

[`PrayerTimesResult`](../interfaces/PrayerTimesResult.md)

Result from computePrayerTimes

### timezone

[`Timezone`](../type-aliases/Timezone.md)

IANA timezone name or UTC offset

## Returns

[`NextPrayerInfo`](../interfaces/NextPrayerInfo.md)

Next prayer information

## Example

```typescript
import { computePrayerTimes, getNextPrayer, CALCULATION_METHODS } from '@azkal182/islamic-utils';

const result = computePrayerTimes(
  { latitude: -6.2088, longitude: 106.8456 },
  { date: { year: 2024, month: 1, day: 15 }, timezone: 7 },
  { method: CALCULATION_METHODS.KEMENAG }
);

if (result.success) {
  const next = getNextPrayer(new Date(), result.data, 7);
  console.log(`Next: ${next.name} at ${next.time}`);
  console.log(`In ${next.minutesUntil} minutes`);
}
```
