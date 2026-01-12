# Islamic Utilities Library

> Utilitas Islam yang akurat dan konsisten untuk waktu sholat, arah kiblat, dan perhitungan warisan.

[![npm version](https://img.shields.io/npm/v/@azkal182/islamic-utils.svg)](https://www.npmjs.com/package/@azkal182/islamic-utils)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)

## ✨ Fitur

| Modul | Status | Deskripsi |
|--------|--------|-------------|
| 🕌 **Waktu Sholat** | ✅ Lengkap | 9 waktu sholat dengan 13+ metode perhitungan |
| 🧭 **Arah Kiblat** | ✅ Lengkap | Arah dan jarak ke Ka'bah |
| 📜 **Warisan (Faraidh)** | ✅ Lengkap | 30+ jenis ahli waris, hijab, aul, radd, kasus khusus |
| 🗓️ **Kalender Hijriyah** | ✅ Lengkap | Konversi Gregorian ↔ Hijriyah, kalender bulanan, penyesuaian |

## 📦 Instalasi

```bash
npm install @azkal182/islamic-utils
# atau
pnpm add @azkal182/islamic-utils
# atau
yarn add @azkal182/islamic-utils
```

## 🚀 Memulai dengan Cepat

### Waktu Sholat

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

### Arah Kiblat

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

### Warisan (Faraidh)

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

### Kalender Hijriyah

```typescript
import {
  computeHijriDate,
  computeHijriMonth,
  computeHijriRange,
  formatHijriDateLong,
} from '@azkal182/islamic-utils/hijri-calendar';

// 1) Konversi satu tanggal Gregorian
const dateResult = computeHijriDate(
  { date: { year: 2026, month: 1, day: 12 } },
  { method: 'ummul_qura' }
);

if (dateResult.success) {
  console.log('Hijri:', formatHijriDateLong(dateResult.data.hijri));
}

// 2) Pilih metode (NU Falakiyah)
const nuResult = computeHijriDate(
  { date: { year: 2026, month: 1, day: 12 } },
  { method: 'nu_falakiyah' }
);

// 3) Generate kalender bulan Hijriyah
const monthResult = computeHijriMonth({ hijri: { year: 1447, month: 7 } }, { method: 'ummul_qura' });

// 4) Konversi rentang tanggal Gregorian
const rangeResult = computeHijriRange(
  {
    start: { year: 2026, month: 1, day: 1 },
    end: { year: 2026, month: 1, day: 7 },
  },
  { method: 'ummul_qura' }
);

// 5) Terapkan penyesuaian (mode memori)
const adjusted = computeHijriDate(
  { date: { year: 2025, month: 3, day: 15 } },
  {
    method: 'ummul_qura',
    adjustments: {
      mode: 'memory',
      data: [
        {
          method: 'ummul_qura',
          hijriYear: 1446,
          hijriMonth: 9,
          shiftDays: 1,
          source: 'sidang-isbat',
          revision: 1,
        },
      ],
    },
  }
);
```

Dokumentasi: `docs/hijri-calendar/README.md`

---

## 🕌 Modul Waktu Sholat

### Ringkasan

Hitung 9 waktu sholat harian dengan dukungan untuk:
- **13+ metode perhitungan** dari organisasi Islam utama
- **Penanganan lintang tinggi** untuk wilayah di atas 48.5°
- **Pilihan madzhab Asr** (Standar/Hanafi)
- **Penyesuaian waktu** dan opsi pembulatan
- **Mode trace** untuk debugging

### 9 Waktu Sholat

| Waktu | Arab | Deskripsi |
|------|--------|-------------|
| `imsak` | الإمساك | Waktu berhenti makan sebelum Subuh |
| `fajr` | الفجر | Sholat Subuh |
| `sunrise` | الشروق | Matahari terbit (Isyraq) |
| `dhuha_start` | بداية الضحى | Awal waktu Dhuha |
| `dhuha_end` | نهاية الضحى | Akhir waktu Dhuha |
| `dhuhr` | الظهر | Sholat Dzuhur |
| `asr` | العصر | Sholat Ashar |
| `maghrib` | المغرب | Sholat Maghrib |
| `isha` | العشاء | Sholat Isya |

### 13 Metode Perhitungan

| Metode | Subuh | Isya | Wilayah |
|--------|------|------|--------|
| `MWL` | 18° | 17° | Muslim World League |
| `ISNA` | 15° | 15° | Amerika Utara |
| `EGYPT` | 19.5° | 17.5° | Mesir, Afrika |
| `MAKKAH` | 18.5° | 90 menit | Arab Saudi |
| `KARACHI` | 18° | 18° | Pakistan, India |
| `TEHRAN` | 17.7° | 14° | Iran |
| `JAKIM` | 20° | 18° | Malaysia |
| `SINGAPORE` | 20° | 18° | Singapura |
| `KEMENAG` | 20° | 18° | Indonesia |
| `DIYANET` | 18° | 17° | Turki |
| `UOIF` | 12° | 12° | Prancis |
| `KUWAIT` | 18° | 17.5° | Kuwait |
| `QATAR` | 18° | 90 menit | Qatar |

### Opsi Lanjutan

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
    asrMadhhab: AsrMadhhab.HANAFI,           // Perhitungan Asr Hanafi
    highLatitudeRule: HighLatitudeRule.MIDDLE_OF_NIGHT,
  },
  {
    includeTrace: true,                       // Trace debug
  }
);
```

### Metode Perhitungan Asr

| Metode | Faktor Bayangan | Digunakan Oleh |
|--------|---------------|---------|
| `AsrMadhhab.STANDARD` | 1× panjang objek | Syafi'i, Maliki, Hanbali |
| `AsrMadhhab.HANAFI` | 2× panjang objek | Hanafi |

### Aturan Lintang Tinggi

Untuk lokasi di atas ~48.5° dimana matahari mungkin tidak mencapai sudut yang diperlukan:

| Aturan | Deskripsi |
|------|-------------|
| `NONE` | Kembalikan null jika waktu tidak dapat dihitung |
| `MIDDLE_OF_NIGHT` | Bagi malam dari Maghrib ke Subuh |
| `ONE_SEVENTH` | Porsi malam = 1/7 dari total malam |
| `ANGLE_BASED` | Proporsional dengan sudut vs durasi malam |

### Waktu Sholat Bulanan

Hitung waktu sholat untuk seluruh bulan dengan satu pemanggilan fungsi:

```typescript
import { computeMonthlyPrayerTimes, CALCULATION_METHODS } from '@azkal182/islamic-utils';

const result = computeMonthlyPrayerTimes({
  year: 2024,
  month: 3,  // Maret
  location: { latitude: -6.2088, longitude: 106.8456 },
  timezone: 7,
  params: { method: CALCULATION_METHODS.KEMENAG },
});

if (result.success) {
  // Akses semua hari
  console.log(`Hari dalam bulan: ${result.data.meta.daysInMonth}`);

  // Iterasi setiap hari
  for (const day of result.data.days) {
    console.log(`Hari ${day.day}: Subuh ${day.formatted.fajr}, Maghrib ${day.formatted.maghrib}`);
  }

  // Akses hari tertentu (indeks 0)
  const day15 = result.data.days[14]; // Hari 15
  console.log(`Hari 15 Subuh: ${day15.formatted.fajr}`);
}
```

**Tipe Return:**

```typescript
interface MonthlyPrayerTimesResult {
  days: Array<{
    day: number;           // 1-31
    date: DateOnly;        // { year, month, day }
    times: PrayerTimes;    // Jam pecahan
    formatted: PrayerTimeStrings; // Format "HH:MM"
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

### Waktu Sholat Berikutnya

Tentukan waktu sholat berikutnya berdasarkan waktu saat ini:

```typescript
import {
  getNextPrayer,
  getCurrentPrayer,
  formatMinutesUntil,
  CALCULATION_METHODS
} from '@azkal182/islamic-utils';

// API sederhana - hitung semuanya secara otomatis!
const result = getNextPrayer(
  { latitude: -6.2088, longitude: 106.8456 },
  'Asia/Jakarta',
  { method: CALCULATION_METHODS.KEMENAG }
  // currentTime default ke new Date()
);

if (result.success) {
  console.log(`Berikutnya: ${result.data.name}`);                    // "maghrib"
  console.log(`Waktu: ${result.data.time}`);                    // "18:07"
  console.log(`Dalam: ${formatMinutesUntil(result.data.minutesUntil)}`);  // "1j 30m"

  if (result.data.isNextDay) {
    console.log('(Besok)');
  }

  // Waktu sholat disertakan dalam hasil
  console.log(result.data.prayerTimes.formatted);
}

// Dapatkan periode sholat saat ini
const current = getCurrentPrayer(
  { latitude: -6.2088, longitude: 106.8456 },
  'Asia/Jakarta',
  { method: CALCULATION_METHODS.KEMENAG }
);

if (current.success && current.data.current) {
  console.log(`Periode saat ini: ${current.data.current}`);    // "asr"
}
```

**Tipe Return:**

```typescript
interface NextPrayerInfo {
  name: PrayerName;           // "maghrib"
  time: string;               // "18:07"
  timeNumeric: number;        // 18.12 (jam pecahan)
  minutesUntil: number;       // 90
  isNextDay: boolean;         // true jika lewat Isya
  prayerTimes: PrayerTimesResult;  // Waktu sholat lengkap hari ini
}

interface CurrentPrayerInfo {
  current: PrayerName | null;  // Periode sholat saat ini
  previous: PrayerName | null; // Sholat sebelumnya
  prayerTimes: PrayerTimesResult;
}
```

### Dukungan Zona Waktu

Semua fungsi mendukung **nama zona waktu IANA** dan **offset UTC**:

```typescript
// Zona waktu IANA (direkomendasikan) - menangani DST secara otomatis
timezone: 'Asia/Jakarta'
timezone: 'America/New_York'
timezone: 'Europe/London'

// Offset UTC (sederhana)
timezone: 7     // UTC+7
timezone: -5    // UTC-5
timezone: 5.5   // UTC+5:30 (India)
```

---


## 🧭 Modul Arah Kiblat

### Ringkasan

Hitung arah (bearing) dari lokasi mana pun di Bumi ke Ka'bah di Mekkah menggunakan navigasi lingkaran besar.

### Penggunaan Dasar

```typescript
import { computeQiblaDirection } from '@azkal182/islamic-utils';

const result = computeQiblaDirection({
  coordinates: { latitude: -6.2088, longitude: 106.8456 } // Jakarta
});

if (result.success) {
  console.log(`Bearing: ${result.data.bearing}°`);           // 295.15
  console.log(`Kompas: ${result.data.compassDirection}`);   // "WNW"
}
```

### Dengan Perhitungan Jarak

```typescript
const result = computeQiblaDirection(
  { coordinates: { latitude: -6.2088, longitude: 106.8456 } },
  { includeDistance: true, includeTrace: true }
);

if (result.success) {
  console.log(`Jarak: ${result.data.meta.distance} km`); // 7920.14
  console.log(`Di Ka'bah: ${result.data.meta.atKaaba}`);    // false
}
```

### Arah Kompas 16 Poin

Modul mengembalikan arah kompas: `N`, `NNE`, `NE`, `ENE`, `E`, `ESE`, `SE`, `SSE`, `S`, `SSW`, `SW`, `WSW`, `W`, `WNW`, `NW`, `NNW`

### Utilitas Lingkaran Besar

```typescript
import {
  calculateInitialBearing,
  calculateFinalBearing,
  calculateGreatCircleDistance,
  calculateMidpoint
} from '@azkal182/islamic-utils';

// Hitung bearing antara dua titik
const bearing = calculateInitialBearing(
  { latitude: -6.2, longitude: 106.8 },
  { latitude: 21.4, longitude: 39.8 }
);
```

---

## 📜 Modul Warisan (Faraidh)

### Ringkasan

Kalkulator warisan Islam lengkap yang mengimplementasikan aturan fiqh klasik:

- **30+ Jenis Ahli Waris** - Semua ahli waris yang didefinisikan Al-Quran dan Sunnah
- **7 Aturan Hijab** - Aturan pemblokiran/pengecualian ahli waris
- **10 Kasus Khusus** - Termasuk Umariyatayn, Mushtarakah, Akdariyyah
- **Aul & Radd** - Penanganan over-subscription dan sisa
- **Batas Wasiyyah** - Pemberlakuan batas 1/3 otomatis
- **Utilitas Pecahan** - Perhitungan presisi tanpa kesalahan floating-point

### Jenis Ahli Waris (30+)

#### Ahli Waris Utama (Ashab al-Furudh & Asabah)

| Kategori | Jenis | Arab |
|----------|-------|--------|
| **Pasangan** | `HUSBAND`, `WIFE` | الزوج، الزوجة |
| **Orang Tua** | `FATHER`, `MOTHER` | الأب، الأم |
| **Kakek Nenek** | `GRANDFATHER_PATERNAL`, `GRANDMOTHER_MATERNAL`, `GRANDMOTHER_PATERNAL` | الجد، الجدة |
| **Anak** | `SON`, `DAUGHTER` | الابن، البنت |
| **Cucu** | `GRANDSON_SON`, `GRANDDAUGHTER_SON` | ابن الابن، بنت الابن |

#### Saudara Kandung

| Jenis | Arab | Deskripsi |
|------|--------|-------------|
| `BROTHER_FULL` | الأخ الشقيق | Ayah dan ibu sama |
| `SISTER_FULL` | الأخت الشقيقة | Ayah dan ibu sama |
| `BROTHER_PATERNAL` | الأخ لأب | Ayah sama saja |
| `SISTER_PATERNAL` | الأخت لأب | Ayah sama saja |
| `BROTHER_UTERINE` | الأخ لأم | Ibu sama saja |
| `SISTER_UTERINE` | الأخت لأم | Ibu sama saja |

#### Asabah Diperluas

| Kategori | Jenis |
|----------|-------|
| **Keponakan** | `NEPHEW_FULL`, `NEPHEW_PATERNAL` |
| **Paman** | `UNCLE_FULL`, `UNCLE_PATERNAL` |
| **Sepupu** | `COUSIN_FULL`, `COUSIN_PATERNAL` |

### Bagian Tetap (Furudh)

| Bagian | Arab | Penerima |
|-------|--------|------------|
| **1/2** (النصف) | Suami (tanpa anak), Anak perempuan tunggal, Saudara perempuan kandung/seayah tunggal |
| **1/4** (الربع) | Suami (dengan anak), Istri (tanpa anak) |
| **1/8** (الثمن) | Istri (dengan anak) |
| **1/3** (الثلث) | Ibu (tanpa anak, <2 saudara), 2+ saudara seibu |
| **1/6** (السدس) | Ayah (dengan anak), Ibu (dengan anak), Nenek, Cucu perempuan dengan anak perempuan |
| **2/3** (الثلثان) | 2+ anak perempuan, 2+ saudara perempuan kandung/seayah |

### Asabah (Ahli Waris Residual)

| Jenis | Arab | Deskripsi |
|------|--------|-------------|
| **Asabah bi Nafs** | عصبة بالنفس | Ahli waris laki-laki yang mengambil sisa sendirian |
| **Asabah bil Ghayr** | عصبة بالغير | Perempuan dengan saudara laki-laki (rasio 2:1) |
| **Asabah maal Ghayr** | عصبة مع الغير | Saudara dengan anak perempuan |

### Aturan Hijab (Pemblokiran)

7 aturan pengecualian total yang diimplementasikan:

| Aturan | Pemblokir | Ahli Waris yang Diblokir |
|------|---------|---------------|
| E1 | Anak Laki-laki/Perempuan | Semua saudara |
| E2 | Ayah | Kakek, semua saudara, paman, keponakan, sepupu |
| E3 | Anak Laki-laki | Cucu laki-laki, Cucu perempuan |
| E4 | Ibu | Nenek dari ibu |
| E5 | Ayah | Nenek dari ayah |
| E6 | Saudara kandung laki-laki | Saudara seayah |
| E7 | Saudara seayah laki-laki | Keponakan |

### Kasus Khusus (10)

| Kasus | Arab | Kondisi |
|------|--------|-----------|
| **Umariyatayn** | العُمَرِيَّتَان | Pasangan + Ibu + Ayah, tanpa keturunan |
| **Mushtarakah** | المُشْتَرَكَة | Suami + Ibu + 2+ saudara seibu + saudara kandung |
| **Akdariyyah** | الأكدرية | Suami + Ibu + Kakek + 1 saudara perempuan kandung |
| **Maal Ghayr** | عصبة مع الغير | Anak perempuan + saudara (tanpa anak laki-laki) |
| **Completion 2/3** | تكملة الثلثين | 1 anak perempuan + cucu perempuan |

### Pengurangan Harta Warisan

Pengurangan diterapkan dalam urutan Islam:

```typescript
const result = computeInheritance({
  estate: {
    grossValue: 1_000_000_000,     // Total harta
    funeralCosts: 50_000_000,      // 1. Biaya jenazah (pertama)
    debts: 100_000_000,            // 2. Hutang (kedua)
    wasiyyah: 200_000_000,         // 3. Wasiat (maks 1/3 dari sisa)
    wasiyyahApprovedByHeirs: false, // Jika true, wasiyyah bisa melebihi 1/3
    currency: 'IDR',
  },
  heirs: [...],
  deceased: { gender: 'male' },
});
```

### Mode Trace

Untuk debugging dan verifikasi:

```typescript
const result = computeInheritance(
  { estate: {...}, heirs: [...], deceased: {...} },
  { includeTrace: true }
);

if (result.success) {
  for (const step of result.data.trace) {
    console.log(`[${step.phase}] ${step.description}`);
    if (step.arabicTerm) console.log(`  Arab: ${step.arabicTerm}`);
  }
}
```

### Contoh Lengkap

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

  console.log('=== Ringkasan Harta ===');
  console.log(`Nilai Kotor: ${data.meta.estate.grossValue}`);
  console.log(`Harta Bersih:  ${data.netEstate}`);

  console.log('\n=== Bagian Ahli Waris ===');
  for (const share of data.shares) {
    if (share.isBlocked) {
      console.log(`${share.heirType}: DIBLOKIR oleh ${share.blockedBy}`);
    } else {
      const arabic = getHeirArabicName(share.heirType);
      console.log(`${share.heirType} (${arabic})`);
      console.log(`  Kategori: ${share.category}`);
      console.log(`  Total: ${share.totalValue}`);
      console.log(`  Per Orang: ${share.perPersonValue}`);
    }
  }

  console.log('\n=== Ringkasan ===');
  console.log(`Aul Diterapkan: ${data.summary.aulApplied}`);
  console.log(`Radd Diterapkan: ${data.summary.raddApplied}`);
  console.log(`Kasus Khusus: ${data.summary.specialCase || 'Tidak ada'}`);
  console.log(`Valid: ${data.verification.isValid}`);
}
```

---

## 🎯 Pola Result

Semua fungsi library mengembalikan tipe `Result<T>` (mirip dengan Rust):

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

### Penggunaan

```typescript
const result = computePrayerTimes(...);

if (result.success) {
  // TypeScript tahu result.data ada
  console.log(result.data.times.fajr);
} else {
  // TypeScript tahu result.error ada
  console.error(result.error.message);
}

// Atau gunakan fungsi utilitas
import { unwrap, unwrapOr, isSuccess, isError } from '@azkal182/islamic-utils';

const data = unwrap(result);              // Throw error jika error
const data = unwrapOr(result, fallback);  // Kembalikan fallback jika error
```

---

## 📊 Performa

| Modul | Operasi | Kecepatan |
|--------|-----------|-------|
| Waktu Sholat | Perhitungan tunggal | ~97,500 ops/detik |
| Waktu Sholat | Tahun (365 hari) | ~264 ops/detik |
| Kiblat | Perhitungan tunggal | ~500,000+ ops/detik |
| Warisan | Kasus sederhana | ~50,000+ ops/detik |
| Warisan | Kasus kompleks | ~25,000+ ops/detik |
| Kalender Hijriyah | computeHijriDate (ummul_qura) | ~850,000+ ops/detik |
| Kalender Hijriyah | computeHijriDate (nu_falakiyah) | ~10,000+ ops/detik |

---

## 🎨 Prinsip Desain

- **Agnostik Bahasa** - Algoritma murni tanpa ketergantungan platform
- **Deterministik** - Input yang sama selalu menghasilkan output yang sama
- **Dapat Dijelaskan** - Hasil termasuk trace opsional untuk verifikasi
- **Modular** - Setiap modul dapat digunakan secara independen
- **Tanpa I/O** - Semua data eksternal disediakan oleh pemanggil
- **Type-Safe** - Dukungan penuh TypeScript dengan tipe yang ketat

---

## 🗺️ Roadmap

### ✅ Selesai (v0.2.0)

- Waktu Sholat dengan 13 metode
- Arah Kiblat dengan navigasi lingkaran besar
- Warisan (Faraidh) dengan 30+ jenis ahli waris
- Aturan Hijab, Furudh, Asabah, Aul, Radd
- Kasus khusus (Umariyatayn, Mushtarakah)
- Dokumentasi API TypeDoc
- Benchmark performa

### ✅ Selesai (v0.3.0)

- Kalender Hijriyah (Konversi Gregorian ↔ Hijriyah, bulan/rentang, metode, penyesuaian)

### 🔜 Fitur yang Direncanakan

| Fitur | Deskripsi | Prioritas |
|---------|-------------|----------|
| **Gono Gini** | Perhitungan harta bersama sebelum warisan | Tinggi |
| **Dhawil Arham** | Distribusi kerabat jauh lengkap | Sedang |
| **Kompetisi Kakek** | Perhitungan lengkap kakek dengan saudara | Sedang |
| **Kalkulator Zakat** | Perhitungan zakat untuk berbagai aset | Rendah |
| **Kalender Puasa** | Kalkulator Ramadan dan puasa sunnah | Rendah |

### 🔜 Gono Gini (Direncanakan)

Dukungan untuk hukum harta bersama pernikahan Indonesia:

```typescript
// API masa depan (direncanakan)
const result = computeInheritance({
  estate: {
    jointProperty: 600_000_000,    // Harta bersama (gono gini)
    separateProperty: 400_000_000, // Harta bawaan mayit
    // ...
  },
  // ...
});

// Harta bersama dibagi 50:50 sebelum warisan
// Yang hidup dapat: 300M (setengahnya)
// Warisan: 300M + 400M = 700M
```

---

## 📁 Contoh

Lihat [examples/](./examples/) untuk contoh penggunaan lengkap:

- [prayer-times.ts](./examples/prayer-times.ts) - Fitur Waktu Sholat
- [qibla.ts](./examples/qibla.ts) - Fitur Arah Kiblat
- [inheritance.ts](./examples/inheritance.ts) - Fitur Warisan (Faraidh)
- [hijri-calendar.ts](./examples/hijri-calendar.ts) - Kalender Hijriyah (tanggal/bulan/rentang/metode/penyesuaian)

Jalankan contoh:
```bash
npm run example:prayer-times
npm run example:qibla
npm run example:inheritance
npm run example:hijri-calendar

pnpm run example:prayer-times
pnpm run example:qibla
pnpm run example:inheritance
pnpm run example:hijri-calendar
```

---

## 📖 Dokumentasi API

Dokumentasi API lengkap dibuat dengan TypeDoc:

```bash
npm run docs

pnpm run docs
```

Dokumentasi dibuat di `docs/api/`.

---

## 🧪 Testing

```bash
npm run test           # Jalankan test dalam mode watch
npm run test:run       # Jalankan test sekali
npm run test:coverage  # Jalankan dengan coverage
npm run bench          # Jalankan benchmark

pnpm test           # Jalankan test dalam mode watch
pnpm test:run       # Jalankan test sekali
pnpm test:coverage  # Jalankan dengan coverage
pnpm bench          # Jalankan benchmark
```

---

## 📄 Lisensi

MIT © 2024

---

## 🤝 Kontribusi

Kontribusi sangat diterima! Silakan baca [Panduan Kontribusi](./CONTRIBUTING.md) untuk detailnya.

## 🙏 Penghargaan

- Metode perhitungan Islam dari organisasi-organisasi utama di seluruh dunia
- Sumber fiqh klasik untuk aturan warisan</parameter>