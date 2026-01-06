[**Islamic Utilities API v0.2.0**](../README.md)

***

[Islamic Utilities API](../README.md) / isSuccess

# Function: isSuccess()

> **isSuccess**\<`T`\>(`result`): `result is SuccessResult<T>`

Defined in: [src/core/types/result.ts:222](https://github.com/azkal182/islamic-utils/blob/ddd04bee89289da73cadadfcee51cdeac187e097/src/core/types/result.ts#L222)

Type guard to check if a result is successful.

## Type Parameters

### T

`T`

## Parameters

### result

[`Result`](../type-aliases/Result.md)\<`T`\>

The result to check

## Returns

`result is SuccessResult<T>`

True if the result is successful

## Example

```typescript
if (isSuccess(result)) {
  // result.data is now accessible
  processData(result.data);
}
```
