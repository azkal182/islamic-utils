[**Islamic Utilities API v0.2.0**](../README.md)

***

[Islamic Utilities API](../README.md) / TimeOfDay

# Interface: TimeOfDay

Defined in: [src/core/types/date.ts:110](https://github.com/azkal182/islamic-utils/blob/0df9a3737b1fb38d644e36b5ae34cdf225bc89df/src/core/types/date.ts#L110)

Represents a time of day without date information.

## Remarks

Used for representing prayer times, sunrise, sunset, etc.
The time is in the local timezone context.

## Example

```typescript
// Fajr at 5:23:45 AM
const fajrTime: TimeOfDay = {
  hours: 5,
  minutes: 23,
  seconds: 45
};
```

## Extended by

- [`DateTimeLocal`](DateTimeLocal.md)

## Properties

### hours

> `readonly` **hours**: `number`

Defined in: [src/core/types/date.ts:120](https://github.com/azkal182/islamic-utils/blob/0df9a3737b1fb38d644e36b5ae34cdf225bc89df/src/core/types/date.ts#L120)

Hours in 24-hour format.

#### Remarks

Valid range: 0 to 23
- 0 = midnight (12:00 AM)
- 12 = noon (12:00 PM)
- 23 = 11:00 PM

***

### minutes

> `readonly` **minutes**: `number`

Defined in: [src/core/types/date.ts:128](https://github.com/azkal182/islamic-utils/blob/0df9a3737b1fb38d644e36b5ae34cdf225bc89df/src/core/types/date.ts#L128)

Minutes within the hour.

#### Remarks

Valid range: 0 to 59

***

### seconds?

> `readonly` `optional` **seconds**: `number`

Defined in: [src/core/types/date.ts:139](https://github.com/azkal182/islamic-utils/blob/0df9a3737b1fb38d644e36b5ae34cdf225bc89df/src/core/types/date.ts#L139)

Seconds within the minute.

#### Remarks

Valid range: 0 to 59
Optional for most use cases.

#### Default Value

```ts
0
```
