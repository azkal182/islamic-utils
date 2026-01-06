[**Islamic Utilities API v0.2.0**](../README.md)

***

[Islamic Utilities API](../README.md) / finalBearing

# Function: finalBearing()

> **finalBearing**(`from`, `to`): `number`

Defined in: [src/astronomy/angles.ts:82](https://github.com/azkal182/islamic-utils/blob/ddd04bee89289da73cadadfcee51cdeac187e097/src/astronomy/angles.ts#L82)

Calculates the final bearing (back azimuth) at the destination.

## Parameters

### from

[`Coordinates`](../interfaces/Coordinates.md)

Starting coordinates

### to

[`Coordinates`](../interfaces/Coordinates.md)

Destination coordinates

## Returns

`number`

Final bearing in degrees (0-360)

## Remarks

The final bearing is the direction you'd be facing when you arrive
at the destination after traveling along the great circle.
It's calculated as the reverse of the initial bearing from the destination.

## Example

```typescript
const jakarta = { latitude: -6.2088, longitude: 106.8456 };
const makkah = { latitude: 21.4225, longitude: 39.8262 };

finalBearing(jakarta, makkah);  // Direction facing when arriving at Makkah
```
