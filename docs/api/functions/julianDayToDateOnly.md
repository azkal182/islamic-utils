[**Islamic Utilities API v0.2.2**](../README.md)

***

[Islamic Utilities API](../README.md) / julianDayToDateOnly

# Function: julianDayToDateOnly()

> **julianDayToDateOnly**(`jd`): [`DateOnly`](../interfaces/DateOnly.md)

Defined in: [src/astronomy/time.ts:54](https://github.com/azkal182/islamic-utils/blob/f548f22580afc5800e32e3785eef49f3fce9f58a/src/astronomy/time.ts#L54)

Converts Julian Day Number to DateOnly.

## Parameters

### jd

`number`

Julian Day Number

## Returns

[`DateOnly`](../interfaces/DateOnly.md)

DateOnly representation

## Remarks

The fractional part of the JD is ignored (returns the date at the start of that JD).

## Example

```typescript
julianDayToDateOnly(2460324.5);
// Returns { year: 2024, month: 1, day: 15 }
```
