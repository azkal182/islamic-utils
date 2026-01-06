[**Islamic Utilities API v0.2.0**](../README.md)

***

[Islamic Utilities API](../README.md) / hourAngle

# Function: hourAngle()

> **hourAngle**(`latitude`, `declination`, `elevation`): `number` \| `null`

Defined in: [src/astronomy/solar.ts:319](https://github.com/azkal182/islamic-utils/blob/0df9a3737b1fb38d644e36b5ae34cdf225bc89df/src/astronomy/solar.ts#L319)

Calculates the hour angle for a given sun elevation.

## Parameters

### latitude

`number`

Observer's latitude in degrees

### declination

`number`

Sun's declination in degrees

### elevation

`number`

Target sun elevation in degrees (e.g., -18 for Fajr)

## Returns

`number` \| `null`

Hour angle in degrees, or null if the sun never reaches that elevation

## Remarks

The hour angle is the angular distance of the sun from the observer's
meridian (solar noon = 0°). For sunrise/sunset, we typically use
elevation = -0.833° (accounting for refraction).

Returns null for polar day/night situations where the sun never
reaches the specified elevation.

## Example

```typescript
// Calculate hour angle for sunrise (elevation = -0.833°)
hourAngle(51.5, 23.4, -0.833);  // Returns angle in degrees

// High latitude in summer (sun doesn't set)
hourAngle(70, 23.4, -0.833);    // May return null
```
