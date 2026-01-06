[**Islamic Utilities API v0.2.2**](../README.md)

***

[Islamic Utilities API](../README.md) / toFractionalHours

# Function: toFractionalHours()

> **toFractionalHours**(`hours`, `minutes`, `seconds`): `number`

Defined in: [src/core/utils/math.ts:89](https://github.com/azkal182/islamic-utils/blob/a30827e72f5e43f868fff9ce519ca224296e663c/src/core/utils/math.ts#L89)

Converts hours and minutes to fractional hours.

## Parameters

### hours

`number`

Whole hours

### minutes

`number`

Minutes (can be > 60)

### seconds

`number` = `0`

Seconds (optional, default 0)

## Returns

`number`

Fractional hours

## Example

```typescript
toFractionalHours(5, 30);      // 5.5
toFractionalHours(12, 15);     // 12.25
toFractionalHours(0, 90);      // 1.5
toFractionalHours(12, 30, 30); // 12.508333...
```
