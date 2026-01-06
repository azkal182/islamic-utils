[**Islamic Utilities API v0.2.0**](../README.md)

***

[Islamic Utilities API](../README.md) / formatTime

# Function: formatTime()

> **formatTime**(`hours`, `format`, `includeSeconds`): `string`

Defined in: [src/astronomy/time.ts:155](https://github.com/azkal182/islamic-utils/blob/ddd04bee89289da73cadadfcee51cdeac187e097/src/astronomy/time.ts#L155)

Formats fractional hours as a time string.

## Parameters

### hours

`number`

Time in fractional hours

### format

Format style ('24h' or '12h')

`"24h"` | `"12h"`

### includeSeconds

`boolean` = `false`

Whether to include seconds

## Returns

`string`

Formatted time string

## Example

```typescript
formatTime(5.5, '24h', false);    // "05:30"
formatTime(5.5, '12h', false);    // "5:30 AM"
formatTime(17.25, '24h', true);   // "17:15:00"
formatTime(17.25, '12h', false);  // "5:15 PM"
```
