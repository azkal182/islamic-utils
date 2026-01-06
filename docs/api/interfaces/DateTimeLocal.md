[**Islamic Utilities API v0.2.0**](../README.md)

***

[Islamic Utilities API](../README.md) / DateTimeLocal

# Interface: DateTimeLocal

Defined in: [src/core/types/date.ts:222](https://github.com/azkal182/islamic-utils/blob/0df9a3737b1fb38d644e36b5ae34cdf225bc89df/src/core/types/date.ts#L222)

Represents a precise moment in time with full date, time, and timezone.

## Remarks

Used for representing the exact moment of prayer times.
This combines DateOnly and TimeOfDay with timezone context.

## Example

```typescript
// Fajr on January 15, 2024 at 5:23 AM in Jakarta
const fajrMoment: DateTimeLocal = {
  year: 2024,
  month: 1,
  day: 15,
  hours: 5,
  minutes: 23,
  seconds: 0,
  timezone: 'Asia/Jakarta'
};
```

## Extends

- [`DateOnly`](DateOnly.md).[`TimeOfDay`](TimeOfDay.md)

## Properties

### day

> `readonly` **day**: `number`

Defined in: [src/core/types/date.ts:90](https://github.com/azkal182/islamic-utils/blob/0df9a3737b1fb38d644e36b5ae34cdf225bc89df/src/core/types/date.ts#L90)

Day of the month (1-indexed).

#### Remarks

Valid range depends on the month:
- 1-31 for January, March, May, July, August, October, December
- 1-30 for April, June, September, November
- 1-28 or 1-29 for February (depending on leap year)

#### Inherited from

[`DateOnly`](DateOnly.md).[`day`](DateOnly.md#day)

***

### hours

> `readonly` **hours**: `number`

Defined in: [src/core/types/date.ts:120](https://github.com/azkal182/islamic-utils/blob/0df9a3737b1fb38d644e36b5ae34cdf225bc89df/src/core/types/date.ts#L120)

Hours in 24-hour format.

#### Remarks

Valid range: 0 to 23
- 0 = midnight (12:00 AM)
- 12 = noon (12:00 PM)
- 23 = 11:00 PM

#### Inherited from

[`TimeOfDay`](TimeOfDay.md).[`hours`](TimeOfDay.md#hours)

***

### minutes

> `readonly` **minutes**: `number`

Defined in: [src/core/types/date.ts:128](https://github.com/azkal182/islamic-utils/blob/0df9a3737b1fb38d644e36b5ae34cdf225bc89df/src/core/types/date.ts#L128)

Minutes within the hour.

#### Remarks

Valid range: 0 to 59

#### Inherited from

[`TimeOfDay`](TimeOfDay.md).[`minutes`](TimeOfDay.md#minutes)

***

### month

> `readonly` **month**: `number`

Defined in: [src/core/types/date.ts:79](https://github.com/azkal182/islamic-utils/blob/0df9a3737b1fb38d644e36b5ae34cdf225bc89df/src/core/types/date.ts#L79)

Month of the year (1-indexed).

#### Remarks

Unlike JavaScript Date (0-11), months are 1-indexed:
- 1 = January
- 12 = December

Valid range: 1 to 12

#### Inherited from

[`DateOnly`](DateOnly.md).[`month`](DateOnly.md#month)

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

#### Inherited from

[`TimeOfDay`](TimeOfDay.md).[`seconds`](TimeOfDay.md#seconds)

***

### timezone

> `readonly` **timezone**: [`Timezone`](../type-aliases/Timezone.md)

Defined in: [src/core/types/date.ts:226](https://github.com/azkal182/islamic-utils/blob/0df9a3737b1fb38d644e36b5ae34cdf225bc89df/src/core/types/date.ts#L226)

Timezone context for this moment.

***

### year

> `readonly` **year**: `number`

Defined in: [src/core/types/date.ts:67](https://github.com/azkal182/islamic-utils/blob/0df9a3737b1fb38d644e36b5ae34cdf225bc89df/src/core/types/date.ts#L67)

Full year (4 digits).

#### Remarks

Uses the Gregorian calendar year.
Valid range: 1 to 9999 (practical range for this library)

#### Example

```ts
2024, 1445 (but note: this is Gregorian, not Hijri)
```

#### Inherited from

[`DateOnly`](DateOnly.md).[`year`](DateOnly.md#year)
