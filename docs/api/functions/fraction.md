[**Islamic Utilities API v0.2.0**](../README.md)

***

[Islamic Utilities API](../README.md) / fraction

# Function: fraction()

> **fraction**(`numerator`, `denominator`): [`Fraction`](../interfaces/Fraction.md)

Defined in: src/inheritance/utils/fraction.ts:64

Creates a fraction from numerator and denominator.

## Parameters

### numerator

`number`

The numerator

### denominator

`number`

The denominator (must not be 0)

## Returns

[`Fraction`](../interfaces/Fraction.md)

Simplified fraction

## Throws

Error if denominator is 0

## Example

```typescript
const f = fraction(2, 4);  // Returns { numerator: 1, denominator: 2 }
```
