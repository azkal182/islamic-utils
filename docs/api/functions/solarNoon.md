[**Islamic Utilities API v0.2.0**](../README.md)

***

[Islamic Utilities API](../README.md) / solarNoon

# Function: solarNoon()

> **solarNoon**(`longitude`, `timezone`, `julianDay`): `number`

Defined in: [src/astronomy/solar.ts:362](https://github.com/azkal182/islamic-utils/blob/ddd04bee89289da73cadadfcee51cdeac187e097/src/astronomy/solar.ts#L362)

Calculates solar noon (when the sun crosses the local meridian).

## Parameters

### longitude

`number`

Observer's longitude in degrees

### timezone

`number`

Timezone offset in hours from UTC

### julianDay

`number`

Julian Day Number

## Returns

`number`

Solar noon as fractional hours (local time)

## Remarks

Solar noon is when the sun is at its highest point in the sky for the day.
This is the basis for calculating all other prayer times.

## Example

```typescript
// Jakarta (longitude 106.8456°, timezone UTC+7)
const jd = dateToJulianDay(2024, 1, 15);
solarNoon(106.8456, 7, jd);  // Returns approximately 11.9 (11:54 AM)
```
