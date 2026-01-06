[**Islamic Utilities API v0.2.0**](../README.md)

***

[Islamic Utilities API](../README.md) / SuccessResult

# Interface: SuccessResult\<T\>

Defined in: [src/core/types/result.ts:91](https://github.com/azkal182/islamic-utils/blob/0df9a3737b1fb38d644e36b5ae34cdf225bc89df/src/core/types/result.ts#L91)

Successful result with data.

## Type Parameters

### T

`T`

The type of the successful data

## Properties

### data

> `readonly` **data**: `T`

Defined in: [src/core/types/result.ts:100](https://github.com/azkal182/islamic-utils/blob/0df9a3737b1fb38d644e36b5ae34cdf225bc89df/src/core/types/result.ts#L100)

The actual result data.

***

### success

> `readonly` **success**: `true`

Defined in: [src/core/types/result.ts:95](https://github.com/azkal182/islamic-utils/blob/0df9a3737b1fb38d644e36b5ae34cdf225bc89df/src/core/types/result.ts#L95)

Indicates this is a successful result.

***

### trace?

> `readonly` `optional` **trace**: [`TraceStep`](TraceStep.md)[]

Defined in: [src/core/types/result.ts:108](https://github.com/azkal182/islamic-utils/blob/0df9a3737b1fb38d644e36b5ae34cdf225bc89df/src/core/types/result.ts#L108)

Optional trace of calculation steps.

#### Remarks

Only included if trace mode was enabled in the options.
