[**Islamic Utilities API v0.2.2**](../README.md)

***

[Islamic Utilities API](../README.md) / HijriCalculationMethod

# Interface: HijriCalculationMethod

Defined in: src/hijri-calendar/methods/types.ts:8

## Properties

### description

> `readonly` **description**: `string`

Defined in: src/hijri-calendar/methods/types.ts:11

***

### id

> `readonly` **id**: [`HijriMethodId`](../type-aliases/HijriMethodId.md)

Defined in: src/hijri-calendar/methods/types.ts:9

***

### name

> `readonly` **name**: `string`

Defined in: src/hijri-calendar/methods/types.ts:10

***

### supportedGregorianYears?

> `readonly` `optional` **supportedGregorianYears**: `object`

Defined in: src/hijri-calendar/methods/types.ts:13

#### end

> `readonly` **end**: `number`

#### start

> `readonly` **start**: `number`

***

### supportedHijriYears?

> `readonly` `optional` **supportedHijriYears**: `object`

Defined in: src/hijri-calendar/methods/types.ts:18

#### end

> `readonly` **end**: `number`

#### start

> `readonly` **start**: `number`

## Methods

### convertGregorianToHijri()

> **convertGregorianToHijri**(`date`): [`HijriDate`](HijriDate.md)

Defined in: src/hijri-calendar/methods/types.ts:26

Converts a Gregorian date to Hijri.

#### Parameters

##### date

[`DateOnly`](DateOnly.md)

#### Returns

[`HijriDate`](HijriDate.md)

***

### convertHijriToGregorian()

> **convertHijriToGregorian**(`date`): [`DateOnly`](DateOnly.md)

Defined in: src/hijri-calendar/methods/types.ts:31

Converts a Hijri date to Gregorian.

#### Parameters

##### date

[`HijriDate`](HijriDate.md)

#### Returns

[`DateOnly`](DateOnly.md)

***

### getHijriMonthLength()

> **getHijriMonthLength**(`identifier`): `29` \| `30`

Defined in: src/hijri-calendar/methods/types.ts:36

Returns the month length (29 or 30 days) for a given Hijri year/month.

#### Parameters

##### identifier

[`HijriMonthIdentifier`](HijriMonthIdentifier.md)

#### Returns

`29` \| `30`
