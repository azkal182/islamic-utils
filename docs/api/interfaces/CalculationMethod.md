[**Islamic Utilities API v0.2.1**](../README.md)

***

[Islamic Utilities API](../README.md) / CalculationMethod

# Interface: CalculationMethod

Defined in: [src/prayer-times/types.ts:314](https://github.com/azkal182/islamic-utils/blob/6511551c69fa725f6e44569e9e1278849e32f702/src/prayer-times/types.ts#L314)

A calculation method defines the angles/intervals used for Fajr and Isha.

## Remarks

Different Islamic organizations and regions use different conventions
for determining when Fajr and Isha occur. This interface allows
specifying these conventions.

## Properties

### description?

> `readonly` `optional` **description**: `string`

Defined in: [src/prayer-times/types.ts:363](https://github.com/azkal182/islamic-utils/blob/6511551c69fa725f6e44569e9e1278849e32f702/src/prayer-times/types.ts#L363)

Optional description of the method.

***

### fajrAngle

> `readonly` **fajrAngle**: `number`

Defined in: [src/prayer-times/types.ts:327](https://github.com/azkal182/islamic-utils/blob/6511551c69fa725f6e44569e9e1278849e32f702/src/prayer-times/types.ts#L327)

Angle below horizon for Fajr.

#### Remarks

Fajr begins when the sun is this many degrees below the horizon.
Values typically range from 15° to 20°.

***

### ishaAngle?

> `readonly` `optional` **ishaAngle**: `number`

Defined in: [src/prayer-times/types.ts:338](https://github.com/azkal182/islamic-utils/blob/6511551c69fa725f6e44569e9e1278849e32f702/src/prayer-times/types.ts#L338)

Angle below horizon for Isha.

#### Remarks

Isha begins when the sun is this many degrees below the horizon.
Values typically range from 15° to 18°.

If undefined, `ishaIntervalMinutes` must be specified.

***

### ishaIntervalMinutes?

> `readonly` `optional` **ishaIntervalMinutes**: `number`

Defined in: [src/prayer-times/types.ts:349](https://github.com/azkal182/islamic-utils/blob/6511551c69fa725f6e44569e9e1278849e32f702/src/prayer-times/types.ts#L349)

Fixed interval in minutes after Maghrib for Isha.

#### Remarks

Some methods (e.g., Makkah) use a fixed time after Maghrib
instead of an angle. Typically 90 minutes.

If specified, takes precedence over `ishaAngle`.

***

### maghribAngle?

> `readonly` `optional` **maghribAngle**: `number`

Defined in: [src/prayer-times/types.ts:358](https://github.com/azkal182/islamic-utils/blob/6511551c69fa725f6e44569e9e1278849e32f702/src/prayer-times/types.ts#L358)

Optional custom Maghrib angle.

#### Remarks

Most methods use 0° (sun at horizon), but some use a
slightly different angle. If undefined, uses default (-0.833°).

***

### name

> `readonly` **name**: `string`

Defined in: [src/prayer-times/types.ts:318](https://github.com/azkal182/islamic-utils/blob/6511551c69fa725f6e44569e9e1278849e32f702/src/prayer-times/types.ts#L318)

Display name of the method.

***

### regions?

> `readonly` `optional` **regions**: readonly `string`[]

Defined in: [src/prayer-times/types.ts:368](https://github.com/azkal182/islamic-utils/blob/6511551c69fa725f6e44569e9e1278849e32f702/src/prayer-times/types.ts#L368)

Regions where this method is commonly used.
