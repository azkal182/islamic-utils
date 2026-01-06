[**Islamic Utilities API v0.2.1**](../README.md)

***

[Islamic Utilities API](../README.md) / clamp

# Function: clamp()

> **clamp**(`value`, `min`, `max`): `number`

Defined in: [src/core/utils/math.ts:143](https://github.com/azkal182/islamic-utils/blob/6511551c69fa725f6e44569e9e1278849e32f702/src/core/utils/math.ts#L143)

Clamps a value between a minimum and maximum.

## Parameters

### value

`number`

The value to clamp

### min

`number`

Minimum allowed value

### max

`number`

Maximum allowed value

## Returns

`number`

Clamped value

## Example

```typescript
clamp(5, 0, 10);   // 5
clamp(-5, 0, 10);  // 0
clamp(15, 0, 10);  // 10
```
