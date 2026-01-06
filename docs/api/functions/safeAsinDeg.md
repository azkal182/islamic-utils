[**Islamic Utilities API v0.2.0**](../README.md)

***

[Islamic Utilities API](../README.md) / safeAsinDeg

# Function: safeAsinDeg()

> **safeAsinDeg**(`x`): `number`

Defined in: [src/core/utils/trigonometry.ts:256](https://github.com/azkal182/islamic-utils/blob/0df9a3737b1fb38d644e36b5ae34cdf225bc89df/src/core/utils/trigonometry.ts#L256)

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
