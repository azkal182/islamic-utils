# Phase A - Prayer Times (Jadwal Sholat)

> **Estimasi:** 5-7 hari
> **Prioritas:** 🟢 High
> **Dependency:** Phase 0 (Core)

---

## 📋 Overview

Modul ini menghitung waktu sholat harian berdasarkan:
- Astronomi matahari
- Aturan fikih
- Parameter yang dapat dikustom

**Waktu yang WAJIB didukung:**
1. Imsak
2. Fajr (Subuh)
3. Sunrise (Terbit Matahari)
4. Dhuha
5. Dhuhr (Zuhur)
6. Asr
7. Maghrib
8. Isha

> ⚠️ **PENTING:** Imsak dan Dhuha adalah **bagian inti modul**, bukan fitur tambahan.

---

## 🎯 Objectives

1. ✅ Menghitung 8 waktu sholat untuk lokasi dan tanggal tertentu
2. ✅ Mendukung multiple calculation methods
3. ✅ Mendukung high latitude rules
4. ✅ Adjustments dan safety buffer
5. ✅ Explainable output (trace)

---

## 📝 Tasks

### Task A.1 - Prayer Times Types

**Deskripsi:** Definisikan semua types khusus Prayer Times.

**Files:**
- `src/prayer-times/types.ts`

**Type Definitions:**

```typescript
// Waktu sholat
export enum PrayerName {
  IMSAK = 'imsak',
  FAJR = 'fajr',
  SUNRISE = 'sunrise',
  DHUHA_START = 'dhuha_start',
  DHUHA_END = 'dhuha_end',
  DHUHR = 'dhuhr',
  ASR = 'asr',
  MAGHRIB = 'maghrib',
  ISHA = 'isha',
}

// Madzhab Asr
export enum AsrMadhhab {
  STANDARD = 'standard',  // Syafi'i / Maliki / Hanbali (shadow = 1)
  HANAFI = 'hanafi',      // shadow = 2
}

// High Latitude Rule
export enum HighLatitudeRule {
  NONE = 'none',
  MIDDLE_OF_NIGHT = 'middle_of_night',
  ONE_SEVENTH = 'one_seventh',
  ANGLE_BASED = 'angle_based',
}

// Rounding Rule
export enum RoundingRule {
  NONE = 'none',
  NEAREST_MINUTE = 'nearest',
  CEIL_MINUTE = 'ceil',
  FLOOR_MINUTE = 'floor',
}

// Imsak Rule
export interface ImsakRule {
  type: 'minutes_before_fajr' | 'angle_based';
  value: number;  // minutes or angle
}

// Dhuha Rule
export interface DhuhaRule {
  start: {
    type: 'minutes_after_sunrise' | 'sun_altitude';
    value: number;
  };
  end: {
    type: 'minutes_before_dhuhr';
    value: number;  // default: 0 (exactly at solar noon)
  };
}

// Input Parameters
export interface PrayerCalculationParams {
  method: CalculationMethod;
  asrMadhhab: AsrMadhhab;
  highLatitudeRule?: HighLatitudeRule;
  imsakRule?: ImsakRule;
  dhuhaRule?: DhuhaRule;
  roundingRule?: RoundingRule;
  adjustments?: Partial<Record<PrayerName, number>>;
  safetyBuffer?: number | Partial<Record<PrayerName, number>>;
}

// Calculation Method
export interface CalculationMethod {
  name: string;
  fajrAngle: number;
  ishaAngle?: number;
  ishaIntervalMinutes?: number;
  maghribAngle?: number;
}

// Output
export interface PrayerTimesResult {
  times: Record<PrayerName, Date | null>;
  meta: {
    coordinates: Coordinates;
    date: DateOnly;
    timezone: string | number;
    method: CalculationMethod;
    params: PrayerCalculationParams;
  };
  trace?: TraceStep[];
}
```

---

### Task A.2 - Calculation Methods Catalog

**Deskripsi:** Implementasi katalog metode kalkulasi yang dapat diperluas.

**Files:**
- `src/prayer-times/methods/catalog.ts`
- `src/prayer-times/methods/index.ts`

**Built-in Methods:**

| Method | Fajr Angle | Isha Angle | Region |
|--------|-----------|-----------|--------|
| MWL | 18° | 17° | Muslim World League |
| ISNA | 15° | 15° | North America |
| Egyptian | 19.5° | 17.5° | Egypt |
| Makkah | 18.5° | 90 min | Saudi Arabia |
| Karachi | 18° | 18° | Pakistan |
| Tehran | 17.7° | 14° | Iran |
| Singapore | 20° | 18° | Singapore |
| Kemenag | 20° | 18° | Indonesia |

```typescript
// catalog.ts
export const CALCULATION_METHODS: Record<string, CalculationMethod> = {
  MWL: {
    name: 'Muslim World League',
    fajrAngle: 18,
    ishaAngle: 17,
  },
  ISNA: {
    name: 'Islamic Society of North America',
    fajrAngle: 15,
    ishaAngle: 15,
  },
  // ... etc
};

export function registerMethod(key: string, method: CalculationMethod): void;
export function getMethod(key: string): CalculationMethod | undefined;
```

---

### Task A.3 - Core Prayer Calculations

**Deskripsi:** Implementasi kalkulasi inti untuk setiap waktu sholat.

**Files:**
- `src/prayer-times/calculations/solar-transit.ts`
- `src/prayer-times/calculations/angle-time.ts`
- `src/prayer-times/calculations/asr.ts`
- `src/prayer-times/calculations/index.ts`

**Functions:**

```typescript
// solar-transit.ts
export function calculateSolarNoon(
  date: DateOnly,
  longitude: number,
  timezone: number
): number;

// angle-time.ts
export function calculateTimeForAngle(
  date: DateOnly,
  coordinates: Coordinates,
  angle: number,
  direction: 'rising' | 'setting'
): number | null;

// asr.ts
export function calculateAsr(
  date: DateOnly,
  coordinates: Coordinates,
  madhhab: AsrMadhhab
): number;
```

---

### Task A.4 - Imsak & Dhuha Calculations

**Deskripsi:** Kalkulasi khusus untuk Imsak dan Dhuha.

**Files:**
- `src/prayer-times/calculations/imsak.ts`
- `src/prayer-times/calculations/dhuha.ts`

**Imsak Rules:**
```typescript
// imsak.ts

// Rule 1: Minutes before Fajr (default: 10 minutes)
export function calculateImsakMinutes(
  fajrTime: number,
  minutesBefore: number
): number;

// Rule 2: Angle-based (custom angle)
export function calculateImsakAngle(
  date: DateOnly,
  coordinates: Coordinates,
  angle: number
): number | null;
```

**Dhuha Rules:**
```typescript
// dhuha.ts

// Dhuha Start
// Rule 1: X minutes after sunrise
export function calculateDhuhaStartMinutes(
  sunriseTime: number,
  minutesAfter: number
): number;

// Rule 2: Sun altitude angle (e.g., 12° above horizon)
export function calculateDhuhaStartAngle(
  date: DateOnly,
  coordinates: Coordinates,
  altitude: number
): number;

// Dhuha End: Before solar noon
export function calculateDhuhaEnd(
  solarNoon: number,
  minutesBefore: number
): number;
```

---

### Task A.5 - High Latitude Handler

**Deskripsi:** Penanganan kasus high latitude dimana Fajr/Isha tidak terdefinisi.

**Files:**
- `src/prayer-times/high-latitude.ts`

**Rules:**

```typescript
// high-latitude.ts

interface NightPortion {
  fajrPortion: number;
  ishaPortion: number;
}

// Rule 1: Middle of Night
// Fajr = midnight + 1/2 * night duration
// Isha = midnight - 1/2 * night duration
export function middleOfNight(
  sunset: number,
  sunrise: number
): NightPortion;

// Rule 2: One-Seventh
// Fajr = 7/7 of night from sunset
// Isha = 6/7 of night from sunset
export function oneSeventh(
  sunset: number,
  sunrise: number
): NightPortion;

// Rule 3: Angle-Based
// Duration based on angle proportionally
export function angleBased(
  fajrAngle: number,
  ishaAngle: number,
  latitude: number
): NightPortion;

// Main handler
export function applyHighLatitudeRule(
  rule: HighLatitudeRule,
  times: Partial<PrayerTimes>,
  params: HighLatitudeParams
): Partial<PrayerTimes>;
```

---

### Task A.6 - Adjustments & Rounding

**Deskripsi:** Implementasi adjustments dan rounding rules.

**Files:**
- `src/prayer-times/adjustments.ts`

**Functions:**

```typescript
// adjustments.ts

// Apply manual adjustments (minutes)
export function applyAdjustments(
  times: Record<PrayerName, number>,
  adjustments: Partial<Record<PrayerName, number>>
): Record<PrayerName, number>;

// Apply safety buffer (ihtiyath)
export function applySafetyBuffer(
  times: Record<PrayerName, number>,
  buffer: number | Partial<Record<PrayerName, number>>
): Record<PrayerName, number>;

// Apply rounding
export function applyRounding(
  times: Record<PrayerName, number>,
  rule: RoundingRule
): Record<PrayerName, number>;
```

---

### Task A.7 - Consistency Validation

**Deskripsi:** Validasi urutan waktu sholat harus logis.

**Files:**
- `src/prayer-times/validation.ts`

**Rules:**
```typescript
// validation.ts

// Urutan yang valid:
// imsak < fajr < sunrise < dhuha_start < dhuha_end < dhuhr < asr < maghrib < isha

export function validateTimeSequence(
  times: Record<PrayerName, number>
): Result<boolean>;

// Error jika tidak konsisten: PRAYER_TIMES_INCONSISTENT
```

---

### Task A.8 - Main Calculator

**Deskripsi:** Fungsi utama `computePrayerTimes()`.

**Files:**
- `src/prayer-times/calculator.ts`
- `src/prayer-times/index.ts`

**API:**

```typescript
// calculator.ts
export function computePrayerTimes(
  location: LocationInput,
  timeContext: TimeContext,
  params: PrayerCalculationParams,
  options?: { includeTrace?: boolean }
): Result<PrayerTimesResult>;

// index.ts (public API)
export { computePrayerTimes } from './calculator';
export * from './types';
export { CALCULATION_METHODS, registerMethod } from './methods';
```

**Flow:**

```
1. Validate inputs
   ↓
2. Calculate solar position for date
   ↓
3. Calculate solar noon (Dhuhr)
   ↓
4. Calculate Sunrise & Sunset
   ↓
5. Calculate Fajr (angle-based)
   ↓
6. Calculate Isha (angle or interval)
   ↓
7. Calculate Imsak (from Fajr)
   ↓
8. Calculate Dhuha (from Sunrise)
   ↓
9. Calculate Asr (shadow ratio)
   ↓
10. Apply High Latitude rules if needed
    ↓
11. Apply adjustments
    ↓
12. Apply safety buffer
    ↓
13. Apply rounding
    ↓
14. Validate sequence
    ↓
15. Return result with optional trace
```

---

### Task A.9 - Unit Tests

**Deskripsi:** Comprehensive unit tests untuk Prayer Times.

**Files:**
- `tests/unit/prayer-times/methods.test.ts`
- `tests/unit/prayer-times/calculations.test.ts`
- `tests/unit/prayer-times/imsak.test.ts`
- `tests/unit/prayer-times/dhuha.test.ts`
- `tests/unit/prayer-times/high-latitude.test.ts`
- `tests/unit/prayer-times/calculator.test.ts`

**Test Cases:**
- Various locations (equator, mid-latitude, high-latitude)
- All calculation methods
- Both Asr madhabs
- All high latitude rules
- Imsak variations
- Dhuha start/end calculations
- Edge cases (polar regions, date line)

---

### Task A.10 - Integration Tests

**Deskripsi:** Test integrasi dengan data real.

**Files:**
- `tests/integration/prayer-times.test.ts`
- `tests/fixtures/prayer-times-data.json`

**Test Locations:**
| Location | Latitude | Longitude | Notes |
|----------|----------|-----------|-------|
| Makkah | 21.4225 | 39.8262 | Reference |
| Jakarta | -6.2088 | 106.8456 | Indonesia |
| London | 51.5074 | -0.1278 | High latitude |
| Oslo | 59.9139 | 10.7522 | Very high latitude |
| Reykjavik | 64.1466 | -21.9426 | Polar edge |
| Sydney | -33.8688 | 151.2093 | Southern hemisphere |

---

## ✅ Definition of Done

- [ ] Semua 8 waktu sholat terhitung dengan benar
- [ ] Multiple methods didukung
- [ ] High latitude rules berfungsi
- [ ] Imsak & Dhuha sesuai spesifikasi
- [ ] Unit tests >90% coverage
- [ ] Integration tests passing
- [ ] Trace mode berfungsi

---

## 📊 Progress Tracking

| Task | Status | Notes |
|------|--------|-------|
| A.1 Types | 🔴 TODO | |
| A.2 Methods Catalog | 🔴 TODO | |
| A.3 Core Calculations | 🔴 TODO | |
| A.4 Imsak & Dhuha | 🔴 TODO | |
| A.5 High Latitude | 🔴 TODO | |
| A.6 Adjustments | 🔴 TODO | |
| A.7 Validation | 🔴 TODO | |
| A.8 Main Calculator | 🔴 TODO | |
| A.9 Unit Tests | 🔴 TODO | |
| A.10 Integration Tests | 🔴 TODO | |

---

*Previous: [PHASE_0_CORE.md](./PHASE_0_CORE.md) | Next: [PHASE_B_QIBLA.md](./PHASE_B_QIBLA.md)*
