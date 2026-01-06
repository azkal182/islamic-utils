[**Islamic Utilities API v0.2.0**](../README.md)

***

[Islamic Utilities API](../README.md) / DhuhaRule

# Interface: DhuhaRule

Defined in: [src/prayer-times/types.ts:250](https://github.com/azkal182/islamic-utils/blob/0df9a3737b1fb38d644e36b5ae34cdf225bc89df/src/prayer-times/types.ts#L250)

Rule for calculating Dhuha prayer time window.

## Remarks

Dhuha is a voluntary prayer performed after sunrise
and before the sun reaches its zenith (solar noon).

## Properties

### end

> `readonly` **end**: `object`

Defined in: [src/prayer-times/types.ts:273](https://github.com/azkal182/islamic-utils/blob/0df9a3737b1fb38d644e36b5ae34cdf225bc89df/src/prayer-times/types.ts#L273)

Rule for calculating Dhuha end time.

#### type

> `readonly` **type**: `"minutes_before_dhuhr"`

Type of calculation.
Currently only supports minutes before Dhuhr.

#### value

> `readonly` **value**: `number`

Minutes before Dhuhr when Dhuha ends.
Default: 0 (Dhuha ends exactly at solar noon)

***

### start

> `readonly` **start**: `object`

Defined in: [src/prayer-times/types.ts:254](https://github.com/azkal182/islamic-utils/blob/0df9a3737b1fb38d644e36b5ae34cdf225bc89df/src/prayer-times/types.ts#L254)

Rule for calculating Dhuha start time.

#### type

> `readonly` **type**: `"minutes_after_sunrise"` \| `"sun_altitude"`

Type of calculation.
- 'minutes_after_sunrise': Fixed minutes after sunrise
- 'sun_altitude': When sun reaches specific altitude above horizon

#### value

> `readonly` **value**: `number`

Value for the calculation.
- For 'minutes_after_sunrise': number of minutes (typically 15-20)
- For 'sun_altitude': altitude in degrees (typically 4.5-12)
