# Hijri Calendar Implementation Plan

> **Scope:** Implementasi modul Hijri Calendar sesuai spesifikasi di [docs/HIJRI_CALENDAR_PLAN.md](./HIJRI_CALENDAR_PLAN.md)
> **Status:** Draft (Siap dieksekusi)
> **Tanggal:** 2026-01-12

## Daftar Isi

1. [Phase 0 – Preparation & Foundation](#phase-0--preparation--foundation)
2. [Phase 1 – Data Contracts & Constants](#phase-1--data-contracts--constants)
3. [Phase 2 – Core Conversion Engine](#phase-2--core-conversion-engine)
4. [Phase 3 – Calculation Methods](#phase-3--calculation-methods)
5. [Phase 4 – Adjustment System](#phase-4--adjustment-system)
6. [Phase 5 – Utilities & Formatting](#phase-5--utilities--formatting)
7. [Phase 6 – Documentation & Examples](#phase-6--documentation--examples)
8. [Phase 7 – QA, Benchmarks & Integration](#phase-7--qa-benchmarks--integration)

---

## Phase 0 – Preparation & Foundation

- [x] Audit struktur repo, pola penamaan file, dan konvensi ekspor modul.
- [x] Buat kerangka folder `src/hijri-calendar/` beserta subfolder (`core/`, `methods/`, `adjustments/`, `utils/`).
- [x] Siapkan kerangka `tests/hijri-calendar/`, `docs/hijri-calendar/`, `examples/`, dan `benchmarks/` (placeholder kosong).
- [x] Tambahkan stub ekspor non-breaking di `src/index.ts`, `package.json` (`exports`), dan `typedoc.json`.
- [x] Tambahkan entri awal di `CHANGELOG.md` (status planned) dan catatan TODO di README utama (opsional jika dibutuhkan).

## Phase 1 – Data Contracts & Constants

- [x] Implement `src/hijri-calendar/types.ts` (alias `DateOnly`, tipe `Result`, opsi kalender, tipe adjustment, dsb.).
- [x] Implement `src/hijri-calendar/constants.ts` (nama bulan, panjang default, rentang tanggal, kode metode).
- [x] Implement validator dasar di `src/hijri-calendar/utils/validators.ts` + re-export di `utils/index.ts`.
- [x] Buat unit test untuk validator dan tipe (mis. validasi date, method id).
- [x] Update `src/hijri-calendar/index.ts` agar mengekspor tipe dan konstanta baru.

## Phase 2 – Core Conversion Engine

- [x] Implement helper internal (`core/helpers.ts`) untuk kalkulasi dasar, normalisasi tanggal, dan util trace.
- [x] Implement `core/compute-date.ts` yang mengembalikan `Result<HijriDateResult>`.
- [x] Implement `core/compute-month.ts` (mendukung query Hijriyah & Gregorian, generate grid mingguan).
- [x] Implement `core/compute-range.ts` untuk rentang tanggal Gregorian.
- [x] Tambahkan unit test pada masing-masing fungsi core.
- [x] Update `core/index.ts` dan `src/hijri-calendar/index.ts` untuk mengekspos fungsi core.

## Phase 3 – Calculation Methods

- [x] Definisikan kontrak metode di `methods/types.ts` dan registry di `methods/index.ts`.
- [x] Implementasi metode **Ummul Qura** (`methods/ummul-qura/`) termasuk tabel lookup dan konversi.
- [x] Implementasi metode **NU Falakiyah** (`methods/nu-falakiyah/`) beserta kalkulasi astronomi minimum.
- [x] Tambahkan unit test untuk tiap metode (kasus normal, out-of-range, integrasi dengan core).
- [x] Integrasikan metode ke pipeline core (`compute-date`, `compute-month`).

## Phase 4 – Adjustment System

- [x] Implement tipe dan API publik di `adjustments/types.ts` dan `adjustments/index.ts`.
- [x] Implement backend penyimpanan: `stores/memory.ts`, `stores/json.ts`, `stores/provider.ts`.
- [x] Implement resolver konflik (`adjustments/resolver.ts`) dan logic aplikasi (`adjustments/apply.ts`).
- [x] Tambahkan unit & integration test untuk setiap mode adjustment dan resolusi konflik.
- [x] Integrasikan sistem adjustment ke fungsi core.

## Phase 5 – Utilities & Formatting

- [x] Implement `utils/formatters.ts` untuk format tanggal, label bulan, dsb.
- [x] Implement `utils/grid-builder.ts` untuk membangun layout kalender mingguan dengan variasi awal pekan.
- [x] Tambahkan unit test untuk formatter dan grid builder (termasuk variasi `weekStartsOn`).
- [x] Update `utils/index.ts` untuk ekspor utilitas baru.

## Phase 6 – Documentation & Examples

- [x] Lengkapi `docs/hijri-calendar/README.md` (overview + quick start).
- [x] Buat `docs/hijri-calendar/methods.md`, `adjustments.md`, dan `api-reference.md`.
- [x] Tambahkan `examples/hijri-calendar.ts` mencakup konversi tunggal, bulanan, range, adjustment, dan metode.
- [x] Update README root (tabel fitur + quick start snippet Hijri Calendar).
- [x] Update `CHANGELOG.md` dengan status progres terbaru.

## Phase 7 – QA, Benchmarks & Integration

- [x] Tambahkan benchmark di `benchmarks/hijri-calendar.bench.ts`.
- [x] Verifikasi lint, test unit, test integrasi, coverage, dan `tsc --noEmit`.
- [x] Pastikan `typedoc` dapat membangkitkan dokumentasi tanpa error.
- [x] Finalisasi entri `package.json` (exports path) dan pastikan bundler `tsup` mengenali modul baru.
- [x] Siapkan ringkasan hasil & risiko (untuk laporan ke pemilik repo).
