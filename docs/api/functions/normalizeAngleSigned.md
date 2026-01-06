[**Islamic Utilities API v0.2.1**](../README.md)

***

[Islamic Utilities API](../README.md) / normalizeAngleSigned

# Function: normalizeAngleSigned()

> **normalizeAngleSigned**(`degrees`): `number`

Defined in: [src/core/types/angle.ts:190](https://github.com/azkal182/islamic-utils/blob/6511551c69fa725f6e44569e9e1278849e32f702/src/core/types/angle.ts#L190)

Normalizes an angle to be within the range [-180, 180).

## Parameters

### degrees

`number`

Angle in decimal degrees (any value)

## Returns

`number`

Normalized angle in range [-180, 180)

## Remarks

This is useful for representing relative angles or bearings
where you want to distinguish between "turn left" and "turn right".

## Example

```typescript
normalizeAngleSigned(270);   // Returns: -90
normalizeAngleSigned(-270);  // Returns: 90
normalizeAngleSigned(180);   // Returns: 180
normalizeAngleSigned(450);   // Returns: 90
```
