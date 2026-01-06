[**Islamic Utilities API v0.2.2**](../README.md)

***

[Islamic Utilities API](../README.md) / isCoordinatesLike

# Function: isCoordinatesLike()

> **isCoordinatesLike**(`obj`): `obj is Coordinates`

Defined in: [src/core/types/coordinates.ts:103](https://github.com/azkal182/islamic-utils/blob/a30827e72f5e43f868fff9ce519ca224296e663c/src/core/types/coordinates.ts#L103)

Type guard to check if an object is a valid Coordinates interface.

## Parameters

### obj

`unknown`

The object to check

## Returns

`obj is Coordinates`

True if the object matches the Coordinates interface structure

## Example

```typescript
const data = JSON.parse(userInput);
if (isCoordinatesLike(data)) {
  // TypeScript now knows data is Coordinates
  console.log(data.latitude);
}
```
