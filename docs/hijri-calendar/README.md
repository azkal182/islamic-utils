# Hijri Calendar

Modul ini menyediakan utilitas untuk konversi **Gregorian ↔ Hijri**, pembuatan kalender bulanan, range harian, serta dukungan:

- Metode kalkulasi: **Ummul Qura** dan **NU Falakiyah (IRNU)**
- **Adjustments** (penyesuaian keputusan) per-bulan Hijriyah
- Utilitas formatting dan grid calendar

## Instalasi

```bash
npm i @azkal182/islamic-utils
```

## Quick Start

### Konversi tanggal (Gregorian → Hijri)

```ts
import { computeHijriDate } from '@azkal182/islamic-utils/hijri-calendar';

const res = computeHijriDate({ date: { year: 2025, month: 3, day: 15 } });

if (res.success) {
  console.log(res.data.hijri);
}
```

### Pilih metode

```ts
import { computeHijriDate } from '@azkal182/islamic-utils/hijri-calendar';

const res = computeHijriDate(
  { date: { year: 2025, month: 3, day: 15 } },
  { method: 'nu_falakiyah' }
);
```

### Kalender bulanan

```ts
import { computeHijriMonth } from '@azkal182/islamic-utils/hijri-calendar';

const month = computeHijriMonth({ hijri: { year: 1446, month: 9 } });
```

## Dokumen lanjutan

- `methods.md`
- `adjustments.md`
- `api-reference.md`
- `known-limitations.md`
