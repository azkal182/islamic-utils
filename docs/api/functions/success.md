[**Islamic Utilities API v0.2.0**](../README.md)

***

[Islamic Utilities API](../README.md) / success

# Function: success()

> **success**\<`T`\>(`data`, `trace?`): [`SuccessResult`](../interfaces/SuccessResult.md)\<`T`\>

Defined in: [src/core/types/result.ts:173](https://github.com/azkal182/islamic-utils/blob/ddd04bee89289da73cadadfcee51cdeac187e097/src/core/types/result.ts#L173)

Creates a successful result.

## Type Parameters

### T

`T`

The type of the data

## Parameters

### data

`T`

The successful result data

### trace?

[`TraceStep`](../interfaces/TraceStep.md)[]

Optional calculation trace

## Returns

[`SuccessResult`](../interfaces/SuccessResult.md)\<`T`\>

A SuccessResult containing the data

## Example

```typescript
const result = success({ bearing: 295.5 }, [{ step: 1, description: 'calculated' }]);
console.log(result.success); // true
console.log(result.data.bearing); // 295.5
```
