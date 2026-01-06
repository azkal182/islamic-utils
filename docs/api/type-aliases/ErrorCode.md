[**Islamic Utilities API v0.2.0**](../README.md)

***

[Islamic Utilities API](../README.md) / ErrorCode

# Type Alias: ErrorCode

> **ErrorCode** = *typeof* [`ErrorCodes`](../variables/ErrorCodes.md)\[keyof *typeof* [`ErrorCodes`](../variables/ErrorCodes.md)\]

Defined in: [src/core/errors/codes.ts:192](https://github.com/azkal182/islamic-utils/blob/ddd04bee89289da73cadadfcee51cdeac187e097/src/core/errors/codes.ts#L192)

Type representing all valid error codes.

## Example

```typescript
function handleError(code: ErrorCode) {
  switch (code) {
    case ErrorCodes.INVALID_COORDINATES:
      // handle coordinates error
      break;
    // ... other cases
  }
}
```
