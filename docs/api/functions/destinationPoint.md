[**Islamic Utilities API v0.2.2**](../README.md)

***

[Islamic Utilities API](../README.md) / destinationPoint

# Function: destinationPoint()

> **destinationPoint**(`start`, `bearing`, `distance`): [`Coordinates`](../interfaces/Coordinates.md)

Defined in: [src/astronomy/angles.ts:148](https://github.com/azkal182/islamic-utils/blob/a30827e72f5e43f868fff9ce519ca224296e663c/src/astronomy/angles.ts#L148)

Calculates the destination point given start, bearing, and distance.

## Parameters

### start

[`Coordinates`](../interfaces/Coordinates.md)

Starting coordinates

### bearing

`number`

Initial bearing in degrees (0-360)

### distance

`number`

Distance in kilometers

## Returns

[`Coordinates`](../interfaces/Coordinates.md)

Destination coordinates

## Remarks

Uses the spherical law of cosines to calculate the destination point.
Assumes Earth is a sphere with radius 6371 km.

## Example

```typescript
// 100 km due north from Jakarta
destinationPoint(
  { latitude: -6.2088, longitude: 106.8456 },
  0,     // North
  100    // 100 km
);
```
