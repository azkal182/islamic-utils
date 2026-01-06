[**Islamic Utilities API v0.2.0**](../README.md)

***

[Islamic Utilities API](../README.md) / InheritanceResult

# Interface: InheritanceResult

Defined in: src/inheritance/types.ts:510

Complete inheritance calculation result.

## Properties

### meta

> `readonly` **meta**: [`InheritanceMeta`](InheritanceMeta.md)

Defined in: src/inheritance/types.ts:529

Calculation metadata.

***

### netEstate

> `readonly` **netEstate**: `number`

Defined in: src/inheritance/types.ts:514

Net estate value (after deductions).

***

### shares

> `readonly` **shares**: [`HeirShare`](HeirShare.md)[]

Defined in: src/inheritance/types.ts:519

Individual share allocations.

***

### summary

> `readonly` **summary**: [`InheritanceSummary`](InheritanceSummary.md)

Defined in: src/inheritance/types.ts:524

Calculation summary.

***

### trace

> `readonly` **trace**: [`InheritanceTraceStep`](InheritanceTraceStep.md)[]

Defined in: src/inheritance/types.ts:537

Detailed trace of calculation steps.

#### Remarks

ALWAYS included for inheritance calculations.

***

### verification

> `readonly` **verification**: `object`

Defined in: src/inheritance/types.ts:542

Verification that calculation is valid.

#### difference

> `readonly` **difference**: `number`

#### isValid

> `readonly` **isValid**: `boolean`

#### netEstate

> `readonly` **netEstate**: `number`

#### sumOfShares

> `readonly` **sumOfShares**: `number`
