[**Islamic Utilities API v0.2.0**](../README.md)

***

[Islamic Utilities API](../README.md) / toDecimalDegrees

# Function: toDecimalDegrees()

> **toDecimalDegrees**(`angle`): `number`

Defined in: [src/core/types/angle.ts:210](https://github.com/azkal182/islamic-utils/blob/ddd04bee89289da73cadadfcee51cdeac187e097/src/core/types/angle.ts#L210)

Converts any Angle type to decimal degrees.

## Parameters

### angle

[`Angle`](../type-aliases/Angle.md)

Angle in either decimal degrees or DMS format

## Returns

`number`

Angle in decimal degrees

## Example

```typescript
// Already decimal - returns as-is
toDecimalDegrees(21.4225); // Returns: 21.4225

// DMS format - converts to decimal
toDecimalDegrees({ degrees: 21, minutes: 25, seconds: 21 }); // Returns: 21.4225
```
