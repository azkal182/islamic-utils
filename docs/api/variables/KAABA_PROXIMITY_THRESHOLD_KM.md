[**Islamic Utilities API v0.2.1**](../README.md)

***

[Islamic Utilities API](../README.md) / KAABA\_PROXIMITY\_THRESHOLD\_KM

# Variable: KAABA\_PROXIMITY\_THRESHOLD\_KM

> `const` **KAABA\_PROXIMITY\_THRESHOLD\_KM**: `0.1` = `0.1`

Defined in: [src/core/constants/kaaba.ts:68](https://github.com/azkal182/islamic-utils/blob/6511551c69fa725f6e44569e9e1278849e32f702/src/core/constants/kaaba.ts#L68)

Precision threshold for determining if a location is "at" the Ka'bah.

## Remarks

If the user's distance to the Ka'bah is less than this value (in km),
they are considered to be at the Ka'bah and any direction is valid.

100 meters is approximately the size of the Mataf (circumambulation area).
