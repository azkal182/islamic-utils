[**Islamic Utilities API v0.2.2**](../README.md)

***

[Islamic Utilities API](../README.md) / isError

# Function: isError()

> **isError**\<`T`\>(`result`): `result is ErrorResult`

Defined in: [src/core/types/result.ts:240](https://github.com/azkal182/islamic-utils/blob/a30827e72f5e43f868fff9ce519ca224296e663c/src/core/types/result.ts#L240)

Type guard to check if a result is an error.

## Type Parameters

### T

`T`

## Parameters

### result

[`Result`](../type-aliases/Result.md)\<`T`\>

The result to check

## Returns

`result is ErrorResult`

True if the result is an error

## Example

```typescript
if (isError(result)) {
  // result.error is now accessible
  logError(result.error);
}
```
