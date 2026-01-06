[**Islamic Utilities API v0.2.2**](../README.md)

***

[Islamic Utilities API](../README.md) / EstateInput

# Interface: EstateInput

Defined in: [src/inheritance/types.ts:176](https://github.com/azkal182/islamic-utils/blob/a30827e72f5e43f868fff9ce519ca224296e663c/src/inheritance/types.ts#L176)

Estate (harta warisan) input.

## Properties

### currency?

> `readonly` `optional` **currency**: `string`

Defined in: [src/inheritance/types.ts:210](https://github.com/azkal182/islamic-utils/blob/a30827e72f5e43f868fff9ce519ca224296e663c/src/inheritance/types.ts#L210)

Currency code for display purposes.

#### Default

```ts
'IDR'
```

***

### debts?

> `readonly` `optional` **debts**: `number`

Defined in: [src/inheritance/types.ts:186](https://github.com/azkal182/islamic-utils/blob/a30827e72f5e43f868fff9ce519ca224296e663c/src/inheritance/types.ts#L186)

Outstanding debts.

#### Default

```ts
0
```

***

### funeralCosts?

> `readonly` `optional` **funeralCosts**: `number`

Defined in: [src/inheritance/types.ts:192](https://github.com/azkal182/islamic-utils/blob/a30827e72f5e43f868fff9ce519ca224296e663c/src/inheritance/types.ts#L192)

Funeral costs (tajhiz).

#### Default

```ts
0
```

***

### grossValue

> `readonly` **grossValue**: `number`

Defined in: [src/inheritance/types.ts:180](https://github.com/azkal182/islamic-utils/blob/a30827e72f5e43f868fff9ce519ca224296e663c/src/inheritance/types.ts#L180)

Gross value of the estate.

***

### wasiyyah?

> `readonly` `optional` **wasiyyah**: `number`

Defined in: [src/inheritance/types.ts:198](https://github.com/azkal182/islamic-utils/blob/a30827e72f5e43f868fff9ce519ca224296e663c/src/inheritance/types.ts#L198)

Bequest (wasiyyah) - will be limited to 1/3 of remaining.

#### Default

```ts
0
```

***

### wasiyyahApprovedByHeirs?

> `readonly` `optional` **wasiyyahApprovedByHeirs**: `boolean`

Defined in: [src/inheritance/types.ts:204](https://github.com/azkal182/islamic-utils/blob/a30827e72f5e43f868fff9ce519ca224296e663c/src/inheritance/types.ts#L204)

If true, wasiyyah can exceed 1/3 (approved by heirs).

#### Default

```ts
false
```
