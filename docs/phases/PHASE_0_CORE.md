# Phase 0 - Project Setup & Core Utilities

> **Estimasi:** 2-3 hari
> **Prioritas:** 🔴 Critical - Harus selesai sebelum modul lain

---

## 📋 Overview

Phase ini mempersiapkan fondasi project termasuk:
- Setup TypeScript & tooling
- Shared types & interfaces
- Error handling system
- Core validators
- Astronomical utilities dasar
- Math helper functions

---

## 🎯 Objectives

1. ✅ Project dapat dijalankan dengan `npm run dev`
2. ✅ Testing framework berjalan dengan `npm test`
3. ✅ Build menghasilkan output valid dengan `npm run build`
4. ✅ Core types tersedia untuk semua modul
5. ✅ Error handling konsisten
6. ✅ Validators dapat digunakan

---

## 📝 Tasks

### Task 0.1 - Project Initialization

**Deskripsi:** Setup project Node.js TypeScript dengan konfigurasi optimal.

**Checklist:**
- [ ] `npm init` dengan informasi package
- [ ] Install TypeScript & dependencies
- [ ] Konfigurasi `tsconfig.json`
- [ ] Setup Vitest untuk testing
- [ ] Setup ESLint & Prettier
- [ ] Konfigurasi build script

**Dependencies:**
```json
{
  "devDependencies": {
    "typescript": "^5.x",
    "vitest": "^1.x",
    "eslint": "^8.x",
    "prettier": "^3.x",
    "@types/node": "^20.x"
  }
}
```

**Files yang dibuat:**
- `package.json`
- `tsconfig.json`
- `vitest.config.ts`
- `.eslintrc.js`
- `.prettierrc`
- `.gitignore`

---

### Task 0.2 - Core Types Definition

**Deskripsi:** Definisikan semua tipe data konseptual yang digunakan lintas modul.

**Files:**
- `src/core/types/date.ts`
- `src/core/types/coordinates.ts`
- `src/core/types/angle.ts`
- `src/core/types/result.ts`
- `src/core/types/index.ts`

**Type Definitions:**

```typescript
// coordinates.ts
export interface Coordinates {
  latitude: number;   // -90 to +90
  longitude: number;  // -180 to +180
  altitude?: number;  // meters, default 0
}

// date.ts
export interface DateOnly {
  year: number;
  month: number;  // 1-12
  day: number;    // 1-31
}

export interface TimeContext {
  date: DateOnly;
  timezone: string | number;  // IANA name or UTC offset
}

// angle.ts
export interface Angle {
  degrees: number;
  minutes?: number;
  seconds?: number;
}

// result.ts
export interface Result<T> {
  success: boolean;
  data?: T;
  error?: LibraryError;
  trace?: TraceStep[];
}

export interface TraceStep {
  step: number;
  description: string;
  value?: unknown;
}
```

---

### Task 0.3 - Error Handling System

**Deskripsi:** Implementasi error handling terstruktur sesuai spesifikasi.

**Files:**
- `src/core/errors/codes.ts`
- `src/core/errors/error.ts`
- `src/core/errors/index.ts`

**Error Codes:**
```typescript
// codes.ts
export const ErrorCodes = {
  // Validation Errors
  INVALID_COORDINATES: 'INVALID_COORDINATES',
  INVALID_DATE: 'INVALID_DATE',
  INVALID_TIMEZONE: 'INVALID_TIMEZONE',

  // Prayer Times Errors
  POLAR_DAY_UNRESOLVED: 'POLAR_DAY_UNRESOLVED',
  PRAYER_TIMES_INCONSISTENT: 'PRAYER_TIMES_INCONSISTENT',

  // Inheritance Errors
  INHERITANCE_INVALID_ESTATE: 'INHERITANCE_INVALID_ESTATE',
  INHERITANCE_INVALID_HEIRS: 'INHERITANCE_INVALID_HEIRS',
} as const;

// error.ts
export class LibraryError extends Error {
  constructor(
    public code: string,
    public message: string,
    public details?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'IslamicUtilsError';
  }
}
```

---

### Task 0.4 - Input Validators

**Deskripsi:** Validator untuk semua tipe input.

**Files:**
- `src/core/validators/coordinates.ts`
- `src/core/validators/date.ts`
- `src/core/validators/timezone.ts`
- `src/core/validators/index.ts`

**Validation Rules:**

```typescript
// coordinates.ts
export function validateCoordinates(coords: Coordinates): Result<Coordinates> {
  // latitude: -90 to +90
  // longitude: -180 to +180
  // altitude: >= 0 if provided
}

// date.ts
export function validateDate(date: DateOnly): Result<DateOnly> {
  // Valid year, month (1-12), day (1-31)
  // Check for valid day in month
}

// timezone.ts
export function validateTimezone(tz: string | number): Result<string | number> {
  // UTC offset: -12 to +14
  // Or valid IANA timezone name
}
```

---

### Task 0.5 - Constants Definition

**Deskripsi:** Konstanta global yang digunakan di seluruh library.

**Files:**
- `src/core/constants/astronomical.ts`
- `src/core/constants/kaaba.ts`
- `src/core/constants/index.ts`

**Constants:**

```typescript
// kaaba.ts
export const KAABA_COORDINATES: Coordinates = {
  latitude: 21.4225,
  longitude: 39.8262,
  altitude: 277
};

// astronomical.ts
export const ASTRONOMICAL_CONSTANTS = {
  // Refraction at horizon
  REFRACTION_ANGLE: 0.833,

  // Solar disc semi-diameter
  SUN_SEMI_DIAMETER: 0.266,

  // Earth's tilt (obliquity)
  EARTH_OBLIQUITY: 23.44,
};
```

---

### Task 0.6 - Math Utility Functions

**Deskripsi:** Helper functions untuk kalkulasi matematis.

**Files:**
- `src/core/utils/math.ts`
- `src/core/utils/trigonometry.ts`
- `src/core/utils/index.ts`

**Functions:**

```typescript
// trigonometry.ts
export function degreesToRadians(degrees: number): number;
export function radiansToDegrees(radians: number): number;
export function normalizeAngle(degrees: number): number;  // 0-360
export function normalizeAngleSigned(degrees: number): number;  // -180 to 180

// math.ts
export function roundToMinute(hours: number, rule: RoundingRule): number;
export function fractionalHours(hours: number, minutes: number): number;
```

---

### Task 0.7 - Astronomical Base Functions

**Deskripsi:** Fungsi astronomi dasar yang akan dipakai modul Prayer Times.

**Files:**
- `src/astronomy/solar.ts`
- `src/astronomy/time.ts`
- `src/astronomy/angles.ts`
- `src/astronomy/index.ts`

**Functions:**

```typescript
// solar.ts
export function solarDeclination(julianDay: number): number;
export function equationOfTime(julianDay: number): number;
export function solarNoon(longitude: number, timezone: number, date: DateOnly): number;

// time.ts
export function dateToJulianDay(date: DateOnly): number;
export function julianDayToDate(jd: number): DateOnly;
export function fractionalDayToTime(fraction: number): TimeOfDay;

// angles.ts
export function hourAngle(
  latitude: number,
  declination: number,
  angle: number
): number | null;  // null if sun never reaches angle
```

---

### Task 0.8 - Unit Tests for Core

**Deskripsi:** Test untuk semua core utilities.

**Files:**
- `tests/unit/core/coordinates.test.ts`
- `tests/unit/core/date.test.ts`
- `tests/unit/core/validators.test.ts`
- `tests/unit/astronomy/solar.test.ts`

**Test Cases:**
- Valid/invalid coordinates
- Edge cases (poles, date line)
- Leap year handling
- Julian day conversion accuracy
- Solar declination verification (against known values)

---

## ✅ Definition of Done

- [ ] Semua task selesai
- [ ] Unit tests passing (>90% coverage untuk core)
- [ ] TypeScript compilation tanpa error
- [ ] ESLint tanpa warning
- [ ] Dokumentasi fungsi dengan JSDoc

---

## 📊 Progress Tracking

| Task | Status | Notes |
|------|--------|-------|
| 0.1 Project Init | 🔴 TODO | |
| 0.2 Core Types | 🔴 TODO | |
| 0.3 Error Handling | 🔴 TODO | |
| 0.4 Validators | 🔴 TODO | |
| 0.5 Constants | 🔴 TODO | |
| 0.6 Math Utils | 🔴 TODO | |
| 0.7 Astronomy Base | 🔴 TODO | |
| 0.8 Unit Tests | 🔴 TODO | |

---

*Next Phase: [PHASE_A_PRAYER_TIMES.md](./PHASE_A_PRAYER_TIMES.md)*
