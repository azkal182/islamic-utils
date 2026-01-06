[**Islamic Utilities API v0.2.0**](../README.md)

***

[Islamic Utilities API](../README.md) / bearingToCompass

# Function: bearingToCompass()

> **bearingToCompass**(`bearing`, `precision`): `string`

Defined in: [src/astronomy/angles.ts:193](https://github.com/azkal182/islamic-utils/blob/ddd04bee89289da73cadadfcee51cdeac187e097/src/astronomy/angles.ts#L193)

Formats a bearing as a compass direction.

## Parameters

### bearing

`number`

Bearing in degrees (0-360)

### precision

Number of characters (1, 2, or 3)

`1` | `2` | `3`

## Returns

`string`

Compass direction string

## Remarks

Precision levels:
- 1: N, S, E, W (4 directions)
- 2: N, NE, E, SE, S, SW, W, NW (8 directions)
- 3: N, NNE, NE, ENE, E, ESE, SE, SSE, S, SSW, SW, WSW, W, WNW, NW, NNW (16 directions)

## Example

```typescript
bearingToCompass(0, 1);     // "N"
bearingToCompass(45, 2);    // "NE"
bearingToCompass(295, 2);   // "NW"
bearingToCompass(295, 3);   // "WNW"
```
