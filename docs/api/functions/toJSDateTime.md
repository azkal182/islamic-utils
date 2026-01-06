[**Islamic Utilities API v0.2.0**](../README.md)

***

[Islamic Utilities API](../README.md) / toJSDateTime

# Function: toJSDateTime()

> **toJSDateTime**(`date`, `hours`, `timezoneOffset`): `Date`

Defined in: [src/astronomy/time.ts:206](https://github.com/azkal182/islamic-utils/blob/0df9a3737b1fb38d644e36b5ae34cdf225bc89df/src/astronomy/time.ts#L206)

Converts fractional hours to a JavaScript Date object.

## Parameters

### date

[`DateOnly`](../interfaces/DateOnly.md)

The date part

### hours

`number`

Time in fractional hours

### timezoneOffset

`number` = `0`

Timezone offset in hours (for display purposes)

## Returns

`Date`

JavaScript Date object

## Remarks

The returned Date is in local timezone of the runtime.
Use this for display and comparison within the same timezone context.

## Example

```typescript
const date = { year: 2024, month: 1, day: 15 };
toJSDateTime(date, 5.5, 7);
// Date object representing Jan 15, 2024, 5:30 AM in UTC+7
```
