# Islamic Utilities Library

> Accurate and consistent Islamic utilities for prayer times, qibla direction, and inheritance calculation.

[![npm version](https://img.shields.io/npm/v/islamic-utils.svg)](https://www.npmjs.com/package/islamic-utils)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Features

✅ **Prayer Times** - Calculate 9 daily prayer times with 13+ calculation methods
✅ **Qibla Direction** - Calculate bearing and distance to Ka'bah
⏳ **Inheritance (Faraidh)** - Coming soon

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
import { computePrayerTimes, CALCULATION_METHODS } from 'islamic-utils';

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
import { computeQiblaDirection } from 'islamic-utils';

const result = computeQiblaDirection({
  coordinates: { latitude: -6.2088, longitude: 106.8456 } // Jakarta
});

if (result.success) {
  console.log(`Qibla: ${result.data.bearing}°`);  // "295.15°"
  console.log(`Direction: ${result.data.compassDirection}`); // "WNW"
}
```

## Prayer Times

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
import { AsrMadhhab } from 'islamic-utils';

// Standard (Shafi'i, Maliki, Hanbali): shadow = 1× object length
{ asrMadhhab: AsrMadhhab.STANDARD }

// Hanafi: shadow = 2× object length
{ asrMadhhab: AsrMadhhab.HANAFI }
```

### High Latitude Handling

For locations above ~48.5° latitude where Fajr/Isha may not be calculable:

```typescript
import { HighLatitudeRule } from 'islamic-utils';

{ highLatitudeRule: HighLatitudeRule.MIDDLE_OF_NIGHT } // Default
{ highLatitudeRule: HighLatitudeRule.ONE_SEVENTH }
{ highLatitudeRule: HighLatitudeRule.ANGLE_BASED }
```

### Advanced Options

```typescript
const result = computePrayerTimes(
  location,
  timeContext,
  {
    method: CALCULATION_METHODS.KEMENAG,
    asrMadhhab: AsrMadhhab.STANDARD,
    highLatitudeRule: HighLatitudeRule.MIDDLE_OF_NIGHT,

    // Custom Imsak rule (default: 10 min before Fajr)
    imsakRule: { type: 'minutes_before_fajr', value: 10 },

    // Custom Dhuha rule
    dhuhaRule: {
      start: { type: 'minutes_after_sunrise', value: 15 },
      end: { type: 'minutes_before_dhuhr', value: 1 },
    },

    // Manual adjustments (in minutes)
    adjustments: { fajr: 2, maghrib: -1 },

    // Safety buffer (ihtiyath)
    safetyBuffer: 2,

    // Rounding: 'none', 'nearest', 'ceil', 'floor'
    roundingRule: PrayerRoundingRule.NEAREST,
  }
);
```

### Trace Mode

For debugging and verification:

```typescript
const result = computePrayerTimes(
  location,
  timeContext,
  params,
  { includeTrace: true }
);

if (result.success) {
  result.data.trace?.forEach(step => {
    console.log(`Step ${step.step}: ${step.description}`);
  });
}
```

## Qibla Direction

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

### Compass Directions

16-point compass rose: N, NNE, NE, ENE, E, ESE, SE, SSE, S, SSW, SW, WSW, W, WNW, NW, NNW

## Performance

| Module | Operation | ops/sec |
|--------|-----------|--------|
| Prayer Times | Single calculation | ~97,500 |
| Prayer Times | Year (365 days) | ~264 |
| Qibla | Single calculation | ~500,000+ |

## Design Principles

- **Language-Agnostic**: Pure algorithms without platform dependencies
- **Deterministic**: Same input always produces same output
- **Explainable**: Results include optional trace for verification
- **Modular**: Each module can be used independently
- **No I/O**: All external data provided by the caller

## API Reference

Full API documentation available at [docs/api](./docs/api).

## Examples

See [examples/](./examples/) for complete usage examples:
- [prayer-times.ts](./examples/prayer-times.ts) - All Prayer Times features
- [qibla.ts](./examples/qibla.ts) - Qibla Direction features

## License

MIT
