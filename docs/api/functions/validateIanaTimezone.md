[**Islamic Utilities API v0.2.0**](../README.md)

***

[Islamic Utilities API](../README.md) / validateIanaTimezone

# Function: validateIanaTimezone()

> **validateIanaTimezone**(`name`): [`Result`](../type-aliases/Result.md)\<`string`\>

Defined in: [src/core/validators/timezone.ts:192](https://github.com/azkal182/islamic-utils/blob/ddd04bee89289da73cadadfcee51cdeac187e097/src/core/validators/timezone.ts#L192)

Validates an IANA timezone name.

## Parameters

### name

`string`

The IANA timezone name

## Returns

[`Result`](../type-aliases/Result.md)\<`string`\>

Success with validated name, or failure with error details

## Remarks

Uses Intl.DateTimeFormat to validate the timezone name.
This is the most reliable cross-platform validation method.

## Example

```typescript
validateIanaTimezone('Asia/Jakarta');  // success
validateIanaTimezone('UTC');           // success
validateIanaTimezone('Invalid/Zone');  // failure
```
