[**Islamic Utilities API v0.2.1**](../README.md)

***

[Islamic Utilities API](../README.md) / acosDeg

# Function: acosDeg()

> **acosDeg**(`x`): `number`

Defined in: [src/core/utils/trigonometry.ts:150](https://github.com/azkal182/islamic-utils/blob/6511551c69fa725f6e44569e9e1278849e32f702/src/core/utils/trigonometry.ts#L150)

Arccosine function that returns degrees.

## Parameters

### x

`number`

Value between -1 and 1

## Returns

`number`

Angle in degrees (0 to 180)

## Example

```typescript
acosDeg(1);     // 0
acosDeg(0.5);   // 60
acosDeg(0);     // 90
acosDeg(-1);    // 180
```
