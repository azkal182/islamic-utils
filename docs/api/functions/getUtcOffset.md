[**Islamic Utilities API v0.2.0**](../README.md)

***

[Islamic Utilities API](../README.md) / getUtcOffset

# Function: getUtcOffset()

> **getUtcOffset**(`timezone`, `date`): `number`

Defined in: [src/core/validators/timezone.ts:238](https://github.com/azkal182/islamic-utils/blob/0df9a3737b1fb38d644e36b5ae34cdf225bc89df/src/core/validators/timezone.ts#L238)

Converts a timezone to its UTC offset for a given date.

## Parameters

### timezone

[`Timezone`](../type-aliases/Timezone.md)

The timezone (IANA name or offset)

### date

`Date` = `...`

The date to get the offset for (needed for DST)

## Returns

`number`

UTC offset in hours

## Remarks

For IANA timezones, the offset may vary due to DST.
For numeric offsets, the value is returned as-is.

## Example

```typescript
// Numeric offset - returns as-is
getUtcOffset(7, date);  // 7

// IANA timezone - calculates offset
getUtcOffset('America/New_York', new Date('2024-07-01'));  // -4 (EDT)
getUtcOffset('America/New_York', new Date('2024-01-01'));  // -5 (EST)
```
