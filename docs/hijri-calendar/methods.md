# Hijri Calendar Methods

## Built-in methods

### `ummul_qura`

- Berbasis **lookup table** (JDN) untuk performa tinggi.
- Cocok untuk kalendar Saudi (Umm al-Qura).

### `nu_falakiyah`

- Berbasis hisab astronomi minimal.
- Menggunakan kriteria **IRNU 3°–6.4°** dengan markaz Jakarta (fixed).

## Menggunakan metode

```ts
import { computeHijriDate } from '@azkal182/islamic-utils/hijri-calendar';

const res = computeHijriDate(
  { date: { year: 2025, month: 3, day: 15 } },
  { method: 'ummul_qura' }
);
```

## Registrasi metode custom

Registry tersedia melalui `hijri-calendar/methods`.

```ts
import { registerMethod } from '@azkal182/islamic-utils/hijri-calendar';

// registerMethod('my_method', { ... })
```
