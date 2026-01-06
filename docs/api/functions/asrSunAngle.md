[**Islamic Utilities API v0.2.1**](../README.md)

***

[Islamic Utilities API](../README.md) / asrSunAngle

# Function: asrSunAngle()

> **asrSunAngle**(`latitude`, `declination`, `shadowFactor`): `number`

Defined in: [src/astronomy/solar.ts:446](https://github.com/azkal182/islamic-utils/blob/6511551c69fa725f6e44569e9e1278849e32f702/src/astronomy/solar.ts#L446)

Calculates shadow length ratio for Asr time calculation.

## Parameters

### latitude

`number`

Observer's latitude in degrees

### declination

`number`

Sun's declination in degrees

### shadowFactor

Shadow length factor (1 for Shafi'i, 2 for Hanafi)

`1` | `2`

## Returns

`number`

Sun elevation angle in degrees when shadow reaches the factor

## Remarks

In Islamic fiqh, Asr begins when an object's shadow equals its length
plus the shadow at solar noon (Shafi'i/Maliki/Hanbali) or twice that (Hanafi).

## Example

```typescript
// Shafi'i/Maliki/Hanbali: shadow = 1x + noon shadow
asrSunAngle(latitude, declination, 1);

// Hanafi: shadow = 2x + noon shadow
asrSunAngle(latitude, declination, 2);
```
