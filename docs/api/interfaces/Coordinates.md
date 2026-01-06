[**Islamic Utilities API v0.2.0**](../README.md)

***

[Islamic Utilities API](../README.md) / Coordinates

# Interface: Coordinates

Defined in: [src/core/types/coordinates.ts:46](https://github.com/azkal182/islamic-utils/blob/0df9a3737b1fb38d644e36b5ae34cdf225bc89df/src/core/types/coordinates.ts#L46)

Represents geographic coordinates on Earth.

## Remarks

Coordinates follow the WGS84 standard used by GPS systems.
- Latitude: Positive values indicate North, negative indicate South
- Longitude: Positive values indicate East, negative indicate West
- Altitude: Height above sea level in meters (optional)

## Example

```typescript
// Jakarta, Indonesia
const jakarta: Coordinates = {
  latitude: -6.2088,   // South of equator
  longitude: 106.8456, // East of Prime Meridian
  altitude: 8          // 8 meters above sea level
};

// London, UK
const london: Coordinates = {
  latitude: 51.5074,   // North
  longitude: -0.1278   // West (no altitude specified)
};
```

## Properties

### altitude?

> `readonly` `optional` **altitude**: `number`

Defined in: [src/core/types/coordinates.ts:85](https://github.com/azkal182/islamic-utils/blob/0df9a3737b1fb38d644e36b5ae34cdf225bc89df/src/core/types/coordinates.ts#L85)

Altitude above sea level in meters.

#### Remarks

Optional field. If not provided, sea level (0) is assumed.
Altitude can affect prayer time calculations due to:
- Earlier sunrise/later sunset at higher elevations
- Atmospheric refraction differences

#### Default Value

```ts
0
```

***

### latitude

> `readonly` **latitude**: `number`

Defined in: [src/core/types/coordinates.ts:60](https://github.com/azkal182/islamic-utils/blob/0df9a3737b1fb38d644e36b5ae34cdf225bc89df/src/core/types/coordinates.ts#L60)

Latitude in decimal degrees.

#### Remarks

Valid range: -90 (South Pole) to +90 (North Pole)

Common reference points:
- 0° = Equator
- 23.5° = Tropic of Cancer
- -23.5° = Tropic of Capricorn
- 66.5° = Arctic Circle
- -66.5° = Antarctic Circle

***

### longitude

> `readonly` **longitude**: `number`

Defined in: [src/core/types/coordinates.ts:72](https://github.com/azkal182/islamic-utils/blob/0df9a3737b1fb38d644e36b5ae34cdf225bc89df/src/core/types/coordinates.ts#L72)

Longitude in decimal degrees.

#### Remarks

Valid range: -180 to +180
- 0° = Prime Meridian (Greenwich, London)
- +180° / -180° = International Date Line

Values exactly at +180 and -180 refer to the same meridian.
