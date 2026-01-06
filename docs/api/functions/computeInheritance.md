[**Islamic Utilities API v0.2.0**](../README.md)

***

[Islamic Utilities API](../README.md) / computeInheritance

# Function: computeInheritance()

> **computeInheritance**(`input`, `_options?`): [`Result`](../type-aliases/Result.md)\<[`InheritanceResult`](../interfaces/InheritanceResult.md)\>

Defined in: src/inheritance/calculator.ts:83

Computes Islamic inheritance distribution.

## Parameters

### input

[`InheritanceInput`](../interfaces/InheritanceInput.md)

Inheritance input with estate, heirs, and policy

### \_options?

[`InheritanceOptions`](../interfaces/InheritanceOptions.md)

## Returns

[`Result`](../type-aliases/Result.md)\<[`InheritanceResult`](../interfaces/InheritanceResult.md)\>

Result containing inheritance distribution or error

## Remarks

**Calculation Flow:**
1. Validate input
2. Calculate net estate
3. Calculate derived flags
4. Validate no rule conflicts
5. Apply hijab (exclusion)
6. Detect special case
7. If special case: apply override
8. Else: calculate furudh → asabah → aul/radd
9. Convert to absolute values
10. Verify sum = net estate
11. Build trace and return

## Example

```typescript
const result = computeInheritance({
  estate: {
    grossValue: 1_000_000_000,
    debts: 50_000_000,
    funeralCosts: 10_000_000,
  },
  heirs: [
    { type: HeirType.WIFE, count: 1 },
    { type: HeirType.SON, count: 2 },
    { type: HeirType.DAUGHTER, count: 1 },
  ],
  deceased: { gender: 'male' },
});

if (result.success) {
  for (const share of result.data.shares) {
    console.log(`${share.heirType}: ${share.totalValue}`);
  }
}
```
