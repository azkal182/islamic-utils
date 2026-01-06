[**Islamic Utilities API v0.2.1**](../README.md)

***

[Islamic Utilities API](../README.md) / wrap

# Function: wrap()

> **wrap**(`value`, `min`, `max`): `number`

Defined in: [src/core/utils/math.ts:201](https://github.com/azkal182/islamic-utils/blob/6511551c69fa725f6e44569e9e1278849e32f702/src/core/utils/math.ts#L201)

Wraps a value to be within a range [min, max).

## Parameters

### value

`number`

The value to wrap

### min

`number`

Minimum value (inclusive)

### max

`number`

Maximum value (exclusive)

## Returns

`number`

Wrapped value

## Example

```typescript
wrap(370, 0, 360);   // 10
wrap(-10, 0, 360);   // 350
wrap(360, 0, 360);   // 0
wrap(25, 0, 24);     // 1
```
