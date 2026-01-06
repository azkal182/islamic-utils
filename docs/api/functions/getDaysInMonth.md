[**Islamic Utilities API v0.2.0**](../README.md)

***

[Islamic Utilities API](../README.md) / getDaysInMonth

# Function: getDaysInMonth()

> **getDaysInMonth**(`year`, `month`): `number`

Defined in: [src/core/validators/date.ts:70](https://github.com/azkal182/islamic-utils/blob/0df9a3737b1fb38d644e36b5ae34cdf225bc89df/src/core/validators/date.ts#L70)

Gets the number of days in a given month.

## Parameters

### year

`number`

The year (needed to check for February in leap years)

### month

`number`

The month (1-12)

## Returns

`number`

Number of days in the month

## Example

```typescript
getDaysInMonth(2024, 2);  // 29 (February in leap year)
getDaysInMonth(2023, 2);  // 28 (February in non-leap year)
getDaysInMonth(2024, 1);  // 31 (January)
getDaysInMonth(2024, 4);  // 30 (April)
```
