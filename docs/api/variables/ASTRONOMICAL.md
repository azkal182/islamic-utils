[**Islamic Utilities API v0.2.1**](../README.md)

***

[Islamic Utilities API](../README.md) / ASTRONOMICAL

# Variable: ASTRONOMICAL

> `const` **ASTRONOMICAL**: `object`

Defined in: [src/core/constants/astronomical.ts:20](https://github.com/azkal182/islamic-utils/blob/6511551c69fa725f6e44569e9e1278849e32f702/src/core/constants/astronomical.ts#L20)

Fundamental astronomical constants.

## Type Declaration

### DEGREES\_PER\_HOUR

> `readonly` **DEGREES\_PER\_HOUR**: `15` = `15`

Number of degrees the Earth rotates per hour.

#### Remarks

360° / 24 hours = 15° per hour
Used in hour angle calculations.

### EARTH\_OBLIQUITY

> `readonly` **EARTH\_OBLIQUITY**: `23.4397` = `23.4397`

Mean obliquity of the ecliptic (Earth's axial tilt) in degrees.

#### Remarks

This value slowly changes over time. The value here is
appropriate for calculations in the 21st century.

~ 23.44° as of J2000.0

### HOURS\_PER\_DEGREE

> `readonly` **HOURS\_PER\_DEGREE**: `number`

Number of hours per degree of longitude.

#### Remarks

24 hours / 360° = 1/15 hours per degree
Used for timezone and solar time calculations.

### J2000\_EPOCH

> `readonly` **J2000\_EPOCH**: `2451545` = `2451545.0`

Julian date of the J2000.0 epoch.

#### Remarks

J2000.0 = January 1, 2000, at 12:00 TT (Terrestrial Time)
This is the standard epoch for modern astronomical calculations.

### JULIAN\_CENTURY

> `readonly` **JULIAN\_CENTURY**: `36525` = `36525`

Days in a Julian century.

### REFRACTION\_AT\_HORIZON

> `readonly` **REFRACTION\_AT\_HORIZON**: `0.833` = `0.833`

Atmospheric refraction at the horizon in degrees.

#### Remarks

When the sun's geometric center is exactly at the horizon (0°),
atmospheric refraction causes it to appear about 34 arcminutes
(0.567°) higher than its true position.

Combined with the sun's semi-diameter (16 arcminutes), the sun
appears to touch the horizon when its center is about 50 arcminutes
(0.833°) below the horizon.

This value is used for sunrise/sunset calculations.

### STANDARD\_REFRACTION

> `readonly` **STANDARD\_REFRACTION**: `0.5667` = `0.5667`

Standard atmospheric refraction correction in degrees.

#### Remarks

Value at sea level under standard atmospheric conditions.
About 34 arcminutes.

### SUN\_SEMI\_DIAMETER

> `readonly` **SUN\_SEMI\_DIAMETER**: `0.266` = `0.266`

Sun's angular semi-diameter in degrees.

#### Remarks

The sun subtends an angle of about 32 arcminutes (0.533°).
The semi-diameter is half of this.

Used to calculate when the sun's upper limb touches the horizon.

## Remarks

These constants are used in solar position calculations.
Sources: USNO, NASA JPL, and IAU standards.
