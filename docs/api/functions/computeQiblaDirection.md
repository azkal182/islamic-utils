[**Islamic Utilities API v0.2.2**](../README.md)

***

[Islamic Utilities API](../README.md) / computeQiblaDirection

# Function: computeQiblaDirection()

> **computeQiblaDirection**(`input`, `options`): [`Result`](../type-aliases/Result.md)\<[`QiblaResult`](../interfaces/QiblaResult.md)\>

Defined in: [src/qibla/calculator.ts:100](https://github.com/azkal182/islamic-utils/blob/a30827e72f5e43f868fff9ce519ca224296e663c/src/qibla/calculator.ts#L100)

Computes the Qibla direction (bearing to Ka'bah) from a given location.

## Parameters

### input

[`QiblaInput`](../interfaces/QiblaInput.md)

User's location

### options

[`QiblaOptions`](../interfaces/QiblaOptions.md) = `{}`

Calculation options

## Returns

[`Result`](../type-aliases/Result.md)\<[`QiblaResult`](../interfaces/QiblaResult.md)\>

Result containing Qibla direction or error

## Remarks

The bearing is calculated using the great-circle initial bearing formula.
This gives the direction to travel at the start of the journey to reach Ka'bah
via the shortest path on Earth's surface.

**Calculation Flow:**
1. Validate input coordinates
2. Check for edge cases (at Ka'bah, etc.)
3. Calculate initial bearing using great-circle formula
4. Optionally calculate distance
5. Convert to compass direction
6. Return formatted result

## Examples

```typescript
import { computeQiblaDirection } from 'islamic-utils';

const result = computeQiblaDirection({
  coordinates: { latitude: -6.2088, longitude: 106.8456 }
});

if (result.success) {
  console.log(`Qibla: ${result.data.bearing}° (${result.data.compassDirection})`);
  // Output: Qibla: 295.14° (WNW)
}
```

```typescript
// With distance and trace
const result = computeQiblaDirection(
  { coordinates: { latitude: 51.5074, longitude: -0.1278 } },
  { includeDistance: true, includeTrace: true }
);

if (result.success) {
  console.log(`Distance: ${result.data.meta.distance} km`);
  console.log('Trace:', result.data.trace);
}
```
