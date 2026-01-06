[**Islamic Utilities API v0.2.0**](../README.md)

***

[Islamic Utilities API](../README.md) / julianCentury

# Function: julianCentury()

> **julianCentury**(`julianDay`): `number`

Defined in: [src/astronomy/solar.ts:82](https://github.com/azkal182/islamic-utils/blob/0df9a3737b1fb38d644e36b5ae34cdf225bc89df/src/astronomy/solar.ts#L82)

Calculates the Julian Century from J2000.0 epoch.

## Parameters

### julianDay

`number`

Julian Day Number

## Returns

`number`

Julian centuries since J2000.0

## Remarks

Many astronomical formulas use Julian centuries (36525 days) since the
J2000.0 epoch as their time parameter.

## Example

```typescript
// J2000.0 epoch itself
julianCentury(2451545.0);  // 0

// One century later
julianCentury(2451545.0 + 36525);  // 1.0
```
