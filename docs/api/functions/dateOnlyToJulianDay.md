[**Islamic Utilities API v0.2.2**](../README.md)

***

[Islamic Utilities API](../README.md) / dateOnlyToJulianDay

# Function: dateOnlyToJulianDay()

> **dateOnlyToJulianDay**(`date`): `number`

Defined in: [src/astronomy/time.ts:24](https://github.com/azkal182/islamic-utils/blob/f548f22580afc5800e32e3785eef49f3fce9f58a/src/astronomy/time.ts#L24)

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
