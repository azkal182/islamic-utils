[**Islamic Utilities API v0.2.2**](../README.md)

***

[Islamic Utilities API](../README.md) / validateUtcOffset

# Function: validateUtcOffset()

> **validateUtcOffset**(`offset`): [`Result`](../type-aliases/Result.md)\<`number`\>

Defined in: [src/core/validators/timezone.ts:132](https://github.com/azkal182/islamic-utils/blob/f548f22580afc5800e32e3785eef49f3fce9f58a/src/core/validators/timezone.ts#L132)

Validates a UTC offset.

## Parameters

### offset

`number`

The UTC offset in hours

## Returns

[`Result`](../type-aliases/Result.md)\<`number`\>

Success with validated offset, or failure with error details

## Example

```typescript
validateUtcOffset(7);     // success
validateUtcOffset(-5);    // success
validateUtcOffset(5.5);   // success (UTC+5:30)
validateUtcOffset(5.75);  // success (UTC+5:45)
validateUtcOffset(20);    // failure
```
