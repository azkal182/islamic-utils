[**Islamic Utilities API v0.2.0**](../README.md)

***

[Islamic Utilities API](../README.md) / PrayerCalculationParams

# Interface: PrayerCalculationParams

Defined in: [src/prayer-times/types.ts:400](https://github.com/azkal182/islamic-utils/blob/0df9a3737b1fb38d644e36b5ae34cdf225bc89df/src/prayer-times/types.ts#L400)

Parameters for prayer time calculation.

## Remarks

These parameters control how prayer times are calculated.
Only `method` is required; all others have sensible defaults.

## Properties

### adjustments?

> `readonly` `optional` **adjustments**: `Partial`\<`Record`\<[`PrayerName`](../type-aliases/PrayerName.md), `number`\>\>

Defined in: [src/prayer-times/types.ts:459](https://github.com/azkal182/islamic-utils/blob/0df9a3737b1fb38d644e36b5ae34cdf225bc89df/src/prayer-times/types.ts#L459)

Manual adjustments in minutes for each prayer.

#### Remarks

Applied after all calculations but before rounding.

***

### asrMadhhab?

> `readonly` `optional` **asrMadhhab**: [`AsrMadhhab`](../type-aliases/AsrMadhhab.md)

Defined in: [src/prayer-times/types.ts:416](https://github.com/azkal182/islamic-utils/blob/0df9a3737b1fb38d644e36b5ae34cdf225bc89df/src/prayer-times/types.ts#L416)

Madhhab for Asr calculation.

#### Remarks

Defaults to STANDARD (Shafi'i shadow factor of 1).

***

### dhuhaRule?

> `readonly` `optional` **dhuhaRule**: [`DhuhaRule`](DhuhaRule.md)

Defined in: [src/prayer-times/types.ts:443](https://github.com/azkal182/islamic-utils/blob/0df9a3737b1fb38d644e36b5ae34cdf225bc89df/src/prayer-times/types.ts#L443)

Rule for calculating Dhuha time window.

#### Remarks

Defaults to 15 minutes after sunrise, ending at Dhuhr.

***

### highLatitudeRule?

> `readonly` `optional` **highLatitudeRule**: [`HighLatitudeRule`](../type-aliases/HighLatitudeRule.md)

Defined in: [src/prayer-times/types.ts:427](https://github.com/azkal182/islamic-utils/blob/0df9a3737b1fb38d644e36b5ae34cdf225bc89df/src/prayer-times/types.ts#L427)

Rule for high latitude locations.

#### Remarks

Applied when Fajr or Isha cannot be calculated
due to the sun not reaching the required angle.

Defaults to MIDDLE_OF_NIGHT.

***

### imsakRule?

> `readonly` `optional` **imsakRule**: [`ImsakRule`](ImsakRule.md)

Defined in: [src/prayer-times/types.ts:435](https://github.com/azkal182/islamic-utils/blob/0df9a3737b1fb38d644e36b5ae34cdf225bc89df/src/prayer-times/types.ts#L435)

Rule for calculating Imsak.

#### Remarks

Defaults to 10 minutes before Fajr.

***

### method

> `readonly` **method**: [`CalculationMethod`](CalculationMethod.md)

Defined in: [src/prayer-times/types.ts:408](https://github.com/azkal182/islamic-utils/blob/0df9a3737b1fb38d644e36b5ae34cdf225bc89df/src/prayer-times/types.ts#L408)

The calculation method to use.

#### Remarks

Use one of the built-in methods from `CALCULATION_METHODS`
or define a custom method.

***

### roundingRule?

> `readonly` `optional` **roundingRule**: [`PrayerRoundingRule`](../type-aliases/PrayerRoundingRule.md)

Defined in: [src/prayer-times/types.ts:451](https://github.com/azkal182/islamic-utils/blob/0df9a3737b1fb38d644e36b5ae34cdf225bc89df/src/prayer-times/types.ts#L451)

Rounding rule for final times.

#### Remarks

Defaults to NEAREST (round to nearest minute).

***

### safetyBuffer?

> `readonly` `optional` **safetyBuffer**: [`SafetyBuffer`](../type-aliases/SafetyBuffer.md)

Defined in: [src/prayer-times/types.ts:468](https://github.com/azkal182/islamic-utils/blob/0df9a3737b1fb38d644e36b5ae34cdf225bc89df/src/prayer-times/types.ts#L468)

Safety buffer (ihtiyath) in minutes.

#### Remarks

Applied after adjustments, before rounding.
Can be a single value or per-prayer configuration.
