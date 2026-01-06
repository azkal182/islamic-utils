[**Islamic Utilities API v0.2.0**](../README.md)

***

[Islamic Utilities API](../README.md) / calculateFinalBearing

# Function: calculateFinalBearing()

> **calculateFinalBearing**(`from`, `to`): `number`

Defined in: [src/qibla/great-circle.ts:74](https://github.com/azkal182/islamic-utils/blob/0df9a3737b1fb38d644e36b5ae34cdf225bc89df/src/qibla/great-circle.ts#L74)

Calculates the final bearing (arrival azimuth) from one point to another.

## Parameters

### from

[`Coordinates`](../interfaces/Coordinates.md)

Starting coordinates

### to

[`Coordinates`](../interfaces/Coordinates.md)

Destination coordinates

## Returns

`number`

Final bearing in degrees (0-360)

## Remarks

The final bearing is the direction of travel at the END of the journey.
It's calculated as the reverse of the initial bearing from destination to start.
