[**Islamic Utilities API v0.2.1**](../README.md)

***

[Islamic Utilities API](../README.md) / isError

# Function: isError()

> **isError**\<`T`\>(`result`): `result is ErrorResult`

Defined in: [src/core/types/result.ts:240](https://github.com/azkal182/islamic-utils/blob/6511551c69fa725f6e44569e9e1278849e32f702/src/core/types/result.ts#L240)

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
