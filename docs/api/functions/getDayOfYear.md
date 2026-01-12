[**Islamic Utilities API v0.2.2**](../README.md)

***

[Islamic Utilities API](../README.md) / getDayOfYear

# Function: getDayOfYear()

> **getDayOfYear**(`date`): `number`

Defined in: [src/core/validators/date.ts:196](https://github.com/azkal182/islamic-utils/blob/f548f22580afc5800e32e3785eef49f3fce9f58a/src/core/validators/date.ts#L196)

Gets the day of the year (1-366).

## Parameters

### date

[`DateOnly`](../interfaces/DateOnly.md)

The date to calculate

## Returns

`number`

Day of year (1 = January 1, 365/366 = December 31)

## Remarks

This is useful for astronomical calculations where the day of year
is used to determine the sun's position.

## Example

```typescript
getDayOfYear({ year: 2024, month: 1, day: 1 });   // 1
getDayOfYear({ year: 2024, month: 12, day: 31 }); // 366 (leap year)
getDayOfYear({ year: 2023, month: 12, day: 31 }); // 365
```
