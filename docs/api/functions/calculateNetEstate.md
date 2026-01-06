[**Islamic Utilities API v0.2.0**](../README.md)

***

[Islamic Utilities API](../README.md) / calculateNetEstate

# Function: calculateNetEstate()

> **calculateNetEstate**(`input`): [`Result`](../type-aliases/Result.md)\<\{ `result`: [`EstateResult`](../interfaces/EstateResult.md); `trace`: [`InheritanceTraceStep`](../interfaces/InheritanceTraceStep.md)[]; \}\>

Defined in: src/inheritance/estate.ts:55

Calculates the net estate after all deductions.

## Parameters

### input

[`EstateInput`](../interfaces/EstateInput.md)

Estate input with gross value and optional deductions

## Returns

[`Result`](../type-aliases/Result.md)\<\{ `result`: [`EstateResult`](../interfaces/EstateResult.md); `trace`: [`InheritanceTraceStep`](../interfaces/InheritanceTraceStep.md)[]; \}\>

Result containing estate breakdown or error

## Remarks

Deduction order (as per Islamic law):
1. Funeral costs (tajhiz)
2. Debts
3. Wasiyyah (limited to 1/3 of remaining unless approved by heirs)

**Rules from DECISION_MATRIX_WARIS.md:**
```spec
NET_ESTATE_RULE:
  net_estate = gross_estate - debts - funeral_costs - allowed_wasiyyah

WASIYYAH_RULE:
  allowed_wasiyyah = MIN(wasiyyah, (gross_estate - debts - funeral_costs) * 1/3)
  OVERRIDE_IF wasiyyah_approved_by_heirs == true
```

## Example

```typescript
const result = calculateNetEstate({
  grossValue: 1_000_000_000,
  debts: 50_000_000,
  funeralCosts: 10_000_000,
  wasiyyah: 400_000_000,  // Will be capped to 1/3
});

if (result.success) {
  console.log(result.data.netEstate);
  // 940_000_000 - 313_333_333 = 626_666_667
}
```
