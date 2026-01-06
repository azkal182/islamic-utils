[**Islamic Utilities API v0.2.1**](../README.md)

***

[Islamic Utilities API](../README.md) / QiblaOptions

# Interface: QiblaOptions

Defined in: [src/qibla/types.ts:45](https://github.com/azkal182/islamic-utils/blob/6511551c69fa725f6e44569e9e1278849e32f702/src/qibla/types.ts#L45)

Options for Qibla calculation.

## Properties

### includeDistance?

> `readonly` `optional` **includeDistance**: `boolean`

Defined in: [src/qibla/types.ts:62](https://github.com/azkal182/islamic-utils/blob/6511551c69fa725f6e44569e9e1278849e32f702/src/qibla/types.ts#L62)

Whether to include the distance to Ka'bah.

#### Remarks

Calculates the great-circle distance in kilometers.
Defaults to false.

***

### includeTrace?

> `readonly` `optional` **includeTrace**: `boolean`

Defined in: [src/qibla/types.ts:53](https://github.com/azkal182/islamic-utils/blob/6511551c69fa725f6e44569e9e1278849e32f702/src/qibla/types.ts#L53)

Whether to include a trace of calculation steps.

#### Remarks

Useful for debugging and verification.
Defaults to false for performance.
