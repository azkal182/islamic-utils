[**Islamic Utilities API v0.2.2**](../README.md)

***

[Islamic Utilities API](../README.md) / ErrorCodes

# Variable: ErrorCodes

> `const` **ErrorCodes**: `object`

Defined in: [src/core/errors/codes.ts:31](https://github.com/azkal182/islamic-utils/blob/a30827e72f5e43f868fff9ce519ca224296e663c/src/core/errors/codes.ts#L31)

All error codes used by the library.

## Type Declaration

### INHERITANCE\_DISTRIBUTION\_MISMATCH

> `readonly` **INHERITANCE\_DISTRIBUTION\_MISMATCH**: `"INHERITANCE_DISTRIBUTION_MISMATCH"` = `'INHERITANCE_DISTRIBUTION_MISMATCH'`

Total distribution doesn't match net estate.

#### Remarks

This is an internal consistency error and should not occur.
If it does, please report it as a bug.

### INHERITANCE\_INVALID\_ESTATE

> `readonly` **INHERITANCE\_INVALID\_ESTATE**: `"INHERITANCE_INVALID_ESTATE"` = `'INHERITANCE_INVALID_ESTATE'`

Estate values are invalid.

#### Remarks

- Estate value must be positive
- Debts cannot exceed estate
- Funeral costs cannot exceed estate
- Wasiyyah cannot exceed 1/3 of estate (after debts and funeral)

### INHERITANCE\_INVALID\_HEIRS

> `readonly` **INHERITANCE\_INVALID\_HEIRS**: `"INHERITANCE_INVALID_HEIRS"` = `'INHERITANCE_INVALID_HEIRS'`

Heir information is invalid.

#### Remarks

- Unknown heir type
- Invalid count (must be positive integer)
- Conflicting heirs (e.g., husband AND wife)

### INHERITANCE\_NO\_HEIRS

> `readonly` **INHERITANCE\_NO\_HEIRS**: `"INHERITANCE_NO_HEIRS"` = `'INHERITANCE_NO_HEIRS'`

No heirs provided for inheritance calculation.

### INTERNAL\_ERROR

> `readonly` **INTERNAL\_ERROR**: `"INTERNAL_ERROR"` = `'INTERNAL_ERROR'`

An unexpected internal error occurred.

#### Remarks

This indicates a bug in the library. Please report it.

### INVALID\_ADJUSTMENT

> `readonly` **INVALID\_ADJUSTMENT**: `"INVALID_ADJUSTMENT"` = `'INVALID_ADJUSTMENT'`

Invalid adjustment value provided.

### INVALID\_CALCULATION\_METHOD

> `readonly` **INVALID\_CALCULATION\_METHOD**: `"INVALID_CALCULATION_METHOD"` = `'INVALID_CALCULATION_METHOD'`

The specified calculation method is not recognized.

### INVALID\_COORDINATES

> `readonly` **INVALID\_COORDINATES**: `"INVALID_COORDINATES"` = `'INVALID_COORDINATES'`

Coordinates are invalid (latitude/longitude out of range).

#### Remarks

- Latitude must be between -90 and +90
- Longitude must be between -180 and +180
- Altitude must be >= 0 if provided

### INVALID\_DATE

> `readonly` **INVALID\_DATE**: `"INVALID_DATE"` = `'INVALID_DATE'`

Date is invalid or doesn't exist.

#### Remarks

Examples: February 30, month 13, day 0, etc.

### INVALID\_PARAMETER\_TYPE

> `readonly` **INVALID\_PARAMETER\_TYPE**: `"INVALID_PARAMETER_TYPE"` = `'INVALID_PARAMETER_TYPE'`

A parameter has an invalid type.

### INVALID\_TIMEZONE

> `readonly` **INVALID\_TIMEZONE**: `"INVALID_TIMEZONE"` = `'INVALID_TIMEZONE'`

Timezone is invalid or unrecognized.

#### Remarks

- UTC offset must be between -12 and +14
- IANA timezone name must be valid

### MISSING\_PARAMETER

> `readonly` **MISSING\_PARAMETER**: `"MISSING_PARAMETER"` = `'MISSING_PARAMETER'`

A required parameter is missing.

### POLAR\_DAY\_UNRESOLVED

> `readonly` **POLAR\_DAY\_UNRESOLVED**: `"POLAR_DAY_UNRESOLVED"` = `'POLAR_DAY_UNRESOLVED'`

High latitude location where Fajr/Isha cannot be calculated
and no high latitude rule was specified.

#### Remarks

Occurs when:
- Location is above ~48.5° latitude in summer
- Sun doesn't reach required angles for Fajr/Isha
- highLatitudeRule is set to 'NONE'

Solution: Use a high latitude rule (MIDDLE_OF_NIGHT, ONE_SEVENTH, etc.)

### PRAYER\_TIMES\_INCONSISTENT

> `readonly` **PRAYER\_TIMES\_INCONSISTENT**: `"PRAYER_TIMES_INCONSISTENT"` = `'PRAYER_TIMES_INCONSISTENT'`

Calculated prayer times are in an inconsistent order.

#### Remarks

Expected order: imsak < fajr < sunrise < dhuha_start < dhuhr < asr < maghrib < isha

This usually indicates a bug or extreme edge case.
Check adjustments and safety buffers for conflicts.

### QIBLA\_AT\_KAABA

> `readonly` **QIBLA\_AT\_KAABA**: `"QIBLA_AT_KAABA"` = `'QIBLA_AT_KAABA'`

User is at or very close to the Ka'bah.

#### Remarks

When the user is at the Ka'bah itself, any direction is valid.
This is technically not an error but a special case.

## Remarks

Use these constants instead of string literals to avoid typos
and enable IDE autocompletion.
