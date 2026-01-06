[**Islamic Utilities API v0.2.2**](../README.md)

***

[Islamic Utilities API](../README.md) / DateOnly

# Interface: DateOnly

Defined in: [src/core/types/date.ts:57](https://github.com/azkal182/islamic-utils/blob/a30827e72f5e43f868fff9ce519ca224296e663c/src/core/types/date.ts#L57)

Represents a calendar date without time information.

## Remarks

This type represents a specific day on the Gregorian calendar.
It does NOT include any time or timezone information.

Use this when you need to specify "which day" without specifying
a specific moment in time.

## Example

```typescript
// January 15, 2024
const date: DateOnly = {
  year: 2024,
  month: 1,
  day: 15
};

// Ramadan 2024 start (estimated)
const ramadanStart: DateOnly = {
  year: 2024,
  month: 3,
  day: 10
};
```

## Extended by

- [`DateTimeLocal`](DateTimeLocal.md)

## Properties

### day

> `readonly` **day**: `number`

Defined in: [src/core/types/date.ts:90](https://github.com/azkal182/islamic-utils/blob/a30827e72f5e43f868fff9ce519ca224296e663c/src/core/types/date.ts#L90)

Day of the month (1-indexed).

#### Remarks

Valid range depends on the month:
- 1-31 for January, March, May, July, August, October, December
- 1-30 for April, June, September, November
- 1-28 or 1-29 for February (depending on leap year)

***

### month

> `readonly` **month**: `number`

Defined in: [src/core/types/date.ts:79](https://github.com/azkal182/islamic-utils/blob/a30827e72f5e43f868fff9ce519ca224296e663c/src/core/types/date.ts#L79)

Month of the year (1-indexed).

#### Remarks

Unlike JavaScript Date (0-11), months are 1-indexed:
- 1 = January
- 12 = December

Valid range: 1 to 12

***

### year

> `readonly` **year**: `number`

Defined in: [src/core/types/date.ts:67](https://github.com/azkal182/islamic-utils/blob/a30827e72f5e43f868fff9ce519ca224296e663c/src/core/types/date.ts#L67)

Full year (4 digits).

#### Remarks

Uses the Gregorian calendar year.
Valid range: 1 to 9999 (practical range for this library)

#### Example

```ts
2024, 1445 (but note: this is Gregorian, not Hijri)
```
