[**Islamic Utilities API v0.2.0**](../README.md)

***

[Islamic Utilities API](../README.md) / HeirShare

# Interface: HeirShare

Defined in: src/inheritance/types.ts:329

Share calculation for a single heir type.

## Properties

### asabahType?

> `readonly` `optional` **asabahType**: [`AsabahType`](../type-aliases/AsabahType.md)

Defined in: src/inheritance/types.ts:348

Asabah type if applicable.

***

### blockedBy?

> `readonly` `optional` **blockedBy**: [`HeirType`](../type-aliases/HeirType.md)[]

Defined in: src/inheritance/types.ts:378

Which heir types blocked this heir.

***

### category

> `readonly` **category**: [`ShareCategory`](../type-aliases/ShareCategory.md)

Defined in: src/inheritance/types.ts:343

Share category.

***

### count

> `readonly` **count**: `number`

Defined in: src/inheritance/types.ts:338

Number of heirs of this type.

***

### finalShare

> `readonly` **finalShare**: [`Fraction`](Fraction.md)

Defined in: src/inheritance/types.ts:358

Final share after aul/radd adjustments.

***

### heirType

> `readonly` **heirType**: [`HeirType`](../type-aliases/HeirType.md)

Defined in: src/inheritance/types.ts:333

Heir type.

***

### isBlocked

> `readonly` **isBlocked**: `boolean`

Defined in: src/inheritance/types.ts:373

Is this heir blocked by hijab?

***

### notes?

> `readonly` `optional` **notes**: `string`[]

Defined in: src/inheritance/types.ts:383

Additional notes/explanations.

***

### originalShare?

> `readonly` `optional` **originalShare**: [`Fraction`](Fraction.md)

Defined in: src/inheritance/types.ts:353

Original furudh share before adjustments.

***

### perPersonValue

> `readonly` **perPersonValue**: `number`

Defined in: src/inheritance/types.ts:368

Value per person (totalValue / count).

***

### totalValue

> `readonly` **totalValue**: `number`

Defined in: src/inheritance/types.ts:363

Total absolute value for this heir type.
