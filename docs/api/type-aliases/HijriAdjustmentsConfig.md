[**Islamic Utilities API v0.2.2**](../README.md)

***

[Islamic Utilities API](../README.md) / HijriAdjustmentsConfig

# Type Alias: HijriAdjustmentsConfig

> **HijriAdjustmentsConfig** = \{ `mode`: `"none"`; \} \| \{ `data`: readonly [`HijriMonthAdjustment`](../interfaces/HijriMonthAdjustment.md)[]; `mode`: `"memory"`; \} \| \{ `filePath`: `string`; `mode`: `"json"`; \} \| \{ `getAdjustments`: [`HijriAdjustmentProvider`](HijriAdjustmentProvider.md); `mode`: `"provider"`; \}

Defined in: src/hijri-calendar/types.ts:107

Adjustment configuration modes.
