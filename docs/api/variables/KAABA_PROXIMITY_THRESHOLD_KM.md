[**Islamic Utilities API v0.2.0**](../README.md)

***

[Islamic Utilities API](../README.md) / KAABA\_PROXIMITY\_THRESHOLD\_KM

# Variable: KAABA\_PROXIMITY\_THRESHOLD\_KM

> `const` **KAABA\_PROXIMITY\_THRESHOLD\_KM**: `0.1` = `0.1`

Defined in: [src/core/constants/kaaba.ts:68](https://github.com/azkal182/islamic-utils/blob/ddd04bee89289da73cadadfcee51cdeac187e097/src/core/constants/kaaba.ts#L68)

Precision threshold for determining if a location is "at" the Ka'bah.

## Remarks

If the user's distance to the Ka'bah is less than this value (in km),
they are considered to be at the Ka'bah and any direction is valid.

100 meters is approximately the size of the Mataf (circumambulation area).
