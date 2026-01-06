[**Islamic Utilities API v0.2.2**](../README.md)

***

[Islamic Utilities API](../README.md) / Angle

# Type Alias: Angle

> **Angle** = `number` \| [`AngleDMS`](../interfaces/AngleDMS.md)

Defined in: [src/core/types/angle.ts:92](https://github.com/azkal182/islamic-utils/blob/a30827e72f5e43f868fff9ce519ca224296e663c/src/core/types/angle.ts#L92)

Represents an angle that can be in decimal degrees or DMS format.

## Remarks

Use decimal degrees (number) for calculations.
Use AngleDMS for display or when input is in DMS format.

## Example

```typescript
// Decimal degrees (preferred for calculations)
const angle1: Angle = 21.4225;

// DMS format (for display or input)
const angle2: Angle = { degrees: 21, minutes: 25, seconds: 21 };
```
