[**Islamic Utilities API v0.2.2**](../README.md)

***

[Islamic Utilities API](../README.md) / roundByRule

# Function: roundByRule()

> **roundByRule**(`value`, `rule`): `number`

Defined in: [src/core/utils/math.ts:32](https://github.com/azkal182/islamic-utils/blob/a30827e72f5e43f868fff9ce519ca224296e663c/src/core/utils/math.ts#L32)

Rounds a number to the nearest integer based on the specified rule.

## Parameters

### value

`number`

The value to round

### rule

[`RoundingRule`](../type-aliases/RoundingRule.md)

The rounding rule to apply

## Returns

`number`

Rounded value

## Example

```typescript
roundByRule(5.4, 'none');     // 5.4
roundByRule(5.4, 'nearest');  // 5
roundByRule(5.4, 'ceil');     // 6
roundByRule(5.4, 'floor');    // 5

roundByRule(5.6, 'nearest');  // 6
roundByRule(5.5, 'nearest');  // 6 (rounds up on .5)
```
