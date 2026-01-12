# Spesifikasi Teknis: Modul Hijri Calendar untuk `islamic-utils`

> **Status**: Draft Specification (siap diimplementasikan)  
> **Versi**: 1.0.0  
> **Bahasa**: Indonesia  
> **Repository**: https://github.com/azkal182/islamic-utils

---

## Daftar Isi

1. [Identitas Modul](#1-identitas-modul)
2. [Tujuan dan Ruang Lingkup](#2-tujuan-dan-ruang-lingkup)
3. [Struktur Folder](#3-struktur-folder)
4. [Kontrak Tipe Data](#4-kontrak-tipe-data)
5. [API Publik](#5-api-publik)
6. [Metode Kalender](#6-metode-kalender)
7. [Sistem Penyesuaian (Adjustment)](#7-sistem-penyesuaian-adjustment)
8. [Algoritma dan Logika Bisnis](#8-algoritma-dan-logika-bisnis)
9. [Error Handling](#9-error-handling)
10. [Kontrak API External (Provider)](#10-kontrak-api-external-provider)
11. [Contoh Penggunaan](#11-contoh-penggunaan)
12. [Requirements Non-Fungsional](#12-requirements-non-fungsional)
13. [Kriteria Keberhasilan Implementasi](#13-kriteria-keberhasilan-implementasi)

---

## 1. Identitas Modul

| Properti | Nilai |
|----------|-------|
| **Nama Modul** | Hijri Calendar |
| **Lokasi** | `src/hijri-calendar` |
| **Tipe** | Utility computation module |
| **Dependency** | Zero external dependencies |

### Karakteristik Modul

Modul ini mengikuti pola arsitektur `islamic-utils`:

- ✅ **Stateless** - tidak menyimpan state global
- ✅ **Pure functions** - seluruh operasi melalui fungsi `computeXxx`
- ✅ **Result pattern** - semua fungsi mengembalikan `Result<T>`
- ✅ **No side effects** - tidak menyentuh I/O kecuali konfigurasi adjustment
- ✅ **Deterministic** - tidak bergantung pada waktu eksekusi (`Date.now()`)

---

## 2. Tujuan dan Ruang Lingkup

### 2.1 Fitur Utama

Modul ini menyediakan 5 kemampuan inti:

1. **Konversi tanggal** Gregorian → Hijriyah
2. **Kalender bulanan** - menghasilkan kalender satu bulan Hijriyah penuh
3. **Kalender rentang** - menghasilkan kalender berdasarkan rentang tanggal
4. **Multi-metode** - mendukung beberapa metode perhitungan Hijriyah
5. **Adjustment system** - sistem penyesuaian berbasis data eksternal

### 2.2 Prinsip Desain

Semua fungsi harus memenuhi kriteria:

| Prinsip | Penjelasan |
|---------|------------|
| **Deterministik** | Input sama → output sama, kapan pun dipanggil |
| **Idempotent** | Dapat dipanggil berulang tanpa perubahan hasil |
| **Order-independent** | Tidak tergantung urutan pemanggilan |
| **Side-effect free** | Tidak mengubah state eksternal |

---

## 3. Struktur Folder

Struktur mengikuti pola yang sudah ada di `islamic-utils`:

```
src/
├── hijri-calendar/              # Modul Hijri Calendar
│   ├── index.ts                 # Public API exports
│   ├── types.ts                 # Type definitions & interfaces
│   ├── constants.ts             # Calendar constants (month names, etc)
│   │
│   ├── core/                    # Core computation logic
│   │   ├── index.ts
│   │   ├── compute-date.ts      # computeHijriDate implementation
│   │   ├── compute-month.ts     # computeHijriMonth implementation
│   │   ├── compute-range.ts     # computeHijriRange implementation
│   │   └── helpers.ts           # Internal helper functions
│   │
│   ├── methods/                 # Calculation methods
│   │   ├── index.ts
│   │   ├── types.ts             # Method-specific types
│   │   │
│   │   ├── ummul-qura/
│   │   │   ├── index.ts         # Ummul Qura implementation
│   │   │   ├── data.ts          # Static lookup table
│   │   │   └── convert.ts       # Conversion logic
│   │   │
│   │   └── nu-falakiyah/
│   │       ├── index.ts         # NU Falakiyah implementation
│   │       └── astronomical.ts  # Astronomical calculations
│   │
│   ├── adjustments/             # Adjustment system
│   │   ├── index.ts
│   │   ├── types.ts             # Adjustment-specific types
│   │   ├── apply.ts             # Apply adjustment logic
│   │   ├── resolver.ts          # Conflict resolution
│   │   │
│   │   └── stores/              # Data stores
│   │       ├── index.ts
│   │       ├── memory.ts        # In-memory store
│   │       ├── json.ts          # JSON file store
│   │       └── provider.ts      # Provider interface
│   │
│   └── utils/                   # Utility functions
│       ├── index.ts
│       ├── validators.ts        # Input validation
│       ├── formatters.ts        # Date formatting
│       └── grid-builder.ts      # Calendar grid construction
│
├── common/                      # Shared dengan modul lain
│   ├── types/
│   │   ├── result.ts            # Result<T> pattern (sudah ada)
│   │   ├── date.ts              # DateOnly type (sudah ada)
│   │   └── errors.ts            # Error types (sudah ada)
│   │
│   └── utils/
│       ├── result-helpers.ts    # unwrap, unwrapOr (sudah ada)
│       └── trace.ts             # Trace system (sudah ada)
│
└── index.ts                     # Root export (re-export hijri-calendar)
```

### Integrasi dengan Struktur Existing

Modul Hijri Calendar akan:
1. **Menggunakan ulang** tipe `Result<T>`, `DateOnly`, dan error handling dari `src/common/`
2. **Mengikuti pola** yang sama dengan modul `prayer-times`, `qibla`, dan `inheritance`
3. **Export ulang** melalui `src/index.ts` untuk akses global
4. **Konsisten** dengan testing pattern di `tests/hijri-calendar/`

### Tujuan Pemisahan

- ✅ **Separation of concerns** - core logic, methods, adjustments terpisah
- ✅ **Testability** - unit test per layer di `tests/hijri-calendar/`
- ✅ **Maintainability** - konsistensi dengan modul existing
- ✅ **Extensibility** - mudah menambah metode baru
- ✅ **Zero coupling** - tidak bergantung pada modul lain kecuali `common/`

---

## 4. Kontrak Tipe Data

### 4.1 Tipe Tanggal

#### `GregorianDate`

```typescript
interface GregorianDate {
  year: number;   // >= 1
  month: number;  // 1-12
  day: number;    // 1-31
}
```

#### `HijriDate`

```typescript
interface HijriDate {
  year: number;   // Tahun Hijriyah
  month: number;  // 1-12
  day: number;    // 1-29 atau 1-30
}
```

**Catatan penting:**
- Tanggal **TIDAK BOLEH** berupa string di API internal
- Selalu gunakan object literal dengan properti eksplisit

---

### 4.2 Identifier Metode

#### `HijriMethodId`

```typescript
type HijriMethodId = "ummul_qura" | "nu_falakiyah";
```

**Aturan:**
- ✅ String literal dengan validasi
- ❌ Enum eksternal
- ❌ Numeric identifier
- ❌ String bebas tanpa validasi

---

### 4.3 Result Pattern (WAJIB)

Modul ini **HARUS menggunakan ulang** `Result<T>` yang sudah ada di `src/common/types/result.ts`:

```typescript
// Dari src/common/types/result.ts (SUDAH ADA)
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

**Aturan KERAS:**
- ❌ **DILARANG** throw error ke user
- ❌ **DILARANG** return `null` atau `undefined`
- ✅ Semua fungsi `computeXxx` harus return `Result<T>`
- ✅ Gunakan helper dari `src/common/utils/result-helpers.ts` (`unwrap`, `unwrapOr`, dll)

---

### 4.4 DateOnly Type (REUSE)

Modul ini menggunakan `DateOnly` yang **sudah ada** di `src/common/types/date.ts`:

```typescript
// Dari src/common/types/date.ts (SUDAH ADA)
interface DateOnly {
  year: number;
  month: number;  // 1-12
  day: number;    // 1-31
}
```

**Mapping untuk Hijri Calendar:**
- `GregorianDate` = alias untuk `DateOnly`
- `HijriDate` = interface baru dengan struktur sama seperti `DateOnly`

```typescript
// Di src/hijri-calendar/types.ts
import type { DateOnly } from '@/common/types';

export type GregorianDate = DateOnly;

export interface HijriDate {
  year: number;
  month: number;  // 1-12
  day: number;    // 1-29 atau 1-30
}
```

---

### 4.5 Options dan Konfigurasi

#### `HijriCalendarOptions`

```typescript
interface HijriCalendarOptions {
  method?: HijriMethodId;              // Default: "ummul_qura"
  adjustments?: HijriAdjustmentsConfig; // Default: { mode: "none" }
  weekStartsOn?: 0 | 1 | 6;            // Default: 0 (Minggu)
}
```

**Catatan:**
- `weekStartsOn` **hanya** memengaruhi grid kalender
- **Tidak** memengaruhi hasil konversi tanggal

---

## 5. API Publik

### Ekspor Wajib

Semua API **HARUS**:
1. Diekspor melalui `src/hijri-calendar/index.ts`
2. Di-re-ekspor ulang melalui `src/index.ts` (root)

```typescript
// src/hijri-calendar/index.ts
export * from './types';
export * from './constants';
export * from './core';
export * from './methods';
export * from './adjustments';

// src/index.ts (root)
export * from './hijri-calendar';
export * from './prayer-times';    // existing
export * from './qibla';            // existing
export * from './inheritance';      // existing
export * from './common';           // existing
```

---

### 5.1 `computeHijriDate`

Konversi satu tanggal Gregorian ke Hijriyah.

#### Signature

```typescript
function computeHijriDate(
  input: { date: GregorianDate },
  options?: HijriCalendarOptions
): Result<HijriDateResult>
```

#### Input

```typescript
{
  date: {
    year: 2025,
    month: 3,
    day: 15
  }
}
```

#### Output: `HijriDateResult`

```typescript
interface HijriDateResult {
  gregorian: GregorianDate;        // Tanggal input
  hijri: HijriDate;                // Hasil konversi
  method: HijriMethodId;           // Metode yang digunakan
  isAdjusted: boolean;             // Apakah ada adjustment?
  adjustmentSource?: string;       // Sumber adjustment (jika ada)
}
```

#### Contoh Response

```typescript
{
  success: true,
  data: {
    gregorian: { year: 2025, month: 3, day: 15 },
    hijri: { year: 1446, month: 9, day: 16 },
    method: "ummul_qura",
    isAdjusted: false
  }
}
```

#### Alur Kerja

1. Metode kalender menghasilkan **hasil dasar**
2. Adjustment diterapkan **setelah** hasil dasar diperoleh
3. Metadata dicatat (method, isAdjusted, source)

---

### 5.2 `computeHijriMonth`

Menghasilkan kalender satu bulan Hijriyah penuh.

#### Signature

```typescript
function computeHijriMonth(
  query: HijriMonthQuery | GregorianMonthQuery,
  options?: HijriCalendarOptions
): Result<HijriMonthResult>
```

#### Query Input

```typescript
// Query berdasarkan bulan Hijriyah
type HijriMonthQuery = {
  hijri: {
    year: number;
    month: number;
  }
}

// Query berdasarkan bulan Gregorian
type GregorianMonthQuery = {
  gregorian: {
    year: number;
    month: number;
  }
}
```

#### Output: `HijriMonthResult`

```typescript
interface HijriMonthResult {
  method: HijriMethodId;
  hijriMonth: {
    year: number;
    month: number;
  };
  days: HijriDayItem[];
  grid?: HijriDayItem[][];  // Opsional, grid kalender
  meta: {
    length: 29 | 30;
    generatedFrom: "hijri" | "gregorian";
    adjustmentApplied: boolean;
  };
}

interface HijriDayItem {
  hijri: HijriDate;
  gregorian: GregorianDate;
  weekday: number;          // 0-6 (0=Minggu)
  isAdjusted: boolean;
}
```

#### Contoh Response

```typescript
{
  success: true,
  data: {
    method: "ummul_qura",
    hijriMonth: { year: 1446, month: 9 },
    days: [
      {
        hijri: { year: 1446, month: 9, day: 1 },
        gregorian: { year: 2025, month: 3, day: 1 },
        weekday: 6,
        isAdjusted: false
      },
      // ... 28-29 hari lainnya
    ],
    meta: {
      length: 30,
      generatedFrom: "hijri",
      adjustmentApplied: false
    }
  }
}
```

---

### 5.3 `computeHijriRange`

Menghasilkan kalender berdasarkan rentang tanggal Gregorian.

#### Signature

```typescript
function computeHijriRange(
  input: {
    start: GregorianDate;
    end: GregorianDate;
  },
  options?: HijriCalendarOptions
): Result<HijriRangeResult>
```

#### Output: `HijriRangeResult`

```typescript
interface HijriRangeResult {
  method: HijriMethodId;
  start: GregorianDate;
  end: GregorianDate;
  days: HijriDayItem[];
  meta: {
    dayCount: number;
    adjustmentApplied: boolean;
  };
}
```

---

## 6. Metode Kalender

### Kontrak Metode

Setiap metode kalender **HARUS**:
- Menerima `GregorianDate` sebagai input
- Mengembalikan `HijriDate` sebagai output dasar
- **TIDAK** mengetahui sistem adjustment
- Bersifat pure function (deterministik)

---

### 6.1 Ummul Qura

**Karakteristik:**
- Berbasis **lookup table** (data statis)
- Data disimpan di `data.ts`
- Tidak melakukan perhitungan astronomi dinamis
- Mengikuti kalender resmi Arab Saudi

**Lokasi:**
```
src/hijri-calendar/methods/ummul-qura/
├── index.ts    # Public interface
├── data.ts     # Static lookup table
└── lookup.ts   # Lookup logic
```

---

### 6.2 NU Falakiyah

**Karakteristik:**
- Berbasis **hisab astronomi** (perhitungan falak)
- Tidak mengandung keputusan resmi organisasi
- Tidak menyimpan data adjustment
- Mengikuti kriteria hisab NU

**Lokasi:**
```
src/hijri-calendar/methods/nu-falakiyah/
├── index.ts    # Public interface
└── base.ts     # Astronomical calculations
```

---

## 7. Sistem Penyesuaian (Adjustment)

### 7.1 Model Data Adjustment

#### `HijriMonthAdjustment`

```typescript
interface HijriMonthAdjustment {
  method: HijriMethodId;
  hijriYear: number;
  hijriMonth: number;
  shiftDays: number;        // -2 sampai +2
  source: string;           // Sumber keputusan
  issuedAt?: string;        // ISO 8601 timestamp
  revision?: number;        // Versi revisi
}
```

#### Makna `shiftDays`

| Value | Arti | Contoh |
|-------|------|--------|
| `+1` | Awal bulan **mundur 1 hari** dari hisab | Hisab: 1 Maret → Adjusted: 28 Feb |
| `-1` | Awal bulan **maju 1 hari** dari hisab | Hisab: 1 Maret → Adjusted: 2 Maret |
| `0` | Tidak ada perubahan | Sesuai hisab |

**Catatan penting:**
- Penyesuaian berlaku untuk **awal bulan**, bukan per hari
- Seluruh hari dalam bulan mengikuti pergeseran

---

### 7.2 Resolusi Konflik

Jika ada **lebih dari satu adjustment** untuk bulan yang sama:

```
Prioritas:
1. revision tertinggi
2. issuedAt terbaru (jika revision sama)
3. data terakhir dimuat (jika timestamp sama)
```

---

### 7.3 Sumber Data Adjustment

#### `HijriAdjustmentsConfig`

```typescript
type HijriAdjustmentsConfig =
  | { mode: "none" }
  | { mode: "memory"; data: HijriMonthAdjustment[] }
  | { mode: "json"; filePath: string }
  | { mode: "provider"; getAdjustments: (year: number) => HijriMonthAdjustment[] | Promise<HijriMonthAdjustment[]> };
```

#### Mode `none`

Tidak ada adjustment, gunakan hasil hisab murni.

```typescript
{
  mode: "none"
}
```

---

#### Mode `memory`

Data adjustment disimpan di memory.

```typescript
{
  mode: "memory",
  data: [
    {
      method: "ummul_qura",
      hijriYear: 1446,
      hijriMonth: 9,
      shiftDays: 1,
      source: "sidang-isbat",
      issuedAt: "2025-03-10T00:00:00.000Z",
      revision: 1
    }
  ]
}
```

---

#### Mode `json`

Data adjustment dibaca dari file JSON.

```typescript
{
  mode: "json",
  filePath: "./data/hijri-adjustments.json"
}
```

**Format file JSON:**

```json
{
  "adjustments": [
    {
      "method": "nu_falakiyah",
      "hijriYear": 1447,
      "hijriMonth": 1,
      "shiftDays": 0,
      "source": "default",
      "revision": 0
    }
  ]
}
```

---

#### Mode `provider`

Fungsi custom untuk mengambil data adjustment.

```typescript
{
  mode: "provider",
  getAdjustments: async (year) => {
    // User bertanggung jawab untuk HTTP request
    const response = await fetch(`/api/adjustments/${year}`);
    return response.json();
  }
}
```

**Catatan:**
- Library **TIDAK** melakukan HTTP request
- Integrasi API sepenuhnya tanggung jawab user

---

### 7.4 Aturan Pemanggilan Adjustment

1. Adjustment dimuat **per tahun Hijriyah**
2. Query tahun lampau tetap memuat adjustment (jika tersedia)
3. Adjustment boleh di-cache selama lifecycle proses
4. Provider function dipanggil **on-demand**

---

## 8. Algoritma dan Logika Bisnis

### 8.1 Algoritma Aplikasi Penyesuaian

Penyesuaian diterapkan dengan cara:

1. Hitung tanggal Gregorian untuk **hari ke-1** bulan Hijriyah (hisab dasar)
2. Geser tanggal Gregorian sesuai `shiftDays`
3. **Seluruh hari dalam bulan** mengikuti pergeseran yang sama

**Penyesuaian TIDAK:**
- Menambah/mengurangi hari individual
- Memotong bulan secara parsial
- Mengubah panjang bulan (tetap 29 atau 30 hari)

---

### 8.2 Algoritma Query Bulan Hijriyah

```
Input: { hijri: { year, month } }

Langkah:
1. Hitung awal bulan dasar (hari ke-1) dari metode hisab
2. Cek apakah ada adjustment untuk bulan tersebut
3. Jika ada, geser awal bulan sesuai shiftDays
4. Tentukan panjang bulan (29 atau 30 hari)
5. Generate seluruh hari dalam bulan
6. Generate grid kalender (jika diminta)
```

---

### 8.3 Algoritma Query Bulan Gregorian

```
Input: { gregorian: { year, month } }

Langkah:
1. Enumerasi seluruh hari dalam bulan Gregorian
2. Konversi setiap hari ke Hijriyah (hisab dasar)
3. Terapkan adjustment untuk setiap konversi
4. Tentukan bulan Hijriyah yang dominan (paling banyak muncul)
5. Generate grid kalender dengan bulan dominan
```

---

## 9. Error Handling

### Error Codes

| Code | Situasi | Contoh |
|------|---------|--------|
| `INVALID_DATE` | Format tanggal tidak valid | `{ year: 2025, month: 13, day: 1 }` |
| `OUT_OF_SUPPORTED_RANGE` | Tanggal di luar jangkauan metode | Tanggal sebelum 1900 untuk Ummul Qura |
| `INVALID_ADJUSTMENT` | Data adjustment tidak valid | `shiftDays: 5` (di luar -2 sampai +2) |
| `METHOD_NOT_SUPPORTED` | Metode tidak tersedia | `method: "custom_method"` |
| `ADJUSTMENT_LOAD_FAILED` | Gagal memuat adjustment | File JSON tidak ditemukan |

### Contoh Error Response

```typescript
{
  success: false,
  error: {
    code: "INVALID_DATE",
    message: "Tanggal tidak valid: bulan harus antara 1-12",
    details: { input: { year: 2025, month: 13, day: 1 } }
  }
}
```

---

## 10. Kontrak API External (Provider)

### Aturan Kontrak

API adjustment **HARUS** mengembalikan:
- **1 tahun Hijriyah penuh** (12 bulan)
- Semua bulan dikirim, bahkan jika tidak ada perubahan

### Endpoint Pattern

```
GET /api/adjustments/{method}/{year}
```

Contoh:
```
GET /api/adjustments/nu_falakiyah/1447
```

---

### Response Format

```typescript
{
  method: "nu_falakiyah",
  year: 1447,
  adjustments: [
    {
      hijriYear: 1447,
      hijriMonth: 1,
      shiftDays: 0,
      source: "default",
      issuedAt: "2025-01-01T00:00:00.000Z",
      revision: 0
    },
    {
      hijriYear: 1447,
      hijriMonth: 2,
      shiftDays: 0,
      source: "default",
      issuedAt: "2025-01-01T00:00:00.000Z",
      revision: 0
    },
    // ... 10 bulan lainnya
    {
      hijriYear: 1447,
      hijriMonth: 9,
      shiftDays: 1,
      source: "sidang-isbat-nu",
      issuedAt: "2026-03-10T00:00:00.000Z",
      revision: 2
    }
  ]
}
```

### Bulan Tanpa Perubahan

```typescript
{
  hijriYear: 1447,
  hijriMonth: 3,
  shiftDays: 0,           // Tidak ada perubahan
  source: "default",      // Sumber default
  revision: 0             // Tidak ada revisi
}
```

---

## 11. Contoh Penggunaan

### 11.1 Konversi Tanggal Sederhana

```typescript
import { computeHijriDate } from '@azkal182/islamic-utils';

const result = computeHijriDate({
  date: { year: 2025, month: 3, day: 15 }
});

if (result.success) {
  console.log(result.data.hijri); 
  // { year: 1446, month: 9, day: 16 }
}
```

---

### 11.2 Konversi dengan Metode Spesifik

```typescript
import { computeHijriDate } from '@azkal182/islamic-utils';

const result = computeHijriDate(
  { date: { year: 2025, month: 3, day: 15 } },
  { method: "nu_falakiyah" }
);
```

---

### 11.3 Kalender Bulanan dengan Adjustment

```typescript
import { computeHijriMonth } from '@azkal182/islamic-utils';

const result = computeHijriMonth(
  { hijri: { year: 1446, month: 9 } },
  {
    method: "nu_falakiyah",
    adjustments: {
      mode: "memory",
      data: [
        {
          method: "nu_falakiyah",
          hijriYear: 1446,
          hijriMonth: 9,
          shiftDays: 1,
          source: "sidang-isbat",
          issuedAt: "2025-03-10T00:00:00.000Z"
        }
      ]
    }
  }
);

if (result.success) {
  console.log(`Ramadan ${result.data.hijriMonth.year}`);
  console.log(`Panjang: ${result.data.meta.length} hari`);
  console.log(`Adjustment: ${result.data.meta.adjustmentApplied}`);
  
  result.data.days.forEach(day => {
    console.log(`${day.hijri.day} Ramadan = ${day.gregorian.day}/${day.gregorian.month}`);
  });
}
```

---

### 11.4 Integrasi dengan API External

```typescript
import { computeHijriMonth } from '@azkal182/islamic-utils';

const result = computeHijriMonth(
  { hijri: { year: 1447, month: 9 } },
  {
    method: "nu_falakiyah",
    adjustments: {
      mode: "provider",
      getAdjustments: async (year) => {
        // User bertanggung jawab untuk HTTP request
        const response = await fetch(
          `https://api.example.com/adjustments/nu_falakiyah/${year}`
        );
        const data = await response.json();
        return data.adjustments;
      }
    }
  }
);
```

---

### 11.5 Kalender Rentang Tanggal

```typescript
import { computeHijriRange } from '@azkal182/islamic-utils';

const result = computeHijriRange(
  {
    start: { year: 2025, month: 3, day: 1 },
    end: { year: 2025, month: 3, day: 31 }
  },
  { method: "ummul_qura" }
);

if (result.success) {
  console.log(`Total hari: ${result.data.meta.dayCount}`);
  
  result.data.days.forEach(day => {
    console.log(
      `${day.gregorian.day} Maret = ${day.hijri.day} ${getMonthName(day.hijri.month)}`
    );
  });
}
```

---

## 12. Requirements Non-Fungsional

| Requirement | Deskripsi | Kriteria |
|-------------|-----------|----------|
| **Deterministik** | Input sama → output sama | Wajib |
| **Pure Functions** | Tidak ada side effect | Wajib |
| **Zero Dependencies** | Tidak ada external dependencies | Wajib |
| **Node.js Compatible** | Berjalan di Node.js 18+ | Wajib |
| **Type Safe** | Full TypeScript support | Wajib |
| **Testable** | Mudah di-unit test dengan Vitest | Wajib |
| **Dokumentasi** | JSDoc untuk public API | Wajib |
| **Performance** | Konversi < 1ms per tanggal | Target |
| **Konsistensi** | Mengikuti pola modul existing | Wajib |

### Testing Pattern

Mengikuti struktur testing existing:

```
tests/
├── hijri-calendar/
│   ├── core/
│   │   ├── compute-date.test.ts
│   │   ├── compute-month.test.ts
│   │   └── compute-range.test.ts
│   │
│   ├── methods/
│   │   ├── ummul-qura.test.ts
│   │   └── nu-falakiyah.test.ts
│   │
│   ├── adjustments/
│   │   ├── apply.test.ts
│   │   ├── resolver.test.ts
│   │   └── stores.test.ts
│   │
│   └── utils/
│       ├── validators.test.ts
│       └── grid-builder.test.ts
│
└── vitest.config.ts
```

### Benchmarking

Tambahkan benchmark di `benchmarks/hijri-calendar.bench.ts`:

```typescript
import { bench, describe } from 'vitest';
import { computeHijriDate, computeHijriMonth } from '@/hijri-calendar';

describe('Hijri Calendar Benchmarks', () => {
  bench('computeHijriDate - single date', () => {
    computeHijriDate({ date: { year: 2025, month: 3, day: 15 } });
  });

  bench('computeHijriMonth - full month', () => {
    computeHijriMonth({ hijri: { year: 1446, month: 9 } });
  });
});
```

### Documentation

Tambahkan dokumentasi di `docs/hijri-calendar/`:

```
docs/
├── hijri-calendar/
│   ├── README.md               # Overview & quick start
│   ├── methods.md              # Calculation methods guide
│   ├── adjustments.md          # Adjustment system guide
│   └── api-reference.md        # Full API reference
│
└── examples/
    └── hijri-calendar.ts       # Complete usage examples
```

---

## 13. Kriteria Keberhasilan Implementasi

Implementasi dianggap **VALID** jika memenuhi semua kriteria berikut:

### ✅ Checklist Implementasi

#### Struktur & Arsitektur
- [ ] Struktur folder **persis** mengikuti pola yang ditentukan
- [ ] Menggunakan ulang `Result<T>` dari `src/common/types/result.ts`
- [ ] Menggunakan ulang `DateOnly` dari `src/common/types/date.ts`
- [ ] Menggunakan ulang `LibraryError` dari `src/common/types/errors.ts`
- [ ] Menggunakan ulang trace system dari `src/common/utils/trace.ts`
- [ ] Export ulang melalui `src/index.ts`

#### Functional Requirements
- [ ] Semua fungsi mengikuti kontrak tipe data dalam spesifikasi ini
- [ ] Tidak ada keputusan resmi di metode hisab (separation of concerns)
- [ ] Adjustment bekerja untuk masa lalu dan masa depan
- [ ] `Result<T>` konsisten di seluruh modul
- [ ] Semua error dikembalikan dalam `Result<T>`, tidak ada throw

#### Code Quality
- [ ] Zero external dependencies (kecuali dev dependencies)
- [ ] Full TypeScript dengan strict mode
- [ ] JSDoc untuk semua public API
- [ ] Lulus ESLint dengan konfigurasi repo

#### Testing
- [ ] Unit test mencakup minimal 80% code coverage
- [ ] Test menggunakan Vitest (existing test framework)
- [ ] Integration test dengan adjustment provider
- [ ] Edge case testing (lintas bulan, shift negatif, dll)
- [ ] Test structure mengikuti pola di `tests/`

#### Documentation
- [ ] README.md di `docs/hijri-calendar/`
- [ ] API reference lengkap
- [ ] Usage examples di `examples/hijri-calendar.ts`
- [ ] Changelog entry di `CHANGELOG.md`

#### Performance
- [ ] Benchmark di `benchmarks/hijri-calendar.bench.ts`
- [ ] Single date conversion < 1ms
- [ ] Month calculation reasonable performance

---

## Lampiran A: Contoh Unit Test

### Test Case: Konversi Tanggal Dasar

```typescript
// tests/hijri-calendar/core/compute-date.test.ts
import { describe, it, expect } from 'vitest';
import { computeHijriDate } from '@/hijri-calendar';

describe('computeHijriDate', () => {
  it('should convert Gregorian to Hijri using Ummul Qura', () => {
    const result = computeHijriDate({
      date: { year: 2025, month: 3, day: 1 }
    });
    
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.hijri).toEqual({
        year: 1446,
        month: 9,
        day: 1
      });
      expect(result.data.method).toBe('ummul_qura');
      expect(result.data.isAdjusted).toBe(false);
    }
  });

  it('should return error for invalid date', () => {
    const result = computeHijriDate({
      date: { year: 2025, month: 13, day: 1 }
    });
    
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.code).toBe('INVALID_DATE');
    }
  });
});
```

### Test Case: Adjustment dengan Shift Positif

```typescript
// tests/hijri-calendar/adjustments/apply.test.ts
import { describe, it, expect } from 'vitest';
import { computeHijriDate } from '@/hijri-calendar';

describe('Adjustment System', () => {
  it('should apply positive shift adjustment', () => {
    const result = computeHijriDate(
      { date: { year: 2025, month: 3, day: 1 } },
      {
        method: 'nu_falakiyah',
        adjustments: {
          mode: 'memory',
          data: [{
            method: 'nu_falakiyah',
            hijriYear: 1446,
            hijriMonth: 9,
            shiftDays: 1,
            source: 'test'
          }]
        }
      }
    );
    
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.hijri.day).toBe(2); // Shifted by +1
      expect(result.data.isAdjusted).toBe(true);
      expect(result.data.adjustmentSource).toBe('test');
    }
  });

  it('should handle conflict resolution by revision', () => {
    const result = computeHijriDate(
      { date: { year: 2025, month: 3, day: 1 } },
      {
        method: 'nu_falakiyah',
        adjustments: {
          mode: 'memory',
          data: [
            {
              method: 'nu_falakiyah',
              hijriYear: 1446,
              hijriMonth: 9,
              shiftDays: 1,
              source: 'old',
              revision: 1
            },
            {
              method: 'nu_falakiyah',
              hijriYear: 1446,
              hijriMonth: 9,
              shiftDays: -1,
              source: 'new',
              revision: 2  // Higher revision wins
            }
          ]
        }
      }
    );
    
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.adjustmentSource).toBe('new');
    }
  });
});
```

### Test Case: Grid Builder

```typescript
// tests/hijri-calendar/utils/grid-builder.test.ts
import { describe, it, expect } from 'vitest';
import { computeHijriMonth } from '@/hijri-calendar';

describe('Calendar Grid Builder', () => {
  it('should build calendar grid starting on Sunday', () => {
    const result = computeHijriMonth(
      { hijri: { year: 1446, month: 9 } },
      { weekStartsOn: 0 } // Sunday
    );
    
    expect(result.success).toBe(true);
    if (result.success && result.data.grid) {
      // First week should start with Sunday (weekday 0)
      expect(result.data.grid[0][0]?.weekday).toBe(0);
      
      // Grid should have 5-6 weeks
      expect(result.data.grid.length).toBeGreaterThanOrEqual(5);
      expect(result.data.grid.length).toBeLessThanOrEqual(6);
    }
  });

  it('should build calendar grid starting on Monday', () => {
    const result = computeHijriMonth(
      { hijri: { year: 1446, month: 9 } },
      { weekStartsOn: 1 } // Monday
    );
    
    expect(result.success).toBe(true);
    if (result.success && result.data.grid) {
      // Find first non-null cell in first week
      const firstDay = result.data.grid[0].find(d => d !== null);
      expect(firstDay?.weekday).toBe(1);
    }
  });
});
```

---

## Lampiran B: Integration dengan Repo Existing

### File Changes Required

#### 1. `src/index.ts` (Root Export)

```typescript
// Existing exports
export * from './prayer-times';
export * from './qibla';
export * from './inheritance';
export * from './common';

// NEW: Add Hijri Calendar
export * from './hijri-calendar';
```

#### 2. `package.json` Updates

```json
{
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.js"
    },
    "./prayer-times": {
      "types": "./dist/prayer-times/index.d.ts",
      "import": "./dist/prayer-times/index.js"
    },
    "./qibla": {
      "types": "./dist/qibla/index.d.ts",
      "import": "./dist/qibla/index.js"
    },
    "./inheritance": {
      "types": "./dist/inheritance/index.d.ts",
      "import": "./dist/inheritance/index.js"
    },
    "./hijri-calendar": {
      "types": "./dist/hijri-calendar/index.d.ts",
      "import": "./dist/hijri-calendar/index.js"
    }
  }
}
```

#### 3. `README.md` Updates

Tambahkan section baru di features table:

```markdown
| Module | Status | Description |
| --- | --- | --- |
| 🕌 **Prayer Times** | ✅ Complete | 9 prayer times with 13+ calculation methods |
| 🧭 **Qibla Direction** | ✅ Complete | Bearing and distance to Ka'bah |
| 📜 **Inheritance (Faraidh)** | ✅ Complete | 30+ heir types, hijab, aul, radd, special cases |
| 📅 **Hijri Calendar** | 🚧 In Progress | Date conversion, monthly calendar, adjustments |
```

#### 4. `typedoc.json` Updates

```json
{
  "entryPoints": [
    "src/index.ts",
    "src/prayer-times/index.ts",
    "src/qibla/index.ts",
    "src/inheritance/index.ts",
    "src/hijri-calendar/index.ts"
  ]
}
```

#### 5. `.github/workflows/` CI Updates

Pastikan CI testing mencakup modul baru:

```yaml
- name: Test
  run: pnpm test:run
  # Will automatically test all files in tests/hijri-calendar/
```

### Development Workflow

#### Step 1: Setup Files

```bash
# Create directory structure
mkdir -p src/hijri-calendar/{core,methods/{ummul-qura,nu-falakiyah},adjustments/stores,utils}
mkdir -p tests/hijri-calendar/{core,methods,adjustments,utils}
mkdir -p docs/hijri-calendar
mkdir -p examples
mkdir -p benchmarks
```

#### Step 2: Create Type Definitions

```typescript
// src/hijri-calendar/types.ts
import type { DateOnly } from '@/common/types';

export type GregorianDate = DateOnly;
export interface HijriDate { /* ... */ }
export type HijriMethodId = 'ummul_qura' | 'nu_falakiyah';
// ... rest of types
```

#### Step 3: Implement Core Functions

```typescript
// src/hijri-calendar/core/compute-date.ts
import type { Result } from '@/common/types';
import type { HijriDateResult } from '../types';

export function computeHijriDate(/* ... */): Result<HijriDateResult> {
  // Implementation
}
```

#### Step 4: Write Tests

```typescript
// tests/hijri-calendar/core/compute-date.test.ts
import { describe, it, expect } from 'vitest';
import { computeHijriDate } from '@/hijri-calendar';

describe('computeHijriDate', () => {
  // Tests
});
```

#### Step 5: Add Examples

```typescript
// examples/hijri-calendar.ts
import { computeHijriDate, computeHijriMonth } from '@azkal182/islamic-utils';

// Usage examples
```

#### Step 6: Documentation

```markdown
<!-- docs/hijri-calendar/README.md -->
# Hijri Calendar Module

## Overview
...

## Quick Start
...

## API Reference
...
```

#### Step 7: Update Changelog

```markdown
<!-- CHANGELOG.md -->
## [Unreleased]

### Added
- **Hijri Calendar Module**: Date conversion, monthly calendar, and adjustment system
  - `computeHijriDate`: Convert Gregorian to Hijri dates
  - `computeHijriMonth`: Generate monthly Hijri calendar
  - `computeHijriRange`: Calendar for date ranges
  - Support for Ummul Qura and NU Falakiyah methods
  - Adjustment system with memory, JSON, and provider modes
```

---

## Lampiran C: Referensi Singkat

### Quick Reference: Tipe Data

```typescript
// Input/Output
GregorianDate: DateOnly (alias)
HijriDate: { year, month, day }
HijriMethodId: "ummul_qura" | "nu_falakiyah"

// Result Pattern (dari common)
Result<T> = SuccessResult<T> | ErrorResult

// Options
HijriCalendarOptions: { method?, adjustments?, weekStartsOn? }

// Adjustment
HijriMonthAdjustment: { method, hijriYear, hijriMonth, shiftDays, source, ... }
```

### Quick Reference: API Functions

```typescript
computeHijriDate({ date }, options?) → Result<HijriDateResult>
computeHijriMonth(query, options?) → Result<HijriMonthResult>
computeHijriRange({ start, end }, options?) → Result<HijriRangeResult>
```

### Quick Reference: Import Paths

```typescript
// Preferred: Named imports from root
import { computeHijriDate, computeHijriMonth } from '@azkal182/islamic-utils';

// Also supported: Module-specific imports
import { computeHijriDate } from '@azkal182/islamic-utils/hijri-calendar';

// Type imports
import type { HijriDate, HijriMethodId } from '@azkal182/islamic-utils';
```

### Quick Reference: Common Patterns

```typescript
// Basic conversion
const result = computeHijriDate({ date: { year: 2025, month: 3, day: 15 } });

// With method
const result = computeHijriDate(
  { date: { year: 2025, month: 3, day: 15 } },
  { method: 'nu_falakiyah' }
);

// With adjustments (memory)
const result = computeHijriMonth(
  { hijri: { year: 1446, month: 9 } },
  { 
    method: 'nu_falakiyah',
    adjustments: {
      mode: 'memory',
      data: [/* adjustments */]
    }
  }
);

// With adjustments (provider)
const result = computeHijriMonth(
  { hijri: { year: 1446, month: 9 } },
  {
    adjustments: {
      mode: 'provider',
      getAdjustments: async (year) => {
        const res = await fetch(`/api/adjustments/${year}`);
        return res.json();
      }
    }
  }
);

// Error handling
if (result.success) {
  console.log(result.data);
} else {
  console.error(result.error.code, result.error.message);
}

// Using helpers
import { unwrap, unwrapOr } from '@azkal182/islamic-utils';

const data = unwrap(result); // throws if error
const data = unwrapOr(result, fallback); // returns fallback if error
```

---

## Penutup

Dokumen ini adalah **spesifikasi teknis lengkap dan final** untuk implementasi modul Hijri Calendar di `islamic-utils`.

### Penggunaan Dokumen

Dokumen ini dapat digunakan sebagai:
- ✅ Dasar implementasi kode
- ✅ Kontrak API internal
- ✅ Referensi untuk unit testing
- ✅ Panduan code review
- ✅ Dokumentasi arsitektur
- ✅ Integration checklist

### Prinsip Implementasi

1. **Konsistensi** - Ikuti pola yang sudah ada di modul existing (`prayer-times`, `qibla`, `inheritance`)
2. **Reusability** - Gunakan ulang tipe dan utility dari `src/common/`
3. **Separation of Concerns** - Pisahkan hisab, adjustment, dan keputusan resmi
4. **Type Safety** - Full TypeScript dengan strict mode
5. **Testability** - Setiap layer harus mudah di-unit test
6. **Zero Dependencies** - Tidak ada external dependencies
7. **Documentation** - JSDoc untuk semua public API

### Langkah Selanjutnya

Opsi untuk melanjutkan implementasi:

#### Option 1: Type Definitions
Saya dapat membuatkan **file `types.ts` lengkap** dengan semua interface dan type yang dibutuhkan.

#### Option 2: Core Implementation
Saya dapat membuatkan **skeleton implementasi** untuk:
- `src/hijri-calendar/core/compute-date.ts`
- `src/hijri-calendar/core/compute-month.ts`
- `src/hijri-calendar/core/compute-range.ts`

#### Option 3: Method Implementation
Saya dapat membuatkan **implementasi metode** untuk:
- Ummul Qura (dengan lookup table)
- NU Falakiyah (dengan perhitungan astronomi)

#### Option 4: Test Suite
Saya dapat membuatkan **comprehensive test suite** untuk edge cases:
- Lintas bulan
- Shift negatif/positif
- Conflict resolution
- Grid building

#### Option 5: Complete Implementation
Saya dapat membuatkan **implementasi lengkap end-to-end** dari semua komponen.

---

**Pilih langkah yang ingin dikerjakan, atau saya dapat memulai dari type definitions terlebih dahulu.**

---

## Metadata Dokumen

| Property | Value |
|----------|-------|
| **Versi** | 1.0.0 |
| **Tanggal Dibuat** | 2026-01-12 |
| **Author** | Technical Specification |
| **Repository** | https://github.com/azkal182/islamic-utils |
| **Target Version** | v0.3.0 atau v1.0.0 |
| **Status** | Draft - Ready for Implementation |

---

## Changelog Dokumen

### v1.0.0 (2026-01-12)
- ✅ Initial specification
- ✅ Struktur folder disesuaikan dengan repo existing
- ✅ Integration dengan common types (Result, DateOnly, LibraryError)
- ✅ Contoh unit test lengkap
- ✅ Development workflow guide
- ✅ Integration checklist