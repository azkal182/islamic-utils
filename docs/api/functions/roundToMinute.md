[**Islamic Utilities API v0.2.2**](../README.md)

***

[Islamic Utilities API](../README.md) / roundToMinute

# Function: roundToMinute()

> **roundToMinute**(`hours`, `rule`): `number`

Defined in: [src/core/utils/math.ts:62](https://github.com/azkal182/islamic-utils/blob/a30827e72f5e43f868fff9ce519ca224296e663c/src/core/utils/math.ts#L62)

Rounds a time value (in hours) to the nearest minute.

## Parameters

### hours

`number`

Time in fractional hours

### rule

[`RoundingRule`](../type-aliases/RoundingRule.md)

The rounding rule to apply

## Returns

`number`

Time in hours, rounded to nearest minute precision

## Example

```typescript
// 5.425 hours = 5h 25.5m
roundToMinute(5.425, 'nearest');  // 5.416... (5h 25m)
roundToMinute(5.425, 'ceil');     // 5.433... (5h 26m)
roundToMinute(5.425, 'floor');    // 5.416... (5h 25m)
```
