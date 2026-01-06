[**Islamic Utilities API v0.2.1**](../README.md)

***

[Islamic Utilities API](../README.md) / fractionalHoursToTimeOfDay

# Function: fractionalHoursToTimeOfDay()

> **fractionalHoursToTimeOfDay**(`hours`): [`TimeOfDay`](../interfaces/TimeOfDay.md)

Defined in: [src/astronomy/time.ts:104](https://github.com/azkal182/islamic-utils/blob/6511551c69fa725f6e44569e9e1278849e32f702/src/astronomy/time.ts#L104)

Converts fractional hours to TimeOfDay.

## Parameters

### hours

`number`

Time in fractional hours (e.g., 5.5 = 5:30 AM)

## Returns

[`TimeOfDay`](../interfaces/TimeOfDay.md)

TimeOfDay representation

## Remarks

Handles wrap-around for values outside 0-24 range.
Negative values are treated as "hours before midnight".

## Example

```typescript
fractionalHoursToTimeOfDay(5.5);
// { hours: 5, minutes: 30, seconds: 0 }

fractionalHoursToTimeOfDay(12.25);
// { hours: 12, minutes: 15, seconds: 0 }

fractionalHoursToTimeOfDay(25.5);
// { hours: 1, minutes: 30, seconds: 0 } (wrapped)
```
