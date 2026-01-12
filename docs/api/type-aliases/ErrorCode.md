[**Islamic Utilities API v0.2.2**](../README.md)

***

[Islamic Utilities API](../README.md) / ErrorCode

# Type Alias: ErrorCode

> **ErrorCode** = *typeof* [`ErrorCodes`](../variables/ErrorCodes.md)\[keyof *typeof* [`ErrorCodes`](../variables/ErrorCodes.md)\]

Defined in: [src/core/errors/codes.ts:202](https://github.com/azkal182/islamic-utils/blob/f548f22580afc5800e32e3785eef49f3fce9f58a/src/core/errors/codes.ts#L202)

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
