[**Islamic Utilities API v0.2.0**](../README.md)

***

[Islamic Utilities API](../README.md) / roundToMinute

# Function: roundToMinute()

> **roundToMinute**(`hours`, `rule`): `number`

Defined in: [src/core/utils/math.ts:62](https://github.com/azkal182/islamic-utils/blob/0df9a3737b1fb38d644e36b5ae34cdf225bc89df/src/core/utils/math.ts#L62)

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
