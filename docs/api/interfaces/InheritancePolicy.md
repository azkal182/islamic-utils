[**Islamic Utilities API v0.2.0**](../README.md)

***

[Islamic Utilities API](../README.md) / InheritancePolicy

# Interface: InheritancePolicy

Defined in: [src/inheritance/types.ts:114](https://github.com/azkal182/islamic-utils/blob/ddd04bee89289da73cadadfcee51cdeac187e097/src/inheritance/types.ts#L114)

Policy configuration for handling scholarly differences (ikhtilaf).

## Remarks

Based on DECISION_MATRIX_WARIS.md Section 3.

## Properties

### dhawilArhamMode

> `readonly` **dhawilArhamMode**: `"ENABLED"` \| `"BAITUL_MAL"`

Defined in: [src/inheritance/types.ts:138](https://github.com/azkal182/islamic-utils/blob/ddd04bee89289da73cadadfcee51cdeac187e097/src/inheritance/types.ts#L138)

Whether to include Dhawil Arham or assign to Baitul Mal.

#### Default

```ts
'ENABLED'
```

***

### grandfatherMode

> `readonly` **grandfatherMode**: `"LIKE_FATHER"` \| `"COMPETE_WITH_SIBLINGS"`

Defined in: [src/inheritance/types.ts:131](https://github.com/azkal182/islamic-utils/blob/ddd04bee89289da73cadadfcee51cdeac187e097/src/inheritance/types.ts#L131)

How grandfather is treated with siblings.

#### Default

```ts
'COMPETE_WITH_SIBLINGS'
```

#### Remarks

- LIKE_FATHER: Grandfather blocks siblings entirely
- COMPETE_WITH_SIBLINGS: Grandfather competes with siblings

***

### motherSiblingRule

> `readonly` **motherSiblingRule**: `"COUNT_ALL"` \| `"EXCLUDE_UTERINE"`

Defined in: [src/inheritance/types.ts:145](https://github.com/azkal182/islamic-utils/blob/ddd04bee89289da73cadadfcee51cdeac187e097/src/inheritance/types.ts#L145)

How siblings affect mother's share calculation.

#### Default

```ts
'COUNT_ALL'
```

***

### mushtarakahPolicy

> `readonly` **mushtarakahPolicy**: `"STANDARD"` \| `"UMAR"`

Defined in: [src/inheritance/types.ts:155](https://github.com/azkal182/islamic-utils/blob/ddd04bee89289da73cadadfcee51cdeac187e097/src/inheritance/types.ts#L155)

Mushtarakah case handling.

#### Default

```ts
'UMAR'
```

#### Remarks

- STANDARD: Uterine siblings get 1/3, full brothers get nothing
- UMAR: All siblings share 1/3 equally

***

### raddIncludesSpouse

> `readonly` **raddIncludesSpouse**: `boolean`

Defined in: [src/inheritance/types.ts:121](https://github.com/azkal182/islamic-utils/blob/ddd04bee89289da73cadadfcee51cdeac187e097/src/inheritance/types.ts#L121)

Whether spouse receives radd (remainder redistribution).

#### Default

```ts
false
```

#### Remarks

Most madhabs exclude spouse from radd.
