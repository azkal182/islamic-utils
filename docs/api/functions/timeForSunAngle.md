[**Islamic Utilities API v0.2.2**](../README.md)

***

[Islamic Utilities API](../README.md) / timeForSunAngle

# Function: timeForSunAngle()

> **timeForSunAngle**(`julianDay`, `latitude`, `longitude`, `timezone`, `angle`, `rising`): `number` \| `null`

Defined in: [src/astronomy/solar.ts:401](https://github.com/azkal182/islamic-utils/blob/f548f22580afc5800e32e3785eef49f3fce9f58a/src/astronomy/solar.ts#L401)

Calculates the time for a given sun elevation angle.

## Parameters

### julianDay

`number`

Julian Day Number

### latitude

`number`

Observer's latitude in degrees

### longitude

`number`

Observer's longitude in degrees

### timezone

`number`

Timezone offset in hours from UTC

### angle

`number`

Target sun elevation angle in degrees

### rising

`boolean`

True for morning (before noon), false for afternoon

## Returns

`number` \| `null`

Time as fractional hours, or null if sun doesn't reach angle

## Remarks

This is the core function used to calculate prayer times.
- For sunrise: angle = -0.833, rising = true
- For Fajr: angle = -18 (or method-specific), rising = true
- For sunset/Maghrib: angle = -0.833, rising = false
- For Isha: angle = -17 (or method-specific), rising = false

## Example

```typescript
const jd = dateToJulianDay(2024, 1, 15);

// Sunrise
timeForSunAngle(jd, -6.2, 106.8, 7, -0.833, true);

// Fajr (with 20° angle)
timeForSunAngle(jd, -6.2, 106.8, 7, -20, true);
```
