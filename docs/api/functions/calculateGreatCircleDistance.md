[**Islamic Utilities API v0.2.0**](../README.md)

***

[Islamic Utilities API](../README.md) / calculateGreatCircleDistance

# Function: calculateGreatCircleDistance()

> **calculateGreatCircleDistance**(`from`, `to`): `number`

Defined in: [src/qibla/great-circle.ts:109](https://github.com/azkal182/islamic-utils/blob/0df9a3737b1fb38d644e36b5ae34cdf225bc89df/src/qibla/great-circle.ts#L109)

Calculates the great-circle distance between two points using Haversine formula.

## Parameters

### from

[`Coordinates`](../interfaces/Coordinates.md)

Starting coordinates

### to

[`Coordinates`](../interfaces/Coordinates.md)

Destination coordinates

## Returns

`number`

Distance in kilometers

## Remarks

The Haversine formula is numerically stable for small distances.

Formula:
```
a = sin²(Δφ/2) + cos(φ₁) × cos(φ₂) × sin²(Δλ/2)
c = 2 × atan2(√a, √(1−a))
d = R × c
```

## Example

```typescript
const distance = calculateGreatCircleDistance(
  { latitude: -6.2088, longitude: 106.8456 },
  { latitude: 21.4225, longitude: 39.8262 }
);
console.log(distance); // ~7985 km
```
