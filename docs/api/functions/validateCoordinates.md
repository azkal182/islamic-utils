[**Islamic Utilities API v0.2.1**](../README.md)

***

[Islamic Utilities API](../README.md) / validateCoordinates

# Function: validateCoordinates()

> **validateCoordinates**(`coords`): [`Result`](../type-aliases/Result.md)\<[`Coordinates`](../interfaces/Coordinates.md)\>

Defined in: [src/core/validators/coordinates.ts:55](https://github.com/azkal182/islamic-utils/blob/6511551c69fa725f6e44569e9e1278849e32f702/src/core/validators/coordinates.ts#L55)

Validates geographic coordinates.

## Parameters

### coords

[`Coordinates`](../interfaces/Coordinates.md)

The coordinates to validate

## Returns

[`Result`](../type-aliases/Result.md)\<[`Coordinates`](../interfaces/Coordinates.md)\>

Success with validated coordinates, or failure with error details

## Remarks

Validation rules:
- Latitude must be between -90 (South Pole) and +90 (North Pole)
- Longitude must be between -180 and +180
- Altitude, if provided, must be >= 0
- Latitude and longitude must be finite numbers (not NaN, not Infinity)

## Example

```typescript
// Valid coordinates
const result1 = validateCoordinates({ latitude: -6.2088, longitude: 106.8456 });
// result1.success === true

// Invalid latitude
const result2 = validateCoordinates({ latitude: 100, longitude: 0 });
// result2.success === false
// result2.error.code === 'INVALID_COORDINATES'
```
