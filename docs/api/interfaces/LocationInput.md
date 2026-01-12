[**Islamic Utilities API v0.2.2**](../README.md)

***

[Islamic Utilities API](../README.md) / LocationInput

# Interface: LocationInput

Defined in: [src/prayer-times/types.ts:572](https://github.com/azkal182/islamic-utils/blob/f548f22580afc5800e32e3785eef49f3fce9f58a/src/prayer-times/types.ts#L572)

Location input for prayer time calculation.

## Remarks

A simple object with latitude and longitude is sufficient.
Altitude is optional and used for more precise sunrise/sunset.

## Properties

### altitude?

> `readonly` `optional` **altitude**: `number`

Defined in: [src/prayer-times/types.ts:586](https://github.com/azkal182/islamic-utils/blob/f548f22580afc5800e32e3785eef49f3fce9f58a/src/prayer-times/types.ts#L586)

Optional altitude in meters above sea level.

***

### latitude

> `readonly` **latitude**: `number`

Defined in: [src/prayer-times/types.ts:576](https://github.com/azkal182/islamic-utils/blob/f548f22580afc5800e32e3785eef49f3fce9f58a/src/prayer-times/types.ts#L576)

Latitude in degrees (-90 to 90, positive = North).

***

### longitude

> `readonly` **longitude**: `number`

Defined in: [src/prayer-times/types.ts:581](https://github.com/azkal182/islamic-utils/blob/f548f22580afc5800e32e3785eef49f3fce9f58a/src/prayer-times/types.ts#L581)

Longitude in degrees (-180 to 180, positive = East).
