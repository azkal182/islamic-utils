# Flutter Islamic Utils - Quick Start Guide

> Panduan cepat untuk memulai project Flutter dengan Islamic Utils library.

---

## 🚀 Setup Project

### 1. Create Flutter Package

```bash
# Create package
flutter create --template=package islamic_utils
cd islamic_utils

# Or with organization
flutter create --template=package --org com.yourorg islamic_utils
```

### 2. Update pubspec.yaml

```yaml
name: islamic_utils
description: Islamic utilities for prayer times, qibla, and inheritance
version: 0.1.0

environment:
  sdk: '>=3.0.0 <4.0.0'
  flutter: '>=3.10.0'

dependencies:
  flutter:
    sdk: flutter

dev_dependencies:
  flutter_test:
    sdk: flutter
  flutter_lints: ^3.0.0
```

### 3. Create Folder Structure

```bash
mkdir -p lib/src/{core,astronomy,prayer_times,qibla,inheritance}
mkdir -p lib/src/core/{constants,errors,types,utils,validators}
mkdir -p lib/src/prayer_times/methods
mkdir -p lib/src/inheritance/{rules,utils,validation}
mkdir -p test/{unit,integration}
```

---

## 📁 Core Files to Create First

### 1. lib/src/core/types/result.dart

```dart
sealed class Result<T> {
  const Result();
}

class Success<T> extends Result<T> {
  final T data;
  const Success(this.data);
}

class Failure<T> extends Result<T> {
  final LibraryError error;
  const Failure(this.error);
}

extension ResultX<T> on Result<T> {
  bool get isSuccess => this is Success<T>;
  T unwrap() => (this as Success<T>).data;
  T unwrapOr(T def) => isSuccess ? unwrap() : def;
}
```

### 2. lib/src/core/types/coordinates.dart

```dart
class Coordinates {
  final double latitude;
  final double longitude;
  final double? altitude;

  const Coordinates({
    required this.latitude,
    required this.longitude,
    this.altitude,
  }) : assert(latitude >= -90 && latitude <= 90),
       assert(longitude >= -180 && longitude <= 180);
}
```

### 3. lib/src/core/types/date_only.dart

```dart
class DateOnly {
  final int year;
  final int month;
  final int day;

  const DateOnly({
    required this.year,
    required this.month,
    required this.day,
  });

  factory DateOnly.now() {
    final dt = DateTime.now();
    return DateOnly(year: dt.year, month: dt.month, day: dt.day);
  }

  DateTime toDateTime() => DateTime(year, month, day);
}
```

### 4. lib/src/core/errors/library_error.dart

```dart
enum ErrorCode {
  invalidCoordinates,
  invalidDate,
  invalidTimezone,
  prayerTimesInconsistent,
  inheritanceInvalidEstate,
}

class LibraryError implements Exception {
  final ErrorCode code;
  final String message;

  const LibraryError(this.code, this.message);

  @override
  String toString() => 'LibraryError($code): $message';
}
```

### 5. lib/src/core/utils/math_utils.dart

```dart
import 'dart:math' as math;

double toRadians(double deg) => deg * math.pi / 180;
double toDegrees(double rad) => rad * 180 / math.pi;

double sinDeg(double deg) => math.sin(toRadians(deg));
double cosDeg(double deg) => math.cos(toRadians(deg));
double tanDeg(double deg) => math.tan(toRadians(deg));
double asinDeg(double x) => toDegrees(math.asin(x));
double acosDeg(double x) => toDegrees(math.acos(x));
double atan2Deg(double y, double x) => toDegrees(math.atan2(y, x));

double wrap(double value, double max) => ((value % max) + max) % max;
```

---

## 🕌 Prayer Times - Minimal Implementation

### lib/src/prayer_times/calculator.dart

```dart
import '../core/types/coordinates.dart';
import '../core/types/date_only.dart';
import '../core/types/result.dart';
import '../astronomy/solar.dart';
import 'types.dart';

Result<PrayerTimesResult> computePrayerTimes({
  required Coordinates location,
  required DateOnly date,
  required int timezone,
  required CalculationMethod method,
}) {
  // 1. Calculate Julian Day
  final jd = dateToJulianDay(date.year, date.month, date.day.toDouble());
  final T = julianCentury(jd);

  // 2. Get solar parameters
  final decl = solarDeclination(T);
  final eot = equationOfTime(T);
  final noon = 12 - (eot / 60) - (location.longitude / 15) + timezone;

  // 3. Calculate each prayer time
  final sunrise = _timeForAngle(location.latitude, decl, noon, -0.833, false);
  final sunset = _timeForAngle(location.latitude, decl, noon, -0.833, true);
  final fajr = _timeForAngle(location.latitude, decl, noon, -method.fajrAngle, false);
  final isha = method.ishaAngle != null
      ? _timeForAngle(location.latitude, decl, noon, -method.ishaAngle!, true)
      : sunset + (method.ishaIntervalMinutes! / 60);
  final asr = _asrTime(location.latitude, decl, noon, 1);

  final times = {
    PrayerName.imsak: fajr - (10 / 60),
    PrayerName.fajr: fajr,
    PrayerName.sunrise: sunrise,
    PrayerName.dhuhaStart: sunrise + 0.25,
    PrayerName.dhuhaEnd: noon - (1 / 60),
    PrayerName.dhuhr: noon,
    PrayerName.asr: asr,
    PrayerName.maghrib: sunset,
    PrayerName.isha: isha,
  };

  return Success(PrayerTimesResult(
    times: times,
    formatted: times.map((k, v) => MapEntry(k, _formatTime(v))),
  ));
}

double? _timeForAngle(double lat, double decl, double noon, double angle, bool pm) {
  final ha = hourAngle(lat, decl, angle);
  if (ha == null) return null;
  return pm ? noon + (ha / 15) : noon - (ha / 15);
}

double _asrTime(double lat, double decl, double noon, int factor) {
  final angle = acosDeg(sinDeg(acotDeg(factor + tanDeg((lat - decl).abs()))));
  return noon + (hourAngle(lat, decl, angle)! / 15);
}

String _formatTime(double? hours) {
  if (hours == null) return '--:--';
  final h = hours.floor();
  final m = ((hours - h) * 60).round();
  return '${h.toString().padLeft(2, '0')}:${m.toString().padLeft(2, '0')}';
}
```

---

## 🧭 Qibla - Minimal Implementation

### lib/src/qibla/calculator.dart

```dart
import 'dart:math' as math;
import '../core/types/coordinates.dart';
import '../core/types/result.dart';
import 'types.dart';

const _kaabaLat = 21.4225;
const _kaabaLon = 39.8262;

Result<QiblaResult> computeQiblaDirection({
  required Coordinates coordinates,
  bool includeDistance = false,
}) {
  final lat1 = _toRad(coordinates.latitude);
  final lat2 = _toRad(_kaabaLat);
  final dLon = _toRad(_kaabaLon - coordinates.longitude);

  final y = math.sin(dLon) * math.cos(lat2);
  final x = math.cos(lat1) * math.sin(lat2) -
            math.sin(lat1) * math.cos(lat2) * math.cos(dLon);

  var bearing = _toDeg(math.atan2(y, x));
  bearing = (bearing + 360) % 360;

  double? distance;
  if (includeDistance) {
    distance = _haversineDistance(
      coordinates.latitude, coordinates.longitude,
      _kaabaLat, _kaabaLon,
    );
  }

  return Success(QiblaResult(
    bearing: bearing,
    compassDirection: _bearingToCompass(bearing),
    distance: distance,
  ));
}

double _toRad(double deg) => deg * math.pi / 180;
double _toDeg(double rad) => rad * 180 / math.pi;

double _haversineDistance(double lat1, double lon1, double lat2, double lon2) {
  const R = 6371.0;
  final dLat = _toRad(lat2 - lat1);
  final dLon = _toRad(lon2 - lon1);
  final a = math.sin(dLat / 2) * math.sin(dLat / 2) +
            math.cos(_toRad(lat1)) * math.cos(_toRad(lat2)) *
            math.sin(dLon / 2) * math.sin(dLon / 2);
  return R * 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a));
}

String _bearingToCompass(double bearing) {
  const dirs = ['N','NNE','NE','ENE','E','ESE','SE','SSE',
                'S','SSW','SW','WSW','W','WNW','NW','NNW'];
  return dirs[((bearing + 11.25) / 22.5).floor() % 16];
}
```

---

## 📜 Inheritance - Minimal Implementation

### lib/src/inheritance/calculator.dart

```dart
import '../core/types/result.dart';
import 'types.dart';
import 'rules/hijab.dart';
import 'rules/furudh.dart';

Result<InheritanceResult> computeInheritance({
  required EstateInput estate,
  required List<HeirInput> heirs,
  required DeceasedInfo deceased,
}) {
  // 1. Calculate net estate
  final maxWasiyyah = (estate.grossValue - estate.debts - estate.funeralCosts) / 3;
  final wasiyyah = estate.wasiyyahApproved
      ? estate.wasiyyah
      : math.min(estate.wasiyyah, maxWasiyyah);
  final netEstate = estate.grossValue - estate.debts - estate.funeralCosts - wasiyyah;

  // 2. Calculate flags
  final flags = _calculateFlags(heirs);

  // 3. Apply hijab
  final blocked = applyHijab(heirs, flags);
  final activeHeirs = heirs.where((h) => !blocked.contains(h.type)).toList();

  // 4. Calculate furudh shares
  final shares = calculateFurudh(activeHeirs, flags, deceased);

  // 5. Calculate asabah (remainder)
  final furudhTotal = shares.values.fold(0.0, (a, b) => a + b);
  final remainder = 1.0 - furudhTotal;

  if (remainder > 0) {
    _distributeAsabah(activeHeirs, shares, remainder, flags);
  }

  // 6. Apply aul if needed
  if (shares.values.fold(0.0, (a, b) => a + b) > 1.0) {
    _applyAul(shares);
  }

  // 7. Convert to absolute values
  final heirShares = shares.entries.map((e) {
    final count = heirs.firstWhere((h) => h.type == e.key).count;
    final total = netEstate * e.value;
    return HeirShare(
      heirType: e.key,
      count: count,
      shareRatio: e.value,
      totalValue: total,
      perPersonValue: total / count,
    );
  }).toList();

  return Success(InheritanceResult(
    netEstate: netEstate,
    shares: heirShares,
    verification: InheritanceVerification(
      sumOfShares: heirShares.fold(0.0, (a, b) => a + b.totalValue),
      netEstate: netEstate,
      isValid: true,
    ),
  ));
}
```

---

## 📦 Main Export

### lib/islamic_utils.dart

```dart
library islamic_utils;

// Core
export 'src/core/types/result.dart';
export 'src/core/types/coordinates.dart';
export 'src/core/types/date_only.dart';
export 'src/core/errors/library_error.dart';

// Prayer Times
export 'src/prayer_times/calculator.dart';
export 'src/prayer_times/types.dart';
export 'src/prayer_times/methods/calculation_methods.dart';

// Qibla
export 'src/qibla/calculator.dart';
export 'src/qibla/types.dart';

// Inheritance
export 'src/inheritance/calculator.dart';
export 'src/inheritance/types.dart';
```

---

## 🧪 First Test

### test/prayer_times_test.dart

```dart
import 'package:flutter_test/flutter_test.dart';
import 'package:islamic_utils/islamic_utils.dart';

void main() {
  test('Jakarta prayer times', () {
    final result = computePrayerTimes(
      location: Coordinates(latitude: -6.2088, longitude: 106.8456),
      date: DateOnly(year: 2024, month: 1, day: 15),
      timezone: 7,
      method: CalculationMethods.kemenag,
    );

    expect(result.isSuccess, true);
    expect(result.unwrap().formatted[PrayerName.fajr], isNotNull);
  });

  test('Qibla from Jakarta', () {
    final result = computeQiblaDirection(
      coordinates: Coordinates(latitude: -6.2088, longitude: 106.8456),
    );

    expect(result.isSuccess, true);
    expect(result.unwrap().bearing, closeTo(295, 1));
  });
}
```

---

## ▶️ Run Tests

```bash
flutter test
```

---

## 📊 Implementation Priority

| Priority | Module | Estimated Time |
|----------|--------|----------------|
| 1 | Core types & utils | 2-3 hours |
| 2 | Astronomy (solar.dart) | 3-4 hours |
| 3 | Prayer Times (basic) | 4-5 hours |
| 4 | Qibla | 1-2 hours |
| 5 | Prayer Times (high lat, monthly) | 3-4 hours |
| 6 | Inheritance (furudh, hijab) | 5-6 hours |
| 7 | Inheritance (aul, radd) | 3-4 hours |
| 8 | Inheritance (special cases) | 4-5 hours |
| **Total** | | **25-33 hours** |

---

## 📚 Next Steps

1. Implement core types ✓
2. Implement astronomy calculations
3. Implement basic prayer times
4. Add unit tests for each module
5. Implement qibla
6. Implement inheritance step by step
7. Add integration tests
8. Publish to pub.dev

Selamat mengerjakan! 🚀
