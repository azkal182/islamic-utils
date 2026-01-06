[**Islamic Utilities API v0.2.2**](../README.md)

***

[Islamic Utilities API](../README.md) / TimeContext

# Interface: TimeContext

Defined in: [src/core/types/date.ts:187](https://github.com/azkal182/islamic-utils/blob/a30827e72f5e43f868fff9ce519ca224296e663c/src/core/types/date.ts#L187)

Provides complete context for time-based calculations.

## Remarks

Combines a date with timezone information to provide unambiguous
context for astronomical calculations.

## Example

```typescript
// Calculate prayer times for Jakarta on January 15, 2024
const context: TimeContext = {
  date: { year: 2024, month: 1, day: 15 },
  timezone: 'Asia/Jakarta'
};

// Or using UTC offset
const context2: TimeContext = {
  date: { year: 2024, month: 1, day: 15 },
  timezone: 7 // UTC+7
};
```

## Properties

### date

> `readonly` **date**: [`DateOnly`](DateOnly.md)

Defined in: [src/core/types/date.ts:191](https://github.com/azkal182/islamic-utils/blob/a30827e72f5e43f868fff9ce519ca224296e663c/src/core/types/date.ts#L191)

The calendar date for calculations.

***

### timezone

> `readonly` **timezone**: [`Timezone`](../type-aliases/Timezone.md)

Defined in: [src/core/types/date.ts:198](https://github.com/azkal182/islamic-utils/blob/a30827e72f5e43f868fff9ce519ca224296e663c/src/core/types/date.ts#L198)

Timezone for the calculation.

#### See

Timezone for details on accepted formats
