[**Islamic Utilities API v0.2.2**](../README.md)

***

[Islamic Utilities API](../README.md) / KAABA\_COORDINATES

# Variable: KAABA\_COORDINATES

> `const` **KAABA\_COORDINATES**: `Readonly`\<`Required`\<[`Coordinates`](../interfaces/Coordinates.md)\>\>

Defined in: [src/core/constants/kaaba.ts:31](https://github.com/azkal182/islamic-utils/blob/f548f22580afc5800e32e3785eef49f3fce9f58a/src/core/constants/kaaba.ts#L31)

Precise coordinates of the Ka'bah in Masjid al-Haram, Makkah.

## Remarks

The Ka'bah is the holiest site in Islam and the direction (Qibla)
that Muslims face during prayer.

These coordinates point to the center of the Ka'bah structure.
The values are based on modern GPS measurements and satellite imagery.

Location: Masjid al-Haram, Makkah, Saudi Arabia

## Example

```typescript
import { KAABA_COORDINATES } from 'islamic-utils';

console.log(`Ka'bah is at ${KAABA_COORDINATES.latitude}°N, ${KAABA_COORDINATES.longitude}°E`);
// Output: Ka'bah is at 21.4225°N, 39.8262°E
```
