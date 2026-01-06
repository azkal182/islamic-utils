[**Islamic Utilities API v0.2.0**](../README.md)

***

[Islamic Utilities API](../README.md) / isHighLatitude

# Function: isHighLatitude()

> **isHighLatitude**(`coords`, `threshold`): `boolean`

Defined in: [src/core/validators/coordinates.ts:160](https://github.com/azkal182/islamic-utils/blob/0df9a3737b1fb38d644e36b5ae34cdf225bc89df/src/core/validators/coordinates.ts#L160)

Checks if coordinates are in a high-latitude region.

## Parameters

### coords

[`Coordinates`](../interfaces/Coordinates.md)

The coordinates to check

### threshold

`number` = `48.5`

Latitude threshold in degrees (default: 48.5)

## Returns

`boolean`

True if absolute latitude exceeds the threshold

## Remarks

High latitude regions may have issues with Fajr/Isha calculations
because the sun may not reach the required angles.

Common thresholds:
- 48.5° - Fajr/Isha may be undefined in summer
- 60° - Midnight sun region
- 66.5° - Arctic/Antarctic circle

## Example

```typescript
// London (51.5°N) - high latitude
isHighLatitude({ latitude: 51.5, longitude: -0.1 }); // true

// Jakarta (6°S) - not high latitude
isHighLatitude({ latitude: -6.2, longitude: 106.8 }); // false

// Custom threshold
isHighLatitude({ latitude: 55, longitude: 0 }, 60); // false
```
