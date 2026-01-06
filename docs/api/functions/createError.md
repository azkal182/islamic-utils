[**Islamic Utilities API v0.2.0**](../README.md)

***

[Islamic Utilities API](../README.md) / createError

# Function: createError()

> **createError**(`code`, `message`, `details?`): [`LibraryError`](../classes/LibraryError.md)

Defined in: [src/core/errors/error.ts:156](https://github.com/azkal182/islamic-utils/blob/ddd04bee89289da73cadadfcee51cdeac187e097/src/core/errors/error.ts#L156)

Factory function to create a LibraryError.

## Parameters

### code

[`ErrorCode`](../type-aliases/ErrorCode.md)

Error code from ErrorCodes

### message

`string`

Human-readable error message

### details?

`Record`\<`string`, `unknown`\>

Optional additional error details

## Returns

[`LibraryError`](../classes/LibraryError.md)

A new LibraryError instance

## Example

```typescript
// Simple error
const error1 = createError(ErrorCodes.INVALID_DATE, 'Day 32 does not exist');

// Error with details
const error2 = createError(
  ErrorCodes.INVALID_COORDINATES,
  'Latitude out of valid range',
  { provided: 100, min: -90, max: 90 }
);
```
