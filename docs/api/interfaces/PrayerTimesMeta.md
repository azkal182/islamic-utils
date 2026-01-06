[**Islamic Utilities API v0.2.0**](../README.md)

***

[Islamic Utilities API](../README.md) / PrayerTimesMeta

# Interface: PrayerTimesMeta

Defined in: [src/prayer-times/types.ts:493](https://github.com/azkal182/islamic-utils/blob/ddd04bee89289da73cadadfcee51cdeac187e097/src/prayer-times/types.ts#L493)

Metadata about the calculation.

## Properties

### adjustedPrayers?

> `readonly` `optional` **adjustedPrayers**: [`PrayerName`](../type-aliases/PrayerName.md)[]

Defined in: [src/prayer-times/types.ts:527](https://github.com/azkal182/islamic-utils/blob/ddd04bee89289da73cadadfcee51cdeac187e097/src/prayer-times/types.ts#L527)

Which prayer times needed high latitude adjustment.

***

### coordinates

> `readonly` **coordinates**: [`Coordinates`](Coordinates.md)

Defined in: [src/prayer-times/types.ts:497](https://github.com/azkal182/islamic-utils/blob/ddd04bee89289da73cadadfcee51cdeac187e097/src/prayer-times/types.ts#L497)

The coordinates used for calculation.

***

### date

> `readonly` **date**: [`DateOnly`](DateOnly.md)

Defined in: [src/prayer-times/types.ts:502](https://github.com/azkal182/islamic-utils/blob/ddd04bee89289da73cadadfcee51cdeac187e097/src/prayer-times/types.ts#L502)

The date for which times were calculated.

***

### highLatitudeAdjusted

> `readonly` **highLatitudeAdjusted**: `boolean`

Defined in: [src/prayer-times/types.ts:522](https://github.com/azkal182/islamic-utils/blob/ddd04bee89289da73cadadfcee51cdeac187e097/src/prayer-times/types.ts#L522)

Whether high latitude rules were applied.

***

### method

> `readonly` **method**: [`CalculationMethod`](CalculationMethod.md)

Defined in: [src/prayer-times/types.ts:512](https://github.com/azkal182/islamic-utils/blob/ddd04bee89289da73cadadfcee51cdeac187e097/src/prayer-times/types.ts#L512)

The calculation method used.

***

### params

> `readonly` **params**: `Required`\<[`PrayerCalculationParams`](PrayerCalculationParams.md)\>

Defined in: [src/prayer-times/types.ts:517](https://github.com/azkal182/islamic-utils/blob/ddd04bee89289da73cadadfcee51cdeac187e097/src/prayer-times/types.ts#L517)

Full parameters used (including defaults).

***

### timezone

> `readonly` **timezone**: [`Timezone`](../type-aliases/Timezone.md)

Defined in: [src/prayer-times/types.ts:507](https://github.com/azkal182/islamic-utils/blob/ddd04bee89289da73cadadfcee51cdeac187e097/src/prayer-times/types.ts#L507)

The timezone used for calculation.
