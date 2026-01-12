# Flutter Islamic Utils - Test Cases & Examples

> Golden test cases dan contoh penggunaan untuk validasi library Flutter.

---

## 🧪 Prayer Times Test Cases

### Basic Calculations

```dart
group('Prayer Times - Basic', () {
  test('Jakarta - Kemenag method', () {
    final result = computePrayerTimes(
      location: Coordinates(latitude: -6.2088, longitude: 106.8456),
      date: DateOnly(year: 2024, month: 1, day: 15),
      timezone: 7,
      params: PrayerCalculationParams(method: CalculationMethods.kemenag),
    );

    expect(result.isSuccess, true);
    final times = result.unwrap().formatted;
    expect(times[PrayerName.imsak], '04:14');
    expect(times[PrayerName.fajr], '04:24');
    expect(times[PrayerName.sunrise], '05:48');
    expect(times[PrayerName.dhuhr], '12:04');
    expect(times[PrayerName.asr], '15:25');
    expect(times[PrayerName.maghrib], '18:15');
    expect(times[PrayerName.isha], '19:27');
  });

  test('Makkah - Umm al-Qura method', () {
    final result = computePrayerTimes(
      location: Coordinates(latitude: 21.4225, longitude: 39.8262),
      date: DateOnly(year: 2024, month: 6, day: 21),
      timezone: 3,
      params: PrayerCalculationParams(method: CalculationMethods.makkah),
    );

    expect(result.isSuccess, true);
    final times = result.unwrap().formatted;
    expect(times[PrayerName.fajr], '03:56');
    expect(times[PrayerName.sunrise], '05:28');
    expect(times[PrayerName.dhuhr], '12:27');
    expect(times[PrayerName.asr], '15:50');
    expect(times[PrayerName.maghrib], '19:14');
    expect(times[PrayerName.isha], '20:44'); // 90 min after Maghrib
  });

  test('New York - ISNA method', () {
    final result = computePrayerTimes(
      location: Coordinates(latitude: 40.7128, longitude: -74.0060),
      date: DateOnly(year: 2024, month: 3, day: 15),
      timezone: -4, // EDT
      params: PrayerCalculationParams(method: CalculationMethods.isna),
    );

    expect(result.isSuccess, true);
  });
});
```

### Asr Madhhab Comparison

```dart
group('Asr Madhhab', () {
  test('Standard vs Hanafi', () {
    final location = Coordinates(latitude: -6.2088, longitude: 106.8456);
    final date = DateOnly(year: 2024, month: 1, day: 15);

    final standard = computePrayerTimes(
      location: location,
      date: date,
      timezone: 7,
      params: PrayerCalculationParams(
        method: CalculationMethods.kemenag,
        asrMadhhab: AsrMadhhab.standard,
      ),
    );

    final hanafi = computePrayerTimes(
      location: location,
      date: date,
      timezone: 7,
      params: PrayerCalculationParams(
        method: CalculationMethods.kemenag,
        asrMadhhab: AsrMadhhab.hanafi,
      ),
    );

    expect(standard.isSuccess, true);
    expect(hanafi.isSuccess, true);

    // Hanafi Asr should be later than Standard
    final standardAsr = standard.unwrap().times[PrayerName.asr]!;
    final hanafiAsr = hanafi.unwrap().times[PrayerName.asr]!;
    expect(hanafiAsr, greaterThan(standardAsr));
  });
});
```

### High Latitude Tests

```dart
group('High Latitude', () {
  test('London summer solstice - Middle of Night', () {
    final result = computePrayerTimes(
      location: Coordinates(latitude: 51.5074, longitude: -0.1278),
      date: DateOnly(year: 2024, month: 6, day: 21),
      timezone: 1, // BST
      params: PrayerCalculationParams(
        method: CalculationMethods.mwl,
        highLatitudeRule: HighLatitudeRule.middleOfNight,
      ),
    );

    expect(result.isSuccess, true);
    expect(result.unwrap().meta.highLatitudeAdjusted, true);
  });

  test('Stockholm - One Seventh method', () {
    final result = computePrayerTimes(
      location: Coordinates(latitude: 59.3293, longitude: 18.0686),
      date: DateOnly(year: 2024, month: 6, day: 21),
      timezone: 2,
      params: PrayerCalculationParams(
        method: CalculationMethods.mwl,
        highLatitudeRule: HighLatitudeRule.oneSeventh,
      ),
    );

    expect(result.isSuccess, true);
  });

  test('Polar region without rule - should fail gracefully', () {
    final result = computePrayerTimes(
      location: Coordinates(latitude: 70.0, longitude: 25.0),
      date: DateOnly(year: 2024, month: 6, day: 21),
      timezone: 2,
      params: PrayerCalculationParams(
        method: CalculationMethods.mwl,
        highLatitudeRule: HighLatitudeRule.none,
      ),
    );

    // Should return null for Fajr/Isha or specific times
    expect(result.isSuccess, true);
  });
});
```

### Monthly Prayer Times

```dart
group('Monthly Prayer Times', () {
  test('Generate full month', () {
    final result = computeMonthlyPrayerTimes(
      year: 2024,
      month: 3,
      location: Coordinates(latitude: -6.2088, longitude: 106.8456),
      timezone: 7,
      params: PrayerCalculationParams(method: CalculationMethods.kemenag),
    );

    expect(result.isSuccess, true);
    expect(result.unwrap().days.length, 31);
    expect(result.unwrap().meta.daysInMonth, 31);
    expect(result.unwrap().meta.isLeapYear, true);
  });

  test('February leap year', () {
    final result = computeMonthlyPrayerTimes(
      year: 2024,
      month: 2,
      location: Coordinates(latitude: -6.2088, longitude: 106.8456),
      timezone: 7,
      params: PrayerCalculationParams(method: CalculationMethods.kemenag),
    );

    expect(result.isSuccess, true);
    expect(result.unwrap().days.length, 29); // Leap year
  });
});
```

---

## 🧭 Qibla Test Cases

```dart
group('Qibla Direction', () {
  test('Jakarta to Kaaba', () {
    final result = computeQiblaDirection(
      coordinates: Coordinates(latitude: -6.2088, longitude: 106.8456),
    );

    expect(result.isSuccess, true);
    expect(result.unwrap().bearing, closeTo(295.15, 0.5));
    expect(result.unwrap().compassDirection, CompassDirection.wnw);
  });

  test('New York to Kaaba', () {
    final result = computeQiblaDirection(
      coordinates: Coordinates(latitude: 40.7128, longitude: -74.0060),
    );

    expect(result.isSuccess, true);
    expect(result.unwrap().bearing, closeTo(58.5, 0.5));
    expect(result.unwrap().compassDirection, CompassDirection.ene);
  });

  test('Tokyo to Kaaba', () {
    final result = computeQiblaDirection(
      coordinates: Coordinates(latitude: 35.6762, longitude: 139.6503),
    );

    expect(result.isSuccess, true);
    expect(result.unwrap().bearing, closeTo(293.0, 1.0));
  });

  test('At Kaaba location', () {
    final result = computeQiblaDirection(
      coordinates: Coordinates(latitude: 21.4225, longitude: 39.8262),
    );

    expect(result.isSuccess, true);
    expect(result.unwrap().meta.atKaaba, true);
  });

  test('With distance calculation', () {
    final result = computeQiblaDirection(
      coordinates: Coordinates(latitude: -6.2088, longitude: 106.8456),
      includeDistance: true,
    );

    expect(result.isSuccess, true);
    expect(result.unwrap().meta.distance, closeTo(7920, 50));
  });
});
```

---

## 📜 Inheritance Test Cases

### Simple Cases

```dart
group('Inheritance - Simple Cases', () {
  test('Husband only', () {
    final result = computeInheritance(
      estate: EstateInput(grossValue: 1000000000),
      heirs: [HeirInput(type: HeirType.husband, count: 1)],
      deceased: DeceasedInfo(gender: Gender.female),
    );

    expect(result.isSuccess, true);
    final husband = result.unwrap().shares
        .firstWhere((s) => s.heirType == HeirType.husband);
    // Husband: 1/2 (no descendants) + Radd remainder
    expect(husband.totalValue, 1000000000);
  });

  test('Wife + Son', () {
    final result = computeInheritance(
      estate: EstateInput(grossValue: 800000000),
      heirs: [
        HeirInput(type: HeirType.wife, count: 1),
        HeirInput(type: HeirType.son, count: 1),
      ],
      deceased: DeceasedInfo(gender: Gender.male),
    );

    expect(result.isSuccess, true);
    final shares = result.unwrap().shares;

    // Wife: 1/8 = 100M
    final wife = shares.firstWhere((s) => s.heirType == HeirType.wife);
    expect(wife.finalShare, Fraction(1, 8));
    expect(wife.totalValue, 100000000);

    // Son: asabah = 7/8 = 700M
    final son = shares.firstWhere((s) => s.heirType == HeirType.son);
    expect(son.category, ShareCategory.asabah);
    expect(son.totalValue, 700000000);
  });

  test('Wife + 2 Sons + 1 Daughter', () {
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

    // Wife: 1/8
    // Sons + Daughter: 7/8 with 2:1 ratio
    // Total parts: 2 + 2 + 1 = 5
    // Each son: 2/5 of 7/8 = 7/20 each
    // Daughter: 1/5 of 7/8 = 7/40

    final son = shares.firstWhere((s) => s.heirType == HeirType.son);
    expect(son.count, 2);
    // Per son = 175M, total = 350M
  });
});
```

### Hijab (Blocking) Tests

```dart
group('Inheritance - Hijab Rules', () {
  test('E1: Son blocks siblings', () {
    final result = computeInheritance(
      estate: EstateInput(grossValue: 1000000000),
      heirs: [
        HeirInput(type: HeirType.son, count: 1),
        HeirInput(type: HeirType.brotherFull, count: 1),
      ],
      deceased: DeceasedInfo(gender: Gender.male),
    );

    expect(result.isSuccess, true);
    final brother = result.unwrap().shares
        .firstWhere((s) => s.heirType == HeirType.brotherFull);
    expect(brother.isBlocked, true);
    expect(brother.blockedBy, contains(HeirType.son));
  });

  test('E2: Father blocks grandfather', () {
    final result = computeInheritance(
      estate: EstateInput(grossValue: 1000000000),
      heirs: [
        HeirInput(type: HeirType.father, count: 1),
        HeirInput(type: HeirType.grandfatherPaternal, count: 1),
      ],
      deceased: DeceasedInfo(gender: Gender.male),
    );

    expect(result.isSuccess, true);
    final grandfather = result.unwrap().shares
        .firstWhere((s) => s.heirType == HeirType.grandfatherPaternal);
    expect(grandfather.isBlocked, true);
    expect(grandfather.blockedBy, contains(HeirType.father));
  });

  test('E3: Son blocks grandchildren', () {
    final result = computeInheritance(
      estate: EstateInput(grossValue: 1000000000),
      heirs: [
        HeirInput(type: HeirType.son, count: 1),
        HeirInput(type: HeirType.grandsonSon, count: 1),
      ],
      deceased: DeceasedInfo(gender: Gender.male),
    );

    expect(result.isSuccess, true);
    final grandson = result.unwrap().shares
        .firstWhere((s) => s.heirType == HeirType.grandsonSon);
    expect(grandson.isBlocked, true);
  });

  test('E6: Full brother blocks paternal siblings', () {
    final result = computeInheritance(
      estate: EstateInput(grossValue: 1000000000),
      heirs: [
        HeirInput(type: HeirType.brotherFull, count: 1),
        HeirInput(type: HeirType.brotherPaternal, count: 1),
      ],
      deceased: DeceasedInfo(gender: Gender.male),
    );

    expect(result.isSuccess, true);
    final paternalBrother = result.unwrap().shares
        .firstWhere((s) => s.heirType == HeirType.brotherPaternal);
    expect(paternalBrother.isBlocked, true);
  });
});
```

### Special Cases

```dart
group('Inheritance - Special Cases', () {
  test('SC-01: Umariyatayn (Husband + Father + Mother)', () {
    final result = computeInheritance(
      estate: EstateInput(grossValue: 600000000),
      heirs: [
        HeirInput(type: HeirType.husband, count: 1),
        HeirInput(type: HeirType.father, count: 1),
        HeirInput(type: HeirType.mother, count: 1),
      ],
      deceased: DeceasedInfo(gender: Gender.female),
    );

    expect(result.isSuccess, true);
    expect(result.unwrap().summary.specialCase, 'umariyatayn');

    // Husband: 1/2 = 300M
    // Mother: 1/3 of remainder (300M) = 100M
    // Father: remainder = 200M

    final mother = result.unwrap().shares
        .firstWhere((s) => s.heirType == HeirType.mother);
    expect(mother.totalValue, 100000000);
  });

  test('SC-02: Mushtarakah', () {
    final result = computeInheritance(
      estate: EstateInput(grossValue: 600000000),
      heirs: [
        HeirInput(type: HeirType.husband, count: 1),
        HeirInput(type: HeirType.mother, count: 1),
        HeirInput(type: HeirType.brotherUterine, count: 2),
        HeirInput(type: HeirType.brotherFull, count: 1),
      ],
      deceased: DeceasedInfo(gender: Gender.female),
    );

    expect(result.isSuccess, true);
    expect(result.unwrap().summary.specialCase, 'mushtarakah');

    // Husband: 1/2
    // Mother: 1/6
    // All siblings share 1/3 equally
  });

  test('SC-05: Sisters as Asabah Maal Ghayr', () {
    final result = computeInheritance(
      estate: EstateInput(grossValue: 1200000000),
      heirs: [
        HeirInput(type: HeirType.daughter, count: 1),
        HeirInput(type: HeirType.sisterFull, count: 2),
      ],
      deceased: DeceasedInfo(gender: Gender.male),
    );

    expect(result.isSuccess, true);
    expect(result.unwrap().summary.specialCase, 'sisters_maal_ghayr');

    // Daughter: 1/2 = 600M
    // Sisters: asabah maal ghayr = 1/2 = 600M (300M each)

    final sisters = result.unwrap().shares
        .firstWhere((s) => s.heirType == HeirType.sisterFull);
    expect(sisters.category, ShareCategory.asabah);
    expect(sisters.asabahType, AsabahType.maaGhayr);
  });

  test('SC-06: Completion of Two-Thirds', () {
    final result = computeInheritance(
      estate: EstateInput(grossValue: 600000000),
      heirs: [
        HeirInput(type: HeirType.daughter, count: 1),
        HeirInput(type: HeirType.granddaughterSon, count: 2),
        HeirInput(type: HeirType.father, count: 1),
      ],
      deceased: DeceasedInfo(gender: Gender.male),
    );

    expect(result.isSuccess, true);

    // Daughter: 1/2 = 300M
    // Granddaughters: 1/6 (to complete 2/3) = 100M
    // Father: 1/6 + asabah

    final granddaughters = result.unwrap().shares
        .firstWhere((s) => s.heirType == HeirType.granddaughterSon);
    expect(granddaughters.finalShare, Fraction(1, 6));
  });
});
```

### Aul Test Cases

```dart
group('Inheritance - Aul', () {
  test('Basic Aul case', () {
    // Husband (1/2) + 2 Sisters (2/3) = 7/6 > 1
    final result = computeInheritance(
      estate: EstateInput(grossValue: 700000000),
      heirs: [
        HeirInput(type: HeirType.husband, count: 1),
        HeirInput(type: HeirType.sisterFull, count: 2),
      ],
      deceased: DeceasedInfo(gender: Gender.female),
    );

    expect(result.isSuccess, true);
    expect(result.unwrap().summary.aulApplied, true);
    expect(result.unwrap().summary.aulOriginalDenominator, 6);
    expect(result.unwrap().summary.aulNewDenominator, 7);

    // Husband: 3/7 of 700M = 300M
    // Sisters: 4/7 of 700M = 400M (200M each)
  });

  test('Triple Aul case', () {
    // Husband (1/2) + Mother (1/3) + Sister (1/2) = 8/6 > 1
    final result = computeInheritance(
      estate: EstateInput(grossValue: 800000000),
      heirs: [
        HeirInput(type: HeirType.husband, count: 1),
        HeirInput(type: HeirType.mother, count: 1),
        HeirInput(type: HeirType.sisterFull, count: 1),
      ],
      deceased: DeceasedInfo(gender: Gender.female),
    );

    expect(result.isSuccess, true);
    expect(result.unwrap().summary.aulApplied, true);

    // Adjust to denominator 8
    // Husband: 3/8
    // Mother: 2/8
    // Sister: 3/8
  });
});
```

### Radd Test Cases

```dart
group('Inheritance - Radd', () {
  test('Radd to daughters', () {
    // Daughters (2/3), no asabah
    final result = computeInheritance(
      estate: EstateInput(grossValue: 900000000),
      heirs: [
        HeirInput(type: HeirType.daughter, count: 2),
      ],
      deceased: DeceasedInfo(gender: Gender.male),
    );

    expect(result.isSuccess, true);
    expect(result.unwrap().summary.raddApplied, true);

    // Daughters get full 900M (2/3 + 1/3 radd)
    final daughters = result.unwrap().shares
        .firstWhere((s) => s.heirType == HeirType.daughter);
    expect(daughters.totalValue, 900000000);
  });

  test('Radd excludes spouse', () {
    // Wife (1/4) + Daughter (1/2) = 3/4, remainder 1/4
    final result = computeInheritance(
      estate: EstateInput(grossValue: 400000000),
      heirs: [
        HeirInput(type: HeirType.wife, count: 1),
        HeirInput(type: HeirType.daughter, count: 1),
      ],
      deceased: DeceasedInfo(gender: Gender.male),
    );

    expect(result.isSuccess, true);
    // Wife stays at 1/4 (no radd)
    // Daughter gets 1/2 + 1/4 radd = 3/4

    final wife = result.unwrap().shares
        .firstWhere((s) => s.heirType == HeirType.wife);
    final daughter = result.unwrap().shares
        .firstWhere((s) => s.heirType == HeirType.daughter);

    expect(wife.totalValue, 100000000); // 1/4
    expect(daughter.totalValue, 300000000); // 3/4
  });
});
```

### Estate Deductions

```dart
group('Inheritance - Estate', () {
  test('Deductions order', () {
    final result = computeInheritance(
      estate: EstateInput(
        grossValue: 1000000000,
        funeralCosts: 50000000,
        debts: 100000000,
        wasiyyah: 200000000,
      ),
      heirs: [HeirInput(type: HeirType.son, count: 1)],
      deceased: DeceasedInfo(gender: Gender.male),
    );

    expect(result.isSuccess, true);
    final meta = result.unwrap().meta.estate;

    // Deduction order: funeral -> debts -> wasiyyah
    // After funeral: 950M
    // After debts: 850M
    // Max wasiyyah: 850M / 3 = 283.3M (200M allowed)
    // Net estate: 650M

    expect(meta.netEstate, 650000000);
    expect(meta.deductions.wasiyyahCapped, false);
  });

  test('Wasiyyah capped at 1/3', () {
    final result = computeInheritance(
      estate: EstateInput(
        grossValue: 300000000,
        wasiyyah: 200000000, // Requested 200M, but max is 100M
      ),
      heirs: [HeirInput(type: HeirType.son, count: 1)],
      deceased: DeceasedInfo(gender: Gender.male),
    );

    expect(result.isSuccess, true);
    final deductions = result.unwrap().meta.estate.deductions;

    expect(deductions.wasiyyah, 100000000); // Capped at 1/3
    expect(deductions.wasiyyahCapped, true);
  });
});
```

---

## 📱 Flutter Widget Examples

### Prayer Times Widget

```dart
class PrayerTimesWidget extends StatefulWidget {
  final Coordinates location;
  final String timezone;

  const PrayerTimesWidget({
    required this.location,
    required this.timezone,
  });

  @override
  State<PrayerTimesWidget> createState() => _PrayerTimesWidgetState();
}

class _PrayerTimesWidgetState extends State<PrayerTimesWidget> {
  late Result<PrayerTimesResult> _prayerTimes;
  late Result<NextPrayerInfo> _nextPrayer;

  @override
  void initState() {
    super.initState();
    _loadPrayerTimes();
  }

  void _loadPrayerTimes() {
    _prayerTimes = computePrayerTimes(
      location: widget.location,
      date: DateOnly.fromDateTime(DateTime.now()),
      timezone: widget.timezone,
      params: PrayerCalculationParams(method: CalculationMethods.kemenag),
    );

    _nextPrayer = getNextPrayer(
      location: widget.location,
      timezone: widget.timezone,
      params: PrayerCalculationParams(method: CalculationMethods.kemenag),
    );

    setState(() {});
  }

  @override
  Widget build(BuildContext context) {
    return switch (_prayerTimes) {
      Success(:final data) => Column(
        children: [
          if (_nextPrayer case Success(:final data))
            _NextPrayerCard(info: data),
          const SizedBox(height: 16),
          _PrayerTimesList(times: data.formatted),
        ],
      ),
      Failure(:final error) => Center(
        child: Text('Error: ${error.message}'),
      ),
    };
  }
}

class _NextPrayerCard extends StatelessWidget {
  final NextPrayerInfo info;

  const _NextPrayerCard({required this.info});

  @override
  Widget build(BuildContext context) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            Text(
              'Next Prayer',
              style: Theme.of(context).textTheme.titleMedium,
            ),
            Text(
              info.name.toString().toUpperCase(),
              style: Theme.of(context).textTheme.headlineLarge,
            ),
            Text(info.time),
            Text(formatMinutesUntil(info.minutesUntil)),
          ],
        ),
      ),
    );
  }
}
```

### Qibla Compass Widget

```dart
class QiblaCompassWidget extends StatefulWidget {
  final Coordinates location;

  const QiblaCompassWidget({required this.location});

  @override
  State<QiblaCompassWidget> createState() => _QiblaCompassWidgetState();
}

class _QiblaCompassWidgetState extends State<QiblaCompassWidget> {
  double? _qiblaBearing;
  double? _distance;

  @override
  void initState() {
    super.initState();
    _calculateQibla();
  }

  void _calculateQibla() {
    final result = computeQiblaDirection(
      coordinates: widget.location,
      includeDistance: true,
    );

    if (result case Success(:final data)) {
      setState(() {
        _qiblaBearing = data.bearing;
        _distance = data.meta.distance;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    if (_qiblaBearing == null) {
      return const CircularProgressIndicator();
    }

    return Column(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        // Compass with Qibla direction
        Transform.rotate(
          angle: -_qiblaBearing! * (pi / 180),
          child: Image.asset('assets/compass.png', width: 200),
        ),
        const SizedBox(height: 24),
        Text(
          '${_qiblaBearing!.toStringAsFixed(1)}°',
          style: Theme.of(context).textTheme.headlineMedium,
        ),
        if (_distance != null)
          Text('${_distance!.toStringAsFixed(0)} km to Kaaba'),
      ],
    );
  }
}
```

### Inheritance Calculator Form

```dart
class InheritanceCalculatorPage extends StatefulWidget {
  @override
  State<InheritanceCalculatorPage> createState() => _InheritanceCalculatorPageState();
}

class _InheritanceCalculatorPageState extends State<InheritanceCalculatorPage> {
  final _formKey = GlobalKey<FormState>();
  final _estateController = TextEditingController();
  final _heirs = <HeirInput>[];
  Gender _deceasedGender = Gender.male;
  Result<InheritanceResult>? _result;

  void _addHeir(HeirType type, int count) {
    setState(() {
      _heirs.add(HeirInput(type: type, count: count));
    });
  }

  void _calculate() {
    if (!_formKey.currentState!.validate()) return;

    final estate = double.tryParse(_estateController.text) ?? 0;

    final result = computeInheritance(
      estate: EstateInput(grossValue: estate),
      heirs: _heirs,
      deceased: DeceasedInfo(gender: _deceasedGender),
    );

    setState(() => _result = result);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Inheritance Calculator')),
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: Form(
          key: _formKey,
          child: ListView(
            children: [
              TextFormField(
                controller: _estateController,
                decoration: const InputDecoration(labelText: 'Total Estate'),
                keyboardType: TextInputType.number,
                validator: (v) => v!.isEmpty ? 'Required' : null,
              ),
              const SizedBox(height: 16),
              SegmentedButton<Gender>(
                segments: const [
                  ButtonSegment(value: Gender.male, label: Text('Male')),
                  ButtonSegment(value: Gender.female, label: Text('Female')),
                ],
                selected: {_deceasedGender},
                onSelectionChanged: (v) => setState(() => _deceasedGender = v.first),
              ),
              const SizedBox(height: 16),
              // Heir list...
              ElevatedButton(
                onPressed: _calculate,
                child: const Text('Calculate'),
              ),
              if (_result != null) ...[
                const SizedBox(height: 24),
                _InheritanceResultCard(result: _result!),
              ],
            ],
          ),
        ),
      ),
    );
  }
}
```

---

## ✅ Validation Checklist

### Prayer Times
- [ ] All 9 prayer times calculated
- [ ] 13 calculation methods working
- [ ] High latitude rules applied correctly
- [ ] Imsak before Fajr
- [ ] Dhuha between sunrise and Dhuhr
- [ ] Time ordering is logical
- [ ] Rounding rules applied
- [ ] Adjustments applied

### Qibla
- [ ] Bearing is 0-360 degrees
- [ ] Compass direction correct
- [ ] Distance calculation accurate
- [ ] At-Kaaba detection works

### Inheritance
- [ ] Estate deductions in correct order
- [ ] Wasiyyah capped at 1/3
- [ ] All 7 hijab rules working
- [ ] Furudh shares correct
- [ ] Asabah remainder distribution
- [ ] Aul adjustment when > 1
- [ ] Radd when < 1 and no asabah
- [ ] All 10 special cases handled
- [ ] Sum of shares = net estate
- [ ] Trace explainable

---

## 🔗 Reference Values

### Prayer Times (Jakarta, 15 Jan 2024)
| Prayer | Kemenag | MWL | ISNA |
|--------|---------|-----|------|
| Fajr | 04:24 | 04:20 | 04:32 |
| Sunrise | 05:48 | 05:48 | 05:48 |
| Dhuhr | 12:04 | 12:04 | 12:04 |
| Asr | 15:25 | 15:25 | 15:25 |
| Maghrib | 18:15 | 18:15 | 18:15 |
| Isha | 19:27 | 19:23 | 19:35 |

### Qibla Bearings
| City | Bearing | Compass |
|------|---------|---------|
| Jakarta | 295° | WNW |
| New York | 58° | ENE |
| London | 119° | ESE |
| Tokyo | 293° | WNW |
| Sydney | 278° | W |
