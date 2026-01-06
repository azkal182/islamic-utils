[**Islamic Utilities API v0.2.2**](../README.md)

***

[Islamic Utilities API](../README.md) / frac

# Function: frac()

> **frac**(`x`): `number`

Defined in: [src/core/utils/math.ts:180](https://github.com/azkal182/islamic-utils/blob/a30827e72f5e43f868fff9ce519ca224296e663c/src/core/utils/math.ts#L180)

Calculates the fractional part of a number.

## Parameters

### x

`number`

The number

## Returns

`number`

Fractional part (always positive)

## Example

```typescript
frac(5.7);   // 0.7
frac(-5.7);  // 0.3 (positive fractional part)
frac(5.0);   // 0.0
```
