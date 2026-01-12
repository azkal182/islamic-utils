[**Islamic Utilities API v0.2.2**](../README.md)

***

[Islamic Utilities API](../README.md) / dateToLocalTime

# Function: dateToLocalTime()

> **dateToLocalTime**(`date`, `timezone`): [`LocalTime`](../interfaces/LocalTime.md)

Defined in: [src/core/utils/timezone.ts:74](https://github.com/azkal182/islamic-utils/blob/f548f22580afc5800e32e3785eef49f3fce9f58a/src/core/utils/timezone.ts#L74)

Converts a JavaScript Date to local time in the specified timezone.

## Parameters

### date

`Date`

JavaScript Date object

### timezone

[`Timezone`](../type-aliases/Timezone.md)

IANA timezone name or UTC offset in hours

## Returns

[`LocalTime`](../interfaces/LocalTime.md)

Local time components and fractional hours

## Example

```typescript
// Using IANA timezone
const local = dateToLocalTime(new Date(), 'Asia/Jakarta');
console.log(local.hour, local.minute); // e.g., 17, 15

// Using UTC offset
const local2 = dateToLocalTime(new Date(), 7); // UTC+7
```
