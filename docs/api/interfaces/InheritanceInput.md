[**Islamic Utilities API v0.2.0**](../README.md)

***

[Islamic Utilities API](../README.md) / InheritanceInput

# Interface: InheritanceInput

Defined in: src/inheritance/types.ts:242

Main input for inheritance calculation.

## Properties

### deceased

> `readonly` **deceased**: `DeceasedInfo`

Defined in: src/inheritance/types.ts:256

Deceased person information.

***

### estate

> `readonly` **estate**: [`EstateInput`](EstateInput.md)

Defined in: src/inheritance/types.ts:246

Estate information.

***

### heirs

> `readonly` **heirs**: [`HeirInput`](HeirInput.md)[]

Defined in: src/inheritance/types.ts:251

List of heirs.

***

### policy?

> `readonly` `optional` **policy**: `Partial`\<[`InheritancePolicy`](InheritancePolicy.md)\>

Defined in: src/inheritance/types.ts:261

Optional policy overrides.
