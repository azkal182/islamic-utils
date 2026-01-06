[**Islamic Utilities API v0.2.0**](../README.md)

***

[Islamic Utilities API](../README.md) / equationOfTime

# Function: equationOfTime()

> **equationOfTime**(`T`): `number`

Defined in: [src/astronomy/solar.ts:273](https://github.com/azkal182/islamic-utils/blob/ddd04bee89289da73cadadfcee51cdeac187e097/src/astronomy/solar.ts#L273)

Calculates the Equation of Time.

## Parameters

### T

`number`

Julian centuries since J2000.0

## Returns

`number`

Equation of time in minutes

## Remarks

The equation of time is the difference between apparent solar time
and mean solar time. It varies throughout the year due to:
1. Earth's elliptical orbit (varying speed)
2. Earth's axial tilt (obliquity)

Range: approximately -14 to +16 minutes

## Example

```typescript
// Used to calculate local solar noon:
// Solar noon = 12:00 - EoT - (longitude / 15)
```
