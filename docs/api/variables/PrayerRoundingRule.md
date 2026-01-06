[**Islamic Utilities API v0.2.0**](../README.md)

***

[Islamic Utilities API](../README.md) / PrayerRoundingRule

# Variable: PrayerRoundingRule

> `const` **PrayerRoundingRule**: `object`

Defined in: [src/prayer-times/types.ts:185](https://github.com/azkal182/islamic-utils/blob/0df9a3737b1fb38d644e36b5ae34cdf225bc89df/src/prayer-times/types.ts#L185)

Rounding rules for prayer times.

## Type Declaration

### CEIL

> `readonly` **CEIL**: `"ceil"` = `'ceil'`

Always round up (ceiling)

### FLOOR

> `readonly` **FLOOR**: `"floor"` = `'floor'`

Always round down (floor)

### NEAREST

> `readonly` **NEAREST**: `"nearest"` = `'nearest'`

Round to nearest minute

### NONE

> `readonly` **NONE**: `"none"` = `'none'`

No rounding - keep full precision

## Remarks

Prayer times are typically displayed to the minute.
This setting controls how fractional minutes are handled.
