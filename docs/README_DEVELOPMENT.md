# Islamic Utils Library - Development Guide

> **Language-Agnostic Islamic Utilities Core Library**
>
> Node.js TypeScript Implementation

---

## 📋 Daftar Isi

1. [Overview](#overview)
2. [Arsitektur Library](#arsitektur-library)
3. [Modul-Modul](#modul-modul)
4. [Struktur Folder](#struktur-folder)
5. [Development Phases](#development-phases)
6. [Quick Links](#quick-links)

---

## Overview

Library ini menyediakan **core utilities keislaman** yang akurat, konsisten, dan dapat dipakai lintas bahasa pemrograman, dengan fokus utama pada:

| Modul | Deskripsi | Status |
|-------|-----------|--------|
| **A. Prayer Times** | Perhitungan jadwal sholat (termasuk Imsak & Dhuha) | 🔴 Planned |
| **B. Qibla Direction** | Perhitungan arah kiblat | 🔴 Planned |
| **C. Inheritance (Faraidh)** | Perhitungan pembagian waris Islam | 🔴 Planned |

### Prinsip Desain

1. **Language-Agnostic** - Algoritma murni tanpa ketergantungan bahasa tertentu
2. **Deterministik** - Input sama = Output sama
3. **Explainable Output** - Hasil dapat dijelaskan langkah demi langkah
4. **Modular & Decoupled** - Setiap modul berdiri sendiri
5. **Strict Validation** - Validasi input ketat dengan error terstruktur
6. **No I/O in Core** - Tidak ada GPS, database, atau network call

---

## Arsitektur Library

```
┌─────────────────────────────────────────────────────────────┐
│                     APPLICATION LAYER                        │
│              (User's App - provides coordinates, etc)        │
└─────────────────────────────────┬───────────────────────────┘
                                  │
┌─────────────────────────────────▼───────────────────────────┐
│                    ISLAMIC-UTILS LIBRARY                     │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │   Prayer    │  │   Qibla     │  │     Inheritance     │  │
│  │   Times     │  │  Direction  │  │      (Faraidh)      │  │
│  └──────┬──────┘  └──────┬──────┘  └──────────┬──────────┘  │
│         │                │                     │             │
│  ┌──────▼────────────────▼─────────────────────▼──────────┐ │
│  │                    CORE / SHARED                        │ │
│  │  • Types & Interfaces    • Validators                   │ │
│  │  • Astronomical Utils    • Error Handling               │ │
│  │  • Math Helpers          • Constants                    │ │
│  └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

---

## Modul-Modul

### 📿 Modul A - Prayer Times (Jadwal Sholat)

**Waktu yang didukung:**
- Imsak, Fajr (Subuh), Sunrise, Dhuha, Dhuhr (Zuhur), Asr, Maghrib, Isha

**Fitur Utama:**
- Multiple calculation methods (MWL, ISNA, Egyptian, Umm al-Qura, etc.)
- High latitude rules
- Adjustable parameters
- Asr calculation (Syafi'i/Hanafi)

📄 **Detail:** [PHASE_A_PRAYER_TIMES.md](./phases/PHASE_A_PRAYER_TIMES.md)

---

### 🧭 Modul B - Qibla Direction (Arah Kiblat)

**Fitur Utama:**
- Great-circle bearing calculation
- True north bearing (0-360°)
- Koordinat Ka'bah sebagai konstanta

📄 **Detail:** [PHASE_B_QIBLA.md](./phases/PHASE_B_QIBLA.md)

---

### 💰 Modul C - Inheritance/Faraidh (Pembagian Waris)

**Fitur Utama:**
- Perhitungan furudh (bagian tetap)
- Perhitungan asabah (sisa)
- Hijab (penghalang waris)
- Aul dan Radd
- Explainable trace

📄 **Detail:** [PHASE_C_INHERITANCE.md](./phases/PHASE_C_INHERITANCE.md)

---

## Struktur Folder

```
islamic-utils/
├── src/
│   ├── core/                    # Shared utilities
│   │   ├── types/               # Common type definitions
│   │   ├── errors/              # Error classes & codes
│   │   ├── validators/          # Input validators
│   │   ├── constants/           # Global constants
│   │   └── utils/               # Helper functions
│   │
│   ├── astronomy/               # Astronomical calculations
│   │   ├── solar.ts             # Sun position calculations
│   │   ├── time.ts              # Time conversions
│   │   └── angles.ts            # Angle utilities
│   │
│   ├── prayer-times/            # Module A
│   │   ├── types.ts             # Prayer-specific types
│   │   ├── methods/             # Calculation methods catalog
│   │   ├── calculator.ts        # Main calculation logic
│   │   ├── high-latitude.ts     # High latitude rules
│   │   └── index.ts             # Public API
│   │
│   ├── qibla/                   # Module B
│   │   ├── types.ts             # Qibla-specific types
│   │   ├── calculator.ts        # Bearing calculation
│   │   └── index.ts             # Public API
│   │
│   ├── inheritance/             # Module C
│   │   ├── types.ts             # Inheritance types
│   │   ├── heirs/               # Heir definitions
│   │   ├── rules/               # Fiqh rules
│   │   ├── calculator.ts        # Distribution logic
│   │   └── index.ts             # Public API
│   │
│   └── index.ts                 # Main entry point
│
├── tests/
│   ├── unit/                    # Unit tests per module
│   ├── integration/             # Integration tests
│   └── fixtures/                # Test data
│
├── docs/
│   ├── phases/                  # Phase documentation
│   └── api/                     # API documentation
│
├── package.json
├── tsconfig.json
├── vitest.config.ts
└── README.md
```

---

## Development Phases

### 🔵 Phase 0 - Project Setup & Core
> Estimasi: 2-3 hari

Setup project TypeScript dan shared utilities.

📄 [PHASE_0_CORE.md](./phases/PHASE_0_CORE.md)

---

### 🟢 Phase 1 - Prayer Times (Modul A)
> Estimasi: 5-7 hari

Implementasi lengkap perhitungan jadwal sholat.

📄 [PHASE_A_PRAYER_TIMES.md](./phases/PHASE_A_PRAYER_TIMES.md)

---

### 🟡 Phase 2 - Qibla Direction (Modul B)
> Estimasi: 1-2 hari

Implementasi perhitungan arah kiblat.

📄 [PHASE_B_QIBLA.md](./phases/PHASE_B_QIBLA.md)

---

### 🔴 Phase 3 - Inheritance (Modul C)
> Estimasi: 7-10 hari

Implementasi perhitungan pembagian waris Islam.

📄 [PHASE_C_INHERITANCE.md](./phases/PHASE_C_INHERITANCE.md)

---

### ⚪ Phase 4 - Integration & Documentation
> Estimasi: 2-3 hari

Final integration, documentation, dan publishing.

📄 [PHASE_4_INTEGRATION.md](./phases/PHASE_4_INTEGRATION.md)

---

## Quick Links

| Dokumen | Deskripsi |
|---------|-----------|
| [SPEC.md](../SPEC.md) | Spesifikasi lengkap library |
| [PHASE_0_CORE.md](./phases/PHASE_0_CORE.md) | Setup & Core utilities |
| [PHASE_A_PRAYER_TIMES.md](./phases/PHASE_A_PRAYER_TIMES.md) | Modul Prayer Times |
| [PHASE_B_QIBLA.md](./phases/PHASE_B_QIBLA.md) | Modul Qibla |
| [PHASE_C_INHERITANCE.md](./phases/PHASE_C_INHERITANCE.md) | Modul Inheritance |
| [PHASE_4_INTEGRATION.md](./phases/PHASE_4_INTEGRATION.md) | Final Integration |

---

## Roadmap

| Version | Target | Status |
|---------|--------|--------|
| v0.1 | Prayer Times + Qibla (Imsak & Dhuha included) | 🔴 Planned |
| v0.2 | High latitude matang | 🔴 Planned |
| v0.3 | Waris inti + trace | 🔴 Planned |
| v1.0 | Waris lengkap & stabil | 🔴 Planned |

---

*Last Updated: 2026-01-06*
