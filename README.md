# Islamic Utilities Library

> Accurate and consistent Islamic utilities for prayer times, qibla direction, and inheritance calculation.

[![npm version](https://img.shields.io/npm/v/@azkal182/islamic-utils.svg)](https://www.npmjs.com/package/@azkal182/islamic-utils)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)

## ✨ Features

| Module | Status | Description |
|--------|--------|-------------|
| 🕌 **Prayer Times** | ✅ Complete | 9 prayer times with 13+ calculation methods |
| 🧭 **Qibla Direction** | ✅ Complete | Bearing and distance to Ka'bah |
| 📜 **Inheritance (Faraidh)** | ✅ Complete | 30+ heir types, hijab, aul, radd, special cases |
| 🗓️ **Hijri Calendar** | ✅ Complete | Gregorian ↔ Hijri conversion, monthly calendar, adjustments |

## 📦 Installation

```bash
npm install @azkal182/islamic-utils
# or
pnpm add @azkal182/islamic-utils
# or
yarn add @azkal182/islamic-utils
```

## 🚀 Quick Start

### Prayer Times

```typescript
import { computePrayerTimes, CALCULATION_METHODS } from '@azkal182/islamic-utils';

const result = computePrayerTimes(
  { latitude: -6.2088, longitude: 106.8456 }, // Jakarta
  { date: { year: 2024, month: 1, day: 15 }, timezone: 7 },
  { method: CALCULATION_METHODS.KEMENAG }
);

if (result.success) {
  console.log('Fajr:', result.data.formatted.fajr);       // "04:24"
  console.log('Maghrib:', result.data.formatted.maghrib); // "18:15"
}
```

### Qibla Direction

```typescript
import { computeQiblaDirection } from '@azkal182/islamic-utils';

const result = computeQiblaDirection({
  coordinates: { latitude: -6.2088, longitude: 106.8456 }
});

if (result.success) {
  console.log(`Qibla: ${result.data.bearing}°`);          // "295.15°"
  console.log(`Direction: ${result.data.compassDirection}`); // "WNW"
}
```

### Inheritance (Faraidh)

```typescript
import { computeInheritance, HeirType } from '@azkal182/islamic-utils';

const result = computeInheritance({
  estate: {
    grossValue: 1_000_000_000,
    debts: 50_000_000,
    wasiyyah: 100_000_000,
  },
  heirs: [
    { type: HeirType.WIFE, count: 1 },
    { type: HeirType.SON, count: 2 },
    { type: HeirType.DAUGHTER, count: 1 },
  ],
  deceased: { gender: 'male' },
});

if (result.success) {
  console.log(`Net Estate: ${result.data.netEstate}`);
  for (const share of result.data.shares) {
    console.log(`${share.heirType}: ${share.totalValue}`);
  }
}
```

### Hijri Calendar

```typescript
import { computeHijriDate } from '@azkal182/islamic-utils/hijri-calendar';

const result = computeHijriDate(
  { date: { year: 2025, month: 3, day: 15 } },
  { method: 'ummul_qura' }
);

if (result.success) {
  console.log(result.data.hijri);
}
```

---

## 🕌 Prayer Times Module

### Overview

Calculate 9 daily prayer times with support for:
- **13+ calculation methods** from major Islamic organizations
- **High latitude handling** for regions above 48.5°
- **Asr madhhab options** (Standard/Hanafi)
- **Time adjustments** and rounding options
- **Trace mode** for debugging

### 9 Prayer Times

| Time | Arabic | Description |
|------|--------|-------------|
| `imsak` | الإمساك | Time to stop eating before Fajr |
| `fajr` | الفجر | Dawn prayer |
| `sunrise` | الشروق | Sunrise (Isyraq) |
| `dhuha_start` | بداية الضحى | Start of Dhuha window |
| `dhuha_end` | نهاية الضحى | End of Dhuha window |
| `dhuhr` | الظهر | Noon prayer |
| `asr` | العصر | Afternoon prayer |
| `maghrib` | المغرب | Sunset prayer |
| `isha` | العشاء | Night prayer |

### 13 Calculation Methods

| Method | Fajr | Isha | Region |
|--------|------|------|--------|
| `MWL` | 18° | 17° | Muslim World League |
| `ISNA` | 15° | 15° | North America |
| `EGYPT` | 19.5° | 17.5° | Egypt, Africa |
| `MAKKAH` | 18.5° | 90 min | Saudi Arabia |
| `KARACHI` | 18° | 18° | Pakistan, India |
| `TEHRAN` | 17.7° | 14° | Iran |
| `JAKIM` | 20° | 18° | Malaysia |
| `SINGAPORE` | 20° | 18° | Singapore |
| `KEMENAG` | 20° | 18° | Indonesia |
| `DIYANET` | 18° | 17° | Turkey |
| `UOIF` | 12° | 12° | France |
| `KUWAIT` | 18° | 17.5° | Kuwait |
| `QATAR` | 18° | 90 min | Qatar |

### Advanced Options

```typescript
import {
  computePrayerTimes,
  CALCULATION_METHODS,
  AsrMadhhab,
  HighLatitudeRule,
  PrayerRoundingRule
} from '@azkal182/islamic-utils';

const result = computePrayerTimes(
  { latitude: 59.3293, longitude: 18.0686 }, // Stockholm
  { date: { year: 2024, month: 6, day: 21 }, timezone: 2 },
  {
    method: CALCULATION_METHODS.MWL,
    asrMadhhab: AsrMadhhab.HANAFI,           // Hanafi Asr calculation
    highLatitudeRule: HighLatitudeRule.MIDDLE_OF_NIGHT,
  },
  {
    includeTrace: true,                       // Debug trace
  }
);
```

### Asr Calculation Methods

| Method | Shadow Factor | Used By |
|--------|---------------|---------|
| `AsrMadhhab.STANDARD` | 1× object length | Shafi'i, Maliki, Hanbali |
| `AsrMadhhab.HANAFI` | 2× object length | Hanafi |

### High Latitude Rules

For locations above ~48.5° where sun may not reach required angles:

| Rule | Description |
|------|-------------|
| `NONE` | Return null if time cannot be calculated |
| `MIDDLE_OF_NIGHT` | Split night from Maghrib to Fajr |
| `ONE_SEVENTH` | Night portion = 1/7 of total night |
| `ANGLE_BASED` | Proportional to angle vs night duration |

### Monthly Prayer Times

Calculate prayer times for an entire month with a single function call:

```typescript
import { computeMonthlyPrayerTimes, CALCULATION_METHODS } from '@azkal182/islamic-utils';

const result = computeMonthlyPrayerTimes({
  year: 2024,
  month: 3,  // March
  location: { latitude: -6.2088, longitude: 106.8456 },
  timezone: 7,
  params: { method: CALCULATION_METHODS.KEMENAG },
});

if (result.success) {
  // Access all days
  console.log(`Days in month: ${result.data.meta.daysInMonth}`);

  // Iterate through each day
  for (const day of result.data.days) {
    console.log(`Day ${day.day}: Fajr ${day.formatted.fajr}, Maghrib ${day.formatted.maghrib}`);
  }

  // Access specific day (0-indexed)
  const day15 = result.data.days[14]; // Day 15
  console.log(`Day 15 Fajr: ${day15.formatted.fajr}`);
}
```

**Return Type:**

```typescript
interface MonthlyPrayerTimesResult {
  days: Array<{
    day: number;           // 1-31
    date: DateOnly;        // { year, month, day }
    times: PrayerTimes;    // Fractional hours
    formatted: PrayerTimeStrings; // "HH:MM" format
  }>;
  meta: {
    year: number;
    month: number;
    daysInMonth: number;
    isLeapYear: boolean;
    location: LocationInput;
    timezone: Timezone;
    method: CalculationMethod;
  };
}
```

### Next Prayer Time

Determine the next upcoming prayer based on current time:

```typescript
import {
  getNextPrayer,
  getCurrentPrayer,
  formatMinutesUntil,
  CALCULATION_METHODS
} from '@azkal182/islamic-utils';

// Simple API - calculates everything automatically!
const result = getNextPrayer(
  { latitude: -6.2088, longitude: 106.8456 },
  'Asia/Jakarta',
  { method: CALCULATION_METHODS.KEMENAG }
  // currentTime defaults to new Date()
);

if (result.success) {
  console.log(`Next: ${result.data.name}`);                    // "maghrib"
  console.log(`Time: ${result.data.time}`);                    // "18:07"
  console.log(`In: ${formatMinutesUntil(result.data.minutesUntil)}`);  // "1h 30m"

  if (result.data.isNextDay) {
    console.log('(Tomorrow)');
  }

  // Prayer times are included in the result
  console.log(result.data.prayerTimes.formatted);
}

// Get current prayer period
const current = getCurrentPrayer(
  { latitude: -6.2088, longitude: 106.8456 },
  'Asia/Jakarta',
  { method: CALCULATION_METHODS.KEMENAG }
);

if (current.success && current.data.current) {
  console.log(`Current period: ${current.data.current}`);    // "asr"
}
```

**Return Types:**

```typescript
interface NextPrayerInfo {
  name: PrayerName;           // "maghrib"
  time: string;               // "18:07"
  timeNumeric: number;        // 18.12 (fractional hours)
  minutesUntil: number;       // 90
  isNextDay: boolean;         // true if past Isha
  prayerTimes: PrayerTimesResult;  // Full prayer times for today
}

interface CurrentPrayerInfo {
  current: PrayerName | null;  // Current prayer period
  previous: PrayerName | null; // Previous prayer
  prayerTimes: PrayerTimesResult;
}
```

### Timezone Support

All functions support both **IANA timezone names** and **UTC offsets**:

```typescript
// IANA timezone (recommended) - handles DST automatically
timezone: 'Asia/Jakarta'
timezone: 'America/New_York'
timezone: 'Europe/London'

// UTC offset (simple)
timezone: 7     // UTC+7
timezone: -5    // UTC-5
timezone: 5.5   // UTC+5:30 (India)
```

---


## 🧭 Qibla Direction Module

### Overview

Calculate the direction (bearing) from any location on Earth to the Ka'bah in Makkah using great circle navigation.

### Basic Usage

```typescript
import { computeQiblaDirection } from '@azkal182/islamic-utils';

const result = computeQiblaDirection({
  coordinates: { latitude: -6.2088, longitude: 106.8456 } // Jakarta
});

if (result.success) {
  console.log(`Bearing: ${result.data.bearing}°`);           // 295.15
  console.log(`Compass: ${result.data.compassDirection}`);   // "WNW"
}
```

### With Distance Calculation

```typescript
const result = computeQiblaDirection(
  { coordinates: { latitude: -6.2088, longitude: 106.8456 } },
  { includeDistance: true, includeTrace: true }
);

if (result.success) {
  console.log(`Distance: ${result.data.meta.distance} km`); // 7920.14
  console.log(`At Ka'bah: ${result.data.meta.atKaaba}`);    // false
}
```

### 16-Point Compass Directions

The module returns compass directions: `N`, `NNE`, `NE`, `ENE`, `E`, `ESE`, `SE`, `SSE`, `S`, `SSW`, `SW`, `WSW`, `W`, `WNW`, `NW`, `NNW`

### Great Circle Utilities

```typescript
import {
  calculateInitialBearing,
  calculateFinalBearing,
  calculateGreatCircleDistance,
  calculateMidpoint
} from '@azkal182/islamic-utils';

// Calculate bearing between two points
const bearing = calculateInitialBearing(
  { latitude: -6.2, longitude: 106.8 },
  { latitude: 21.4, longitude: 39.8 }
);
```

---

## 📜 Inheritance (Faraidh) Module

### Overview

Complete Islamic inheritance calculator implementing classical fiqh rules:

- **30+ Heir Types** - All Quranic and Sunnah-defined heirs
- **7 Hijab Rules** - Heir blocking/exclusion rules
- **10 Special Cases** - Including Umariyatayn, Mushtarakah, Akdariyyah
- **Aul & Radd** - Over-subscription and remainder handling
- **Wasiyyah Limits** - Automatic 1/3 cap enforcement
- **Fraction Utilities** - Precise calculations without floating-point errors

### Heir Types (30+)

#### Primary Heirs (Ashab al-Furudh & Asabah)

| Category | Types | Arabic |
|----------|-------|--------|
| **Spouse** | `HUSBAND`, `WIFE` | الزوج، الزوجة |
| **Parents** | `FATHER`, `MOTHER` | الأب، الأم |
| **Grandparents** | `GRANDFATHER_PATERNAL`, `GRANDMOTHER_MATERNAL`, `GRANDMOTHER_PATERNAL` | الجد، الجدة |
| **Children** | `SON`, `DAUGHTER` | الابن، البنت |
| **Grandchildren** | `GRANDSON_SON`, `GRANDDAUGHTER_SON` | ابن الابن، بنت الابن |

#### Siblings

| Type | Arabic | Description |
|------|--------|-------------|
| `BROTHER_FULL` | الأخ الشقيق | Same father and mother |
| `SISTER_FULL` | الأخت الشقيقة | Same father and mother |
| `BROTHER_PATERNAL` | الأخ لأب | Same father only |
| `SISTER_PATERNAL` | الأخت لأب | Same father only |
| `BROTHER_UTERINE` | الأخ لأم | Same mother only |
| `SISTER_UTERINE` | الأخت لأم | Same mother only |

#### Extended Asabah

| Category | Types |
|----------|-------|
| **Nephews** | `NEPHEW_FULL`, `NEPHEW_PATERNAL` |
| **Uncles** | `UNCLE_FULL`, `UNCLE_PATERNAL` |
| **Cousins** | `COUSIN_FULL`, `COUSIN_PATERNAL` |

### Fixed Shares (Furudh)

| Share | Arabic | Recipients |
|-------|--------|------------|
| **1/2** (النصف) | Husband (no child), Single daughter, Single full/paternal sister |
| **1/4** (الربع) | Husband (with child), Wife (no child) |
| **1/8** (الثمن) | Wife (with child) |
| **1/3** (الثلث) | Mother (no child, <2 siblings), 2+ uterine siblings |
| **1/6** (السدس) | Father (with child), Mother (with child), Grandmother, Granddaughters with daughter |
| **2/3** (الثلثان) | 2+ daughters, 2+ full/paternal sisters |

### Asabah (Residuary Heirs)

| Type | Arabic | Description |
|------|--------|-------------|
| **Asabah bi Nafs** | عصبة بالنفس | Male heirs who take remainder alone |
| **Asabah bil Ghayr** | عصبة بالغير | Females with male siblings (2:1 ratio) |
| **Asabah maal Ghayr** | عصبة مع الغير | Sisters with daughters |

### Hijab (Blocking) Rules

7 total exclusion rules implemented:

| Rule | Blocker | Blocked Heirs |
|------|---------|---------------|
| E1 | Son/Daughter | All siblings |
| E2 | Father | Grandfather, all siblings, uncles, nephews, cousins |
| E3 | Son | Grandsons, Granddaughters |
| E4 | Mother | Maternal grandmother |
| E5 | Father | Paternal grandmother |
| E6 | Full brother | Paternal siblings |
| E7 | Paternal brother | Nephews |

### Special Cases (10)

| Case | Arabic | Condition |
|------|--------|-----------|
| **Umariyatayn** | العُمَرِيَّتَان | Spouse + Mother + Father, no descendant |
| **Mushtarakah** | المُشْتَرَكَة | Husband + Mother + 2+ uterine siblings + full siblings |
| **Akdariyyah** | الأكدرية | Husband + Mother + Grandfather + 1 full sister |
| **Maal Ghayr** | عصبة مع الغير | Daughter(s) + sisters (no son) |
| **Completion 2/3** | تكملة الثلثين | 1 daughter + granddaughters |

### Estate Deductions

Deductions are applied in Islamic order:

```typescript
const result = computeInheritance({
  estate: {
    grossValue: 1_000_000_000,     // Total harta
    funeralCosts: 50_000_000,      // 1. Biaya jenazah (first)
    debts: 100_000_000,            // 2. Hutang (second)
    wasiyyah: 200_000_000,         // 3. Wasiat (max 1/3 of remainder)
    wasiyyahApprovedByHeirs: false, // If true, wasiyyah can exceed 1/3
    currency: 'IDR',
  },
  heirs: [...],
  deceased: { gender: 'male' },
});
```

### Trace Mode

For debugging and verification:

```typescript
const result = computeInheritance(
  { estate: {...}, heirs: [...], deceased: {...} },
  { includeTrace: true }
);

if (result.success) {
  for (const step of result.data.trace) {
    console.log(`[${step.phase}] ${step.description}`);
    if (step.arabicTerm) console.log(`  Arabic: ${step.arabicTerm}`);
  }
}
```

### Full Example

```typescript
import {
  computeInheritance,
  HeirType,
  getHeirArabicName,
} from '@azkal182/islamic-utils';

const result = computeInheritance({
  estate: {
    grossValue: 600_000_000,
    debts: 50_000_000,
    wasiyyah: 50_000_000,
  },
  heirs: [
    { type: HeirType.WIFE, count: 1 },
    { type: HeirType.FATHER, count: 1 },
    { type: HeirType.MOTHER, count: 1 },
    { type: HeirType.SON, count: 1 },
    { type: HeirType.DAUGHTER, count: 2 },
  ],
  deceased: { gender: 'male' },
});

if (result.success) {
  const data = result.data;

  console.log('=== Estate Summary ===');
  console.log(`Gross Value: ${data.meta.estate.grossValue}`);
  console.log(`Net Estate:  ${data.netEstate}`);

  console.log('\n=== Heir Shares ===');
  for (const share of data.shares) {
    if (share.isBlocked) {
      console.log(`${share.heirType}: BLOCKED by ${share.blockedBy}`);
    } else {
      const arabic = getHeirArabicName(share.heirType);
      console.log(`${share.heirType} (${arabic})`);
      console.log(`  Category: ${share.category}`);
      console.log(`  Total: ${share.totalValue}`);
      console.log(`  Per Person: ${share.perPersonValue}`);
    }
  }

  console.log('\n=== Summary ===');
  console.log(`Aul Applied: ${data.summary.aulApplied}`);
  console.log(`Radd Applied: ${data.summary.raddApplied}`);
  console.log(`Special Case: ${data.summary.specialCase || 'None'}`);
  console.log(`Valid: ${data.verification.isValid}`);
}
```

---

## 🎯 Result Pattern

All library functions return a `Result<T>` type (similar to Rust):

```typescript
type Result<T> = SuccessResult<T> | ErrorResult;

interface SuccessResult<T> {
  success: true;
  data: T;
  trace?: TraceStep[];
}

interface ErrorResult {
  success: false;
  error: LibraryError;
  trace?: TraceStep[];
}
```

### Usage

```typescript
const result = computePrayerTimes(...);

if (result.success) {
  // TypeScript knows result.data exists
  console.log(result.data.times.fajr);
} else {
  // TypeScript knows result.error exists
  console.error(result.error.message);
}

// Or use utility functions
import { unwrap, unwrapOr, isSuccess, isError } from '@azkal182/islamic-utils';

const data = unwrap(result);              // Throws on error
const data = unwrapOr(result, fallback);  // Returns fallback on error
```

---

## 📊 Performance

| Module | Operation | Speed |
|--------|-----------|-------|
| Prayer Times | Single calculation | ~97,500 ops/sec |
| Prayer Times | Year (365 days) | ~264 ops/sec |
| Qibla | Single calculation | ~500,000+ ops/sec |
| Inheritance | Simple case | ~50,000+ ops/sec |
| Inheritance | Complex case | ~25,000+ ops/sec |

---

## 🎨 Design Principles

- **Language-Agnostic** - Pure algorithms without platform dependencies
- **Deterministic** - Same input always produces same output
- **Explainable** - Results include optional trace for verification
- **Modular** - Each module can be used independently
- **No I/O** - All external data provided by the caller
- **Type-Safe** - Full TypeScript support with strict types

---

## 🗺️ Roadmap

### ✅ Completed (v0.2.0)

- Prayer Times with 13 methods
- Qibla Direction with great circle navigation
- Inheritance (Faraidh) with 30+ heir types
- Hijab, Furudh, Asabah, Aul, Radd rules
- Special cases (Umariyatayn, Mushtarakah)
- TypeDoc API documentation
- Performance benchmarks

### 🔜 Planned Features

| Feature | Description | Priority |
|---------|-------------|----------|
| **Gono Gini** | Marital property (harta bersama) calculation before inheritance | High |
| **Dhawil Arham** | Complete distant relative distribution | Medium |
| **Grandfather Competition** | Full grandfather with siblings calculation | Medium |
| **Hijri Calendar** | Hijri date conversion and calculation | Medium |
| **Zakat Calculator** | Zakat calculation for various assets | Low |
| **Fasting Calendar** | Ramadan and voluntary fasting calculator | Low |

### 🔜 Gono Gini (Planned)

Support for Indonesian marital property law:

```typescript
// Future API (planned)
const result = computeInheritance({
  estate: {
    jointProperty: 600_000_000,    // Harta bersama (gono gini)
    separateProperty: 400_000_000, // Harta bawaan mayit
    // ...
  },
  // ...
});

// Joint property split 50:50 before inheritance
// Survivor gets: 300M (their half)
// Inheritance: 300M + 400M = 700M
```

---

## 📁 Examples

See [examples/](./examples/) for complete usage examples:

- [prayer-times.ts](./examples/prayer-times.ts) - Prayer Times features
- [qibla.ts](./examples/qibla.ts) - Qibla Direction features
- [inheritance.ts](./examples/inheritance.ts) - Inheritance (Faraidh) features

Run examples:
```bash
pnpm run example:prayer-times
pnpm run example:qibla
pnpm run example:inheritance
```

---

## 📖 API Documentation

Full API documentation generated with TypeDoc:

```bash
pnpm run docs
```

Documentation is generated at `docs/api/`.

---

## 🧪 Testing

```bash
pnpm test           # Run tests in watch mode
pnpm test:run       # Run tests once
pnpm test:coverage  # Run with coverage
pnpm bench          # Run benchmarks
```

---

## 📄 License

MIT © 2024

---

## 🤝 Contributing

Contributions are welcome! Please read the [Contributing Guide](./CONTRIBUTING.md) for details.

## 🙏 Acknowledgments

- Islamic calculation methods from major organizations worldwide
- Classical fiqh sources for inheritance rules
