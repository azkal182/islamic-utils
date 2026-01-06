[**Islamic Utilities API v0.2.2**](../README.md)

***

[Islamic Utilities API](../README.md) / normalizeCoordinates

# Function: normalizeCoordinates()

> **normalizeCoordinates**(`coords`): `Required`\<[`Coordinates`](../interfaces/Coordinates.md)\>

Defined in: [src/core/validators/coordinates.ts:187](https://github.com/azkal182/islamic-utils/blob/a30827e72f5e43f868fff9ce519ca224296e663c/src/core/validators/coordinates.ts#L187)

Normalizes coordinates to standard ranges.

## Parameters

### coords

[`Coordinates`](../interfaces/Coordinates.md)

The coordinates to normalize

## Returns

`Required`\<[`Coordinates`](../interfaces/Coordinates.md)\>

Normalized coordinates with altitude defaulted to 0 if not provided

## Remarks

This function:
- Ensures longitude wraps around at the date line
- Defaults altitude to 0 if not provided
- Does NOT validate - use validateCoordinates first

## Example

```typescript
// Normalize longitude at date line
normalizeCoordinates({ latitude: 0, longitude: 181 });
// Result: { latitude: 0, longitude: -179, altitude: 0 }

// Default altitude
normalizeCoordinates({ latitude: 0, longitude: 0 });
// Result: { latitude: 0, longitude: 0, altitude: 0 }
```
