# ISLAMIC UTILITIES CORE LIBRARY

## Language-Agnostic Application & Core Specification

---

## 0) Tujuan, Ruang Lingkup, dan Prinsip Dasar

### 0.1 Tujuan

Library ini bertujuan menyediakan **core utilities keislaman** yang akurat, konsisten, dan dapat dipakai lintas bahasa pemrograman, dengan fokus utama pada:

1. **Perhitungan jadwal sholat** (termasuk Imsak dan Dhuha)
2. **Perhitungan arah kiblat**
3. **Perhitungan pembagian waris Islam (faraidh)**

Library dirancang sebagai **core logic murni** (pure domain logic), sehingga dapat:

- diimplementasikan pada Node.js (TypeScript),
- diporting ke Dart (pub),
- atau bahasa lain di masa depan,
  tanpa mengubah aturan, model data, maupun hasil perhitungan.

---

### 0.2 Prinsip Desain Utama

1. **Language-Agnostic**
   Semua algoritma dan aturan ditulis dalam bentuk konseptual, matematis, dan aturan fikih, tanpa ketergantungan pada bahasa tertentu.

2. **Deterministik**
   Input yang sama harus selalu menghasilkan output yang sama.

3. **Explainable Output**
   Hasil, terutama pada modul waris dan kasus edge jadwal sholat, harus dapat dijelaskan langkah demi langkah.

4. **Modular & Decoupled**
   Setiap modul berdiri sendiri dan dapat digunakan tanpa modul lain.

5. **Strict Validation**
   Semua input divalidasi secara ketat dan error dikembalikan secara terstruktur.

6. **No I/O in Core**
   Core library:

   - tidak membaca GPS,
   - tidak membaca database timezone,
   - tidak melakukan network call.
     Semua data eksternal disediakan oleh aplikasi pemanggil.

---

## 1) Konsep Umum & Kontrak Data

### 1.1 Tipe Data Konseptual

- **Date**

  - Format kalender (YYYY-MM-DD)
  - Tidak mengandung waktu

- **DateTime / Instant**

  - Waktu absolut yang terikat zona waktu

- **Timezone**

  - Minimal: UTC offset valid untuk tanggal tersebut
  - Ideal: timezone lengkap termasuk DST

- **Coordinates**

  - latitude: −90 sampai +90
  - longitude: −180 sampai +180
  - altitude_m: opsional (default 0)

- **Angle**

  - Derajat
  - Rentang dan referensi harus dijelaskan (mis. 0–360 dari utara sejati)

- **DurationMinutes**

  - Bilangan menit (boleh negatif)

---

### 1.2 Model Error (WAJIB)

Semua modul mengembalikan error terstruktur:

```
Error {
  code: string,
  message: string,
  details?: object
}
```

Contoh kode error:

- INVALID_COORDINATES
- INVALID_DATE
- INVALID_TIMEZONE
- POLAR_DAY_UNRESOLVED
- PRAYER_TIMES_INCONSISTENT
- INHERITANCE_INVALID_ESTATE
- INHERITANCE_INVALID_HEIRS

---

### 1.3 Explainability (Trace)

Output dapat menyertakan properti `trace`:

- berisi langkah perhitungan,
- aturan yang dipakai,
- fallback decision (mis. high latitude rule).

Trace dapat dimatikan untuk performa, kecuali modul waris yang **disarankan selalu explainable**.

---

## 2) Modul A — Prayer Times (Jadwal Sholat)

### 2.1 Deskripsi Umum

Modul ini menghitung waktu sholat harian berdasarkan:

- astronomi matahari,
- aturan fikih,
- parameter yang dapat dikustom.

**WAKTU YANG WAJIB DIDUKUNG:**

1. Imsak
2. Fajr (Subuh)
3. Sunrise (Terbit Matahari)
4. Dhuha
5. Dhuhr (Zuhur)
6. Asr
7. Maghrib
8. Isha

Imsak dan Dhuha adalah **bagian inti modul**, bukan fitur tambahan.

---

### 2.2 Input

#### A. LocationInput

- Coordinates (wajib)
- Altitude (opsional)

#### B. TimeContext

- Date (wajib)
- Timezone (wajib)

#### C. PrayerCalculationParams

- **method** (wajib)

  - fajr_angle
  - isha_angle **atau** isha_interval_minutes

- **asr_madhhab** (wajib)

  - STANDARD (Syafi’i / Maliki / Hanbali)
  - HANAFI

- **high_latitude_rule** (opsional)

  - NONE
  - MIDDLE_OF_NIGHT
  - ONE_SEVENTH
  - ANGLE_BASED

- **imsaak_rule** (wajib, default tersedia)

  - MINUTES_BEFORE_FAJR (mis. default 10 menit)
  - atau ANGLE_BASED

- **dhuha_rule** (wajib, default tersedia)

  - awal Dhuha:

    - MINUTES_AFTER_SUNRISE
    - atau SUN_ALTITUDE_ANGLE

  - akhir Dhuha:

    - default sebelum zawal (solar noon)

- **rounding_rule**

  - NONE
  - NEAREST_MINUTE
  - CEIL_MINUTE
  - FLOOR_MINUTE

- **adjustments_minutes**

  - penyesuaian per waktu (termasuk imsak & dhuha)

- **safety_buffer_minutes**

  - ihtiyath global atau per waktu

---

### 2.3 Output

#### PrayerTimesResult

- **times**

  - imsak
  - fajr
  - sunrise
  - dhuha_start
  - dhuha_end
  - dhuhr
  - asr
  - maghrib
  - isha

- **meta**

  - parameter final
  - koordinat
  - timezone

- **trace** (opsional)

---

### 2.4 Aturan Perhitungan (Rules)

**R1. Validasi**

- Koordinat valid
- Zona waktu tersedia
- Tanggal valid

**R2. Astronomi Inti**

- solar declination
- equation of time
- solar noon
- hour angle

**R3. Definisi Waktu**

- Fajr & Isha: sudut matahari atau interval
- Imsak: offset atau sudut khusus
- Sunrise/Sunset: standar astronomi + refraksi
- Dhuha:

  - mulai setelah matahari naik
  - berakhir sebelum zawal

- Asr:

  - shadow factor 1 (STANDARD)
  - shadow factor 2 (HANAFI)

**R4. High Latitude**

- Terapkan rule jika Fajr/Isha tidak terdefinisi
- Jika NONE → error POLAR_DAY_UNRESOLVED

**R5. Adjustments & Buffer**

- Diterapkan setelah perhitungan dasar
- Sebelum rounding

**R6. Konsistensi**

- Urutan waktu harus logis
- Jika tidak → error PRAYER_TIMES_INCONSISTENT

---

### 2.5 Method Catalog

Setiap method berisi:

- nama
- fajr_angle
- isha_angle atau isha_interval
- catatan khusus

Catalog **harus dapat diperluas oleh pengguna**.

---

## 3) Modul B — Qibla Direction

### 3.1 Deskripsi

Menghitung arah kiblat sebagai **true bearing** (utara sejati) dari lokasi pengguna menuju Ka’bah.

### 3.2 Input

- Coordinates pengguna

### 3.3 Output

- bearing_true_deg (0–360)
- meta (koordinat input & Ka’bah)
- trace (opsional)

### 3.4 Aturan

- Menggunakan great-circle initial bearing
- Koordinat Ka’bah adalah konstanta terdokumentasi
- Magnetic bearing **bukan bagian core**

---

## 4) Modul C — Inheritance (Faraidh)

### 4.1 Deskripsi

Menghitung pembagian harta warisan Islam berdasarkan:

- ahli waris yang sah,
- hijab (penghalang),
- furudh,
- asabah,
- aul dan radd.

### 4.2 Input

**Estate**

- estate_value
- debts
- funeral_costs
- wasiyyah (maks 1/3 kecuali disetujui)
- currency (opsional)

**Heirs**

- type
- count

**Policy**

- pilihan kebijakan fikih (radd, kakek vs saudara, dll)

---

### 4.3 Output

- net_estate
- shares per ahli waris
- hijab info
- meta policy
- trace langkah lengkap

---

### 4.4 Aturan Waris

- Validasi harta
- Hijab
- Furudh
- Asabah
- Aul
- Radd
- Strategi pembulatan terkontrol

Total pembagian **harus selalu sama dengan net_estate**.

---

## 5) Konfigurasi Lintas Modul

- Registry:

  - prayer methods
  - inheritance policies

- Feature flags:

  - strict_mode
  - trace_mode

- Semua output JSON-friendly

---

## 6) Non-Functional Requirements

- Akurasi astronomi
- Konsistensi fikih
- Performa tinggi
- Dokumentasi lengkap
- Tanpa network / OS dependency

---

## 7) API Konseptual

```
computePrayerTimes(...)
computeQiblaDirection(...)
computeInheritance(...)
```

---

## 8) Roadmap

- v0.1: Prayer Times + Qibla (Imsak & Dhuha included)
- v0.2: High latitude matang
- v0.3: Waris inti + trace
- v1.0: Waris lengkap & stabil
