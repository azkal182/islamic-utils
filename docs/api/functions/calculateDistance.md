[**Islamic Utilities API v0.2.1**](../README.md)

***

[Islamic Utilities API](../README.md) / calculateDistance

# Function: calculateDistance()

> **calculateDistance**(`from`, `to`): `number`

Defined in: [src/core/constants/kaaba.ts:100](https://github.com/azkal182/islamic-utils/blob/6511551c69fa725f6e44569e9e1278849e32f702/src/core/constants/kaaba.ts#L100)

Calculates great-circle distance between two points on Earth.

## Parameters

### from

[`Coordinates`](../interfaces/Coordinates.md)

Starting coordinates

### to

[`Coordinates`](../interfaces/Coordinates.md)

Ending coordinates

## Returns

`number`

Distance in kilometers

## Remarks

Uses the Haversine formula, which is accurate for most distances.
For very short distances, may have minor floating-point errors.

## Example

```typescript
import { calculateDistance, KAABA_COORDINATES } from 'islamic-utils';

const jakarta = { latitude: -6.2088, longitude: 106.8456 };
const distance = calculateDistance(jakarta, KAABA_COORDINATES);
console.log(`Distance to Makkah: ${distance.toFixed(0)} km`);
// Output: Distance to Makkah: 7803 km
```
