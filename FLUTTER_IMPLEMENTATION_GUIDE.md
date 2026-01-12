# Flutter Islamic Utils - Implementation Guide

> Panduan detail implementasi algoritma dan formula untuk library Islamic Utils dalam Dart/Flutter.

---

## 📐 Astronomy Calculations

### 1. Julian Day Number

```dart
/// Menghitung Julian Day Number untuk tanggal tertentu
double dateToJulianDay(int year, int month, double day) {
  // Adjust for months January and February
  if (month <= 2) {
    year -= 1;
    month += 12;
  }

  final a = (year / 100).floor();
  final b = 2 - a + (a / 4).floor();

  return (365.25 * (year + 4716)).floor() +
         (30.6001 * (month + 1)).floor() +
         day + b - 1524.5;
}

/// Julian Century dari epoch J2000.0
double julianCentury(double julianDay) {
  return (julianDay - 2451545.0) / 36525.0;
}
```

### 2. Solar Calculations

```dart
/// Mean longitude of the Sun (derajat)
double sunMeanLongitude(double T) {
  return _wrap(280.46646 + 36000.76983 * T + 0.0003032 * T * T, 360);
}

/// Mean anomaly of the Sun (derajat)
double sunMeanAnomaly(double T) {
  return _wrap(357.52911 + 35999.05029 * T - 0.0001537 * T * T, 360);
}

/// Equation of center
double sunEquationOfCenter(double T) {
  final M = sunMeanAnomaly(T);
  final mRad = _toRadians(M);

  return (1.914602 - 0.004817 * T - 0.000014 * T * T) * sin(mRad) +
         (0.019993 - 0.000101 * T) * sin(2 * mRad) +
         0.000289 * sin(3 * mRad);
}

/// Solar declination (derajat, -23.44 to +23.44)
double solarDeclination(double T) {
  final lambda = sunApparentLongitude(T);
  final epsilon = obliquityCorrection(T);

  return _asinDeg(_sinDeg(epsilon) * _sinDeg(lambda));
}

/// Equation of Time (menit)
double equationOfTime(double T) {
  final epsilon = obliquityCorrection(T);
  final L0 = sunMeanLongitude(T);
  final e = earthOrbitEccentricity(T);
  final M = sunMeanAnomaly(T);

  final y = _tanDeg(epsilon / 2) * _tanDeg(epsilon / 2);

  final eot = y * _sinDeg(2 * L0) -
              2 * e * _sinDeg(M) +
              4 * e * y * _sinDeg(M) * _cosDeg(2 * L0) -
              0.5 * y * y * _sinDeg(4 * L0) -
              1.25 * e * e * _sinDeg(2 * M);

  return 4 * _toDegrees(eot); // Convert to minutes
}
```

### 3. Hour Angle

```dart
/// Hour angle untuk sudut matahari tertentu
/// Returns null jika matahari tidak mencapai sudut tersebut
double? hourAngle(double latitude, double declination, double elevation) {
  final latRad = _toRadians(latitude);
  final decRad = _toRadians(declination);
  final elevRad = _toRadians(elevation);

  final cosH = (sin(elevRad) - sin(latRad) * sin(decRad)) /
               (cos(latRad) * cos(decRad));

  // Check if sun reaches this elevation
  if (cosH < -1 || cosH > 1) {
    return null; // Sun doesn't reach this angle
  }

  return _toDegrees(acos(cosH));
}
```

### 4. Solar Noon

```dart
/// Solar noon (jam desimal dalam timezone lokal)
double solarNoon(double longitude, double timezone, double julianDay) {
  final T = julianCentury(julianDay);
  final eot = equationOfTime(T);

  // Solar noon = 12:00 - EoT - (longitude / 15) + timezone
  return 12 - (eot / 60) - (longitude / 15) + timezone;
}
```

---

## 🕌 Prayer Time Algorithms

### Sunrise/Sunset Angle

```dart
/// Standard astronomical refraction + sun semi-diameter
const double sunriseAngle = -0.833; // degrees below horizon
```

### Prayer Time Formulas

```dart
/// Menghitung waktu sholat dari sudut matahari
double? timeForSunAngle({
  required double angle,
  required double latitude,
  required double declination,
  required double solarNoon,
  required bool afterNoon,
}) {
  final ha = hourAngle(latitude, declination, angle);
  if (ha == null) return null;

  final offset = ha / 15; // Convert degrees to hours

  return afterNoon ? solarNoon + offset : solarNoon - offset;
}

/// Asr calculation
double asrTime({
  required double latitude,
  required double declination,
  required double solarNoon,
  required int shadowFactor, // 1 for Standard, 2 for Hanafi
}) {
  final latRad = _toRadians(latitude);
  final decRad = _toRadians(declination);

  // Shadow angle for Asr
  final a = atan(1 / (shadowFactor + tan((latRad - decRad).abs())));
  final angle = _toDegrees(a);

  return timeForSunAngle(
    angle: angle,
    latitude: latitude,
    declination: declination,
    solarNoon: solarNoon,
    afterNoon: true,
  )!;
}
```

### High Latitude Adjustments

```dart
/// Middle of night method
(double fajr, double isha) middleOfNight({
  required double sunset,
  required double sunrise, // next day
  required double fajrAngle,
  required double ishaAngle,
}) {
  final nightDuration = (24 - sunset) + sunrise;
  final midnight = sunset + (nightDuration / 2);

  // Fajr and Isha are equidistant from midnight
  final portion = nightDuration / 2;

  return (
    midnight - (portion * fajrAngle / 90), // Fajr
    sunset + (portion * (1 - ishaAngle / 90)), // Isha
  );
}

/// One-seventh of night method
(double fajr, double isha) oneSeventhOfNight({
  required double sunset,
  required double sunrise,
}) {
  final nightDuration = (24 - sunset) + sunrise;
  final seventh = nightDuration / 7;

  return (
    sunrise - seventh,  // Fajr
    sunset + (sixth * 6), // Isha (6/7 of night)
  );
}
```

---

## 🧭 Qibla Calculation

### Great Circle Formula

```dart
/// Ka'bah coordinates
const kaabaLatitude = 21.4225;
const kaabaLongitude = 39.8262;

/// Initial bearing (arah kiblat)
double calculateQiblaBearing(double lat, double lon) {
  final lat1 = _toRadians(lat);
  final lat2 = _toRadians(kaabaLatitude);
  final dLon = _toRadians(kaabaLongitude - lon);

  final y = sin(dLon) * cos(lat2);
  final x = cos(lat1) * sin(lat2) - sin(lat1) * cos(lat2) * cos(dLon);

  var bearing = _toDegrees(atan2(y, x));
  return (bearing + 360) % 360; // Normalize to 0-360
}

/// Great circle distance (km)
double calculateDistanceToKaaba(double lat, double lon) {
  const earthRadius = 6371.0; // km

  final lat1 = _toRadians(lat);
  final lat2 = _toRadians(kaabaLatitude);
  final dLat = _toRadians(kaabaLatitude - lat);
  final dLon = _toRadians(kaabaLongitude - lon);

  final a = sin(dLat / 2) * sin(dLat / 2) +
            cos(lat1) * cos(lat2) * sin(dLon / 2) * sin(dLon / 2);
  final c = 2 * atan2(sqrt(a), sqrt(1 - a));

  return earthRadius * c;
}

/// Compass direction (16-point)
String bearingToCompass(double bearing) {
  final directions = [
    'N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE',
    'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'
  ];
  final index = ((bearing + 11.25) / 22.5).floor() % 16;
  return directions[index];
}
```

---

## 📜 Inheritance Calculations

### 1. Net Estate Calculation

```dart
EstateResult calculateNetEstate(EstateInput input) {
  final afterFuneral = input.grossValue - input.funeralCosts;
  final afterDebts = afterFuneral - input.debts;

  // Wasiyyah max 1/3 unless approved
  final maxWasiyyah = afterDebts / 3;
  final wasiyyahAllowed = input.wasiyyahApprovedByHeirs
      ? input.wasiyyah
      : min(input.wasiyyah, maxWasiyyah);

  final netEstate = afterDebts - wasiyyahAllowed;

  return EstateResult(
    grossValue: input.grossValue,
    netEstate: netEstate,
    deductions: DeductionsResult(
      funeralCosts: input.funeralCosts,
      debts: input.debts,
      wasiyyah: wasiyyahAllowed,
      wasiyyahCapped: wasiyyahAllowed < input.wasiyyah,
    ),
  );
}
```

### 2. Derived Flags

```dart
DerivedFlags calculateFlags(List<HeirInput> heirs) {
  int count(HeirType type) =>
    heirs.where((h) => h.type == type).fold(0, (sum, h) => sum + h.count);

  final hasSon = count(HeirType.son) > 0;
  final hasDaughter = count(HeirType.daughter) > 0;
  final hasGrandson = count(HeirType.grandsonSon) > 0;

  final siblingsTotal =
    count(HeirType.brotherFull) + count(HeirType.sisterFull) +
    count(HeirType.brotherPaternal) + count(HeirType.sisterPaternal) +
    count(HeirType.brotherUterine) + count(HeirType.sisterUterine);

  return DerivedFlags(
    hasChild: hasSon || hasDaughter,
    hasSon: hasSon,
    hasDaughter: hasDaughter,
    hasDescendant: hasSon || hasDaughter || hasGrandson,
    hasFather: count(HeirType.father) > 0,
    hasMother: count(HeirType.mother) > 0,
    hasGrandfather: count(HeirType.grandfatherPaternal) > 0,
    siblingsTotal: siblingsTotal,
    hasTwoOrMoreSiblings: siblingsTotal >= 2,
    hasSpouse: count(HeirType.husband) > 0 || count(HeirType.wife) > 0,
    // ... more flags
  );
}
```

### 3. Hijab Rules Implementation

```dart
List<BlockedHeir> applyHijab(List<HeirInput> heirs, DerivedFlags flags) {
  final blocked = <BlockedHeir>[];

  // Rule E1: Descendants block siblings
  if (flags.hasDescendant) {
    for (final type in [
      HeirType.brotherFull, HeirType.sisterFull,
      HeirType.brotherPaternal, HeirType.sisterPaternal,
      HeirType.brotherUterine, HeirType.sisterUterine,
    ]) {
      _blockIfExists(heirs, type, blocked,
        blockedBy: flags.hasSon ? HeirType.son : HeirType.daughter);
    }
  }

  // Rule E2: Father blocks grandfather and male agnates
  if (flags.hasFather) {
    for (final type in [
      HeirType.grandfatherPaternal,
      HeirType.brotherFull, HeirType.brotherPaternal,
      HeirType.nephewFull, HeirType.nephewPaternal,
      HeirType.uncleFull, HeirType.unclePaternal,
      HeirType.cousinFull, HeirType.cousinPaternal,
    ]) {
      _blockIfExists(heirs, type, blocked, blockedBy: HeirType.father);
    }
  }

  // Rule E3: Son blocks grandchildren
  if (flags.hasSon) {
    _blockIfExists(heirs, HeirType.grandsonSon, blocked, blockedBy: HeirType.son);
    _blockIfExists(heirs, HeirType.granddaughterSon, blocked, blockedBy: HeirType.son);
  }

  // Rule E4: Mother blocks maternal grandmother
  if (flags.hasMother) {
    _blockIfExists(heirs, HeirType.grandmotherMaternal, blocked,
      blockedBy: HeirType.mother);
  }

  // Rule E5: Father blocks paternal grandmother
  if (flags.hasFather) {
    _blockIfExists(heirs, HeirType.grandmotherPaternal, blocked,
      blockedBy: HeirType.father);
  }

  // Rule E6: Full brother blocks paternal siblings
  if (heirs.any((h) => h.type == HeirType.brotherFull && h.count > 0)) {
    _blockIfExists(heirs, HeirType.brotherPaternal, blocked,
      blockedBy: HeirType.brotherFull);
    _blockIfExists(heirs, HeirType.sisterPaternal, blocked,
      blockedBy: HeirType.brotherFull);
  }

  // Rule E7: Paternal brother blocks nephews
  if (heirs.any((h) => h.type == HeirType.brotherPaternal && h.count > 0)) {
    _blockIfExists(heirs, HeirType.nephewFull, blocked,
      blockedBy: HeirType.brotherPaternal);
    _blockIfExists(heirs, HeirType.nephewPaternal, blocked,
      blockedBy: HeirType.brotherPaternal);
  }

  return blocked;
}
```

### 4. Furudh Shares

```dart
Map<HeirType, Fraction> calculateFurudh(
  List<HeirInput> heirs,
  DerivedFlags flags,
  InheritancePolicy policy,
) {
  final shares = <HeirType, Fraction>{};

  // HUSBAND
  if (flags.hasHusband) {
    shares[HeirType.husband] = flags.hasDescendant
        ? Fraction(1, 4)  // 1/4 with descendants
        : Fraction(1, 2); // 1/2 without descendants
  }

  // WIFE
  if (flags.hasWife) {
    shares[HeirType.wife] = flags.hasDescendant
        ? Fraction(1, 8)  // 1/8 with descendants
        : Fraction(1, 4); // 1/4 without descendants
  }

  // MOTHER
  if (flags.hasMother) {
    if (flags.hasDescendant || flags.hasTwoOrMoreSiblings) {
      shares[HeirType.mother] = Fraction(1, 6);
    } else {
      shares[HeirType.mother] = Fraction(1, 3);
    }
  }

  // FATHER (with descendants gets 1/6 as furudh)
  if (flags.hasFather && flags.hasDescendant) {
    shares[HeirType.father] = Fraction(1, 6);
  }

  // DAUGHTER(S)
  if (flags.hasDaughter && !flags.hasSon) {
    final count = heirs.firstWhere((h) => h.type == HeirType.daughter).count;
    shares[HeirType.daughter] = count == 1
        ? Fraction(1, 2)   // 1/2 for one
        : Fraction(2, 3);  // 2/3 for two or more
  }

  // GRANDDAUGHTER (completion of 2/3)
  if (flags.hasGranddaughter && !flags.hasSon && !flags.hasGrandson) {
    final daughterCount =
      heirs.firstWhereOrNull((h) => h.type == HeirType.daughter)?.count ?? 0;
    if (daughterCount == 1) {
      shares[HeirType.granddaughterSon] = Fraction(1, 6); // Complete 2/3
    } else if (daughterCount == 0) {
      final count = heirs.firstWhere((h) => h.type == HeirType.granddaughterSon).count;
      shares[HeirType.granddaughterSon] = count == 1
          ? Fraction(1, 2)
          : Fraction(2, 3);
    }
    // If 2+ daughters, granddaughter is blocked
  }

  // UTERINE SIBLINGS (only in kalalah - no father, no descendants)
  if (!flags.hasFather && !flags.hasDescendant && flags.hasUterineSiblings) {
    final count =
      heirs.where((h) => h.type == HeirType.brotherUterine ||
                         h.type == HeirType.sisterUterine)
           .fold(0, (sum, h) => sum + h.count);

    final share = count == 1 ? Fraction(1, 6) : Fraction(1, 3);
    shares[HeirType.brotherUterine] = share;
    shares[HeirType.sisterUterine] = share;
  }

  // ... more furudh rules

  return shares;
}
```

### 5. Aul (Over-subscription)

```dart
/// Apply Aul when total shares > 1
AulResult applyAul(Map<HeirType, Fraction> shares) {
  var total = shares.values.fold(Fraction(0, 1), (a, b) => a + b);

  if (total.toDouble() <= 1.0) {
    return AulResult(applied: false, shares: shares);
  }

  // Find common denominator (Asal Masalah)
  final asalMasalah = _lcm(shares.values.map((f) => f.denominator));

  // Sum of numerators
  final totalNumerator = shares.values
      .map((f) => f.numerator * (asalMasalah ~/ f.denominator))
      .fold(0, (a, b) => a + b);

  // New denominator after Aul
  final newDenominator = totalNumerator;

  // Adjust each share
  final adjusted = shares.map((type, share) {
    final numerator = share.numerator * (asalMasalah ~/ share.denominator);
    return MapEntry(type, Fraction(numerator, newDenominator));
  });

  return AulResult(
    applied: true,
    shares: adjusted,
    originalDenominator: asalMasalah,
    newDenominator: newDenominator,
  );
}
```

### 6. Radd (Remainder Distribution)

```dart
/// Apply Radd when total shares < 1 and no asabah
RaddResult applyRadd(
  Map<HeirType, Fraction> shares,
  InheritancePolicy policy,
) {
  var total = shares.values.fold(Fraction(0, 1), (a, b) => a + b);

  if (total.toDouble() >= 1.0) {
    return RaddResult(applied: false, shares: shares);
  }

  final remainder = Fraction(1, 1) - total;

  // Exclude spouse from radd (unless policy allows)
  final eligibleTypes = shares.keys.where((type) {
    if (type == HeirType.husband || type == HeirType.wife) {
      return policy.raddIncludesSpouse;
    }
    return true;
  }).toList();

  if (eligibleTypes.isEmpty) {
    return RaddResult(applied: false, shares: shares);
  }

  // Calculate eligible total
  final eligibleTotal = eligibleTypes
      .map((t) => shares[t]!)
      .fold(Fraction(0, 1), (a, b) => a + b);

  // Distribute remainder proportionally
  final adjusted = Map<HeirType, Fraction>.from(shares);
  for (final type in eligibleTypes) {
    final proportion = shares[type]! / eligibleTotal;
    final raddShare = remainder * proportion;
    adjusted[type] = shares[type]! + raddShare;
  }

  return RaddResult(
    applied: true,
    shares: adjusted,
    remainder: remainder,
  );
}
```

---

## 🧮 Fraction Utility Implementation

```dart
class Fraction {
  final int numerator;
  final int denominator;

  const Fraction(this.numerator, this.denominator)
      : assert(denominator != 0, 'Denominator cannot be zero');

  Fraction operator +(Fraction other) {
    final lcm = _lcm(denominator, other.denominator);
    final num1 = numerator * (lcm ~/ denominator);
    final num2 = other.numerator * (lcm ~/ other.denominator);
    return Fraction(num1 + num2, lcm).simplify();
  }

  Fraction operator -(Fraction other) {
    final lcm = _lcm(denominator, other.denominator);
    final num1 = numerator * (lcm ~/ denominator);
    final num2 = other.numerator * (lcm ~/ other.denominator);
    return Fraction(num1 - num2, lcm).simplify();
  }

  Fraction operator *(Fraction other) {
    return Fraction(
      numerator * other.numerator,
      denominator * other.denominator,
    ).simplify();
  }

  Fraction operator /(Fraction other) {
    return Fraction(
      numerator * other.denominator,
      denominator * other.numerator,
    ).simplify();
  }

  Fraction simplify() {
    final gcd = _gcd(numerator.abs(), denominator.abs());
    return Fraction(numerator ~/ gcd, denominator ~/ gcd);
  }

  double toDouble() => numerator / denominator;

  @override
  String toString() => '$numerator/$denominator';

  static int _gcd(int a, int b) => b == 0 ? a : _gcd(b, a % b);
  static int _lcm(int a, int b) => (a * b) ~/ _gcd(a, b);
}
```

---

## 🧪 Golden Test Cases

### Prayer Times

```dart
// Jakarta, 15 Jan 2024, Kemenag method
test('Jakarta prayer times', () {
  final result = computePrayerTimes(
    location: Coordinates(latitude: -6.2088, longitude: 106.8456),
    date: DateOnly(year: 2024, month: 1, day: 15),
    timezone: 7,
    params: PrayerCalculationParams(method: CalculationMethods.kemenag),
  );

  expect(result.isSuccess, true);
  expect(result.unwrap().formatted[PrayerName.fajr], '04:24');
  expect(result.unwrap().formatted[PrayerName.maghrib], '18:15');
});
```

### Inheritance

```dart
// Simple case: Wife + 2 Sons + 1 Daughter
test('Basic inheritance', () {
  final result = computeInheritance(
    estate: EstateInput(grossValue: 1000000000),
    heirs: [
      HeirInput(type: HeirType.wife, count: 1),
      HeirInput(type: HeirType.son, count: 2),
      HeirInput(type: HeirType.daughter, count: 1),
    ],
    deceased: DeceasedInfo(gender: Gender.male),
  );

  expect(result.isSuccess, true);
  final shares = result.unwrap().shares;

  // Wife: 1/8 (with descendants)
  expect(shares.firstWhere((s) => s.heirType == HeirType.wife).finalShare,
      Fraction(1, 8));

  // Sons + Daughter as asabah (2:1 ratio)
  // Remaining 7/8 divided: Sons get 2/5 each, Daughter gets 1/5
});
```

---

## 📁 File Templates

Silakan lihat repository untuk template file lengkap yang bisa di-copy sebagai starting point untuk implementasi.

---

## 🔗 References

- **TypeScript Source**: `src/` folder dari project ini
- **Astronomy Algorithms**: Jean Meeus, "Astronomical Algorithms"
- **Islamic Fiqh**: DECISION_MATRIX_WARIS.md, SPECIAL_CASE_RULES_INHERITANCE.md
- **Prayer Calculation**: IslamicFinder, Praytimes.org
