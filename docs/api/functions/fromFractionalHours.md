[**Islamic Utilities API v0.2.2**](../README.md)

***

[Islamic Utilities API](../README.md) / fromFractionalHours

# Function: fromFractionalHours()

> **fromFractionalHours**(`fractionalHours`): `object`

Defined in: [src/core/utils/math.ts:108](https://github.com/azkal182/islamic-utils/blob/f548f22580afc5800e32e3785eef49f3fce9f58a/src/core/utils/math.ts#L108)

Converts fractional hours to hours, minutes, and seconds.

## Parameters

### fractionalHours

`number`

Time in fractional hours

## Returns

`object`

Object with hours, minutes, and seconds

### hours

> **hours**: `number`

### minutes

> **minutes**: `number`

### seconds

> **seconds**: `number`

## Example

```typescript
fromFractionalHours(5.5);
// { hours: 5, minutes: 30, seconds: 0 }

fromFractionalHours(12.2583);
// { hours: 12, minutes: 15, seconds: 29.88 }
```
