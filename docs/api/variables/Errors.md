[**Islamic Utilities API v0.2.0**](../README.md)

***

[Islamic Utilities API](../README.md) / Errors

# Variable: Errors

> `const` **Errors**: `object`

Defined in: [src/core/errors/error.ts:170](https://github.com/azkal182/islamic-utils/blob/0df9a3737b1fb38d644e36b5ae34cdf225bc89df/src/core/errors/error.ts#L170)

Pre-built error factory functions for common error types.

## Type Declaration

### internal()

> `readonly` **internal**: (`message`, `details?`) => [`LibraryError`](../classes/LibraryError.md)

Creates an INTERNAL_ERROR.

#### Parameters

##### message

`string`

Error message

##### details?

`Record`\<`string`, `unknown`\>

Additional context

#### Returns

[`LibraryError`](../classes/LibraryError.md)

### invalidCoordinates()

> `readonly` **invalidCoordinates**: (`message`, `details?`) => [`LibraryError`](../classes/LibraryError.md)

Creates an INVALID_COORDINATES error.

#### Parameters

##### message

`string`

Error message

##### details?

`Record`\<`string`, `unknown`\>

Coordinate details

#### Returns

[`LibraryError`](../classes/LibraryError.md)

### invalidDate()

> `readonly` **invalidDate**: (`message`, `details?`) => [`LibraryError`](../classes/LibraryError.md)

Creates an INVALID_DATE error.

#### Parameters

##### message

`string`

Error message

##### details?

`Record`\<`string`, `unknown`\>

Date details

#### Returns

[`LibraryError`](../classes/LibraryError.md)

### invalidEstate()

> `readonly` **invalidEstate**: (`message`, `details?`) => [`LibraryError`](../classes/LibraryError.md)

Creates an INHERITANCE_INVALID_ESTATE error.

#### Parameters

##### message

`string`

Error message

##### details?

`Record`\<`string`, `unknown`\>

Estate details

#### Returns

[`LibraryError`](../classes/LibraryError.md)

### invalidHeirs()

> `readonly` **invalidHeirs**: (`message`, `details?`) => [`LibraryError`](../classes/LibraryError.md)

Creates an INHERITANCE_INVALID_HEIRS error.

#### Parameters

##### message

`string`

Error message

##### details?

`Record`\<`string`, `unknown`\>

Heir details

#### Returns

[`LibraryError`](../classes/LibraryError.md)

### invalidTimezone()

> `readonly` **invalidTimezone**: (`message`, `details?`) => [`LibraryError`](../classes/LibraryError.md)

Creates an INVALID_TIMEZONE error.

#### Parameters

##### message

`string`

Error message

##### details?

`Record`\<`string`, `unknown`\>

Timezone details

#### Returns

[`LibraryError`](../classes/LibraryError.md)

### missingParameter()

> `readonly` **missingParameter**: (`paramName`) => [`LibraryError`](../classes/LibraryError.md)

Creates a MISSING_PARAMETER error.

#### Parameters

##### paramName

`string`

Name of the missing parameter

#### Returns

[`LibraryError`](../classes/LibraryError.md)

### polarDayUnresolved()

> `readonly` **polarDayUnresolved**: (`latitude`, `date?`) => [`LibraryError`](../classes/LibraryError.md)

Creates a POLAR_DAY_UNRESOLVED error.

#### Parameters

##### latitude

`number`

The problematic latitude

##### date?

`string`

The date when the issue occurred

#### Returns

[`LibraryError`](../classes/LibraryError.md)

### prayerTimesInconsistent()

> `readonly` **prayerTimesInconsistent**: (`details`) => [`LibraryError`](../classes/LibraryError.md)

Creates a PRAYER_TIMES_INCONSISTENT error.

#### Parameters

##### details

`Record`\<`string`, `unknown`\>

Details about the inconsistency

#### Returns

[`LibraryError`](../classes/LibraryError.md)

## Remarks

Use these for convenience when creating common errors.
