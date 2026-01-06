[**Islamic Utilities API v0.2.0**](../README.md)

***

[Islamic Utilities API](../README.md) / MonthlyPrayerTimesInput

# Interface: MonthlyPrayerTimesInput

Defined in: src/prayer-times/monthly.ts:31

Input for monthly prayer times calculation.

## Properties

### location

> `readonly` **location**: [`LocationInput`](LocationInput.md)

Defined in: src/prayer-times/monthly.ts:45

Geographic location.

***

### month

> `readonly` **month**: `number`

Defined in: src/prayer-times/monthly.ts:40

Month (1-12).

***

### params

> `readonly` **params**: [`PrayerCalculationParams`](PrayerCalculationParams.md)

Defined in: src/prayer-times/monthly.ts:55

Calculation parameters.

***

### timezone

> `readonly` **timezone**: [`Timezone`](../type-aliases/Timezone.md)

Defined in: src/prayer-times/monthly.ts:50

Timezone (IANA name or UTC offset in hours).

***

### year

> `readonly` **year**: `number`

Defined in: src/prayer-times/monthly.ts:35

Year (e.g., 2024).
