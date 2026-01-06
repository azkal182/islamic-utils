[**Islamic Utilities API v0.2.1**](../README.md)

***

[Islamic Utilities API](../README.md) / addDays

# Function: addDays()

> **addDays**(`date`, `days`): [`DateOnly`](../interfaces/DateOnly.md)

Defined in: [src/core/validators/date.ts:234](https://github.com/azkal182/islamic-utils/blob/6511551c69fa725f6e44569e9e1278849e32f702/src/core/validators/date.ts#L234)

Adds days to a date.

## Parameters

### date

[`DateOnly`](../interfaces/DateOnly.md)

The starting date

### days

`number`

Number of days to add (can be negative)

## Returns

[`DateOnly`](../interfaces/DateOnly.md)

New date with days added

## Example

```typescript
addDays({ year: 2024, month: 1, day: 31 }, 1);
// Result: { year: 2024, month: 2, day: 1 }

addDays({ year: 2024, month: 1, day: 1 }, -1);
// Result: { year: 2023, month: 12, day: 31 }
```
