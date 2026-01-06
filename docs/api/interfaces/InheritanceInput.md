[**Islamic Utilities API v0.2.1**](../README.md)

***

[Islamic Utilities API](../README.md) / InheritanceInput

# Interface: InheritanceInput

Defined in: [src/inheritance/types.ts:242](https://github.com/azkal182/islamic-utils/blob/6511551c69fa725f6e44569e9e1278849e32f702/src/inheritance/types.ts#L242)

Main input for inheritance calculation.

## Properties

### deceased

> `readonly` **deceased**: `DeceasedInfo`

Defined in: [src/inheritance/types.ts:256](https://github.com/azkal182/islamic-utils/blob/6511551c69fa725f6e44569e9e1278849e32f702/src/inheritance/types.ts#L256)

Deceased person information.

***

### estate

> `readonly` **estate**: [`EstateInput`](EstateInput.md)

Defined in: [src/inheritance/types.ts:246](https://github.com/azkal182/islamic-utils/blob/6511551c69fa725f6e44569e9e1278849e32f702/src/inheritance/types.ts#L246)

Estate information.

***

### heirs

> `readonly` **heirs**: [`HeirInput`](HeirInput.md)[]

Defined in: [src/inheritance/types.ts:251](https://github.com/azkal182/islamic-utils/blob/6511551c69fa725f6e44569e9e1278849e32f702/src/inheritance/types.ts#L251)

List of heirs.

***

### policy?

> `readonly` `optional` **policy**: `Partial`\<[`InheritancePolicy`](InheritancePolicy.md)\>

Defined in: [src/inheritance/types.ts:261](https://github.com/azkal182/islamic-utils/blob/6511551c69fa725f6e44569e9e1278849e32f702/src/inheritance/types.ts#L261)

Optional policy overrides.
