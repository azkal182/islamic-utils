[**Islamic Utilities API v0.2.2**](../README.md)

***

[Islamic Utilities API](../README.md) / isSuccess

# Function: isSuccess()

> **isSuccess**\<`T`\>(`result`): `result is SuccessResult<T>`

Defined in: [src/core/types/result.ts:222](https://github.com/azkal182/islamic-utils/blob/a30827e72f5e43f868fff9ce519ca224296e663c/src/core/types/result.ts#L222)

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
