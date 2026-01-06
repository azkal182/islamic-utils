[**Islamic Utilities API v0.2.2**](../README.md)

***

[Islamic Utilities API](../README.md) / atan2Deg

# Function: atan2Deg()

> **atan2Deg**(`y`, `x`): `number`

Defined in: [src/core/utils/trigonometry.ts:192](https://github.com/azkal182/islamic-utils/blob/a30827e72f5e43f868fff9ce519ca224296e663c/src/core/utils/trigonometry.ts#L192)

Two-argument arctangent that returns degrees.

## Parameters

### y

`number`

Y coordinate

### x

`number`

X coordinate

## Returns

`number`

Angle in degrees (-180 to 180)

## Remarks

atan2 is preferred over atan for computing the angle of a vector
because it handles all quadrants correctly and avoids division by zero.

## Example

```typescript
atan2Deg(1, 1);    // 45 (first quadrant)
atan2Deg(1, -1);   // 135 (second quadrant)
atan2Deg(-1, -1);  // -135 (third quadrant)
atan2Deg(-1, 1);   // -45 (fourth quadrant)
atan2Deg(0, 1);    // 0 (positive x-axis)
atan2Deg(1, 0);    // 90 (positive y-axis)
```
