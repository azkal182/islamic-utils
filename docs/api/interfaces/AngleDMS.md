[**Islamic Utilities API v0.2.0**](../README.md)

***

[Islamic Utilities API](../README.md) / AngleDMS

# Interface: AngleDMS

Defined in: [src/core/types/angle.ts:42](https://github.com/azkal182/islamic-utils/blob/0df9a3737b1fb38d644e36b5ae34cdf225bc89df/src/core/types/angle.ts#L42)

Represents an angle in Degrees-Minutes-Seconds format.

## Remarks

This format is commonly used in:
- Geographic coordinates (e.g., 21° 25' 21" N)
- Astronomical observations
- Navigation charts

For negative angles, only the degrees component should be negative.

## Example

```typescript
// Ka'bah latitude: 21° 25' 21" N
const kaabaLat: AngleDMS = {
  degrees: 21,
  minutes: 25,
  seconds: 21
};

// Negative latitude (South): 6° 12' 31.68" S
const jakartaLat: AngleDMS = {
  degrees: -6,
  minutes: 12,
  seconds: 31.68
};
```

## Properties

### degrees

> `readonly` **degrees**: `number`

Defined in: [src/core/types/angle.ts:50](https://github.com/azkal182/islamic-utils/blob/0df9a3737b1fb38d644e36b5ae34cdf225bc89df/src/core/types/angle.ts#L50)

Whole degrees component.

#### Remarks

Can be positive or negative.
For negative angles, only this component is negative.

***

### minutes?

> `readonly` `optional` **minutes**: `number`

Defined in: [src/core/types/angle.ts:61](https://github.com/azkal182/islamic-utils/blob/0df9a3737b1fb38d644e36b5ae34cdf225bc89df/src/core/types/angle.ts#L61)

Minutes component (0-59).

#### Remarks

Always positive (0 to 59).
1 degree = 60 minutes

#### Default Value

```ts
0
```

***

### seconds?

> `readonly` `optional` **seconds**: `number`

Defined in: [src/core/types/angle.ts:73](https://github.com/azkal182/islamic-utils/blob/0df9a3737b1fb38d644e36b5ae34cdf225bc89df/src/core/types/angle.ts#L73)

Seconds component (0-59.999...).

#### Remarks

Always positive (0 to 59.999...).
1 minute = 60 seconds
Can include fractional seconds.

#### Default Value

```ts
0
```
