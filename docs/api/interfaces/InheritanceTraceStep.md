[**Islamic Utilities API v0.2.1**](../README.md)

***

[Islamic Utilities API](../README.md) / InheritanceTraceStep

# Interface: InheritanceTraceStep

Defined in: [src/inheritance/types.ts:474](https://github.com/azkal182/islamic-utils/blob/6511551c69fa725f6e44569e9e1278849e32f702/src/inheritance/types.ts#L474)

Inheritance-specific trace step.

## Extends

- [`TraceStep`](TraceStep.md)

## Properties

### arabicTerm?

> `readonly` `optional` **arabicTerm**: `string`

Defined in: [src/inheritance/types.ts:494](https://github.com/azkal182/islamic-utils/blob/6511551c69fa725f6e44569e9e1278849e32f702/src/inheritance/types.ts#L494)

Arabic term for this step (for verification with kitab).

***

### calculation?

> `readonly` `optional` **calculation**: `string`

Defined in: [src/core/types/result.ts:70](https://github.com/azkal182/islamic-utils/blob/6511551c69fa725f6e44569e9e1278849e32f702/src/core/types/result.ts#L70)

Optional formula or calculation performed.

#### Remarks

Use this to show the mathematical formula applied.

#### Inherited from

[`TraceStep`](TraceStep.md).[`calculation`](TraceStep.md#calculation)

***

### description

> `readonly` **description**: `string`

Defined in: [src/core/types/result.ts:62](https://github.com/azkal182/islamic-utils/blob/6511551c69fa725f6e44569e9e1278849e32f702/src/core/types/result.ts#L62)

Human-readable description of what this step does.

#### Inherited from

[`TraceStep`](TraceStep.md).[`description`](TraceStep.md#description)

***

### formula?

> `readonly` `optional` **formula**: `string`

Defined in: [src/inheritance/types.ts:499](https://github.com/azkal182/islamic-utils/blob/6511551c69fa725f6e44569e9e1278849e32f702/src/inheritance/types.ts#L499)

Calculation formula if applicable.

***

### phase

> `readonly` **phase**: `"FURUDH"` \| `"ASABAH"` \| `"VALIDATION"` \| `"ESTATE"` \| `"FLAGS"` \| `"HIJAB"` \| `"SPECIAL_CASE"` \| `"AUL"` \| `"RADD"` \| `"DISTRIBUTION"` \| `"VERIFICATION"`

Defined in: [src/inheritance/types.ts:478](https://github.com/azkal182/islamic-utils/blob/6511551c69fa725f6e44569e9e1278849e32f702/src/inheritance/types.ts#L478)

Phase of calculation.

***

### reference?

> `readonly` `optional` **reference**: `string`

Defined in: [src/inheritance/types.ts:504](https://github.com/azkal182/islamic-utils/blob/6511551c69fa725f6e44569e9e1278849e32f702/src/inheritance/types.ts#L504)

Reference to kitab/source.

***

### step

> `readonly` **step**: `number`

Defined in: [src/core/types/result.ts:57](https://github.com/azkal182/islamic-utils/blob/6511551c69fa725f6e44569e9e1278849e32f702/src/core/types/result.ts#L57)

Sequential step number (1-indexed).

#### Inherited from

[`TraceStep`](TraceStep.md).[`step`](TraceStep.md#step)

***

### subSteps?

> `readonly` `optional` **subSteps**: [`TraceStep`](TraceStep.md)[]

Defined in: [src/core/types/result.ts:83](https://github.com/azkal182/islamic-utils/blob/6511551c69fa725f6e44569e9e1278849e32f702/src/core/types/result.ts#L83)

Optional sub-steps for complex calculations.

#### Inherited from

[`TraceStep`](TraceStep.md).[`subSteps`](TraceStep.md#substeps)

***

### value?

> `readonly` `optional` **value**: `unknown`

Defined in: [src/core/types/result.ts:78](https://github.com/azkal182/islamic-utils/blob/6511551c69fa725f6e44569e9e1278849e32f702/src/core/types/result.ts#L78)

Optional result value of this step.

#### Remarks

Can be any type: number, string, object, etc.

#### Inherited from

[`TraceStep`](TraceStep.md).[`value`](TraceStep.md#value)
