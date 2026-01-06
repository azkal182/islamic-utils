[**Islamic Utilities API v0.2.1**](../README.md)

***

[Islamic Utilities API](../README.md) / unwrap

# Function: unwrap()

> **unwrap**\<`T`\>(`result`): `T`

Defined in: [src/core/types/result.ts:266](https://github.com/azkal182/islamic-utils/blob/6511551c69fa725f6e44569e9e1278849e32f702/src/core/types/result.ts#L266)

Unwraps a result, returning the data or throwing the error.

## Type Parameters

### T

`T`

The type of the successful data

## Parameters

### result

[`Result`](../type-aliases/Result.md)\<`T`\>

The result to unwrap

## Returns

`T`

The successful data

## Throws

The library error if the result is an error

## Remarks

Use this when you want to convert from Result pattern to exception pattern.
Not recommended for normal library usage, but useful for quick scripts.

## Example

```typescript
try {
  const data = unwrap(computePrayerTimes(...));
  console.log(data.times.fajr);
} catch (error) {
  console.error('Failed:', error.message);
}
```
