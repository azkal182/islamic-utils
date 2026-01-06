[**Islamic Utilities API v0.2.0**](../README.md)

***

[Islamic Utilities API](../README.md) / AsrMadhhab

# Variable: AsrMadhhab

> `const` **AsrMadhhab**: `object`

Defined in: [src/prayer-times/types.ts:98](https://github.com/azkal182/islamic-utils/blob/0df9a3737b1fb38d644e36b5ae34cdf225bc89df/src/prayer-times/types.ts#L98)

Madhhab (school of thought) for Asr prayer calculation.

## Type Declaration

### HANAFI

> `readonly` **HANAFI**: `"hanafi"` = `'hanafi'`

Hanafi calculation.
Asr begins when shadow equals 2x object length plus noon shadow.

### STANDARD

> `readonly` **STANDARD**: `"standard"` = `'standard'`

Shafi'i, Maliki, and Hanbali calculation.
Asr begins when shadow equals object length plus noon shadow.

## Remarks

The difference is in when Asr begins based on shadow length:
- Standard (Shafi'i, Maliki, Hanbali): shadow = 1x object length + noon shadow
- Hanafi: shadow = 2x object length + noon shadow
