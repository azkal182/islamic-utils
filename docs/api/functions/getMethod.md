[**Islamic Utilities API v0.2.2**](../README.md)

***

[Islamic Utilities API](../README.md) / getMethod

# Function: getMethod()

> **getMethod**(`key`): [`CalculationMethod`](../interfaces/CalculationMethod.md) \| `undefined`

Defined in: [src/prayer-times/methods/catalog.ts:353](https://github.com/azkal182/islamic-utils/blob/a30827e72f5e43f868fff9ce519ca224296e663c/src/prayer-times/methods/catalog.ts#L353)

Gets a calculation method by its key.

## Parameters

### key

`string`

The method key (built-in or custom)

## Returns

[`CalculationMethod`](../interfaces/CalculationMethod.md) \| `undefined`

The calculation method or undefined if not found

## Example

```typescript
const method = getMethod('MWL');
if (method) {
  console.log(`Fajr angle: ${method.fajrAngle}°`);
}
```
