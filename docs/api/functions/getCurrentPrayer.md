[**Islamic Utilities API v0.2.1**](../README.md)

***

[Islamic Utilities API](../README.md) / getCurrentPrayer

# Function: getCurrentPrayer()

> **getCurrentPrayer**(`currentTime`, `prayerTimes`, `timezone`): [`CurrentPrayerInfo`](../interfaces/CurrentPrayerInfo.md)

Defined in: src/prayer-times/next-prayer.ts:195

Determines the current prayer period.

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

[`CurrentPrayerInfo`](../interfaces/CurrentPrayerInfo.md)

Current prayer period info

## Example

```typescript
const current = getCurrentPrayer(new Date(), result.data, 7);
if (current.current) {
  console.log(`Current period: ${current.current}`);
}
```
