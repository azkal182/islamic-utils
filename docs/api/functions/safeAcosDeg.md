[**Islamic Utilities API v0.2.2**](../README.md)

***

[Islamic Utilities API](../README.md) / safeAcosDeg

# Function: safeAcosDeg()

> **safeAcosDeg**(`x`): `number`

Defined in: [src/core/utils/trigonometry.ts:238](https://github.com/azkal182/islamic-utils/blob/f548f22580afc5800e32e3785eef49f3fce9f58a/src/core/utils/trigonometry.ts#L238)

Safe arccosine that handles out-of-range values.

## Parameters

### x

`number`

Value (will be clamped to [-1, 1])

## Returns

`number`

Angle in degrees (0 to 180)

## Remarks

Due to floating-point precision issues, calculated values may slightly
exceed the valid range [-1, 1]. This function clamps the input to avoid NaN.

## Example

```typescript
safeAcosDeg(0.5);    // 60
safeAcosDeg(1.001);  // 0 (clamped to 1)
safeAcosDeg(-1.001); // 180 (clamped to -1)
```
