[**Islamic Utilities API v0.2.1**](../README.md)

***

[Islamic Utilities API](../README.md) / isLeapYear

# Function: isLeapYear()

> **isLeapYear**(`year`): `boolean`

Defined in: [src/core/validators/date.ts:51](https://github.com/azkal182/islamic-utils/blob/6511551c69fa725f6e44569e9e1278849e32f702/src/core/validators/date.ts#L51)

Checks if a year is a leap year.

## Parameters

### year

`number`

The year to check

## Returns

`boolean`

True if the year is a leap year

## Remarks

Leap year rules:
1. Divisible by 4
2. NOT divisible by 100, unless...
3. Divisible by 400

## Example

```typescript
isLeapYear(2024); // true (divisible by 4)
isLeapYear(2023); // false
isLeapYear(2000); // true (divisible by 400)
isLeapYear(1900); // false (divisible by 100, not by 400)
```
