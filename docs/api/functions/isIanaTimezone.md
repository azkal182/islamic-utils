[**Islamic Utilities API v0.2.2**](../README.md)

***

[Islamic Utilities API](../README.md) / isIanaTimezone

# Function: isIanaTimezone()

> **isIanaTimezone**(`tz`): `boolean`

Defined in: [src/core/utils/timezone.ts:48](https://github.com/azkal182/islamic-utils/blob/a30827e72f5e43f868fff9ce519ca224296e663c/src/core/utils/timezone.ts#L48)

Checks if a timezone string is a valid IANA timezone name.

## Parameters

### tz

`string`

Timezone string to check

## Returns

`boolean`

True if valid IANA timezone name

## Example

```typescript
isIanaTimezone('Asia/Jakarta');  // true
isIanaTimezone('Invalid/Zone');  // false
```
