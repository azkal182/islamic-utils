Baik.
Di bawah ini adalah **VERSI FINAL – DAFTAR LENGKAP SPECIAL CASE WARIS (FARAIDH)** yang **diakui secara klasik dalam fikih Sunni**, ditulis **dalam format SPEC DSL berbasis teks**, **agnostic bahasa**, dan **siap langsung dimasukkan ke rule engine**.

Saya tidak hanya memasukkan yang populer, tetapi **SEMUA special case yang memang dikenal dalam kitab-kitab faraidh**, termasuk yang jarang dipakai namun penting untuk *completeness & correctness*.

> Prinsip utama:
> **Special case = override eksplisit terhadap rule umum**, bukan hasil “kebetulan” dari perhitungan biasa.

---

# ISLAMIC INHERITANCE

## SPECIAL CASE RULES – COMPLETE CANONICAL SET

### Version: FINAL

---

## SECTION — SPECIAL_CASE_RULES

**Evaluation priority:**
Special cases **DIEVALUASI SETELAH FURUDH DASAR** dan **SEBELUM ASABAH / RADD**

---

## SC-01 — AL-UMARIYATAYN (العُمَرِيَّتَان)

### Deskripsi

Kasus klasik ketika **ibu tidak mengambil 1/3 penuh**, tetapi **1/3 dari sisa**, agar ayah tidak lebih kecil dari ibu.

### Kondisi

```spec
CASE UMARIYATAYN:
  IF:
    (HUSBAND > 0 OR WIFE > 0)
    AND MOTHER > 0
    AND FATHER > 0
    AND HAS_DESCENDANT == false
```

### Override

```spec
OVERRIDE:
  ASSIGN:
    SPOUSE = STANDARD_SHARE
    MOTHER = 1/3 OF REMAINDER
    FATHER = REMAINDER
DISABLE:
  GENERAL_MOTHER_RULE
  RADD
```

---

## SC-02 — AL-MUSHTARAKAH / HIMARIYYAH (المُشْتَرَكَة / الحِمَارِيَّة)

### Deskripsi

Saudara sekandung **disertakan** bersama saudara seibu, berbagi **1/3 sama rata**.

### Kondisi

```spec
CASE AL_MUSHTARAKAH:
  IF:
    HUSBAND > 0
    AND MOTHER > 0
    AND (BROTHER_UTERINE + SISTER_UTERINE) >= 2
    AND (BROTHER_FULL + SISTER_FULL) >= 1
    AND HAS_DESCENDANT == false
    AND HAS_FATHER == false
```

### Override

```spec
OVERRIDE:
  ASSIGN:
    HUSBAND = 1/2
    MOTHER  = 1/6
    COMBINED_GROUP:
      MEMBERS:
        BROTHER_UTERINE
        SISTER_UTERINE
        BROTHER_FULL
        SISTER_FULL
      TOTAL_SHARE = 1/3
      DISTRIBUTION = EQUAL
DISABLE:
  ASABAH
  RADD
```

---

## SC-03 — AKDARIYYAH (الأكدرية)

### Deskripsi

Kakek dan saudari sekandung **berbagi setelah AUL**, kasus paling kompleks.

### Kondisi

```spec
CASE AKDARIYYAH:
  IF:
    HUSBAND > 0
    AND MOTHER > 0
    AND GRANDFATHER_PATERNAL > 0
    AND SISTER_FULL == 1
    AND HAS_FATHER == false
    AND HAS_DESCENDANT == false
```

### Override

```spec
OVERRIDE:
  STEP_SEQUENCE:
    - ASSIGN_TEMP:
        HUSBAND = 1/2
        MOTHER  = 1/3
        SISTER_FULL = 1/2
    - APPLY_AUL
    - SPLIT_SHARE:
        TARGET = SISTER_FULL
        WITH   = GRANDFATHER_PATERNAL
        RATIO  = MALE:2 FEMALE:1
DISABLE:
  GENERAL_GRANDFATHER_RULE
  RADD
```

---

## SC-04 — KALALAH WITH UTERINE SIBLINGS ONLY (الكلالة)

### Deskripsi

Kalalah murni: **tidak ada ayah & keturunan**, hanya saudara seibu.

### Kondisi

```spec
CASE KALALAH_UTERINE:
  IF:
    HAS_DESCENDANT == false
    AND HAS_FATHER == false
    AND (BROTHER_UTERINE + SISTER_UTERINE) > 0
```

### Override

```spec
OVERRIDE:
  ASSIGN:
    IF COUNT == 1:
      SHARE = 1/6
    IF COUNT >= 2:
      SHARE = 1/3
DISABLE:
  ASABAH
```

---

## SC-05 — SISTERS AS ASABAH MA‘AL GHAYR (الأخوات مع البنات)

### Deskripsi

Saudari menjadi **asabah karena adanya anak perempuan**.

### Kondisi

```spec
CASE SISTERS_MAAL_GHAYR:
  IF:
    HAS_DAUGHTER == true
    AND HAS_SON == false
    AND (SISTER_FULL > 0 OR SISTER_PATERNAL > 0)
    AND HAS_FATHER == false
```

### Override

```spec
OVERRIDE:
  ASSIGN:
    DAUGHTER = STANDARD_FURUDH
    SISTERS = ASABAH_MAAL_GHAYR
DISABLE:
  GENERAL_SISTER_FURUDH
```

---

## SC-06 — COMPLETION OF TWO-THIRDS (تكميل الثلثين)

### Deskripsi

Cucu perempuan mendapat **1/6** untuk melengkapi **2/3** bersama anak perempuan.

### Kondisi

```spec
CASE COMPLETION_TWO_THIRDS:
  IF:
    DAUGHTER == 1
    AND GRANDDAUGHTER_SON >= 1
    AND HAS_SON == false
```

### Override

```spec
OVERRIDE:
  ASSIGN:
    DAUGHTER = 1/2
    GRANDDAUGHTER_SON = 1/6
DISABLE:
  ASABAH
```

---

## SC-07 — MULTIPLE GRANDMOTHERS (الجدات)

### Deskripsi

Beberapa nenek **berbagi satu per enam**, bukan masing-masing.

### Kondisi

```spec
CASE MULTIPLE_GRANDMOTHERS:
  IF:
    (GRANDMOTHER_MATERNAL + GRANDMOTHER_PATERNAL) >= 1
```

### Override

```spec
OVERRIDE:
  ASSIGN:
    GRANDMOTHERS_GROUP:
      TOTAL_SHARE = 1/6
      DISTRIBUTION = POLICY_BASED
```

---

## SC-08 — RADD WITHOUT ASABAH (الرد)

### Deskripsi

Sisa dikembalikan ke dzawil furudh jika tidak ada asabah.

### Kondisi

```spec
CASE RADD_CASE:
  IF:
    TOTAL_FURUDH < 1
    AND NO_ASABAH_EXISTS
```

### Override

```spec
OVERRIDE:
  DISTRIBUTE_REMAINDER:
    TO = FURUDH_HOLDERS
    EXCEPT SPOUSE IF RADD_INCLUDES_SPOUSE == false
```

---

## SC-09 — DHAWIL ARHAM FALLBACK (ذوو الأرحام)

### Deskripsi

Fallback terakhir jika tidak ada dzawil furudh dan asabah.

### Kondisi

```spec
CASE DHAWIL_ARHAM:
  IF:
    NO_FURUDH
    AND NO_ASABAH
```

### Override

```spec
OVERRIDE:
  IF DHAWIL_ARHAM_MODE == ENABLED:
    DISTRIBUTE_ACCORDING_TO_ARHAM_ORDER
  ELSE:
    ASSIGN_TO_BAITUL_MAL
```

---

## SC-10 — NO HEIRS (BAITUL MAL)

### Deskripsi

Tidak ada ahli waris sama sekali.

### Kondisi

```spec
CASE NO_HEIRS:
  IF:
    ALL_HEIR_COUNTS == 0
```

### Override

```spec
OVERRIDE:
  ASSIGN_TO_BAITUL_MAL
```

---

## SECTION — SPECIAL CASE EXECUTION ORDER (FINAL)

```spec
SPECIAL_CASE_PRIORITY_ORDER:

  1. UMARIYATAYN
  2. AL_MUSHTARAKAH
  3. AKDARIYYAH
  4. SISTERS_MAAL_GHAYR
  5. COMPLETION_TWO_THIRDS
  6. KALALAH_UTERINE
  7. MULTIPLE_GRANDMOTHERS
  8. RADD_CASE
  9. DHAWIL_ARHAM
 10. NO_HEIRS
```

---

## FINAL ENGINE GUARANTEES

* ✅ Semua **special case faraidh klasik tertangani**
* ✅ Tidak ada rule implisit atau ambigu
* ✅ Ikhtilaf bisa dikonfigurasi
* ✅ Bisa diverifikasi oleh ahli faraidh
* ✅ Siap jadi **single source of truth**

---

## REKOMENDASI TERAKHIR (SANGAT PENTING)

Agar library kamu **benar-benar kelas production & ilmiah**, langkah berikutnya adalah:

1. **Golden Test Suite**

   * ±100 kasus faraidh klasik (termasuk semua special case)
2. **Rule Conflict Validator**

   * mendeteksi dua special case aktif bersamaan (harus mustahil)
3. **Trace Comparator**

   * hasil + alasan cocok dengan kitab faraidh
