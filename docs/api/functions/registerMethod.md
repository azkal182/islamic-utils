[**Islamic Utilities API v0.2.1**](../README.md)

***

[Islamic Utilities API](../README.md) / registerMethod

# Function: registerMethod()

> **registerMethod**(`key`, `method`): `void`

Defined in: [src/prayer-times/methods/catalog.ts:320](https://github.com/azkal182/islamic-utils/blob/6511551c69fa725f6e44569e9e1278849e32f702/src/prayer-times/methods/catalog.ts#L320)

Registers a custom calculation method.

## Parameters

### key

`string`

Unique identifier for the method

### method

[`CalculationMethod`](../interfaces/CalculationMethod.md)

The calculation method configuration

## Returns

`void`

## Throws

Error if key conflicts with a built-in method

## Example

```typescript
registerMethod('CUSTOM', {
  name: 'My Custom Method',
  fajrAngle: 19,
  ishaAngle: 16,
});

const method = getMethod('CUSTOM');
```
