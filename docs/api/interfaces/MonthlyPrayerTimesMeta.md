[**Islamic Utilities API v0.2.0**](../README.md)

***

[Islamic Utilities API](../README.md) / MonthlyPrayerTimesMeta

# Interface: MonthlyPrayerTimesMeta

Defined in: src/prayer-times/monthly.ts:86

Metadata for monthly prayer times calculation.

## Properties

### daysInMonth

> `readonly` **daysInMonth**: `number`

Defined in: src/prayer-times/monthly.ts:100

Number of days in the month.

***

### isLeapYear

> `readonly` **isLeapYear**: `boolean`

Defined in: src/prayer-times/monthly.ts:105

Whether this is a leap year (relevant for February).

***

### location

> `readonly` **location**: [`LocationInput`](LocationInput.md)

Defined in: src/prayer-times/monthly.ts:110

Location used for calculation.

***

### method

> `readonly` **method**: [`CalculationMethod`](CalculationMethod.md)

Defined in: src/prayer-times/monthly.ts:120

Calculation method used.

***

### month

> `readonly` **month**: `number`

Defined in: src/prayer-times/monthly.ts:95

Month calculated (1-12).

***

### params

> `readonly` **params**: [`PrayerCalculationParams`](PrayerCalculationParams.md)

Defined in: src/prayer-times/monthly.ts:125

Full parameters used for calculation.

***

### timezone

> `readonly` **timezone**: [`Timezone`](../type-aliases/Timezone.md)

Defined in: src/prayer-times/monthly.ts:115

Timezone used.

***

### year

> `readonly` **year**: `number`

Defined in: src/prayer-times/monthly.ts:90

Year calculated.
