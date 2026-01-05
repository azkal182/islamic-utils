# Phase C - Inheritance / Faraidh (Pembagian Waris)

> **Estimasi:** 7-10 hari
> **Prioritas:** 🔴 High (Kompleks)
> **Dependency:** Phase 0 (Core)

---

## 📋 Overview

Modul ini menghitung pembagian harta warisan Islam berdasarkan:
- Ahli waris yang sah
- Hijab (penghalang)
- Furudh (bagian tetap)
- Asabah (sisa)
- Aul dan Radd

> ⚠️ **PENTING:** Modul ini **WAJIB explainable**. Setiap hasil harus dilengkapi trace langkah perhitungan yang detail.

---

## 🎯 Objectives

1. ✅ Menghitung pembagian waris sesuai syariat Islam
2. ✅ Mendukung semua jenis ahli waris
3. ✅ Implementasi hijab lengkap
4. ✅ Implementasi aul dan radd
5. ✅ **Explainable output** (trace wajib)
6. ✅ Total pembagian = net estate

---

## 📝 Tasks

### Task C.1 - Inheritance Types

**Deskripsi:** Definisikan semua types untuk modul Faraidh.

**Files:**
- `src/inheritance/types.ts`

**Type Definitions:**

```typescript
// types.ts

// Jenis Ahli Waris
export enum HeirType {
  // Kerabat laki-laki
  HUSBAND = 'husband',
  FATHER = 'father',
  GRANDFATHER = 'grandfather',  // paternal
  SON = 'son',
  GRANDSON = 'grandson',
  BROTHER_FULL = 'brother_full',
  BROTHER_PATERNAL = 'brother_paternal',
  BROTHER_MATERNAL = 'brother_maternal',
  NEPHEW_FULL = 'nephew_full',
  NEPHEW_PATERNAL = 'nephew_paternal',
  UNCLE_FULL = 'uncle_full',
  UNCLE_PATERNAL = 'uncle_paternal',
  COUSIN_FULL = 'cousin_full',
  COUSIN_PATERNAL = 'cousin_paternal',

  // Kerabat perempuan
  WIFE = 'wife',
  MOTHER = 'mother',
  GRANDMOTHER_PATERNAL = 'grandmother_paternal',
  GRANDMOTHER_MATERNAL = 'grandmother_maternal',
  DAUGHTER = 'daughter',
  GRANDDAUGHTER = 'granddaughter',
  SISTER_FULL = 'sister_full',
  SISTER_PATERNAL = 'sister_paternal',
  SISTER_MATERNAL = 'sister_maternal',
}

// Kategori Ahli Waris
export enum HeirCategory {
  ASHAB_AL_FURUDH = 'furudh',     // Penerima bagian tetap
  ASABAH = 'asabah',              // Penerima sisa
  DHAWIL_ARHAM = 'dhawil_arham',  // Kerabat jauh (optional)
}

// Input Estate
export interface EstateInput {
  grossValue: number;          // Total harta
  debts?: number;              // Hutang
  funeralCosts?: number;       // Biaya pemakaman
  wasiyyah?: number;           // Wasiat (max 1/3)
  currency?: string;           // Optional currency code
}

// Input Ahli Waris
export interface HeirInput {
  type: HeirType;
  count: number;              // Jumlah (misal: 3 anak laki-laki)
}

// Policy Fikih
export interface InheritancePolicy {
  // Kebijakan Radd
  raddPolicy: 'include_spouse' | 'exclude_spouse';

  // Masalah kakek dengan saudara
  grandfatherWithSiblings: 'akdariyyah' | 'simple';

  // Masalah al-mushtarakah
  mushtarakahPolicy: 'standard' | 'umar';
}

// Input lengkap
export interface InheritanceInput {
  estate: EstateInput;
  heirs: HeirInput[];
  policy?: Partial<InheritancePolicy>;
  deceased: {
    gender: 'male' | 'female';
  };
}

// Output per Ahli Waris
export interface HeirShare {
  heirType: HeirType;
  count: number;
  originalShare?: Fraction;    // Bagian asli (furudh)
  finalShare: Fraction;        // Bagian final (setelah aul/radd)
  absoluteValue: number;       // Nilai dalam currency
  perPersonValue: number;      // Nilai per orang
  category: HeirCategory;
  isBlocked: boolean;          // Terhijab?
  blockedBy?: HeirType[];      // Dihijab oleh siapa?
  notes?: string[];            // Catatan tambahan
}

// Fraction untuk presisi
export interface Fraction {
  numerator: number;
  denominator: number;
  decimal: number;             // Representasi desimal
}

// Output
export interface InheritanceResult {
  netEstate: number;
  shares: HeirShare[];
  summary: {
    totalDistributed: number;
    aulApplied: boolean;
    aulRatio?: Fraction;
    raddApplied: boolean;
    raddRatio?: Fraction;
  };
  meta: {
    estate: EstateInput;
    policy: InheritancePolicy;
    baseDenominator: number;   // Asal masalah
  };
  trace: TraceStep[];          // WAJIB untuk inheritance
}
```

---

### Task C.2 - Estate Calculator

**Deskripsi:** Hitung net estate setelah dikurangi hutang, biaya pemakaman, dan wasiat.

**Files:**
- `src/inheritance/estate.ts`

**Rules:**

```typescript
// estate.ts

// Urutan pengurangan:
// 1. Biaya pemakaman
// 2. Hutang
// 3. Wasiat (max 1/3 dari sisa)

export function calculateNetEstate(input: EstateInput): Result<{
  netEstate: number;
  deductions: {
    funeralCosts: number;
    debts: number;
    wasiyyah: number;
  };
  trace: TraceStep[];
}> {
  const trace: TraceStep[] = [];

  let remaining = input.grossValue;
  trace.push({ step: 1, description: 'Gross estate', value: remaining });

  // Funeral costs
  const funeral = input.funeralCosts || 0;
  remaining -= funeral;
  trace.push({ step: 2, description: 'After funeral costs', value: remaining });

  // Debts
  const debts = input.debts || 0;
  remaining -= debts;
  trace.push({ step: 3, description: 'After debts', value: remaining });

  // Wasiyyah (max 1/3)
  let wasiyyah = input.wasiyyah || 0;
  const maxWasiyyah = remaining / 3;
  if (wasiyyah > maxWasiyyah) {
    wasiyyah = maxWasiyyah;
    trace.push({
      step: 4,
      description: 'Wasiyyah capped at 1/3',
      value: wasiyyah
    });
  }
  remaining -= wasiyyah;

  return {
    success: true,
    data: {
      netEstate: remaining,
      deductions: { funeralCosts: funeral, debts, wasiyyah },
      trace
    }
  };
}
```

---

### Task C.3 - Heir Definitions

**Deskripsi:** Definisikan karakteristik setiap jenis ahli waris.

**Files:**
- `src/inheritance/heirs/definitions.ts`
- `src/inheritance/heirs/furudh.ts`
- `src/inheritance/heirs/asabah.ts`

**Furudh Shares:**

| Bagian | Penerima |
|--------|----------|
| 1/2 | Suami (tanpa anak), anak perempuan tunggal, saudari kandung/seayah tunggal |
| 1/4 | Suami (dengan anak), istri (tanpa anak) |
| 1/8 | Istri (dengan anak) |
| 2/3 | 2+ anak perempuan, 2+ saudari kandung/seayah |
| 1/3 | Ibu (tanpa anak & saudara), 2+ saudara/i seibu |
| 1/6 | Ayah (dengan anak), ibu (dengan anak/saudara), nenek, kakek, cucu perempuan (dengan anak perempuan), saudari seayah (dengan saudari kandung) |

```typescript
// furudh.ts
export const FURUDH_RULES: FurudhRule[] = [
  {
    heir: HeirType.HUSBAND,
    conditions: [
      { share: fraction(1, 2), when: 'no descendants' },
      { share: fraction(1, 4), when: 'with descendants' }
    ]
  },
  {
    heir: HeirType.WIFE,
    conditions: [
      { share: fraction(1, 4), when: 'no descendants' },
      { share: fraction(1, 8), when: 'with descendants' }
    ]
  },
  // ... more rules
];
```

---

### Task C.4 - Hijab (Blocking) Rules

**Deskripsi:** Implementasi aturan hijab.

**Files:**
- `src/inheritance/rules/hijab.ts`

**Hijab Rules:**

```typescript
// hijab.ts

// Hijab Hirman (Totally Blocked)
export const HIJAB_HIRMAN: HijabRule[] = [
  // Grandfather blocked by father
  { heir: HeirType.GRANDFATHER, blockedBy: [HeirType.FATHER] },

  // Grandmother blocked by mother
  { heir: HeirType.GRANDMOTHER_PATERNAL, blockedBy: [HeirType.MOTHER] },
  { heir: HeirType.GRANDMOTHER_MATERNAL, blockedBy: [HeirType.MOTHER] },

  // Grandson blocked by son
  { heir: HeirType.GRANDSON, blockedBy: [HeirType.SON] },

  // Full brother blocked by son, grandson, father
  {
    heir: HeirType.BROTHER_FULL,
    blockedBy: [HeirType.SON, HeirType.GRANDSON, HeirType.FATHER]
  },

  // ... more rules
];

// Hijab Nuqsan (Partial Block - reduces share)
export const HIJAB_NUQSAN: HijabNuqsanRule[] = [
  // Husband: 1/2 → 1/4 with descendants
  { heir: HeirType.HUSBAND, reducedBy: ['descendants'], from: fraction(1,2), to: fraction(1,4) },

  // ... more rules
];

export function applyHijab(
  heirs: HeirInput[],
  deceasedGender: 'male' | 'female'
): {
  activeHeirs: HeirInput[];
  blockedHeirs: { heir: HeirInput; blockedBy: HeirType[] }[];
  trace: TraceStep[];
};
```

---

### Task C.5 - Furudh Calculator

**Deskripsi:** Hitung bagian furudh untuk setiap ahli waris.

**Files:**
- `src/inheritance/rules/furudh-calculator.ts`

```typescript
// furudh-calculator.ts

export function calculateFurudh(
  heirs: HeirInput[],
  context: InheritanceContext
): {
  shares: Map<HeirType, Fraction>;
  baseDenominator: number;  // Asal masalah
  trace: TraceStep[];
} {
  // 1. Determine shares for each heir
  // 2. Find common denominator (asal masalah)
  // 3. Calculate each share as fraction of base
}

// Asal Masalah table
export const BASE_DENOMINATORS = [2, 3, 4, 6, 8, 12, 24];

export function findBaseDenominator(fractions: Fraction[]): number;
```

---

### Task C.6 - Asabah Calculator

**Deskripsi:** Hitung bagian asabah (sisa).

**Files:**
- `src/inheritance/rules/asabah-calculator.ts`

**Asabah Types:**

1. **Asabah bi Nafs** - By themselves (male relatives)
2. **Asabah bi Ghair** - Through another (women with male siblings)
3. **Asabah ma'a Ghair** - With another (sisters with daughters)

```typescript
// asabah-calculator.ts

export enum AsabahType {
  BI_NAFS = 'bi_nafs',
  BI_GHAIR = 'bi_ghair',
  MAA_GHAIR = 'maa_ghair',
}

// Asabah priority order
export const ASABAH_PRIORITY: HeirType[] = [
  HeirType.SON,
  HeirType.GRANDSON,
  HeirType.FATHER,
  HeirType.GRANDFATHER,
  HeirType.BROTHER_FULL,
  HeirType.BROTHER_PATERNAL,
  // ... etc
];

export function calculateAsabah(
  remainingEstate: Fraction,
  heirs: HeirInput[],
  context: InheritanceContext
): {
  shares: Map<HeirType, Fraction>;
  trace: TraceStep[];
};
```

---

### Task C.7 - Aul Handler

**Deskripsi:** Handle kasus aul (ketika total furudh > 1).

**Files:**
- `src/inheritance/rules/aul.ts`

```typescript
// aul.ts

// Aul = Proportional reduction when shares exceed estate

export function detectAul(
  furudhShares: Map<HeirType, Fraction>,
  baseDenominator: number
): boolean {
  const totalNumerator = sumNumerators(furudhShares);
  return totalNumerator > baseDenominator;
}

export function applyAul(
  shares: Map<HeirType, Fraction>,
  baseDenominator: number
): {
  adjustedShares: Map<HeirType, Fraction>;
  newDenominator: number;
  trace: TraceStep[];
} {
  // New denominator = total of all numerators
  // Each share keeps same numerator but uses new denominator
}
```

**Contoh Aul:**
- Suami (1/2) + 2 saudari kandung (2/3)
- Asal masalah: 6
- Total: 3 + 4 = 7 > 6
- Baru: 3/7 dan 4/7

---

### Task C.8 - Radd Handler

**Deskripsi:** Handle kasus radd (ketika total furudh < 1 dan tidak ada asabah).

**Files:**
- `src/inheritance/rules/radd.ts`

```typescript
// radd.ts

// Radd = Redistribution when shares are less than estate
// Note: Spouse does NOT receive radd (in most madhabs)

export function detectRadd(
  furudhShares: Map<HeirType, Fraction>,
  hasAsabah: boolean
): boolean {
  if (hasAsabah) return false;
  const total = sumFractions(furudhShares);
  return total.decimal < 1;
}

export function applyRadd(
  shares: Map<HeirType, Fraction>,
  policy: InheritancePolicy
): {
  adjustedShares: Map<HeirType, Fraction>;
  trace: TraceStep[];
} {
  // Redistribute remainder proportionally to furudh holders
  // Excluding/including spouse based on policy
}
```

---

### Task C.9 - Special Cases

**Deskripsi:** Handle kasus-kasus khusus dalam faraidh.

**Files:**
- `src/inheritance/rules/special-cases.ts`

**Special Cases:**

1. **Al-Mushtarakah** (Shared case)
   - Suami + ibu + saudara/i seibu + saudara kandung
   - Saudara kandung "berbagi" dengan saudara seibu

2. **Al-Akdariyyah** (Akdar's case)
   - Suami + ibu + kakek + saudari kandung
   - Kasus rumit dengan aul khusus

3. **Al-Minbariyyah** (Pulpit case)
   - Istri + 2 anak perempuan + ayah + ibu

```typescript
// special-cases.ts

export function detectSpecialCase(
  heirs: HeirInput[],
  deceasedGender: 'male' | 'female'
): SpecialCase | null;

export function handleSpecialCase(
  specialCase: SpecialCase,
  policy: InheritancePolicy
): {
  shares: Map<HeirType, Fraction>;
  trace: TraceStep[];
};
```

---

### Task C.10 - Main Inheritance Calculator

**Deskripsi:** Fungsi utama `computeInheritance()`.

**Files:**
- `src/inheritance/calculator.ts`
- `src/inheritance/index.ts`

```typescript
// calculator.ts

export function computeInheritance(
  input: InheritanceInput
): Result<InheritanceResult> {
  const trace: TraceStep[] = [];

  // 1. Validate input
  // 2. Calculate net estate
  // 3. Apply hijab
  // 4. Check special cases
  // 5. Calculate furudh
  // 6. Calculate asabah
  // 7. Check for aul
  // 8. Check for radd
  // 9. Convert to absolute values
  // 10. Validate total = net estate
  // 11. Return result with trace
}

// index.ts (public API)
export { computeInheritance } from './calculator';
export * from './types';
```

---

### Task C.11 - Fraction Utilities

**Deskripsi:** Utility functions untuk operasi pecahan.

**Files:**
- `src/inheritance/utils/fraction.ts`

```typescript
// fraction.ts

export function fraction(num: number, den: number): Fraction;
export function addFractions(a: Fraction, b: Fraction): Fraction;
export function subtractFractions(a: Fraction, b: Fraction): Fraction;
export function multiplyFraction(f: Fraction, n: number): Fraction;
export function simplifyFraction(f: Fraction): Fraction;
export function gcd(a: number, b: number): number;
export function lcm(a: number, b: number): number;
export function toDecimal(f: Fraction): number;
```

---

### Task C.12 - Unit Tests

**Deskripsi:** Comprehensive unit tests.

**Files:**
- `tests/unit/inheritance/estate.test.ts`
- `tests/unit/inheritance/hijab.test.ts`
- `tests/unit/inheritance/furudh.test.ts`
- `tests/unit/inheritance/asabah.test.ts`
- `tests/unit/inheritance/aul.test.ts`
- `tests/unit/inheritance/radd.test.ts`
- `tests/unit/inheritance/calculator.test.ts`

---

### Task C.13 - Integration Tests with Real Cases

**Deskripsi:** Test dengan kasus waris nyata.

**Files:**
- `tests/integration/inheritance.test.ts`
- `tests/fixtures/inheritance-cases.json`

**Test Cases:**

| Case | Heirs | Expected Result |
|------|-------|-----------------|
| Simple | 1 son + 1 daughter | Son 2/3, Daughter 1/3 |
| With spouse | Husband + 2 daughters | Husband 1/4, Daughters 2/3 (shared) |
| Aul case | Husband + 2 sisters | Adjusted shares |
| Radd case | Mother + daughter | Proportional redistribution |
| Full complex | Multiple heirs | Verified against known solution |

---

## ✅ Definition of Done

- [ ] Semua jenis ahli waris didukung
- [ ] Hijab berfungsi dengan benar
- [ ] Aul dan Radd berfungsi
- [ ] Special cases handled
- [ ] **Trace selalu ada** (wajib)
- [ ] Total = Net Estate (invariant)
- [ ] Unit tests >90% coverage
- [ ] Integration tests dengan kasus nyata

---

## 📊 Progress Tracking

| Task | Status | Notes |
|------|--------|-------|
| C.1 Types | 🔴 TODO | |
| C.2 Estate Calculator | 🔴 TODO | |
| C.3 Heir Definitions | 🔴 TODO | |
| C.4 Hijab Rules | 🔴 TODO | |
| C.5 Furudh Calculator | 🔴 TODO | |
| C.6 Asabah Calculator | 🔴 TODO | |
| C.7 Aul Handler | 🔴 TODO | |
| C.8 Radd Handler | 🔴 TODO | |
| C.9 Special Cases | 🔴 TODO | |
| C.10 Main Calculator | 🔴 TODO | |
| C.11 Fraction Utils | 🔴 TODO | |
| C.12 Unit Tests | 🔴 TODO | |
| C.13 Integration Tests | 🔴 TODO | |

---

*Previous: [PHASE_B_QIBLA.md](./PHASE_B_QIBLA.md) | Next: [PHASE_4_INTEGRATION.md](./PHASE_4_INTEGRATION.md)*
