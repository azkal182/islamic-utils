[**Islamic Utilities API v0.2.2**](../README.md)

***

[Islamic Utilities API](../README.md) / getTimezoneOffset

# Function: getTimezoneOffset()

> **getTimezoneOffset**(`timezone`, `date`): `number`

Defined in: [src/core/utils/timezone.ts:146](https://github.com/azkal182/islamic-utils/blob/a30827e72f5e43f868fff9ce519ca224296e663c/src/core/utils/timezone.ts#L146)

Gets the UTC offset in hours for a given timezone at a specific date.

## Parameters

### timezone

[`Timezone`](../type-aliases/Timezone.md)

IANA timezone name or UTC offset

### date

`Date`

Date to check (for DST handling)

## Returns

`number`

UTC offset in hours

## Example

```typescript
getTimezoneOffset('Asia/Jakarta', new Date()); // 7
getTimezoneOffset(7, new Date());              // 7
```
