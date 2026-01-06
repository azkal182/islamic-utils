[**Islamic Utilities API v0.2.2**](../README.md)

***

[Islamic Utilities API](../README.md) / applyHijab

# Function: applyHijab()

> **applyHijab**(`heirs`, `flags`): `HijabResult`

Defined in: [src/inheritance/rules/hijab.ts:187](https://github.com/azkal182/islamic-utils/blob/a30827e72f5e43f868fff9ce519ca224296e663c/src/inheritance/rules/hijab.ts#L187)

Applies Hijab Hirman rules to determine which heirs are blocked.

## Parameters

### heirs

[`HeirInput`](../interfaces/HeirInput.md)[]

List of heir inputs

### flags

[`DerivedFlags`](../interfaces/DerivedFlags.md)

Derived flags from heirs

## Returns

`HijabResult`

Hijab result with active heirs, blocked heirs, and trace

## Remarks

Hijab Hirman = Total exclusion. A blocked heir receives nothing.

## Example

```typescript
const result = applyHijab(
  [
    { type: HeirType.SON, count: 1 },
    { type: HeirType.BROTHER_FULL, count: 1 },
  ],
  flags
);

// Brother is blocked by son (Rule E1)
result.blockedHeirs[0].heir.type  // 'brother_full'
result.blockedHeirs[0].blockedBy  // ['son']
```
