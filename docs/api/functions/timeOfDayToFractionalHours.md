[**Islamic Utilities API v0.2.0**](../README.md)

***

[Islamic Utilities API](../README.md) / timeOfDayToFractionalHours

# Function: timeOfDayToFractionalHours()

> **timeOfDayToFractionalHours**(`time`): `number`

Defined in: [src/astronomy/time.ts:135](https://github.com/azkal182/islamic-utils/blob/ddd04bee89289da73cadadfcee51cdeac187e097/src/astronomy/time.ts#L135)

Converts TimeOfDay to fractional hours.

## Parameters

### time

[`TimeOfDay`](../interfaces/TimeOfDay.md)

The time to convert

## Returns

`number`

Time in fractional hours

## Example

```typescript
timeOfDayToFractionalHours({ hours: 5, minutes: 30, seconds: 0 });
// 5.5

timeOfDayToFractionalHours({ hours: 12, minutes: 15, seconds: 30 });
// 12.2583...
```
