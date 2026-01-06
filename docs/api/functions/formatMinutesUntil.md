[**Islamic Utilities API v0.2.1**](../README.md)

***

[Islamic Utilities API](../README.md) / formatMinutesUntil

# Function: formatMinutesUntil()

> **formatMinutesUntil**(`minutes`): `string`

Defined in: src/prayer-times/next-prayer.ts:238

Formats minutes into a human-readable countdown string.

## Parameters

### minutes

`number`

Number of minutes

## Returns

`string`

Formatted string like "1h 30m" or "45m"

## Example

```typescript
formatMinutesUntil(90);  // "1h 30m"
formatMinutesUntil(45);  // "45m"
formatMinutesUntil(150); // "2h 30m"
```
