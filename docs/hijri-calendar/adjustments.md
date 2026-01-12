# Hijri Calendar Adjustments

Adjustments digunakan untuk menggeser **awal bulan** Hijriyah (bukan mengubah hari individual).

## `shiftDays`

- `+1`: awal bulan mundur 1 hari dari hisab (tanggal Gregorian lebih awal)
- `-1`: awal bulan maju 1 hari dari hisab (tanggal Gregorian lebih lambat)

## Mode

### `none`
Tidak ada penyesuaian.

### `memory`

```ts
import { computeHijriDate } from '@azkal182/islamic-utils/hijri-calendar';

const res = computeHijriDate(
  { date: { year: 2025, month: 3, day: 15 } },
  {
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

### `json`

```ts
const res = computeHijriDate(
  { date: { year: 2025, month: 3, day: 15 } },
  { adjustments: { mode: 'json', filePath: './data/hijri-adjustments.json' } }
);
```

### `provider`

Catatan: API `computeHijri*` saat ini bersifat **sinkron**, jadi provider harus mengembalikan array (bukan Promise).

```ts
const res = computeHijriDate(
  { date: { year: 2025, month: 3, day: 15 } },
  {
    adjustments: {
      mode: 'provider',
      getAdjustments: (hijriYear, method) => {
        return [];
      },
    },
  }
);
```
