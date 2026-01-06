[**Islamic Utilities API v0.2.0**](../README.md)

***

[Islamic Utilities API](../README.md) / validateTimezone

# Function: validateTimezone()

> **validateTimezone**(`timezone`): [`Result`](../type-aliases/Result.md)\<[`Timezone`](../type-aliases/Timezone.md)\>

Defined in: [src/core/validators/timezone.ts:97](https://github.com/azkal182/islamic-utils/blob/0df9a3737b1fb38d644e36b5ae34cdf225bc89df/src/core/validators/timezone.ts#L97)

Validates a timezone value.

## Parameters

### timezone

[`Timezone`](../type-aliases/Timezone.md)

The timezone to validate (IANA name or UTC offset)

## Returns

[`Result`](../type-aliases/Result.md)\<[`Timezone`](../type-aliases/Timezone.md)\>

Success with validated timezone, or failure with error details

## Remarks

Accepts two formats:
1. IANA timezone name (string): "Asia/Jakarta", "America/New_York"
2. UTC offset (number): 7 (UTC+7), -5 (UTC-5), 5.5 (UTC+5:30)

## Example

```typescript
// IANA timezone name
validateTimezone('Asia/Jakarta');  // success
validateTimezone('Invalid/Zone');  // failure

// UTC offset
validateTimezone(7);    // success (UTC+7)
validateTimezone(-5);   // success (UTC-5)
validateTimezone(5.5);  // success (UTC+5:30)
validateTimezone(20);   // failure (out of range)
```
