[**Islamic Utilities API v0.2.0**](../README.md)

***

[Islamic Utilities API](../README.md) / InheritanceInput

# Interface: InheritanceInput

Defined in: [src/inheritance/types.ts:242](https://github.com/azkal182/islamic-utils/blob/ddd04bee89289da73cadadfcee51cdeac187e097/src/inheritance/types.ts#L242)

Main input for inheritance calculation.

## Properties

### deceased

> `readonly` **deceased**: `DeceasedInfo`

Defined in: [src/inheritance/types.ts:256](https://github.com/azkal182/islamic-utils/blob/ddd04bee89289da73cadadfcee51cdeac187e097/src/inheritance/types.ts#L256)

Deceased person information.

***

### estate

> `readonly` **estate**: [`EstateInput`](EstateInput.md)

Defined in: [src/inheritance/types.ts:246](https://github.com/azkal182/islamic-utils/blob/ddd04bee89289da73cadadfcee51cdeac187e097/src/inheritance/types.ts#L246)

Estate information.

***

### heirs

> `readonly` **heirs**: [`HeirInput`](HeirInput.md)[]

Defined in: [src/inheritance/types.ts:251](https://github.com/azkal182/islamic-utils/blob/ddd04bee89289da73cadadfcee51cdeac187e097/src/inheritance/types.ts#L251)

List of heirs.

***

### policy?

> `readonly` `optional` **policy**: `Partial`\<[`InheritancePolicy`](InheritancePolicy.md)\>

Defined in: [src/inheritance/types.ts:261](https://github.com/azkal182/islamic-utils/blob/ddd04bee89289da73cadadfcee51cdeac187e097/src/inheritance/types.ts#L261)

Optional policy overrides.
