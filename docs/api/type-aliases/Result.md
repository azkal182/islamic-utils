[**Islamic Utilities API v0.2.1**](../README.md)

***

[Islamic Utilities API](../README.md) / Result

# Type Alias: Result\<T\>

> **Result**\<`T`\> = [`SuccessResult`](../interfaces/SuccessResult.md)\<`T`\> \| [`ErrorResult`](../interfaces/ErrorResult.md)

Defined in: [src/core/types/result.ts:156](https://github.com/azkal182/islamic-utils/blob/6511551c69fa725f6e44569e9e1278849e32f702/src/core/types/result.ts#L156)

Union type representing either success or error.

## Type Parameters

### T

`T`

The type of the successful data

## Remarks

This is the main return type for all library functions.
Use TypeScript's type narrowing to handle both cases:

## Example

```typescript
function handleResult(result: Result<PrayerTimesResult>) {
  if (result.success) {
    // TypeScript knows result.data exists here
    console.log(result.data.times);
  } else {
    // TypeScript knows result.error exists here
    console.error(result.error.code);
  }
}
```
