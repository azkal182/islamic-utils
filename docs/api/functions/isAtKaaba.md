[**Islamic Utilities API v0.2.1**](../README.md)

***

[Islamic Utilities API](../README.md) / isAtKaaba

# Function: isAtKaaba()

> **isAtKaaba**(`coords`): `boolean`

Defined in: [src/core/constants/kaaba.ts:133](https://github.com/azkal182/islamic-utils/blob/6511551c69fa725f6e44569e9e1278849e32f702/src/core/constants/kaaba.ts#L133)

Checks if a location is at or very near the Ka'bah.

## Parameters

### coords

[`Coordinates`](../interfaces/Coordinates.md)

The location to check

## Returns

`boolean`

True if within the proximity threshold

## Example

```typescript
import { isAtKaaba, KAABA_COORDINATES } from 'islamic-utils';

isAtKaaba(KAABA_COORDINATES);  // true
isAtKaaba({ latitude: -6.2, longitude: 106.8 });  // false
```
