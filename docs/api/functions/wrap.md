[**Islamic Utilities API v0.2.2**](../README.md)

***

[Islamic Utilities API](../README.md) / wrap

# Function: wrap()

> **wrap**(`value`, `min`, `max`): `number`

Defined in: [src/core/utils/math.ts:201](https://github.com/azkal182/islamic-utils/blob/f548f22580afc5800e32e3785eef49f3fce9f58a/src/core/utils/math.ts#L201)

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
