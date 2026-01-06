[**Islamic Utilities API v0.2.0**](../README.md)

***

[Islamic Utilities API](../README.md) / formatUtcOffset

# Function: formatUtcOffset()

> **formatUtcOffset**(`offset`): `string`

Defined in: [src/core/validators/timezone.ts:290](https://github.com/azkal182/islamic-utils/blob/0df9a3737b1fb38d644e36b5ae34cdf225bc89df/src/core/validators/timezone.ts#L290)

Formats a UTC offset as a string.

## Parameters

### offset

`number`

The UTC offset in hours

## Returns

`string`

Formatted string like "UTC+7" or "UTC-5:30"

## Example

```typescript
formatUtcOffset(7);     // "UTC+7"
formatUtcOffset(-5);    // "UTC-5"
formatUtcOffset(5.5);   // "UTC+5:30"
formatUtcOffset(-9.75); // "UTC-9:45"
```
