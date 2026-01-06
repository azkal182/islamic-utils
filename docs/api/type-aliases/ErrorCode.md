[**Islamic Utilities API v0.2.1**](../README.md)

***

[Islamic Utilities API](../README.md) / ErrorCode

# Type Alias: ErrorCode

> **ErrorCode** = *typeof* [`ErrorCodes`](../variables/ErrorCodes.md)\[keyof *typeof* [`ErrorCodes`](../variables/ErrorCodes.md)\]

Defined in: [src/core/errors/codes.ts:192](https://github.com/azkal182/islamic-utils/blob/6511551c69fa725f6e44569e9e1278849e32f702/src/core/errors/codes.ts#L192)

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
