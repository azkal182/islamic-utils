[**Islamic Utilities API v0.2.2**](../README.md)

***

[Islamic Utilities API](../README.md) / HighLatitudeRule

# Variable: HighLatitudeRule

> `const` **HighLatitudeRule**: `object`

Defined in: [src/prayer-times/types.ts:140](https://github.com/azkal182/islamic-utils/blob/f548f22580afc5800e32e3785eef49f3fce9f58a/src/prayer-times/types.ts#L140)

Rules for calculating Fajr and Isha at high latitudes.

## Type Declaration

### ANGLE\_BASED

> `readonly` **ANGLE\_BASED**: `"angle_based"` = `'angle_based'`

Angle-based method.
Time is proportional to the angle relative to the duration
from sunset to midnight.

### MIDDLE\_OF\_NIGHT

> `readonly` **MIDDLE\_OF\_NIGHT**: `"middle_of_night"` = `'middle_of_night'`

Middle of Night method.
- Fajr = Sunset + 1/2 night duration
- Isha = Sunset + 1/2 night duration (from the other end)

### NONE

> `readonly` **NONE**: `"none"` = `'none'`

No adjustment - return null if time cannot be calculated.
Use this only if you have a specific fallback strategy.

### ONE\_SEVENTH

> `readonly` **ONE\_SEVENTH**: `"one_seventh"` = `'one_seventh'`

One-Seventh of Night method.
- Fajr = Sunrise - 1/7 night duration
- Isha = Sunset + 6/7 night duration

## Remarks

At high latitudes (above ~48.5°), the sun may not descend far enough
below the horizon for Fajr or Isha angles to be reached.

These rules provide alternatives for such situations.
