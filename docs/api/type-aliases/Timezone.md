[**Islamic Utilities API v0.2.0**](../README.md)

***

[Islamic Utilities API](../README.md) / Timezone

# Type Alias: Timezone

> **Timezone** = `string` \| `number`

Defined in: [src/core/types/date.ts:163](https://github.com/azkal182/islamic-utils/blob/0df9a3737b1fb38d644e36b5ae34cdf225bc89df/src/core/types/date.ts#L163)

Represents timezone information.

## Remarks

Can be specified as:
- IANA timezone name (recommended): "Asia/Jakarta", "America/New_York"
- UTC offset in hours: 7, -5, 5.5 (for half-hour offsets like India)

IANA names are preferred because they handle DST automatically.

## Example

```typescript
// Using IANA name (recommended)
const tz1: Timezone = "Asia/Jakarta";

// Using UTC offset
const tz2: Timezone = 7;        // UTC+7
const tz3: Timezone = -5;       // UTC-5
const tz4: Timezone = 5.5;      // UTC+5:30 (India)
```
