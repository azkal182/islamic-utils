[**Islamic Utilities API v0.2.2**](../README.md)

***

[Islamic Utilities API](../README.md) / isAtKaaba

# Function: isAtKaaba()

> **isAtKaaba**(`coords`): `boolean`

Defined in: [src/core/constants/kaaba.ts:133](https://github.com/azkal182/islamic-utils/blob/f548f22580afc5800e32e3785eef49f3fce9f58a/src/core/constants/kaaba.ts#L133)

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
