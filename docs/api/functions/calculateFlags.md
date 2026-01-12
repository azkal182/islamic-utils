[**Islamic Utilities API v0.2.2**](../README.md)

***

[Islamic Utilities API](../README.md) / calculateFlags

# Function: calculateFlags()

> **calculateFlags**(`heirs`): [`DerivedFlags`](../interfaces/DerivedFlags.md)

Defined in: [src/inheritance/flags.ts:40](https://github.com/azkal182/islamic-utils/blob/f548f22580afc5800e32e3785eef49f3fce9f58a/src/inheritance/flags.ts#L40)

Calculates derived flags from the list of heirs.

## Parameters

### heirs

[`HeirInput`](../interfaces/HeirInput.md)[]

Array of heir inputs

## Returns

[`DerivedFlags`](../interfaces/DerivedFlags.md)

Derived boolean flags

## Remarks

These flags are used throughout the calculation to determine:
- Hijab (exclusion) rules
- Furudh share amounts
- Special case detection

## Example

```typescript
const flags = calculateFlags([
  { type: HeirType.SON, count: 2 },
  { type: HeirType.DAUGHTER, count: 1 },
  { type: HeirType.WIFE, count: 1 },
]);

flags.HAS_CHILD       // true
flags.HAS_SON         // true
flags.HAS_DESCENDANT  // true
```
