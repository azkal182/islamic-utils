[**Islamic Utilities API v0.2.2**](../README.md)

***

[Islamic Utilities API](../README.md) / ErrorCode

# Type Alias: ErrorCode

> **ErrorCode** = *typeof* [`ErrorCodes`](../variables/ErrorCodes.md)\[keyof *typeof* [`ErrorCodes`](../variables/ErrorCodes.md)\]

Defined in: [src/core/errors/codes.ts:192](https://github.com/azkal182/islamic-utils/blob/a30827e72f5e43f868fff9ce519ca224296e663c/src/core/errors/codes.ts#L192)

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
