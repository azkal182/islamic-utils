[**Islamic Utilities API v0.2.1**](../README.md)

***

[Islamic Utilities API](../README.md) / HeirShare

# Interface: HeirShare

Defined in: [src/inheritance/types.ts:329](https://github.com/azkal182/islamic-utils/blob/6511551c69fa725f6e44569e9e1278849e32f702/src/inheritance/types.ts#L329)

Share calculation for a single heir type.

## Properties

### asabahType?

> `readonly` `optional` **asabahType**: [`AsabahType`](../type-aliases/AsabahType.md)

Defined in: [src/inheritance/types.ts:348](https://github.com/azkal182/islamic-utils/blob/6511551c69fa725f6e44569e9e1278849e32f702/src/inheritance/types.ts#L348)

Asabah type if applicable.

***

### blockedBy?

> `readonly` `optional` **blockedBy**: [`HeirType`](../type-aliases/HeirType.md)[]

Defined in: [src/inheritance/types.ts:378](https://github.com/azkal182/islamic-utils/blob/6511551c69fa725f6e44569e9e1278849e32f702/src/inheritance/types.ts#L378)

Which heir types blocked this heir.

***

### category

> `readonly` **category**: [`ShareCategory`](../type-aliases/ShareCategory.md)

Defined in: [src/inheritance/types.ts:343](https://github.com/azkal182/islamic-utils/blob/6511551c69fa725f6e44569e9e1278849e32f702/src/inheritance/types.ts#L343)

Share category.

***

### count

> `readonly` **count**: `number`

Defined in: [src/inheritance/types.ts:338](https://github.com/azkal182/islamic-utils/blob/6511551c69fa725f6e44569e9e1278849e32f702/src/inheritance/types.ts#L338)

Number of heirs of this type.

***

### finalShare

> `readonly` **finalShare**: [`Fraction`](Fraction.md)

Defined in: [src/inheritance/types.ts:358](https://github.com/azkal182/islamic-utils/blob/6511551c69fa725f6e44569e9e1278849e32f702/src/inheritance/types.ts#L358)

Final share after aul/radd adjustments.

***

### heirType

> `readonly` **heirType**: [`HeirType`](../type-aliases/HeirType.md)

Defined in: [src/inheritance/types.ts:333](https://github.com/azkal182/islamic-utils/blob/6511551c69fa725f6e44569e9e1278849e32f702/src/inheritance/types.ts#L333)

Heir type.

***

### isBlocked

> `readonly` **isBlocked**: `boolean`

Defined in: [src/inheritance/types.ts:373](https://github.com/azkal182/islamic-utils/blob/6511551c69fa725f6e44569e9e1278849e32f702/src/inheritance/types.ts#L373)

Is this heir blocked by hijab?

***

### notes?

> `readonly` `optional` **notes**: `string`[]

Defined in: [src/inheritance/types.ts:383](https://github.com/azkal182/islamic-utils/blob/6511551c69fa725f6e44569e9e1278849e32f702/src/inheritance/types.ts#L383)

Additional notes/explanations.

***

### originalShare?

> `readonly` `optional` **originalShare**: [`Fraction`](Fraction.md)

Defined in: [src/inheritance/types.ts:353](https://github.com/azkal182/islamic-utils/blob/6511551c69fa725f6e44569e9e1278849e32f702/src/inheritance/types.ts#L353)

Original furudh share before adjustments.

***

### perPersonValue

> `readonly` **perPersonValue**: `number`

Defined in: [src/inheritance/types.ts:368](https://github.com/azkal182/islamic-utils/blob/6511551c69fa725f6e44569e9e1278849e32f702/src/inheritance/types.ts#L368)

Value per person (totalValue / count).

***

### totalValue

> `readonly` **totalValue**: `number`

Defined in: [src/inheritance/types.ts:363](https://github.com/azkal182/islamic-utils/blob/6511551c69fa725f6e44569e9e1278849e32f702/src/inheritance/types.ts#L363)

Total absolute value for this heir type.
