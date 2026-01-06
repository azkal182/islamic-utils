[**Islamic Utilities API v0.2.2**](../README.md)

***

[Islamic Utilities API](../README.md) / fractionDayOfYear

# Function: fractionDayOfYear()

> **fractionDayOfYear**(`date`, `hours`): `number`

Defined in: [src/astronomy/time.ts:251](https://github.com/azkal182/islamic-utils/blob/a30827e72f5e43f868fff9ce519ca224296e663c/src/astronomy/time.ts#L251)

Gets the fractional day of the year.

## Parameters

### date

[`DateOnly`](../interfaces/DateOnly.md)

The date

### hours

`number` = `0`

Time in fractional hours (optional, default 0)

## Returns

`number`

Fractional day of year (1.0 = midnight on Jan 1)

## Remarks

This is used in some astronomical formulas that require the
day of year with time precision.

## Example

```typescript
// Noon on January 15
fractionDayOfYear({ year: 2024, month: 1, day: 15 }, 12);
// 15.5

// 6 AM on February 1
fractionDayOfYear({ year: 2024, month: 2, day: 1 }, 6);
// 32.25
```
