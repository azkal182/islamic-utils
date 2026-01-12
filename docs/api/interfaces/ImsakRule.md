[**Islamic Utilities API v0.2.2**](../README.md)

***

[Islamic Utilities API](../README.md) / ImsakRule

# Interface: ImsakRule

Defined in: [src/prayer-times/types.ts:215](https://github.com/azkal182/islamic-utils/blob/f548f22580afc5800e32e3785eef49f3fce9f58a/src/prayer-times/types.ts#L215)

Rule for calculating Imsak (beginning of fasting time).

## Remarks

Imsak is typically a few minutes before Fajr to provide a
safety margin for those who are fasting.

## Properties

### type

> `readonly` **type**: `"angle_based"` \| `"minutes_before_fajr"`

Defined in: [src/prayer-times/types.ts:221](https://github.com/azkal182/islamic-utils/blob/f548f22580afc5800e32e3785eef49f3fce9f58a/src/prayer-times/types.ts#L221)

Type of Imsak calculation.
- 'minutes_before_fajr': Fixed minutes before Fajr (most common)
- 'angle_based': Based on sun angle (similar to Fajr)

***

### value

> `readonly` **value**: `number`

Defined in: [src/prayer-times/types.ts:228](https://github.com/azkal182/islamic-utils/blob/f548f22580afc5800e32e3785eef49f3fce9f58a/src/prayer-times/types.ts#L228)

Value for the calculation.
- For 'minutes_before_fajr': number of minutes (typically 10)
- For 'angle_based': sun angle in degrees (typically 19-20)
