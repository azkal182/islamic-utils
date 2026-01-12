# Flutter Islamic Utils Package Specification

> Panduan lengkap untuk membangun library Islamic Utilities dalam Dart/Flutter dengan fitur yang sama dengan versi TypeScript.

## 📋 Ringkasan Library

Library ini menyediakan utilitas keislaman yang akurat dan konsisten:

| Modul | Deskripsi |
|-------|-----------|
| 🕌 **Prayer Times** | 9 waktu sholat dengan 13+ metode kalkulasi |
| 🧭 **Qibla Direction** | Bearing dan jarak ke Ka'bah |
| 📜 **Inheritance (Faraidh)** | 30+ jenis ahli waris, hijab, aul, radd |

---

## 🏗️ Struktur Project Flutter

```
islamic_utils/
├── lib/
│   ├── islamic_utils.dart              # Main export
│   ├── src/
│   │   ├── core/
│   │   │   ├── constants/
│   │   │   │   ├── astronomical.dart   # Konstanta astronomi
│   │   │   │   └── geographic.dart     # Koordinat Ka'bah
│   │   │   ├── errors/
│   │   │   │   ├── error_codes.dart
│   │   │   │   └── library_error.dart
│   │   │   ├── types/
│   │   │   │   ├── coordinates.dart
│   │   │   │   ├── date_only.dart
│   │   │   │   ├── angle.dart
│   │   │   │   └── result.dart         # Result<T> pattern
│   │   │   ├── utils/
│   │   │   │   ├── math_utils.dart
│   │   │   │   └── trigonometry.dart
│   │   │   └── validators/
│   │   │       ├── coordinate_validator.dart
│   │   │       ├── date_validator.dart
│   │   │       └── timezone_validator.dart
│   │   ├── astronomy/
│   │   │   ├── solar.dart              # Solar calculations
│   │   │   ├── angles.dart             # Navigation angles
│   │   │   └── time.dart               # Time utilities
│   │   ├── prayer_times/
│   │   │   ├── calculator.dart
│   │   │   ├── types.dart
│   │   │   ├── methods/
│   │   │   │   └── calculation_methods.dart
│   │   │   ├── high_latitude.dart
│   │   │   ├── adjustments.dart
│   │   │   ├── monthly.dart
│   │   │   └── next_prayer.dart
│   │   ├── qibla/
│   │   │   ├── calculator.dart
│   │   │   ├── types.dart
│   │   │   └── great_circle.dart
│   │   └── inheritance/
│   │       ├── calculator.dart
│   │       ├── types.dart
│   │       ├── estate.dart
│   │       ├── flags.dart
│   │       ├── rules/
│   │       │   ├── hijab.dart
│   │       │   ├── furudh.dart
│   │       │   ├── asabah.dart
│   │       │   ├── aul.dart
│   │       │   ├── radd.dart
│   │       │   └── special_cases.dart
│   │       ├── utils/
│   │       │   └── fraction.dart
│   │       └── validation/
│   │           └── rule_conflict.dart
├── test/
├── example/
├── pubspec.yaml
└── README.md
```

---

## 🔧 Core Types (Dart Implementation)

### 1. Result Pattern

```dart
/// Base result type - sealed class for exhaustive matching
sealed class Result<T> {
  const Result();
}

class Success<T> extends Result<T> {
  final T data;
  final List<TraceStep>? trace;

  const Success(this.data, {this.trace});
}

class Failure<T> extends Result<T> {
  final LibraryError error;
  final List<TraceStep>? trace;

  const Failure(this.error, {this.trace});
}

// Extension methods
extension ResultExtension<T> on Result<T> {
  bool get isSuccess => this is Success<T>;
  bool get isError => this is Failure<T>;

  T unwrap() {
    return switch (this) {
      Success(:final data) => data,
      Failure(:final error) => throw error,
    };
  }

  T unwrapOr(T defaultValue) {
    return switch (this) {
      Success(:final data) => data,
      Failure() => defaultValue,
    };
  }
}
```

### 2. Coordinates

```dart
class Coordinates {
  final double latitude;  // -90 to 90
  final double longitude; // -180 to 180
  final double? altitude; // meters, optional

  const Coordinates({
    required this.latitude,
    required this.longitude,
    this.altitude,
  });

  bool get isValid =>
    latitude >= -90 && latitude <= 90 &&
    longitude >= -180 && longitude <= 180;
}
```

### 3. DateOnly

```dart
class DateOnly {
  final int year;
  final int month; // 1-12
  final int day;   // 1-31

  const DateOnly({
    required this.year,
    required this.month,
    required this.day,
  });

  factory DateOnly.fromDateTime(DateTime dt) =>
    DateOnly(year: dt.year, month: dt.month, day: dt.day);

  DateTime toDateTime() => DateTime(year, month, day);
}
```

### 4. LibraryError

```dart
enum ErrorCode {
  invalidCoordinates,
  invalidDate,
  invalidTimezone,
  polarDayUnresolved,
  prayerTimesInconsistent,
  inheritanceInvalidEstate,
  inheritanceInvalidHeirs,
}

class LibraryError implements Exception {
  final ErrorCode code;
  final String message;
  final Map<String, dynamic>? details;

  const LibraryError({
    required this.code,
    required this.message,
    this.details,
  });
}
```

---

## 🕌 Modul Prayer Times

### Types

```dart
/// Nama waktu sholat
enum PrayerName {
  imsak,
  fajr,
  sunrise,
  dhuhaStart,
  dhuhaEnd,
  dhuhr,
  asr,
  maghrib,
  isha,
}

/// Madzhab untuk perhitungan Asr
enum AsrMadhhab {
  standard, // Syafi'i, Maliki, Hanbali (shadow factor 1)
  hanafi,   // Hanafi (shadow factor 2)
}

/// Aturan high latitude
enum HighLatitudeRule {
  none,
  middleOfNight,
  oneSeventh,
  angleBased,
}

/// Aturan pembulatan
enum PrayerRoundingRule {
  none,
  nearest,
  ceil,
  floor,
}

/// Metode kalkulasi
class CalculationMethod {
  final String name;
  final double fajrAngle;
  final double? ishaAngle;
  final int? ishaIntervalMinutes;
  final double? maghribAngle;
  final String? description;
  final List<String>? regions;

  const CalculationMethod({
    required this.name,
    required this.fajrAngle,
    this.ishaAngle,
    this.ishaIntervalMinutes,
    this.maghribAngle,
    this.description,
    this.regions,
  });
}
```

### Built-in Methods

```dart
abstract class CalculationMethods {
  static const mwl = CalculationMethod(
    name: 'Muslim World League',
    fajrAngle: 18,
    ishaAngle: 17,
  );

  static const isna = CalculationMethod(
    name: 'ISNA',
    fajrAngle: 15,
    ishaAngle: 15,
  );

  static const egypt = CalculationMethod(
    name: 'Egyptian General Authority',
    fajrAngle: 19.5,
    ishaAngle: 17.5,
  );

  static const makkah = CalculationMethod(
    name: 'Umm al-Qura, Makkah',
    fajrAngle: 18.5,
    ishaIntervalMinutes: 90,
  );

  static const kemenag = CalculationMethod(
    name: 'Kemenag Indonesia',
    fajrAngle: 20,
    ishaAngle: 18,
  );

  // ... 8 more methods
}
```

### Main API

```dart
/// Parameter kalkulasi
class PrayerCalculationParams {
  final CalculationMethod method;
  final AsrMadhhab asrMadhhab;
  final HighLatitudeRule highLatitudeRule;
  final ImsakRule imsakRule;
  final DhuhaRule dhuhaRule;
  final PrayerRoundingRule roundingRule;
  final Map<PrayerName, int>? adjustments;
  final dynamic safetyBuffer; // int or Map<PrayerName, int>

  const PrayerCalculationParams({
    required this.method,
    this.asrMadhhab = AsrMadhhab.standard,
    this.highLatitudeRule = HighLatitudeRule.middleOfNight,
    this.imsakRule = const ImsakRule.minutesBeforeFajr(10),
    this.dhuhaRule = const DhuhaRule.default_(),
    this.roundingRule = PrayerRoundingRule.nearest,
    this.adjustments,
    this.safetyBuffer,
  });
}

/// Hasil kalkulasi
class PrayerTimesResult {
  final Map<PrayerName, double?> times;      // Fractional hours
  final Map<PrayerName, String?> formatted;  // HH:MM format
  final PrayerTimesMeta meta;
  final List<TraceStep>? trace;
}

/// Main function
Result<PrayerTimesResult> computePrayerTimes({
  required Coordinates location,
  required DateOnly date,
  required dynamic timezone, // int or String (IANA)
  required PrayerCalculationParams params,
  bool includeTrace = false,
});

/// Monthly prayer times
Result<MonthlyPrayerTimesResult> computeMonthlyPrayerTimes({
  required int year,
  required int month,
  required Coordinates location,
  required dynamic timezone,
  required PrayerCalculationParams params,
});

/// Next prayer
Result<NextPrayerInfo> getNextPrayer({
  required Coordinates location,
  required dynamic timezone,
  required PrayerCalculationParams params,
  DateTime? currentTime,
});
```

---

## 🧭 Modul Qibla

### Types

```dart
enum CompassDirection {
  n, nne, ne, ene, e, ese, se, sse,
  s, ssw, sw, wsw, w, wnw, nw, nnw,
}

class QiblaResult {
  final double bearing;              // 0-360 degrees
  final CompassDirection compassDirection;
  final QiblaMeta meta;
  final List<TraceStep>? trace;
}

class QiblaMeta {
  final Coordinates userLocation;
  final Coordinates kaabaLocation;
  final double? distance;  // km (optional)
  final bool? atKaaba;
}
```

### Main API

```dart
Result<QiblaResult> computeQiblaDirection({
  required Coordinates coordinates,
  bool includeDistance = false,
  bool includeTrace = false,
});

// Great circle utilities
double calculateInitialBearing(Coordinates from, Coordinates to);
double calculateFinalBearing(Coordinates from, Coordinates to);
double calculateGreatCircleDistance(Coordinates from, Coordinates to);
Coordinates calculateMidpoint(Coordinates from, Coordinates to);
```

---

## 📜 Modul Inheritance (Faraidh)

### Heir Types (30+)

```dart
enum HeirType {
  // Spouse
  husband, wife,

  // Ascendants
  father, mother,
  grandfatherPaternal,
  grandmotherMaternal, grandmotherPaternal,

  // Descendants
  son, daughter,
  grandsonSon, granddaughterSon,

  // Siblings
  brotherFull, sisterFull,
  brotherPaternal, sisterPaternal,
  brotherUterine, sisterUterine,

  // Extended Asabah
  nephewFull, nephewPaternal,
  uncleFull, unclePaternal,
  cousinFull, cousinPaternal,

  // Dhawil Arham
  grandchildDaughter,
  auntMaternal, auntPaternal,
  uncleMaternal, otherDhawilArham,
}

enum HeirCategory {
  spouse, ascendant, descendant,
  sibling, extendedAsabah, dhawilArham,
}

enum ShareCategory {
  furudh,           // Fixed share
  asabah,           // Remainder
  furudhAndAsabah,  // Both
  blocked,          // Excluded
  dhawilArham,
}

enum AsabahType {
  biNafs,    // Male heirs alone
  bilGhayr,  // Women with male siblings
  maaGhayr,  // Sisters with daughters
}
```

### Input Types

```dart
class EstateInput {
  final double grossValue;
  final double debts;
  final double funeralCosts;
  final double wasiyyah;
  final bool wasiyyahApprovedByHeirs;
  final String currency;
}

class HeirInput {
  final HeirType type;
  final int count;
}

class DeceasedInfo {
  final Gender gender; // male or female
}

class InheritancePolicy {
  final bool raddIncludesSpouse;
  final GrandfatherMode grandfatherMode;
  final DhawilArhamMode dhawilArhamMode;
  final MotherSiblingRule motherSiblingRule;
  final MushtarakahPolicy mushtarakahPolicy;
}
```

### Output Types

```dart
class HeirShare {
  final HeirType heirType;
  final int count;
  final ShareCategory category;
  final AsabahType? asabahType;
  final Fraction? originalShare;
  final Fraction finalShare;
  final double totalValue;
  final double perPersonValue;
  final bool isBlocked;
  final List<HeirType>? blockedBy;
  final List<String>? notes;
}

class InheritanceResult {
  final double netEstate;
  final List<HeirShare> shares;
  final InheritanceSummary summary;
  final InheritanceMeta meta;
  final List<InheritanceTraceStep> trace;
  final InheritanceVerification verification;
}
```

### Main API

```dart
Result<InheritanceResult> computeInheritance({
  required EstateInput estate,
  required List<HeirInput> heirs,
  required DeceasedInfo deceased,
  InheritancePolicy? policy,
  bool includeTrace = true,
});
```

### 7 Hijab Rules

| Rule | Blocker | Blocked |
|------|---------|---------|
| E1 | Descendant | All siblings |
| E2 | Father | Grandfather, siblings, uncles, nephews, cousins |
| E3 | Son | Grandchildren |
| E4 | Mother | Maternal grandmother |
| E5 | Father | Paternal grandmother |
| E6 | Full brother | Paternal siblings |
| E7 | Paternal brother | Nephews |

### 10 Special Cases

1. **Umariyatayn** - Mother gets 1/3 of remainder
2. **Mushtarakah** - Full siblings share with uterine
3. **Akdariyyah** - Complex grandfather + sister case
4. **Sisters Maal Ghayr** - Sisters as asabah with daughters
5. **Completion 2/3** - Granddaughter completes 2/3
6. **Kalalah Uterine** - No parent/descendant
7. **Multiple Grandmothers** - Share 1/6
8. **Radd** - Remainder redistribution
9. **Dhawil Arham** - Distant relatives fallback
10. **No Heirs** - Baitul Mal

---

## 🔢 Fraction Utility

```dart
class Fraction {
  final int numerator;
  final int denominator;

  const Fraction(this.numerator, this.denominator);

  Fraction operator +(Fraction other);
  Fraction operator -(Fraction other);
  Fraction operator *(Fraction other);
  Fraction operator /(Fraction other);

  Fraction simplify();
  double toDouble();

  @override
  String toString() => '$numerator/$denominator';
}

// Predefined fractions
abstract class Fractions {
  static const oneHalf = Fraction(1, 2);
  static const oneThird = Fraction(1, 3);
  static const oneFourth = Fraction(1, 4);
  static const oneSixth = Fraction(1, 6);
  static const oneEighth = Fraction(1, 8);
  static const twoThirds = Fraction(2, 3);
}
```

---

## 🧪 Testing Strategy

```yaml
# Test categories
unit_tests:
  - core/validators
  - astronomy/solar_calculations
  - astronomy/julian_day
  - prayer_times/each_prayer
  - qibla/bearing_calculation
  - inheritance/hijab_rules
  - inheritance/furudh_shares
  - inheritance/special_cases

integration_tests:
  - prayer_times_full_calculation
  - monthly_prayer_times
  - inheritance_complete_scenarios
  - golden_test_suite (100+ cases)

benchmark_tests:
  - prayer_times_performance
  - yearly_calculation_speed
  - inheritance_complex_cases
```

---

## 📦 pubspec.yaml

```yaml
name: islamic_utils
description: Accurate Islamic utilities for prayer times, qibla direction, and inheritance calculation
version: 0.1.0
homepage: https://github.com/azkal182/islamic_utils_flutter

environment:
  sdk: '>=3.0.0 <4.0.0'
  flutter: '>=3.10.0'

dependencies:
  flutter:
    sdk: flutter
  intl: ^0.19.0          # For timezone/formatting
  timezone: ^0.9.0        # IANA timezone support

dev_dependencies:
  flutter_test:
    sdk: flutter
  flutter_lints: ^3.0.0
  mocktail: ^1.0.0
  benchmark_harness: ^2.2.0
```

---

## 🎯 Prinsip Desain

1. **Pure Dart** - Tidak ada dependency eksternal untuk kalkulasi inti
2. **Immutable** - Semua class menggunakan `final` dan `const`
3. **Type-safe** - Menggunakan sealed class dan enum
4. **Null-safe** - Full null safety
5. **Testable** - Semua fungsi deterministik
6. **No I/O** - Core tidak akses GPS/network
7. **Explainable** - Trace untuk verifikasi

---

## 📊 Performance Targets

| Operation | Target |
|-----------|--------|
| Single prayer time calc | < 1ms |
| Monthly (31 days) | < 50ms |
| Yearly (365 days) | < 500ms |
| Qibla direction | < 0.1ms |
| Inheritance (simple) | < 1ms |
| Inheritance (complex) | < 5ms |

---

## 🚀 Roadmap

- **v0.1.0**: Prayer Times + Qibla (core)
- **v0.2.0**: High latitude, monthly, next prayer
- **v0.3.0**: Inheritance (furudh, asabah, hijab)
- **v0.4.0**: Inheritance (aul, radd, special cases)
- **v1.0.0**: Full feature parity dengan TypeScript version
- **v1.1.0**: Gono Gini (harta bersama)
- **v1.2.0**: Hijri calendar integration
