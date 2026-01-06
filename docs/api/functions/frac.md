[**Islamic Utilities API v0.2.1**](../README.md)

***

[Islamic Utilities API](../README.md) / frac

# Function: frac()

> **frac**(`x`): `number`

Defined in: [src/core/utils/math.ts:180](https://github.com/azkal182/islamic-utils/blob/6511551c69fa725f6e44569e9e1278849e32f702/src/core/utils/math.ts#L180)

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
