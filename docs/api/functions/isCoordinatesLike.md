[**Islamic Utilities API v0.2.1**](../README.md)

***

[Islamic Utilities API](../README.md) / isCoordinatesLike

# Function: isCoordinatesLike()

> **isCoordinatesLike**(`obj`): `obj is Coordinates`

Defined in: [src/core/types/coordinates.ts:103](https://github.com/azkal182/islamic-utils/blob/6511551c69fa725f6e44569e9e1278849e32f702/src/core/types/coordinates.ts#L103)

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
