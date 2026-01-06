[**Islamic Utilities API v0.2.0**](../README.md)

***

[Islamic Utilities API](../README.md) / initialBearing

# Function: initialBearing()

> **initialBearing**(`from`, `to`): `number`

Defined in: [src/astronomy/angles.ts:45](https://github.com/azkal182/islamic-utils/blob/0df9a3737b1fb38d644e36b5ae34cdf225bc89df/src/astronomy/angles.ts#L45)

Calculates the initial bearing (forward azimuth) for navigation.

## Parameters

### from

[`Coordinates`](../interfaces/Coordinates.md)

Starting coordinates

### to

[`Coordinates`](../interfaces/Coordinates.md)

Destination coordinates

## Returns

`number`

Initial bearing in degrees (0-360, where 0 = North)

## Remarks

Uses the spherical law of cosines to calculate the great-circle
initial bearing. This is the direction to face at the starting
point to travel along the shortest path to the destination.

The formula is:
```
θ = atan2(sin(Δλ) × cos(φ₂),
          cos(φ₁) × sin(φ₂) − sin(φ₁) × cos(φ₂) × cos(Δλ))
```

Where:
- φ₁ = starting latitude
- φ₂ = ending latitude
- Δλ = difference in longitude

## Example

```typescript
// Jakarta to Makkah
const jakarta = { latitude: -6.2088, longitude: 106.8456 };
const makkah = { latitude: 21.4225, longitude: 39.8262 };

initialBearing(jakarta, makkah);  // approximately 295°
```
