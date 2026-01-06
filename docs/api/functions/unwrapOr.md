[**Islamic Utilities API v0.2.1**](../README.md)

***

[Islamic Utilities API](../README.md) / unwrapOr

# Function: unwrapOr()

> **unwrapOr**\<`T`\>(`result`, `defaultValue`): `T`

Defined in: [src/core/types/result.ts:287](https://github.com/azkal182/islamic-utils/blob/6511551c69fa725f6e44569e9e1278849e32f702/src/core/types/result.ts#L287)

Unwraps a result, returning the data or a default value.

## Type Parameters

### T

`T`

The type of the successful data

## Parameters

### result

[`Result`](../type-aliases/Result.md)\<`T`\>

The result to unwrap

### defaultValue

`T`

The value to return if the result is an error

## Returns

`T`

The successful data or the default value

## Example

```typescript
const bearing = unwrapOr(computeQiblaDirection(...), { bearing: 0 });
console.log(bearing.bearing); // Either the calculated value or 0
```
