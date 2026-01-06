# Islamic Utilities Library

> Accurate and consistent Islamic utilities for prayer times, qibla direction, and inheritance calculation.

[![npm version](https://img.shields.io/npm/v/@azkal182/islamic-utils.svg)](https://www.npmjs.com/package/@azkal182/islamic-utils)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Features

✅ **Prayer Times** - Calculate 9 daily prayer times with 13+ calculation methods
✅ **Qibla Direction** - Calculate bearing and distance to Ka'bah
✅ **Inheritance (Faraidh)** - Complete Islamic inheritance calculator with 30+ heir types

## Installation

```bash
npm install @azkal182/islamic-utils
# or
pnpm add @azkal182/islamic-utils
# or
yarn add @azkal182/islamic-utils
```

## Quick Start

### Prayer Times

```typescript
import { computePrayerTimes, CALCULATION_METHODS } from '@azkal182/islamic-utils';

const result = computePrayerTimes(
  { latitude: -6.2088, longitude: 106.8456 }, // Jakarta
  { date: { year: 2024, month: 1, day: 15 }, timezone: 7 },
  { method: CALCULATION_METHODS.KEMENAG }
);

if (result.success) {
  console.log('Fajr:', result.data.formatted.fajr);    // "04:24"
  console.log('Maghrib:', result.data.formatted.maghrib); // "18:15"
}
```

### Qibla Direction

```typescript
import { computeQiblaDirection } from '@azkal182/islamic-utils';

const result = computeQiblaDirection({
  coordinates: { latitude: -6.2088, longitude: 106.8456 } // Jakarta
});

if (result.success) {
  console.log(`Qibla: ${result.data.bearing}°`);  // "295.15°"
  console.log(`Direction: ${result.data.compassDirection}`); // "WNW"
}
```

### Inheritance (Faraidh)

```typescript
import { computeInheritance, HeirType } from '@azkal182/islamic-utils';

const result = computeInheritance({
  estate: {
    grossValue: 1_000_000_000, // 1 Billion IDR
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

---

## Inheritance (Faraidh) Module

### Overview

Complete Islamic inheritance calculator implementing:

- **30+ Heir Types** - All Quranic and Sunnah-defined heirs
- **7 Hijab Rules** - Heir blocking/exclusion rules
- **10 Special Cases** - Including Umariyatayn, Mushtarakah, Akdariyyah
- **Aul & Radd** - Over-subscription and remainder handling
- **Wasiyyah Limits** - Automatic 1/3 cap enforcement

### Heir Types

#### Primary Heirs

| Category | Types |
|----------|-------|
| **Spouse** | `HUSBAND`, `WIFE` |
| **Parents** | `FATHER`, `MOTHER`, `GRANDFATHER_PATERNAL`, `GRANDMOTHER_MATERNAL`, `GRANDMOTHER_PATERNAL` |
| **Children** | `SON`, `DAUGHTER`, `GRANDSON_SON`, `GRANDDAUGHTER_SON` |
| **Siblings** | `BROTHER_FULL`, `SISTER_FULL`, `BROTHER_PATERNAL`, `SISTER_PATERNAL`, `BROTHER_UTERINE`, `SISTER_UTERINE` |

#### Extended Heirs

| Category | Types |
|----------|-------|
| **Nephews** | `NEPHEW_FULL`, `NEPHEW_PATERNAL` |
| **Uncles** | `UNCLE_FULL`, `UNCLE_PATERNAL` |
| **Cousins** | `COUSIN_FULL`, `COUSIN_PATERNAL` |

### Furudh (Fixed Shares)

| Share | Arabic | Recipients |
|-------|--------|------------|
| 1/2 | النصف | Husband (no child), Daughter (single), Full/Paternal Sister (single) |
| 1/4 | الربع | Husband (with child), Wife (no child) |
| 1/8 | الثمن | Wife (with child) |
| 1/3 | الثلث | Mother (no child, <2 siblings), Uterine Siblings (2+) |
| 1/6 | السدس | Father/Mother (with child), Grandmother, Granddaughter (with daughter) |
| 2/3 | الثلثان | Daughters (2+), Full/Paternal Sisters (2+) |

### Hijab (Blocking) Rules

| Blocker | Blocked Heirs |
|---------|---------------|
| Son/Daughter | Full/Paternal Brothers & Sisters |
| Father | Grandfather, All Siblings, Uncles, Nephews |
| Mother | All Grandmothers |
| Son | Grandsons, Granddaughters |
| Full Brother | Paternal Brothers & Sisters |
| Two Full Sisters | Paternal Sisters |

### Special Cases

| Case | Arabic | Condition |
|------|--------|-----------|
| Umariyatayn | العُمَرِيَّتَان | Spouse + Mother + Father, no descendant |
| Mushtarakah | المُشْتَرَكَة | Husband + Mother + Uterine Siblings (2+) + Full Siblings |
| Akdariyyah | الأكدرية | Husband + Mother + Grandfather + 1 Full Sister |
| Sisters Maal Ghayr | - | Daughter + Sisters, no son |
| Completion 2/3 | - | 1 Daughter + Granddaughters |

### Estate Deductions

```typescript
const result = computeInheritance({
  estate: {
    grossValue: 1_000_000_000,
    funeralCosts: 50_000_000,    // Deducted first
    debts: 100_000_000,          // Deducted second
    wasiyyah: 200_000_000,       // Max 1/3 of remainder (after debts)
    wasiyyahApprovedByHeirs: false, // If true, wasiyyah can exceed 1/3
  },
  // ...
});
```

### Trace Mode

For debugging and verification:

```typescript
const result = computeInheritance(
  { estate: {...}, heirs: [...], deceased: {...} },
  { enableTrace: true }
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
  getHeirCategory
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
    { type: HeirType.SON, count: 2 },
    { type: HeirType.DAUGHTER, count: 1 },
  ],
  deceased: { gender: 'male' },
});

if (result.success) {
  const data = result.data;

  console.log('Estate Summary:');
  console.log(`  Gross: ${data.grossEstate}`);
  console.log(`  Net:   ${data.netEstate}`);

  console.log('\nHeir Shares:');
  for (const share of data.shares) {
    if (share.isBlocked) {
      console.log(`  ${share.heirType}: BLOCKED`);
    } else {
      console.log(`  ${share.heirType} (${getHeirArabicName(share.heirType)})`);
      console.log(`    Share: ${share.shareDescription}`);
      console.log(`    Value: ${share.totalValue}`);
    }
  }

  console.log('\nSummary:');
  console.log(`  Aul Applied: ${data.summary.aulApplied}`);
  console.log(`  Radd Applied: ${data.summary.raddApplied}`);
  console.log(`  Special Case: ${data.summary.specialCase || 'None'}`);
  console.log(`  Valid: ${data.verification.isValid}`);
}
```

---

## Prayer Times Module

### 9 Prayer Times

| Time | Description |
|------|-------------|
| `imsak` | Time to stop eating before Fajr |
| `fajr` | Dawn prayer |
| `sunrise` | Sunrise (Isyraq) |
| `dhuha_start` | Start of Dhuha prayer window |
| `dhuha_end` | End of Dhuha prayer window |
| `dhuhr` | Noon prayer |
| `asr` | Afternoon prayer |
| `maghrib` | Sunset prayer |
| `isha` | Night prayer |

### 13 Calculation Methods

| Method | Fajr Angle | Isha | Region |
|--------|------------|------|--------|
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

### Asr Calculation

```typescript
import { AsrMadhhab } from '@azkal182/islamic-utils';

// Standard (Shafi'i, Maliki, Hanbali): shadow = 1× object length
{ asrMadhhab: AsrMadhhab.STANDARD }

// Hanafi: shadow = 2× object length
{ asrMadhhab: AsrMadhhab.HANAFI }
```

### High Latitude Handling

For locations above ~48.5° latitude:

```typescript
import { HighLatitudeRule } from '@azkal182/islamic-utils';

{ highLatitudeRule: HighLatitudeRule.MIDDLE_OF_NIGHT } // Default
{ highLatitudeRule: HighLatitudeRule.ONE_SEVENTH }
{ highLatitudeRule: HighLatitudeRule.ANGLE_BASED }
```

---

## Qibla Direction Module

### Basic Usage

```typescript
const result = computeQiblaDirection({
  coordinates: { latitude: -6.2088, longitude: 106.8456 }
});

// result.data.bearing = 295.15 (degrees from true north)
// result.data.compassDirection = 'WNW'
```

### With Distance

```typescript
const result = computeQiblaDirection(
  { coordinates: { latitude: -6.2088, longitude: 106.8456 } },
  { includeDistance: true }
);

// result.data.meta.distance = 7920.14 (km to Makkah)
```

---

## Design Principles

- **Language-Agnostic**: Pure algorithms without platform dependencies
- **Deterministic**: Same input always produces same output
- **Explainable**: Results include optional trace for verification
- **Modular**: Each module can be used independently
- **No I/O**: All external data provided by the caller

## Performance

| Module | Operation | ops/sec |
|--------|-----------|--------|
| Prayer Times | Single calculation | ~97,500 |
| Prayer Times | Year (365 days) | ~264 |
| Qibla | Single calculation | ~500,000+ |
| Inheritance | Single calculation | ~50,000+ |

## Examples

See [examples/](./examples/) for complete usage examples:

- [prayer-times.ts](./examples/prayer-times.ts) - Prayer Times features
- [qibla.ts](./examples/qibla.ts) - Qibla Direction features
- [inheritance.ts](./examples/inheritance.ts) - Inheritance (Faraidh) features

## License

MIT
