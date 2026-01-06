[**Islamic Utilities API v0.2.2**](../README.md)

***

[Islamic Utilities API](../README.md) / fixPrecision

# Function: fixPrecision()

> **fixPrecision**(`value`, `decimals`): `number`

Defined in: [src/core/utils/math.ts:226](https://github.com/azkal182/islamic-utils/blob/a30827e72f5e43f868fff9ce519ca224296e663c/src/core/utils/math.ts#L226)

Fixes floating-point precision issues by rounding to a specified number of decimal places.

## Parameters

### value

`number`

The value to fix

### decimals

`number` = `10`

Number of decimal places (default: 10)

## Returns

`number`

Fixed value

## Remarks

JavaScript floating-point arithmetic can produce results like 0.1 + 0.2 = 0.30000000000000004.
This function rounds to a reasonable precision to avoid such issues in comparisons.

## Example

```typescript
fixPrecision(0.1 + 0.2);              // 0.3
fixPrecision(1.0000000001);           // 1
fixPrecision(3.14159265359, 4);       // 3.1416
```
