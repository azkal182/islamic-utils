[**Islamic Utilities API v0.2.2**](../README.md)

***

[Islamic Utilities API](../README.md) / InheritanceInput

# Interface: InheritanceInput

Defined in: [src/inheritance/types.ts:242](https://github.com/azkal182/islamic-utils/blob/a30827e72f5e43f868fff9ce519ca224296e663c/src/inheritance/types.ts#L242)

Main input for inheritance calculation.

## Properties

### deceased

> `readonly` **deceased**: `DeceasedInfo`

Defined in: [src/inheritance/types.ts:256](https://github.com/azkal182/islamic-utils/blob/a30827e72f5e43f868fff9ce519ca224296e663c/src/inheritance/types.ts#L256)

Deceased person information.

***

### estate

> `readonly` **estate**: [`EstateInput`](EstateInput.md)

Defined in: [src/inheritance/types.ts:246](https://github.com/azkal182/islamic-utils/blob/a30827e72f5e43f868fff9ce519ca224296e663c/src/inheritance/types.ts#L246)

Estate information.

***

### heirs

> `readonly` **heirs**: [`HeirInput`](HeirInput.md)[]

Defined in: [src/inheritance/types.ts:251](https://github.com/azkal182/islamic-utils/blob/a30827e72f5e43f868fff9ce519ca224296e663c/src/inheritance/types.ts#L251)

List of heirs.

***

### policy?

> `readonly` `optional` **policy**: `Partial`\<[`InheritancePolicy`](InheritancePolicy.md)\>

Defined in: [src/inheritance/types.ts:261](https://github.com/azkal182/islamic-utils/blob/a30827e72f5e43f868fff9ce519ca224296e663c/src/inheritance/types.ts#L261)

Optional policy overrides.
