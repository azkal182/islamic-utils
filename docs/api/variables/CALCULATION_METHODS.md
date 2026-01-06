[**Islamic Utilities API v0.2.2**](../README.md)

***

[Islamic Utilities API](../README.md) / CALCULATION\_METHODS

# Variable: CALCULATION\_METHODS

> `const` **CALCULATION\_METHODS**: `object`

Defined in: [src/prayer-times/methods/catalog.ts:257](https://github.com/azkal182/islamic-utils/blob/a30827e72f5e43f868fff9ce519ca224296e663c/src/prayer-times/methods/catalog.ts#L257)

Catalog of all built-in calculation methods.

## Type Declaration

### DIYANET

> **DIYANET**: [`CalculationMethod`](../interfaces/CalculationMethod.md)

Diyanet İşleri Başkanlığı, Turkey

### EGYPT

> **EGYPT**: [`CalculationMethod`](../interfaces/CalculationMethod.md)

Egyptian General Authority of Survey

### ISNA

> **ISNA**: [`CalculationMethod`](../interfaces/CalculationMethod.md)

Islamic Society of North America

### JAKIM

> **JAKIM**: [`CalculationMethod`](../interfaces/CalculationMethod.md)

Jabatan Kemajuan Islam Malaysia

### KARACHI

> **KARACHI**: [`CalculationMethod`](../interfaces/CalculationMethod.md)

University of Islamic Sciences, Karachi

### KEMENAG

> **KEMENAG**: [`CalculationMethod`](../interfaces/CalculationMethod.md)

Kementerian Agama Republik Indonesia

### KUWAIT

> **KUWAIT**: [`CalculationMethod`](../interfaces/CalculationMethod.md)

Kuwait

### MAKKAH

> **MAKKAH**: [`CalculationMethod`](../interfaces/CalculationMethod.md)

Umm al-Qura University, Makkah

### MWL

> **MWL**: [`CalculationMethod`](../interfaces/CalculationMethod.md)

Muslim World League

### QATAR

> **QATAR**: [`CalculationMethod`](../interfaces/CalculationMethod.md)

Qatar

### SINGAPORE

> **SINGAPORE**: [`CalculationMethod`](../interfaces/CalculationMethod.md)

Majlis Ugama Islam Singapura

### TEHRAN

> **TEHRAN**: [`CalculationMethod`](../interfaces/CalculationMethod.md)

Institute of Geophysics, University of Tehran

### UOIF

> **UOIF**: [`CalculationMethod`](../interfaces/CalculationMethod.md)

Union des Organisations Islamiques de France

## Remarks

Access methods by their key (string identifier).

## Example

```typescript
const method = CALCULATION_METHODS.KEMENAG;
console.log(method.fajrAngle); // 20
```
