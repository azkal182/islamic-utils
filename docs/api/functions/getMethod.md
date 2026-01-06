[**Islamic Utilities API v0.2.1**](../README.md)

***

[Islamic Utilities API](../README.md) / getMethod

# Function: getMethod()

> **getMethod**(`key`): [`CalculationMethod`](../interfaces/CalculationMethod.md) \| `undefined`

Defined in: [src/prayer-times/methods/catalog.ts:353](https://github.com/azkal182/islamic-utils/blob/6511551c69fa725f6e44569e9e1278849e32f702/src/prayer-times/methods/catalog.ts#L353)

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
