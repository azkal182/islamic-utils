[**Islamic Utilities API v0.2.2**](../README.md)

***

[Islamic Utilities API](../README.md) / InheritanceResult

# Interface: InheritanceResult

Defined in: [src/inheritance/types.ts:510](https://github.com/azkal182/islamic-utils/blob/a30827e72f5e43f868fff9ce519ca224296e663c/src/inheritance/types.ts#L510)

Complete inheritance calculation result.

## Properties

### meta

> `readonly` **meta**: [`InheritanceMeta`](InheritanceMeta.md)

Defined in: [src/inheritance/types.ts:529](https://github.com/azkal182/islamic-utils/blob/a30827e72f5e43f868fff9ce519ca224296e663c/src/inheritance/types.ts#L529)

Calculation metadata.

***

### netEstate

> `readonly` **netEstate**: `number`

Defined in: [src/inheritance/types.ts:514](https://github.com/azkal182/islamic-utils/blob/a30827e72f5e43f868fff9ce519ca224296e663c/src/inheritance/types.ts#L514)

Net estate value (after deductions).

***

### shares

> `readonly` **shares**: [`HeirShare`](HeirShare.md)[]

Defined in: [src/inheritance/types.ts:519](https://github.com/azkal182/islamic-utils/blob/a30827e72f5e43f868fff9ce519ca224296e663c/src/inheritance/types.ts#L519)

Individual share allocations.

***

### summary

> `readonly` **summary**: [`InheritanceSummary`](InheritanceSummary.md)

Defined in: [src/inheritance/types.ts:524](https://github.com/azkal182/islamic-utils/blob/a30827e72f5e43f868fff9ce519ca224296e663c/src/inheritance/types.ts#L524)

Calculation summary.

***

### trace

> `readonly` **trace**: [`InheritanceTraceStep`](InheritanceTraceStep.md)[]

Defined in: [src/inheritance/types.ts:537](https://github.com/azkal182/islamic-utils/blob/a30827e72f5e43f868fff9ce519ca224296e663c/src/inheritance/types.ts#L537)

Detailed trace of calculation steps.

#### Remarks

ALWAYS included for inheritance calculations.

***

### verification

> `readonly` **verification**: `object`

Defined in: [src/inheritance/types.ts:542](https://github.com/azkal182/islamic-utils/blob/a30827e72f5e43f868fff9ce519ca224296e663c/src/inheritance/types.ts#L542)

Verification that calculation is valid.

#### difference

> `readonly` **difference**: `number`

#### isValid

> `readonly` **isValid**: `boolean`

#### netEstate

> `readonly` **netEstate**: `number`

#### sumOfShares

> `readonly` **sumOfShares**: `number`
