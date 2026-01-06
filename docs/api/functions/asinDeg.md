[**Islamic Utilities API v0.2.2**](../README.md)

***

[Islamic Utilities API](../README.md) / asinDeg

# Function: asinDeg()

> **asinDeg**(`x`): `number`

Defined in: [src/core/utils/trigonometry.ts:132](https://github.com/azkal182/islamic-utils/blob/a30827e72f5e43f868fff9ce519ca224296e663c/src/core/utils/trigonometry.ts#L132)

Arcsine function that returns degrees.

## Parameters

### x

`number`

Value between -1 and 1

## Returns

`number`

Angle in degrees (-90 to 90)

## Example

```typescript
asinDeg(0);     // 0
asinDeg(0.5);   // 30
asinDeg(1);     // 90
asinDeg(-1);    // -90
```
