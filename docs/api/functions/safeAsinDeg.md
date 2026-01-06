[**Islamic Utilities API v0.2.1**](../README.md)

***

[Islamic Utilities API](../README.md) / safeAsinDeg

# Function: safeAsinDeg()

> **safeAsinDeg**(`x`): `number`

Defined in: [src/core/utils/trigonometry.ts:256](https://github.com/azkal182/islamic-utils/blob/6511551c69fa725f6e44569e9e1278849e32f702/src/core/utils/trigonometry.ts#L256)

Safe arcsine that handles out-of-range values.

## Parameters

### x

`number`

Value (will be clamped to [-1, 1])

## Returns

`number`

Angle in degrees (-90 to 90)

## Example

```typescript
safeAsinDeg(0.5);    // 30
safeAsinDeg(1.001);  // 90 (clamped to 1)
safeAsinDeg(-1.001); // -90 (clamped to -1)
```
