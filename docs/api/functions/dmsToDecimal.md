[**Islamic Utilities API v0.2.1**](../README.md)

***

[Islamic Utilities API](../README.md) / dmsToDecimal

# Function: dmsToDecimal()

> **dmsToDecimal**(`dms`): `number`

Defined in: [src/core/types/angle.ts:111](https://github.com/azkal182/islamic-utils/blob/6511551c69fa725f6e44569e9e1278849e32f702/src/core/types/angle.ts#L111)

Converts an angle from DMS format to decimal degrees.

## Parameters

### dms

[`AngleDMS`](../interfaces/AngleDMS.md)

Angle in Degrees-Minutes-Seconds format

## Returns

`number`

Angle in decimal degrees

## Example

```typescript
// Convert 21° 25' 21" to decimal degrees
const decimal = dmsToDecimal({ degrees: 21, minutes: 25, seconds: 21 });
// Result: 21.4225

// Negative angle: -6° 12' 31.68"
const negative = dmsToDecimal({ degrees: -6, minutes: 12, seconds: 31.68 });
// Result: -6.2088
```
