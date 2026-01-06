[**Islamic Utilities API v0.2.0**](../README.md)

***

[Islamic Utilities API](../README.md) / TraceStep

# Interface: TraceStep

Defined in: [src/core/types/result.ts:53](https://github.com/azkal182/islamic-utils/blob/ddd04bee89289da73cadadfcee51cdeac187e097/src/core/types/result.ts#L53)

Represents a single step in a calculation trace.

## Remarks

Traces are used to explain how a result was calculated.
This is especially important for:
- Inheritance calculations (fiqh rules applied)
- Prayer times (high latitude adjustments)
- Debugging and verification

## Example

```typescript
const trace: TraceStep = {
  step: 1,
  description: 'Calculate solar noon for longitude 106.8456',
  calculation: 'solarNoon = 12 - (106.8456 / 15) + EoT',
  value: 11.54
};
```

## Extended by

- [`InheritanceTraceStep`](InheritanceTraceStep.md)

## Properties

### calculation?

> `readonly` `optional` **calculation**: `string`

Defined in: [src/core/types/result.ts:70](https://github.com/azkal182/islamic-utils/blob/ddd04bee89289da73cadadfcee51cdeac187e097/src/core/types/result.ts#L70)

Optional formula or calculation performed.

#### Remarks

Use this to show the mathematical formula applied.

***

### description

> `readonly` **description**: `string`

Defined in: [src/core/types/result.ts:62](https://github.com/azkal182/islamic-utils/blob/ddd04bee89289da73cadadfcee51cdeac187e097/src/core/types/result.ts#L62)

Human-readable description of what this step does.

***

### step

> `readonly` **step**: `number`

Defined in: [src/core/types/result.ts:57](https://github.com/azkal182/islamic-utils/blob/ddd04bee89289da73cadadfcee51cdeac187e097/src/core/types/result.ts#L57)

Sequential step number (1-indexed).

***

### subSteps?

> `readonly` `optional` **subSteps**: `TraceStep`[]

Defined in: [src/core/types/result.ts:83](https://github.com/azkal182/islamic-utils/blob/ddd04bee89289da73cadadfcee51cdeac187e097/src/core/types/result.ts#L83)

Optional sub-steps for complex calculations.

***

### value?

> `readonly` `optional` **value**: `unknown`

Defined in: [src/core/types/result.ts:78](https://github.com/azkal182/islamic-utils/blob/ddd04bee89289da73cadadfcee51cdeac187e097/src/core/types/result.ts#L78)

Optional result value of this step.

#### Remarks

Can be any type: number, string, object, etc.
