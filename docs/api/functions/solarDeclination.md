[**Islamic Utilities API v0.2.2**](../README.md)

***

[Islamic Utilities API](../README.md) / solarDeclination

# Function: solarDeclination()

> **solarDeclination**(`T`): `number`

Defined in: [src/astronomy/solar.ts:241](https://github.com/azkal182/islamic-utils/blob/a30827e72f5e43f868fff9ce519ca224296e663c/src/astronomy/solar.ts#L241)

Calculates the Sun's declination.

## Parameters

### T

`number`

Julian centuries since J2000.0

## Returns

`number`

Declination in degrees (-23.44 to +23.44)

## Remarks

Declination is the angular distance of the Sun north or south of
the celestial equator. It ranges from approximately -23.44° (winter
solstice) to +23.44° (summer solstice) in the Northern Hemisphere.

## Example

```typescript
// Around summer solstice (Northern Hemisphere)
solarDeclination(T);  // approximately +23.4°

// Around equinox
solarDeclination(T);  // approximately 0°
```
