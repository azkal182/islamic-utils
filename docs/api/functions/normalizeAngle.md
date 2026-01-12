[**Islamic Utilities API v0.2.2**](../README.md)

***

[Islamic Utilities API](../README.md) / normalizeAngle

# Function: normalizeAngle()

> **normalizeAngle**(`degrees`): `number`

Defined in: [src/core/types/angle.ts:167](https://github.com/azkal182/islamic-utils/blob/f548f22580afc5800e32e3785eef49f3fce9f58a/src/core/types/angle.ts#L167)

Normalizes an angle to be within the range [0, 360).

## Parameters

### degrees

`number`

Angle in decimal degrees (any value)

## Returns

`number`

Normalized angle in range [0, 360)

## Example

```typescript
normalizeAngle(450);   // Returns: 90
normalizeAngle(-90);   // Returns: 270
normalizeAngle(360);   // Returns: 0
normalizeAngle(720);   // Returns: 0
```
