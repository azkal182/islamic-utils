[**Islamic Utilities API v0.2.0**](../README.md)

***

[Islamic Utilities API](../README.md) / getMethod

# Function: getMethod()

> **getMethod**(`key`): [`CalculationMethod`](../interfaces/CalculationMethod.md) \| `undefined`

Defined in: [src/prayer-times/methods/catalog.ts:353](https://github.com/azkal182/islamic-utils/blob/ddd04bee89289da73cadadfcee51cdeac187e097/src/prayer-times/methods/catalog.ts#L353)

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
