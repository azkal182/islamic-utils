[**Islamic Utilities API v0.2.0**](../README.md)

***

[Islamic Utilities API](../README.md) / dateToJulianDay

# Function: dateToJulianDay()

> **dateToJulianDay**(`year`, `month`, `day`): `number`

Defined in: [src/astronomy/solar.ts:42](https://github.com/azkal182/islamic-utils/blob/ddd04bee89289da73cadadfcee51cdeac187e097/src/astronomy/solar.ts#L42)

Calculates the Julian Day Number for a given date.

## Parameters

### year

`number`

Full year (e.g., 2024)

### month

`number`

Month (1-12)

### day

`number`

Day of month (1-31, can have fractional part for time)

## Returns

`number`

Julian Day Number

## Remarks

Julian Day is a continuous count of days since the beginning of the Julian
Period (January 1, 4713 BC in the proleptic Julian calendar).
It's useful for astronomical calculations because it avoids calendar complexities.

This function implements the algorithm for the Gregorian calendar.

## Example

```typescript
// January 1, 2000, at noon (J2000.0 epoch)
dateToJulianDay(2000, 1, 1.5);  // 2451545.0

// January 15, 2024
dateToJulianDay(2024, 1, 15);   // 2460324.5
```
