[**Islamic Utilities API v0.2.2**](../README.md)

***

[Islamic Utilities API](../README.md) / failure

# Function: failure()

> **failure**(`error`, `trace?`): [`ErrorResult`](../interfaces/ErrorResult.md)

Defined in: [src/core/types/result.ts:200](https://github.com/azkal182/islamic-utils/blob/f548f22580afc5800e32e3785eef49f3fce9f58a/src/core/types/result.ts#L200)

Creates an error result.

## Parameters

### error

[`LibraryError`](../classes/LibraryError.md)

The error information

### trace?

[`TraceStep`](../interfaces/TraceStep.md)[]

Optional partial trace up to failure point

## Returns

[`ErrorResult`](../interfaces/ErrorResult.md)

An ErrorResult containing the error

## Example

```typescript
import { createError, ErrorCodes } from '../errors';

const result = failure(
  createError(ErrorCodes.INVALID_COORDINATES, 'Latitude out of range'),
  [{ step: 1, description: 'validation failed' }]
);
console.log(result.success); // false
console.log(result.error.code); // 'INVALID_COORDINATES'
```
