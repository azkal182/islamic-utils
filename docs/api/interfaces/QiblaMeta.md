[**Islamic Utilities API v0.2.2**](../README.md)

***

[Islamic Utilities API](../README.md) / QiblaMeta

# Interface: QiblaMeta

Defined in: [src/qibla/types.ts:131](https://github.com/azkal182/islamic-utils/blob/a30827e72f5e43f868fff9ce519ca224296e663c/src/qibla/types.ts#L131)

Metadata about the Qibla calculation.

## Properties

### atKaaba?

> `readonly` `optional` **atKaaba**: `boolean`

Defined in: [src/qibla/types.ts:153](https://github.com/azkal182/islamic-utils/blob/a30827e72f5e43f868fff9ce519ca224296e663c/src/qibla/types.ts#L153)

Whether the user is at or very near the Ka'bah.

***

### distance?

> `readonly` `optional` **distance**: `number`

Defined in: [src/qibla/types.ts:148](https://github.com/azkal182/islamic-utils/blob/a30827e72f5e43f868fff9ce519ca224296e663c/src/qibla/types.ts#L148)

Distance to Ka'bah in kilometers.

#### Remarks

Only included if `includeDistance: true` was specified.

***

### kaabaLocation

> `readonly` **kaabaLocation**: [`Coordinates`](Coordinates.md)

Defined in: [src/qibla/types.ts:140](https://github.com/azkal182/islamic-utils/blob/a30827e72f5e43f868fff9ce519ca224296e663c/src/qibla/types.ts#L140)

The Ka'bah coordinates used in calculation.

***

### note?

> `readonly` `optional` **note**: `string`

Defined in: [src/qibla/types.ts:158](https://github.com/azkal182/islamic-utils/blob/a30827e72f5e43f868fff9ce519ca224296e663c/src/qibla/types.ts#L158)

Note about the calculation (for edge cases).

***

### userLocation

> `readonly` **userLocation**: [`Coordinates`](Coordinates.md)

Defined in: [src/qibla/types.ts:135](https://github.com/azkal182/islamic-utils/blob/a30827e72f5e43f868fff9ce519ca224296e663c/src/qibla/types.ts#L135)

The user's input coordinates.
