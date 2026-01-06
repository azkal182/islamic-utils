[**Islamic Utilities API v0.2.2**](../README.md)

***

[Islamic Utilities API](../README.md) / decimalToDms

# Function: decimalToDms()

> **decimalToDms**(`decimal`): [`AngleDMS`](../interfaces/AngleDMS.md)

Defined in: [src/core/types/angle.ts:137](https://github.com/azkal182/islamic-utils/blob/a30827e72f5e43f868fff9ce519ca224296e663c/src/core/types/angle.ts#L137)

Converts an angle from decimal degrees to DMS format.

## Parameters

### decimal

`number`

Angle in decimal degrees

## Returns

[`AngleDMS`](../interfaces/AngleDMS.md)

Angle in Degrees-Minutes-Seconds format

## Example

```typescript
// Convert 21.4225° to DMS
const dms = decimalToDms(21.4225);
// Result: { degrees: 21, minutes: 25, seconds: 21 }

// Negative angle
const negative = decimalToDms(-6.2088);
// Result: { degrees: -6, minutes: 12, seconds: 31.68 }
```
