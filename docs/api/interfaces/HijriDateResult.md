[**Islamic Utilities API v0.2.2**](../README.md)

***

[Islamic Utilities API](../README.md) / HijriDateResult

# Interface: HijriDateResult

Defined in: src/hijri-calendar/types.ts:161

Result payload for [computeHijriDate](../functions/computeHijriDate.md).

## Properties

### adjustmentSource?

> `readonly` `optional` **adjustmentSource**: `string`

Defined in: src/hijri-calendar/types.ts:166

***

### gregorian

> `readonly` **gregorian**: [`DateOnly`](DateOnly.md)

Defined in: src/hijri-calendar/types.ts:162

***

### hijri

> `readonly` **hijri**: [`HijriDate`](HijriDate.md)

Defined in: src/hijri-calendar/types.ts:163

***

### isAdjusted

> `readonly` **isAdjusted**: `boolean`

Defined in: src/hijri-calendar/types.ts:165

***

### method

> `readonly` **method**: [`HijriMethodId`](../type-aliases/HijriMethodId.md)

Defined in: src/hijri-calendar/types.ts:164

***

### trace?

> `readonly` `optional` **trace**: readonly [`TraceStep`](TraceStep.md)[]

Defined in: src/hijri-calendar/types.ts:167
