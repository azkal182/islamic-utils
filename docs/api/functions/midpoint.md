[**Islamic Utilities API v0.2.0**](../README.md)

***

[Islamic Utilities API](../README.md) / midpoint

# Function: midpoint()

> **midpoint**(`from`, `to`): [`Coordinates`](../interfaces/Coordinates.md)

Defined in: [src/astronomy/angles.ts:108](https://github.com/azkal182/islamic-utils/blob/ddd04bee89289da73cadadfcee51cdeac187e097/src/astronomy/angles.ts#L108)

Calculates the midpoint between two coordinates on a great circle.

## Parameters

### from

[`Coordinates`](../interfaces/Coordinates.md)

Starting coordinates

### to

[`Coordinates`](../interfaces/Coordinates.md)

Ending coordinates

## Returns

[`Coordinates`](../interfaces/Coordinates.md)

Midpoint coordinates

## Remarks

The midpoint is the point exactly halfway along the great circle path.
This is NOT the same as averaging the coordinates.

## Example

```typescript
const london = { latitude: 51.5, longitude: -0.1 };
const tokyo = { latitude: 35.7, longitude: 139.7 };

midpoint(london, tokyo);
// Returns coordinates somewhere over Russia
```
