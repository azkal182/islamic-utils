[**Islamic Utilities API v0.2.2**](../README.md)

***

[Islamic Utilities API](../README.md) / lerp

# Function: lerp()

> **lerp**(`a`, `b`, `t`): `number`

Defined in: [src/core/utils/math.ts:163](https://github.com/azkal182/islamic-utils/blob/a30827e72f5e43f868fff9ce519ca224296e663c/src/core/utils/math.ts#L163)

Linear interpolation between two values.

## Parameters

### a

`number`

Start value

### b

`number`

End value

### t

`number`

Interpolation factor (0 to 1)

## Returns

`number`

Interpolated value

## Example

```typescript
lerp(0, 100, 0.0);   // 0
lerp(0, 100, 0.5);   // 50
lerp(0, 100, 1.0);   // 100
lerp(0, 100, 0.25);  // 25
```
