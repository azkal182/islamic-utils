[**Islamic Utilities API v0.2.1**](../README.md)

***

[Islamic Utilities API](../README.md) / dateOnlyToJulianDay

# Function: dateOnlyToJulianDay()

> **dateOnlyToJulianDay**(`date`): `number`

Defined in: [src/astronomy/time.ts:24](https://github.com/azkal182/islamic-utils/blob/6511551c69fa725f6e44569e9e1278849e32f702/src/astronomy/time.ts#L24)

Converts a DateOnly to Julian Day Number (at midnight).

## Parameters

### date

[`DateOnly`](../interfaces/DateOnly.md)

The date to convert

## Returns

`number`

Julian Day Number at 0:00 local time

## Example

```typescript
dateOnlyToJulianDay({ year: 2024, month: 1, day: 15 });
// Returns JD at midnight on Jan 15, 2024
```
