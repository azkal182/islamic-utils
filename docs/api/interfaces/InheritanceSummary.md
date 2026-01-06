[**Islamic Utilities API v0.2.0**](../README.md)

***

[Islamic Utilities API](../README.md) / InheritanceSummary

# Interface: InheritanceSummary

Defined in: src/inheritance/types.ts:389

Summary of the inheritance calculation.

## Properties

### aulApplied

> `readonly` **aulApplied**: `boolean`

Defined in: src/inheritance/types.ts:398

Whether Aul was applied.

***

### aulNewDenominator?

> `readonly` `optional` **aulNewDenominator**: `number`

Defined in: src/inheritance/types.ts:413

New denominator after Aul.

***

### aulOriginalDenominator?

> `readonly` `optional` **aulOriginalDenominator**: `number`

Defined in: src/inheritance/types.ts:408

Original denominator before Aul.

***

### aulRatio?

> `readonly` `optional` **aulRatio**: [`Fraction`](Fraction.md)

Defined in: src/inheritance/types.ts:403

Aul adjustment ratio if applied.

***

### raddApplied

> `readonly` **raddApplied**: `boolean`

Defined in: src/inheritance/types.ts:418

Whether Radd was applied.

***

### raddRemainder?

> `readonly` `optional` **raddRemainder**: [`Fraction`](Fraction.md)

Defined in: src/inheritance/types.ts:423

Remainder that was redistributed.

***

### specialCase?

> `readonly` `optional` **specialCase**: `string`

Defined in: src/inheritance/types.ts:428

Special case that was applied (if any).

***

### specialCaseArabic?

> `readonly` `optional` **specialCaseArabic**: `string`

Defined in: src/inheritance/types.ts:433

Special case Arabic name.

***

### totalDistributed

> `readonly` **totalDistributed**: `number`

Defined in: src/inheritance/types.ts:393

Total value distributed.
