# Phase C - Inheritance / Faraidh (Pembagian Waris)

> **Estimasi:** 7-10 hari
> **Prioritas:** 🔴 High (Most Complex)
> **Dependency:** Phase 0 (Core)
> **Reference Docs:**
> - `DECISION_MATRIX_WARIS.md` - Rule engine DSL
> - `SPECIAL_CASE_RULES_INHERITANCE.md` - Special case handling

---

## 📋 Overview

Modul ini menghitung pembagian harta warisan Islam berdasarkan:
- **Net Estate** - Harta bersih setelah dikurangi utang, biaya pemakaman, wasiat
- **Hijab Hirman** - Penghalang total
- **Furudh** - Bagian tetap (1/2, 1/3, 1/4, 1/6, 1/8, 2/3)
- **Asabah** - Penerima sisa
- **Special Cases** - 10 kasus khusus yang override aturan umum
- **Aul** - Penyesuaian jika total furudh > 1
- **Radd** - Redistribusi jika total furudh < 1 dan tidak ada asabah

> ⚠️ **CRITICAL REQUIREMENTS:**
> 1. **Trace Mode WAJIB** - Setiap langkah perhitungan harus di-trace
> 2. **Rule Conflict Validator** - Deteksi jika 2+ special case aktif bersamaan (HARUS mustahil)
> 3. **Trace Comparator Ready** - Hasil dapat diverifikasi dengan kitab faraidh

---

## 🎯 Objectives

1. ✅ Menghitung pembagian waris sesuai syariat Islam
2. ✅ Mendukung 30+ jenis ahli waris
3. ✅ Implementasi 7 hijab hirman rules
4. ✅ Implementasi 10 special cases
5. ✅ Implementasi aul dan radd
6. ✅ **Explainable output** dengan trace detail
7. ✅ **Rule Conflict Validator** - Mencegah conflict special cases
8. ✅ **Configurable Ikhtilaf** - 4 policy switches
9. ✅ Total pembagian = net estate (invariant)

---

## 📝 Tasks

### Task C.1 - Types & Enums

**Deskripsi:** Definisikan semua types berdasarkan DECISION_MATRIX_WARIS.md.

**Files:**
- `src/inheritance/types.ts`

**Heir Types (30+ types):**

```typescript
// === SPOUSE ===
HUSBAND = 'husband',
WIFE = 'wife',

// === ASCENDANTS ===
FATHER = 'father',
MOTHER = 'mother',
GRANDFATHER_PATERNAL = 'grandfather_paternal',
GRANDMOTHER_MATERNAL = 'grandmother_maternal',
GRANDMOTHER_PATERNAL = 'grandmother_paternal',

// === DESCENDANTS ===
SON = 'son',
DAUGHTER = 'daughter',
GRANDSON_SON = 'grandson_son',
GRANDDAUGHTER_SON = 'granddaughter_son',

// === SIBLINGS ===
BROTHER_FULL = 'brother_full',
SISTER_FULL = 'sister_full',
BROTHER_PATERNAL = 'brother_paternal',
SISTER_PATERNAL = 'sister_paternal',
BROTHER_UTERINE = 'brother_uterine',
SISTER_UTERINE = 'sister_uterine',

// === EXTENDED ASABAH ===
NEPHEW_FULL = 'nephew_full',
NEPHEW_PATERNAL = 'nephew_paternal',
UNCLE_FULL = 'uncle_full',
UNCLE_PATERNAL = 'uncle_paternal',
COUSIN_FULL = 'cousin_full',
COUSIN_PATERNAL = 'cousin_paternal',

// === DHAWIL ARHAM ===
GRANDCHILD_DAUGHTER = 'grandchild_daughter',
AUNT_MATERNAL = 'aunt_maternal',
AUNT_PATERNAL = 'aunt_paternal',
UNCLE_MATERNAL = 'uncle_maternal',
```

**Policy Configuration (4 Ikhtilaf Switches):**

```typescript
interface InheritancePolicy {
  // Apakah spouse mendapat radd?
  raddIncludesSpouse: boolean;  // default: false

  // Mode kakek dengan saudara
  grandfatherMode: 'LIKE_FATHER' | 'COMPETE_WITH_SIBLINGS';

  // Dhawil arham handling
  dhawilArhamMode: 'ENABLED' | 'BAITUL_MAL';

  // Aturan saudara untuk ibu
  motherSiblingRule: 'COUNT_ALL' | 'EXCLUDE_UTERINE';
}
```

---

### Task C.2 - Derived Flags Calculator

**Deskripsi:** Hitung boolean flags berdasarkan heir list.

**Files:**
- `src/inheritance/flags.ts`

**Flags (dari DECISION_MATRIX_WARIS.md Section 2):**

```typescript
interface DerivedFlags {
  HAS_CHILD: boolean;           // SON + DAUGHTER > 0
  HAS_SON: boolean;
  HAS_DAUGHTER: boolean;
  HAS_GRANDSON: boolean;
  HAS_DESCENDANT: boolean;      // HAS_CHILD OR HAS_GRANDSON
  HAS_FATHER: boolean;
  HAS_MOTHER: boolean;
  HAS_GRANDFATHER: boolean;
  HAS_SIBLINGS_TOTAL: number;   // All siblings count
  HAS_TWO_OR_MORE_SIBLINGS: boolean;
}

function calculateFlags(heirs: HeirInput[]): DerivedFlags;
```

---

### Task C.3 - Estate Calculator

**Deskripsi:** Hitung net estate.

**Files:**
- `src/inheritance/estate.ts`

**Rules (dari DECISION_MATRIX_WARIS.md Section 0):**

```spec
NET_ESTATE_RULE:
  net_estate = gross_estate - debts - funeral_costs - allowed_wasiyyah

WASIYYAH_RULE:
  allowed_wasiyyah = MIN(wasiyyah, (gross_estate - debts - funeral_costs) * 1/3)
  OVERRIDE_IF wasiyyah_approved_by_heirs == true

ERROR_IF net_estate < 0
```

---

### Task C.4 - Hijab Hirman Rules

**Deskripsi:** Implementasi 7 aturan penghalang total.

**Files:**
- `src/inheritance/rules/hijab.ts`

**Rules (dari DECISION_MATRIX_WARIS.md Section 4):**

| Rule | IF | THEN EXCLUDE |
|------|-----|--------------|
| E1 | HAS_DESCENDANT | All siblings |
| E2 | HAS_FATHER | Grandfather, all brothers, nephews, uncles, cousins |
| E3 | HAS_SON | Grandson, Granddaughter |
| E4 | HAS_MOTHER | Grandmother maternal |
| E5 | HAS_FATHER | Grandmother paternal |
| E6 | BROTHER_FULL > 0 | Brother/Sister paternal |
| E7 | BROTHER_PATERNAL > 0 | Nephews |

---

### Task C.5 - Furudh Calculator

**Deskripsi:** Hitung bagian tetap untuk setiap ahli waris.

**Files:**
- `src/inheritance/rules/furudh.ts`

**Furudh Rules (dari DECISION_MATRIX_WARIS.md Section 5):**

| Heir | Condition | Share |
|------|-----------|-------|
| Husband | No descendant | 1/2 |
| Husband | With descendant | 1/4 |
| Wife | No descendant | 1/4 |
| Wife | With descendant | 1/8 |
| Mother | No desc & < 2 siblings | 1/3 |
| Mother | With desc OR >= 2 siblings | 1/6 |
| Father | With son | 1/6 (furudh only) |
| Father | With desc but no son | 1/6 + asabah |
| Father | No descendant | asabah only |
| Daughter(1) | No son | 1/2 |
| Daughter(2+) | No son | 2/3 shared |
| Daughter | With son | asabah bil ghayr (2:1) |
| ... | ... | ... |

---

### Task C.6 - Asabah Calculator

**Deskripsi:** Hitung bagian sisa.

**Files:**
- `src/inheritance/rules/asabah.ts`

**Asabah Priority Order (dari DECISION_MATRIX_WARIS.md Section 6):**

```
1. SON
2. GRANDSON_SON
3. FATHER
4. GRANDFATHER_PATERNAL (with policy)
5. BROTHER_FULL
6. BROTHER_PATERNAL
7. NEPHEW_FULL
8. NEPHEW_PATERNAL
9. UNCLE_FULL
10. UNCLE_PATERNAL
11. COUSIN_FULL
12. COUSIN_PATERNAL
```

**Asabah Types:**
- **Asabah bi Nafs** - Male by themselves
- **Asabah bil Ghayr** - Female + male same level (2:1 ratio)
- **Asabah ma'al Ghayr** - Sister with daughter

---

### Task C.7 - Special Cases Handler ⚠️ CRITICAL

**Deskripsi:** Implementasi 10 special cases dengan priority order.

**Files:**
- `src/inheritance/rules/special-cases.ts`
- `src/inheritance/rules/special-cases/umariyatayn.ts`
- `src/inheritance/rules/special-cases/mushtarakah.ts`
- `src/inheritance/rules/special-cases/akdariyyah.ts`
- ... (per case)

**Special Cases (dari SPECIAL_CASE_RULES_INHERITANCE.md):**

| Priority | Case | Condition |
|----------|------|-----------|
| 1 | **UMARIYATAYN** | Spouse + Mother + Father, no descendant |
| 2 | **MUSHTARAKAH** | Husband + Mother + uterine siblings + full siblings |
| 3 | **AKDARIYYAH** | Husband + Mother + Grandfather + 1 Sister full |
| 4 | **SISTERS_MAAL_GHAYR** | Daughter + Sisters, no son |
| 5 | **COMPLETION_TWO_THIRDS** | 1 Daughter + Granddaughters |
| 6 | **KALALAH_UTERINE** | No desc, no father, only uterine siblings |
| 7 | **MULTIPLE_GRANDMOTHERS** | Multiple grandmothers share 1/6 |
| 8 | **RADD** | Total furudh < 1, no asabah |
| 9 | **DHAWIL_ARHAM** | No furudh, no asabah |
| 10 | **NO_HEIRS** | Assign to Baitul Mal |

**Key Implementation:**

```typescript
interface SpecialCase {
  id: string;
  name: string;
  arabicName: string;
  detect: (context: InheritanceContext) => boolean;
  apply: (context: InheritanceContext) => SpecialCaseResult;
  overrides: string[];  // What rules to disable
}

function detectSpecialCase(context): SpecialCase | null;
function applySpecialCase(case: SpecialCase, context): Result;
```

---

### Task C.8 - Rule Conflict Validator ⚠️ CRITICAL

**Deskripsi:** Validasi bahwa tidak ada 2 special case aktif bersamaan.

**Files:**
- `src/inheritance/validation/rule-conflict.ts`

**Implementation:**

```typescript
interface ConflictValidationResult {
  valid: boolean;
  activeCases: string[];
  conflicts: Array<{
    case1: string;
    case2: string;
    reason: string;
  }>;
}

function validateNoConflicts(
  heirs: HeirInput[],
  flags: DerivedFlags,
  policy: InheritancePolicy
): Result<ConflictValidationResult>;

// MUST return error if:
// - More than 1 special case detected
// - Conflicting rules activated

// This should be IMPOSSIBLE by design
// But validator ensures engine correctness
```

**Test Cases for Conflict Validator:**
1. Test all 10 special case conditions are mutually exclusive
2. Test no combination of heirs activates > 1 special case
3. Test policy variations don't create conflicts

---

### Task C.9 - Aul Handler

**Deskripsi:** Handle over-subscription (total furudh > 1).

**Files:**
- `src/inheritance/rules/aul.ts`

```spec
AUL_RULE:
  IF TOTAL_FURUDH > 1
  THEN FOR EACH FURUDH:
    adjusted_share = share / TOTAL_FURUDH
  NO_REMAINDER
```

---

### Task C.10 - Radd Handler

**Deskripsi:** Handle under-subscription (total furudh < 1, no asabah).

**Files:**
- `src/inheritance/rules/radd.ts`

```spec
RADD_RULE:
  IF TOTAL_FURUDH < 1 AND NO_ASABAH_EXISTS
  THEN DISTRIBUTE REMAINDER TO:
    ALL_FURUDH_HOLDERS
    EXCEPT SPOUSE IF RADD_INCLUDES_SPOUSE == false
```

---

### Task C.11 - Fraction Utilities

**Deskripsi:** Operasi pecahan dengan presisi.

**Files:**
- `src/inheritance/utils/fraction.ts`

```typescript
interface Fraction {
  numerator: number;
  denominator: number;
}

function fraction(num: number, den: number): Fraction;
function add(a: Fraction, b: Fraction): Fraction;
function subtract(a: Fraction, b: Fraction): Fraction;
function multiply(a: Fraction, n: number): Fraction;
function divide(a: Fraction, b: Fraction): Fraction;
function simplify(f: Fraction): Fraction;
function toDecimal(f: Fraction): number;
function gcd(a: number, b: number): number;
function lcm(a: number, b: number): number;
function findCommonDenominator(fractions: Fraction[]): number;
```

---

### Task C.12 - Main Calculator

**Deskripsi:** Fungsi utama `computeInheritance()`.

**Files:**
- `src/inheritance/calculator.ts`
- `src/inheritance/index.ts`

**Calculation Flow:**

```
1. Validate input
2. Calculate net estate
3. Calculate derived flags
4. Apply hijab hirman (exclusion)
5. Detect special case (only 0 or 1 allowed)
   ↳ Validate no conflicts (CRITICAL)
6. If special case: apply override
7. Else: calculate furudh → asabah → aul/radd
8. Convert to absolute values
9. Validate sum = net_estate
10. Build trace
11. Return result
```

---

### Task C.13 - Trace Comparator ⚠️ CRITICAL

**Deskripsi:** Trace yang dapat diverifikasi dengan kitab faraidh.

**Files:**
- `src/inheritance/trace/builder.ts`
- `src/inheritance/trace/formatter.ts`

**Trace Format:**

```typescript
interface InheritanceTraceStep {
  step: number;
  phase: 'ESTATE' | 'HIJAB' | 'SPECIAL_CASE' | 'FURUDH' | 'ASABAH' | 'AUL' | 'RADD' | 'FINAL';
  description: string;
  descriptionArabic?: string;  // Arabic term for verification
  calculation?: string;         // e.g., "1/2 × 100,000,000 = 50,000,000"
  reference?: string;           // Kitab reference if applicable
  value?: unknown;
}

interface InheritanceTrace {
  steps: InheritanceTraceStep[];
  summary: {
    asalMasalah: number;        // Base denominator
    totalFurudh: Fraction;
    aulApplied: boolean;
    raddApplied: boolean;
    specialCase?: string;
  };
  verification: {
    sumOfShares: number;
    netEstate: number;
    isValid: boolean;           // sum === netEstate
  };
}
```

**Example Trace Output:**

```
Step 1 [ESTATE]: Gross estate = Rp 1.000.000.000
Step 2 [ESTATE]: After debts (Rp 50.000.000) = Rp 950.000.000
Step 3 [ESTATE]: After funeral (Rp 10.000.000) = Rp 940.000.000
Step 4 [ESTATE]: Wasiyyah limited to 1/3 = Rp 100.000.000
Step 5 [ESTATE]: Net estate (الْمِيرَاث الصَّافِي) = Rp 840.000.000
Step 6 [HIJAB]: BROTHER_FULL excluded by FATHER (Rule E2)
Step 7 [FURUDH]: WIFE receives 1/8 (الثُّمُن) = Rp 105.000.000
Step 8 [FURUDH]: MOTHER receives 1/6 (السُّدُس) = Rp 140.000.000
Step 9 [ASABAH]: SON receives remainder = Rp 595.000.000
Step 10 [FINAL]: Total distributed = Rp 840.000.000 ✓
```

---

### Task C.14 - Unit Tests

**Deskripsi:** Comprehensive unit tests.

**Files:**
- `tests/unit/inheritance/estate.test.ts`
- `tests/unit/inheritance/flags.test.ts`
- `tests/unit/inheritance/hijab.test.ts`
- `tests/unit/inheritance/furudh.test.ts`
- `tests/unit/inheritance/asabah.test.ts`
- `tests/unit/inheritance/special-cases.test.ts`
- `tests/unit/inheritance/rule-conflict.test.ts` ⚠️ CRITICAL
- `tests/unit/inheritance/aul.test.ts`
- `tests/unit/inheritance/radd.test.ts`
- `tests/unit/inheritance/fraction.test.ts`
- `tests/unit/inheritance/calculator.test.ts`

**Minimum Test Cases:**
- All 30+ heir types
- All 7 hijab rules
- All 10 special cases
- Aul & Radd scenarios
- **Rule conflict validation** (must pass)

---

### Task C.15 - Integration Tests (Golden Test Suite)

**Deskripsi:** 100+ test cases dari kitab faraidh klasik.

**Files:**
- `tests/integration/inheritance.test.ts`
- `tests/fixtures/inheritance-golden-tests.json`

**Test Categories:**

| Category | Count | Description |
|----------|-------|-------------|
| Simple cases | ~20 | Basic heir combinations |
| Furudh only | ~15 | No asabah cases |
| Asabah cases | ~15 | Various asabah scenarios |
| Aul cases | ~10 | Over-subscription |
| Radd cases | ~10 | Under-subscription |
| Special cases | ~20 | All 10 special cases |
| Complex cases | ~10 | Multiple rules applied |

---

## ✅ Definition of Done

- [ ] All 30+ heir types supported
- [ ] All 7 hijab rules implemented
- [ ] All 10 special cases implemented
- [ ] Aul & Radd working correctly
- [ ] **Rule Conflict Validator passing** ⚠️ CRITICAL
- [ ] **Trace always included** with Arabic terms
- [ ] Sum = Net Estate (invariant, verified by trace)
- [ ] 4 policy switches configurable
- [ ] Unit tests > 90% coverage
- [ ] 100+ golden test cases passing

---

## 📊 Progress Tracking

| Task | Status | Notes |
|------|--------|-------|
| C.1 Types & Enums | 🔴 TODO | 30+ heir types |
| C.2 Derived Flags | 🔴 TODO | Boolean flags |
| C.3 Estate Calculator | 🔴 TODO | Net estate |
| C.4 Hijab Rules | 🔴 TODO | 7 exclusion rules |
| C.5 Furudh Calculator | 🔴 TODO | Fixed shares |
| C.6 Asabah Calculator | 🔴 TODO | Remainder heirs |
| C.7 Special Cases | 🔴 TODO | 10 cases |
| C.8 Rule Conflict Validator | 🔴 TODO | ⚠️ CRITICAL |
| C.9 Aul Handler | 🔴 TODO | |
| C.10 Radd Handler | 🔴 TODO | |
| C.11 Fraction Utils | 🔴 TODO | |
| C.12 Main Calculator | 🔴 TODO | |
| C.13 Trace Comparator | 🔴 TODO | ⚠️ CRITICAL |
| C.14 Unit Tests | 🔴 TODO | |
| C.15 Golden Tests | 🔴 TODO | 100+ cases |

---

## 🔗 Reference Documents

1. **DECISION_MATRIX_WARIS.md** - Main rule engine DSL
2. **SPECIAL_CASE_RULES_INHERITANCE.md** - 10 special case definitions

---

*Previous: [PHASE_B_QIBLA.md](./PHASE_B_QIBLA.md) | Next: [PHASE_4_INTEGRATION.md](./PHASE_4_INTEGRATION.md)*
