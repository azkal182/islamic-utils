[**Islamic Utilities API v0.2.0**](../README.md)

***

[Islamic Utilities API](../README.md) / Angle

# Type Alias: Angle

> **Angle** = `number` \| [`AngleDMS`](../interfaces/AngleDMS.md)

Defined in: [src/core/types/angle.ts:92](https://github.com/azkal182/islamic-utils/blob/ddd04bee89289da73cadadfcee51cdeac187e097/src/core/types/angle.ts#L92)

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
