[**Islamic Utilities API v0.2.1**](../README.md)

***

[Islamic Utilities API](../README.md) / PRAYER\_ANGLES

# Variable: PRAYER\_ANGLES

> `const` **PRAYER\_ANGLES**: `object`

Defined in: [src/core/constants/astronomical.ts:108](https://github.com/azkal182/islamic-utils/blob/6511551c69fa725f6e44569e9e1278849e32f702/src/core/constants/astronomical.ts#L108)

Standard angles used in prayer time calculations.

## Type Declaration

### ASTRONOMICAL\_TWILIGHT

> `readonly` **ASTRONOMICAL\_TWILIGHT**: `18` = `18`

Sun elevation for beginning of astronomical twilight.

#### Remarks

18° below horizon. Sky is completely dark.

### CIVIL\_TWILIGHT

> `readonly` **CIVIL\_TWILIGHT**: `6` = `6`

Sun elevation for beginning of civil twilight.

#### Remarks

6° below horizon. Enough light for most outdoor activities.

### DHUHA\_START\_DEFAULT

> `readonly` **DHUHA\_START\_DEFAULT**: `4.5` = `4.5`

Default sun altitude for Dhuha start.

#### Remarks

When the sun has risen sufficiently for Dhuha prayer.
Typically 3°-15° above the horizon depending on opinion.

### FAJR\_DEFAULT

> `readonly` **FAJR\_DEFAULT**: `18` = `18`

Default angle for Fajr (dawn).

#### Remarks

When the first light appears on the eastern horizon (true dawn).
This is when the sun is 18° below the horizon according to MWL.
Different methods use 15°-20°.

### ISHA\_DEFAULT

> `readonly` **ISHA\_DEFAULT**: `17` = `17`

Default angle for Isha (nightfall).

#### Remarks

When the twilight disappears completely.
MWL uses 17°. Different methods use 15°-18°.

### NAUTICAL\_TWILIGHT

> `readonly` **NAUTICAL\_TWILIGHT**: `12` = `12`

Sun elevation for beginning of nautical twilight.

#### Remarks

12° below horizon. Horizon still visible at sea.

### SUNRISE\_SUNSET

> `readonly` **SUNRISE\_SUNSET**: `-0.833` = `-0.833`

Sun elevation angle for sunrise/sunset.

#### Remarks

Includes refraction correction (0.833°).
Sun's upper limb just touches the horizon.

## Remarks

These are the sun elevation angles that define various prayer times.
Different organizations and madhabs may use slightly different values.
