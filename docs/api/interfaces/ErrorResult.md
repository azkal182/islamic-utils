[**Islamic Utilities API v0.2.1**](../README.md)

***

[Islamic Utilities API](../README.md) / ErrorResult

# Interface: ErrorResult

Defined in: [src/core/types/result.ts:114](https://github.com/azkal182/islamic-utils/blob/6511551c69fa725f6e44569e9e1278849e32f702/src/core/types/result.ts#L114)

Failed result with error information.

## Properties

### error

> `readonly` **error**: [`LibraryError`](../classes/LibraryError.md)

Defined in: [src/core/types/result.ts:123](https://github.com/azkal182/islamic-utils/blob/6511551c69fa725f6e44569e9e1278849e32f702/src/core/types/result.ts#L123)

Structured error information.

***

### success

> `readonly` **success**: `false`

Defined in: [src/core/types/result.ts:118](https://github.com/azkal182/islamic-utils/blob/6511551c69fa725f6e44569e9e1278849e32f702/src/core/types/result.ts#L118)

Indicates this is an error result.

***

### trace?

> `readonly` `optional` **trace**: [`TraceStep`](TraceStep.md)[]

Defined in: [src/core/types/result.ts:131](https://github.com/azkal182/islamic-utils/blob/6511551c69fa725f6e44569e9e1278849e32f702/src/core/types/result.ts#L131)

Optional partial trace up to the point of failure.

#### Remarks

Useful for debugging to see what steps succeeded before the error.
