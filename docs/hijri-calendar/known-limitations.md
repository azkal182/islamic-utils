# Known Limitations & Future Optimizations

Dokumen ini mencatat keterbatasan saat ini dan ide optimasi yang bisa dikerjakan di iterasi berikutnya.

## 1) NU Falakiyah (IRNU) accuracy model

- Implementasi `nu_falakiyah` saat ini menggunakan model astronomi **minimal** untuk posisi Bulan.
- Targetnya adalah menyediakan engine yang konsisten dan testable; untuk akurasi yang lebih tinggi, pertimbangkan:
  - Menggunakan algoritma Bulan yang lebih lengkap (Meeus full terms / ephemeris-level).
  - Menambahkan pencarian event ijtima' (konjungsi) dan aturan awal bulan yang lebih ketat (tidak hanya window ±2 hari dari seed).

## 2) Adjustment provider async

- API `computeHijri*` saat ini **sinkron** sehingga `adjustments.mode='provider'` hanya mendukung provider yang mengembalikan array secara langsung.
- Jika ingin mendukung provider async (Promise/HTTP), perlu menambahkan API async (mis. `computeHijriDateAsync`) atau strategi prefetch/caching.

## 3) JSON adjustments in browser

- Mode `json` menggunakan `fs.readFileSync`, sehingga hanya cocok untuk environment Node.js.
- Untuk browser, gunakan mode `memory` atau `provider`.

## 4) Performance optimizations

- Ummul Qura sudah memakai lookup table dan binary search (cepat).
- Untuk NU Falakiyah, optimasi yang mungkin:
  - Cache hasil start-of-month per (year,month,method).
  - Cache perhitungan maghrib dan posisi Bulan/Matahari di tanggal yang sering diakses.

### Catatan benchmark (indikatif)

Benchmark `benchmarks/hijri-calendar.bench.ts` menunjukkan pola umum:

- `ummul_qura` jauh lebih cepat daripada `nu_falakiyah`.
- `computeHijriMonth` untuk query Gregorian lebih mahal karena melakukan konversi setiap hari di bulan Gregorian.

Ini normal untuk implementasi sekarang. Jika membutuhkan performa tinggi untuk `nu_falakiyah`, cache adalah prioritas utama.

## 5) Calendar grid builder

- Saat ini `computeHijriMonth` masih memiliki internal grid builder dan juga tersedia `utils/grid-builder`.
- Ke depan bisa dipertimbangkan untuk menyatukan agar tidak ada duplikasi logic.

## 6) Repo QA notes (non-blocking warnings)

Saat menjalankan QA:

- `eslint src` masih menghasilkan beberapa warning (bukan error) di modul lain (mis. `inheritance`).
- `typedoc` menghasilkan beberapa warning (tag JSDoc tertentu dan beberapa reference type yang tidak masuk dokumentasi).

Semua ini tidak memblokir build/test, tapi dapat dirapikan di iterasi berikutnya.
