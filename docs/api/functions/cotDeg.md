[**Islamic Utilities API v0.2.0**](../README.md)

***

[Islamic Utilities API](../README.md) / cotDeg

# Function: cotDeg()

> **cotDeg**(`degrees`): `number`

Defined in: [src/core/utils/trigonometry.ts:114](https://github.com/azkal182/islamic-utils/blob/ddd04bee89289da73cadadfcee51cdeac187e097/src/core/utils/trigonometry.ts#L114)

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
