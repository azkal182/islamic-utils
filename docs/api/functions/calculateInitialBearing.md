[**Islamic Utilities API v0.2.0**](../README.md)

***

[Islamic Utilities API](../README.md) / calculateInitialBearing

# Function: calculateInitialBearing()

> **calculateInitialBearing**(`from`, `to`): `number`

Defined in: [src/qibla/great-circle.ts:49](https://github.com/azkal182/islamic-utils/blob/0df9a3737b1fb38d644e36b5ae34cdf225bc89df/src/qibla/great-circle.ts#L49)

Calculates the initial bearing (forward azimuth) from one point to another.

## Parameters

### from

[`Coordinates`](../interfaces/Coordinates.md)

Starting coordinates

### to

[`Coordinates`](../interfaces/Coordinates.md)

Destination coordinates

## Returns

`number`

Initial bearing in degrees (0-360, clockwise from north)

## Remarks

The initial bearing is the direction to travel at the START of the journey.
For a great-circle route, the bearing changes continuously along the path.

Formula:
```
θ = atan2(sin(Δλ) × cos(φ₂),
          cos(φ₁) × sin(φ₂) − sin(φ₁) × cos(φ₂) × cos(Δλ))
```

## Example

```typescript
// Bearing from Jakarta to Makkah
const bearing = calculateInitialBearing(
  { latitude: -6.2088, longitude: 106.8456 },
  { latitude: 21.4225, longitude: 39.8262 }
);
console.log(bearing); // ~295° (WNW)
```
