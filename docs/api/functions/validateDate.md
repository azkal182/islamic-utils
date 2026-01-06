[**Islamic Utilities API v0.2.1**](../README.md)

***

[Islamic Utilities API](../README.md) / validateDate

# Function: validateDate()

> **validateDate**(`date`): [`Result`](../type-aliases/Result.md)\<[`DateOnly`](../interfaces/DateOnly.md)\>

Defined in: [src/core/validators/date.ts:112](https://github.com/azkal182/islamic-utils/blob/6511551c69fa725f6e44569e9e1278849e32f702/src/core/validators/date.ts#L112)

Validates a date.

## Parameters

### date

[`DateOnly`](../interfaces/DateOnly.md)

The date to validate

## Returns

[`Result`](../type-aliases/Result.md)\<[`DateOnly`](../interfaces/DateOnly.md)\>

Success with validated date, or failure with error details

## Remarks

Validation rules:
- Year must be between 1 and 9999
- Month must be between 1 and 12
- Day must be valid for the given month and year
- All values must be integers

## Example

```typescript
// Valid date
validateDate({ year: 2024, month: 1, day: 15 });
// result.success === true

// Invalid month
validateDate({ year: 2024, month: 13, day: 1 });
// result.error.code === 'INVALID_DATE'

// February 29 in non-leap year
validateDate({ year: 2023, month: 2, day: 29 });
// result.error.code === 'INVALID_DATE'
```
