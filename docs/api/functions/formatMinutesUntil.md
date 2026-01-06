[**Islamic Utilities API v0.2.2**](../README.md)

***

[Islamic Utilities API](../README.md) / formatMinutesUntil

# Function: formatMinutesUntil()

> **formatMinutesUntil**(`minutes`): `string`

Defined in: [src/prayer-times/next-prayer.ts:303](https://github.com/azkal182/islamic-utils/blob/a30827e72f5e43f868fff9ce519ca224296e663c/src/prayer-times/next-prayer.ts#L303)

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
