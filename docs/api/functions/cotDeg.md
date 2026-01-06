[**Islamic Utilities API v0.2.2**](../README.md)

***

[Islamic Utilities API](../README.md) / cotDeg

# Function: cotDeg()

> **cotDeg**(`degrees`): `number`

Defined in: [src/core/utils/trigonometry.ts:114](https://github.com/azkal182/islamic-utils/blob/a30827e72f5e43f868fff9ce519ca224296e663c/src/core/utils/trigonometry.ts#L114)

Cotangent function that takes degrees.

## Parameters

### degrees

`number`

Angle in degrees

## Returns

`number`

Cotangent of the angle (1/tan)

## Example

```typescript
cotDeg(45);   // 1
cotDeg(30);   // 1.732... (√3)
cotDeg(60);   // 0.577... (1/√3)
```
