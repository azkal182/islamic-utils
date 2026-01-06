[**Islamic Utilities API v0.2.2**](../README.md)

***

[Islamic Utilities API](../README.md) / InheritanceSummary

# Interface: InheritanceSummary

Defined in: [src/inheritance/types.ts:389](https://github.com/azkal182/islamic-utils/blob/a30827e72f5e43f868fff9ce519ca224296e663c/src/inheritance/types.ts#L389)

Summary of the inheritance calculation.

## Properties

### aulApplied

> `readonly` **aulApplied**: `boolean`

Defined in: [src/inheritance/types.ts:398](https://github.com/azkal182/islamic-utils/blob/a30827e72f5e43f868fff9ce519ca224296e663c/src/inheritance/types.ts#L398)

Whether Aul was applied.

***

### aulNewDenominator?

> `readonly` `optional` **aulNewDenominator**: `number`

Defined in: [src/inheritance/types.ts:413](https://github.com/azkal182/islamic-utils/blob/a30827e72f5e43f868fff9ce519ca224296e663c/src/inheritance/types.ts#L413)

New denominator after Aul.

***

### aulOriginalDenominator?

> `readonly` `optional` **aulOriginalDenominator**: `number`

Defined in: [src/inheritance/types.ts:408](https://github.com/azkal182/islamic-utils/blob/a30827e72f5e43f868fff9ce519ca224296e663c/src/inheritance/types.ts#L408)

Original denominator before Aul.

***

### aulRatio?

> `readonly` `optional` **aulRatio**: [`Fraction`](Fraction.md)

Defined in: [src/inheritance/types.ts:403](https://github.com/azkal182/islamic-utils/blob/a30827e72f5e43f868fff9ce519ca224296e663c/src/inheritance/types.ts#L403)

Aul adjustment ratio if applied.

***

### raddApplied

> `readonly` **raddApplied**: `boolean`

Defined in: [src/inheritance/types.ts:418](https://github.com/azkal182/islamic-utils/blob/a30827e72f5e43f868fff9ce519ca224296e663c/src/inheritance/types.ts#L418)

Whether Radd was applied.

***

### raddRemainder?

> `readonly` `optional` **raddRemainder**: [`Fraction`](Fraction.md)

Defined in: [src/inheritance/types.ts:423](https://github.com/azkal182/islamic-utils/blob/a30827e72f5e43f868fff9ce519ca224296e663c/src/inheritance/types.ts#L423)

Remainder that was redistributed.

***

### specialCase?

> `readonly` `optional` **specialCase**: `string`

Defined in: [src/inheritance/types.ts:428](https://github.com/azkal182/islamic-utils/blob/a30827e72f5e43f868fff9ce519ca224296e663c/src/inheritance/types.ts#L428)

Special case that was applied (if any).

***

### specialCaseArabic?

> `readonly` `optional` **specialCaseArabic**: `string`

Defined in: [src/inheritance/types.ts:433](https://github.com/azkal182/islamic-utils/blob/a30827e72f5e43f868fff9ce519ca224296e663c/src/inheritance/types.ts#L433)

Special case Arabic name.

***

### totalDistributed

> `readonly` **totalDistributed**: `number`

Defined in: [src/inheritance/types.ts:393](https://github.com/azkal182/islamic-utils/blob/a30827e72f5e43f868fff9ce519ca224296e663c/src/inheritance/types.ts#L393)

Total value distributed.
