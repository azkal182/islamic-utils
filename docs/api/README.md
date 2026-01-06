**Islamic Utilities API v0.2.0**

***

# Islamic Utilities API v0.2.0

## Fileoverview

Islamic Utilities Core Library - Main Entry Point

## Description

This library provides accurate and consistent Islamic utilities for:
- Prayer times calculation (including Imsak and Dhuha)
- Qibla direction calculation
- Inheritance (Faraidh) calculation

## Remarks

The library is designed with the following principles:
- **Language-Agnostic**: Pure algorithms without platform dependencies
- **Deterministik**: Same input always produces same output
- **Explainable**: Results include optional trace for verification
- **Modular**: Each module can be used independently
- **No I/O**: All external data provided by the caller

## Example

```typescript
import { computeQiblaDirection, KAABA_COORDINATES } from 'islamic-utils';

const result = computeQiblaDirection({
  coordinates: { latitude: -6.2088, longitude: 106.8456 }
});

if (result.success) {
  console.log(`Qibla: ${result.data.bearing}°`);
}
```

## Classes

- [LibraryError](classes/LibraryError.md)

## Interfaces

- [AngleDMS](interfaces/AngleDMS.md)
- [CalculationMethod](interfaces/CalculationMethod.md)
- [CalculatorOptions](interfaces/CalculatorOptions.md)
- [Coordinates](interfaces/Coordinates.md)
- [DateOnly](interfaces/DateOnly.md)
- [DateTimeLocal](interfaces/DateTimeLocal.md)
- [DerivedFlags](interfaces/DerivedFlags.md)
- [DhuhaRule](interfaces/DhuhaRule.md)
- [ErrorResult](interfaces/ErrorResult.md)
- [EstateInput](interfaces/EstateInput.md)
- [EstateResult](interfaces/EstateResult.md)
- [Fraction](interfaces/Fraction.md)
- [HeirInput](interfaces/HeirInput.md)
- [HeirShare](interfaces/HeirShare.md)
- [ImsakRule](interfaces/ImsakRule.md)
- [InheritanceInput](interfaces/InheritanceInput.md)
- [InheritanceMeta](interfaces/InheritanceMeta.md)
- [InheritanceOptions](interfaces/InheritanceOptions.md)
- [InheritancePolicy](interfaces/InheritancePolicy.md)
- [InheritanceResult](interfaces/InheritanceResult.md)
- [InheritanceSummary](interfaces/InheritanceSummary.md)
- [InheritanceTraceStep](interfaces/InheritanceTraceStep.md)
- [LocationInput](interfaces/LocationInput.md)
- [MonthlyPrayerTimesDayResult](interfaces/MonthlyPrayerTimesDayResult.md)
- [MonthlyPrayerTimesInput](interfaces/MonthlyPrayerTimesInput.md)
- [MonthlyPrayerTimesMeta](interfaces/MonthlyPrayerTimesMeta.md)
- [MonthlyPrayerTimesResult](interfaces/MonthlyPrayerTimesResult.md)
- [PrayerCalculationParams](interfaces/PrayerCalculationParams.md)
- [PrayerTimeContext](interfaces/PrayerTimeContext.md)
- [PrayerTimesMeta](interfaces/PrayerTimesMeta.md)
- [PrayerTimesResult](interfaces/PrayerTimesResult.md)
- [QiblaInput](interfaces/QiblaInput.md)
- [QiblaMeta](interfaces/QiblaMeta.md)
- [QiblaOptions](interfaces/QiblaOptions.md)
- [QiblaResult](interfaces/QiblaResult.md)
- [SuccessResult](interfaces/SuccessResult.md)
- [TimeContext](interfaces/TimeContext.md)
- [TimeOfDay](interfaces/TimeOfDay.md)
- [TraceStep](interfaces/TraceStep.md)

## Type Aliases

- [Angle](type-aliases/Angle.md)
- [AsabahType](type-aliases/AsabahType.md)
- [AsrMadhhab](type-aliases/AsrMadhhab.md)
- [CalculationMethodKey](type-aliases/CalculationMethodKey.md)
- [CompassDirection](type-aliases/CompassDirection.md)
- [ErrorCode](type-aliases/ErrorCode.md)
- [HeirCategory](type-aliases/HeirCategory.md)
- [HeirType](type-aliases/HeirType.md)
- [HighLatitudeRule](type-aliases/HighLatitudeRule.md)
- [PrayerAdjustments](type-aliases/PrayerAdjustments.md)
- [PrayerName](type-aliases/PrayerName.md)
- [PrayerRoundingRule](type-aliases/PrayerRoundingRule.md)
- [PrayerTimes](type-aliases/PrayerTimes.md)
- [PrayerTimeStrings](type-aliases/PrayerTimeStrings.md)
- [Result](type-aliases/Result.md)
- [RoundingRule](type-aliases/RoundingRule.md)
- [SafetyBuffer](type-aliases/SafetyBuffer.md)
- [ShareCategory](type-aliases/ShareCategory.md)
- [Timezone](type-aliases/Timezone.md)

## Variables

- [AsabahType](variables/AsabahType.md)
- [AsrMadhhab](variables/AsrMadhhab.md)
- [ASTRONOMICAL](variables/ASTRONOMICAL.md)
- [CALCULATION\_METHODS](variables/CALCULATION_METHODS.md)
- [COMMON\_TIMEZONES](variables/COMMON_TIMEZONES.md)
- [CompassDirection](variables/CompassDirection.md)
- [DEFAULT\_DHUHA\_RULE](variables/DEFAULT_DHUHA_RULE.md)
- [DEFAULT\_IMSAK\_RULE](variables/DEFAULT_IMSAK_RULE.md)
- [DEFAULT\_POLICY](variables/DEFAULT_POLICY.md)
- [DIYANET](variables/DIYANET.md)
- [EARTH\_RADIUS\_KM](variables/EARTH_RADIUS_KM.md)
- [EGYPT](variables/EGYPT.md)
- [ErrorCodes](variables/ErrorCodes.md)
- [Errors](variables/Errors.md)
- [FRACTION](variables/FRACTION.md)
- [HeirCategory](variables/HeirCategory.md)
- [HeirType](variables/HeirType.md)
- [HighLatitudeRule](variables/HighLatitudeRule.md)
- [ISNA](variables/ISNA.md)
- [JAKIM](variables/JAKIM.md)
- [KAABA\_COORDINATES](variables/KAABA_COORDINATES.md)
- [KAABA\_PROXIMITY\_THRESHOLD\_KM](variables/KAABA_PROXIMITY_THRESHOLD_KM.md)
- [KARACHI](variables/KARACHI.md)
- [KEMENAG](variables/KEMENAG.md)
- [KUWAIT](variables/KUWAIT.md)
- [LATITUDE\_RANGE](variables/LATITUDE_RANGE.md)
- [LONGITUDE\_RANGE](variables/LONGITUDE_RANGE.md)
- [MAKKAH](variables/MAKKAH.md)
- [MWL](variables/MWL.md)
- [PRAYER\_ANGLES](variables/PRAYER_ANGLES.md)
- [PRAYER\_NAMES\_ORDERED](variables/PRAYER_NAMES_ORDERED.md)
- [PrayerName](variables/PrayerName.md)
- [PrayerRoundingRule](variables/PrayerRoundingRule.md)
- [QATAR](variables/QATAR.md)
- [ShareCategory](variables/ShareCategory.md)
- [SINGAPORE](variables/SINGAPORE.md)
- [SPECIAL\_CASES](variables/SPECIAL_CASES.md)
- [TEHRAN](variables/TEHRAN.md)
- [TRIG](variables/TRIG.md)
- [UOIF](variables/UOIF.md)
- [UTC\_OFFSET\_RANGE](variables/UTC_OFFSET_RANGE.md)
- [VERSION](variables/VERSION.md)
- [YEAR\_RANGE](variables/YEAR_RANGE.md)

## Functions

- [acosDeg](functions/acosDeg.md)
- [acotDeg](functions/acotDeg.md)
- [addDays](functions/addDays.md)
- [applyHijab](functions/applyHijab.md)
- [asinDeg](functions/asinDeg.md)
- [asrSunAngle](functions/asrSunAngle.md)
- [atan2Deg](functions/atan2Deg.md)
- [atanDeg](functions/atanDeg.md)
- [bearingToCompass](functions/bearingToCompass.md)
- [bearingToCompassDirection](functions/bearingToCompassDirection.md)
- [calculateDistance](functions/calculateDistance.md)
- [calculateFinalBearing](functions/calculateFinalBearing.md)
- [calculateFlags](functions/calculateFlags.md)
- [calculateGreatCircleDistance](functions/calculateGreatCircleDistance.md)
- [calculateInitialBearing](functions/calculateInitialBearing.md)
- [calculateMidpoint](functions/calculateMidpoint.md)
- [calculateNetEstate](functions/calculateNetEstate.md)
- [clamp](functions/clamp.md)
- [computeInheritance](functions/computeInheritance.md)
- [computeMonthlyPrayerTimes](functions/computeMonthlyPrayerTimes.md)
- [computePrayerTimes](functions/computePrayerTimes.md)
- [computeQiblaDirection](functions/computeQiblaDirection.md)
- [cosDeg](functions/cosDeg.md)
- [cotDeg](functions/cotDeg.md)
- [createError](functions/createError.md)
- [dateOnlyToJulianDay](functions/dateOnlyToJulianDay.md)
- [datesEqual](functions/datesEqual.md)
- [dateToJulianDay](functions/dateToJulianDay.md)
- [decimalToDms](functions/decimalToDms.md)
- [destinationPoint](functions/destinationPoint.md)
- [dmsToDecimal](functions/dmsToDecimal.md)
- [equationOfTime](functions/equationOfTime.md)
- [failure](functions/failure.md)
- [finalBearing](functions/finalBearing.md)
- [fixPrecision](functions/fixPrecision.md)
- [formatTime](functions/formatTime.md)
- [formatUtcOffset](functions/formatUtcOffset.md)
- [frac](functions/frac.md)
- [fraction](functions/fraction.md)
- [fractionAdd](functions/fractionAdd.md)
- [fractionalHoursToTimeOfDay](functions/fractionalHoursToTimeOfDay.md)
- [fractionDayOfYear](functions/fractionDayOfYear.md)
- [fractionDivide](functions/fractionDivide.md)
- [fractionMultiply](functions/fractionMultiply.md)
- [fractionSimplify](functions/fractionSimplify.md)
- [fractionSubtract](functions/fractionSubtract.md)
- [fractionToDecimal](functions/fractionToDecimal.md)
- [fractionToString](functions/fractionToString.md)
- [fromFractionalHours](functions/fromFractionalHours.md)
- [fromJSDate](functions/fromJSDate.md)
- [getAsrShadowFactor](functions/getAsrShadowFactor.md)
- [getDayOfYear](functions/getDayOfYear.md)
- [getDaysInMonth](functions/getDaysInMonth.md)
- [getHeirArabicName](functions/getHeirArabicName.md)
- [getHeirCategory](functions/getHeirCategory.md)
- [getMethod](functions/getMethod.md)
- [getUtcOffset](functions/getUtcOffset.md)
- [hourAngle](functions/hourAngle.md)
- [initialBearing](functions/initialBearing.md)
- [isAtKaaba](functions/isAtKaaba.md)
- [isCoordinatesLike](functions/isCoordinatesLike.md)
- [isDateOnlyLike](functions/isDateOnlyLike.md)
- [isError](functions/isError.md)
- [isFemaleHeir](functions/isFemaleHeir.md)
- [isHighLatitude](functions/isHighLatitude.md)
- [isLeapYear](functions/isLeapYear.md)
- [isMaleHeir](functions/isMaleHeir.md)
- [isSuccess](functions/isSuccess.md)
- [isTimeOfDayLike](functions/isTimeOfDayLike.md)
- [isValidErrorCode](functions/isValidErrorCode.md)
- [julianCentury](functions/julianCentury.md)
- [julianDayToDateOnly](functions/julianDayToDateOnly.md)
- [lerp](functions/lerp.md)
- [listMethodKeys](functions/listMethodKeys.md)
- [midpoint](functions/midpoint.md)
- [normalizeAngle](functions/normalizeAngle.md)
- [normalizeAngleSigned](functions/normalizeAngleSigned.md)
- [normalizeCoordinates](functions/normalizeCoordinates.md)
- [registerMethod](functions/registerMethod.md)
- [roundByRule](functions/roundByRule.md)
- [roundToMinute](functions/roundToMinute.md)
- [safeAcosDeg](functions/safeAcosDeg.md)
- [safeAsinDeg](functions/safeAsinDeg.md)
- [sinDeg](functions/sinDeg.md)
- [solarDeclination](functions/solarDeclination.md)
- [solarNoon](functions/solarNoon.md)
- [success](functions/success.md)
- [tanDeg](functions/tanDeg.md)
- [timeForSunAngle](functions/timeForSunAngle.md)
- [timeOfDayToFractionalHours](functions/timeOfDayToFractionalHours.md)
- [toDecimalDegrees](functions/toDecimalDegrees.md)
- [toDegrees](functions/toDegrees.md)
- [toFractionalHours](functions/toFractionalHours.md)
- [toJSDate](functions/toJSDate.md)
- [toJSDateTime](functions/toJSDateTime.md)
- [toRadians](functions/toRadians.md)
- [unwrap](functions/unwrap.md)
- [unwrapOr](functions/unwrapOr.md)
- [validateCoordinates](functions/validateCoordinates.md)
- [validateDate](functions/validateDate.md)
- [validateIanaTimezone](functions/validateIanaTimezone.md)
- [validateTimezone](functions/validateTimezone.md)
- [validateUtcOffset](functions/validateUtcOffset.md)
- [wrap](functions/wrap.md)
