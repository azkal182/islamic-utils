[**Islamic Utilities API v0.2.2**](../README.md)

***

[Islamic Utilities API](../README.md) / clamp

# Function: clamp()

> **clamp**(`value`, `min`, `max`): `number`

Defined in: [src/core/utils/math.ts:143](https://github.com/azkal182/islamic-utils/blob/a30827e72f5e43f868fff9ce519ca224296e663c/src/core/utils/math.ts#L143)

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
