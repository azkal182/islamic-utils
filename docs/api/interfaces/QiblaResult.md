[**Islamic Utilities API v0.2.2**](../README.md)

***

[Islamic Utilities API](../README.md) / QiblaResult

# Interface: QiblaResult

Defined in: [src/qibla/types.ts:164](https://github.com/azkal182/islamic-utils/blob/a30827e72f5e43f868fff9ce519ca224296e663c/src/qibla/types.ts#L164)

Result of Qibla direction calculation.

## Properties

### bearing

> `readonly` **bearing**: `number`

Defined in: [src/qibla/types.ts:173](https://github.com/azkal182/islamic-utils/blob/a30827e72f5e43f868fff9ce519ca224296e663c/src/qibla/types.ts#L173)

Bearing to Ka'bah in degrees.

#### Remarks

- Value is 0-360 degrees from true north
- Clockwise direction
- 0° = North, 90° = East, 180° = South, 270° = West

***

### compassDirection

> `readonly` **compassDirection**: [`CompassDirection`](../type-aliases/CompassDirection.md)

Defined in: [src/qibla/types.ts:181](https://github.com/azkal182/islamic-utils/blob/a30827e72f5e43f868fff9ce519ca224296e663c/src/qibla/types.ts#L181)

Compass direction (16-point).

#### Remarks

e.g., "NNE", "WNW", "SE", etc.

***

### meta

> `readonly` **meta**: [`QiblaMeta`](QiblaMeta.md)

Defined in: [src/qibla/types.ts:186](https://github.com/azkal182/islamic-utils/blob/a30827e72f5e43f868fff9ce519ca224296e663c/src/qibla/types.ts#L186)

Metadata about the calculation.

***

### trace?

> `readonly` `optional` **trace**: [`TraceStep`](TraceStep.md)[]

Defined in: [src/qibla/types.ts:194](https://github.com/azkal182/islamic-utils/blob/a30827e72f5e43f868fff9ce519ca224296e663c/src/qibla/types.ts#L194)

Optional trace of calculation steps.

#### Remarks

Only included if `includeTrace: true` was specified.
