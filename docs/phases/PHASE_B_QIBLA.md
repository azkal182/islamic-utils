# Phase B - Qibla Direction (Arah Kiblat)

> **Estimasi:** 1-2 hari
> **Prioritas:** 🟡 Medium
> **Dependency:** Phase 0 (Core)

---

## 📋 Overview

Modul ini menghitung arah kiblat sebagai **true bearing** (utara sejati) dari lokasi pengguna menuju Ka'bah.

**Karakteristik:**
- Modul paling sederhana dari ketiga modul
- Menggunakan great-circle initial bearing
- Tidak bergantung pada waktu (hanya lokasi)

---

## 🎯 Objectives

1. ✅ Menghitung bearing true north (0-360°) ke Ka'bah
2. ✅ Validasi koordinat input
3. ✅ Explainable output dengan trace
4. ✅ Akurasi tinggi (minimal 2 desimal)

---

## 📝 Tasks

### Task B.1 - Qibla Types

**Deskripsi:** Definisikan types untuk modul Qibla.

**Files:**
- `src/qibla/types.ts`

**Type Definitions:**

```typescript
// types.ts

export interface QiblaInput {
  coordinates: Coordinates;
}

export interface QiblaResult {
  bearing: number;  // 0-360 degrees from true north
  meta: {
    userLocation: Coordinates;
    kaabaLocation: Coordinates;
    distance?: number;  // optional, in kilometers
  };
  trace?: TraceStep[];
}

export interface QiblaTraceStep {
  step: number;
  description: string;
  calculation?: string;
  value?: number;
}
```

---

### Task B.2 - Great Circle Calculation

**Deskripsi:** Implementasi formula initial bearing great-circle.

**Files:**
- `src/qibla/great-circle.ts`

**Formula:**

```
Initial Bearing Formula:
θ = atan2(sin(Δλ) × cos(φ₂), cos(φ₁) × sin(φ₂) − sin(φ₁) × cos(φ₂) × cos(Δλ))

Where:
- φ₁ = user latitude (radians)
- φ₂ = Kaaba latitude (radians)
- Δλ = Kaaba longitude - user longitude (radians)
```

**Implementation:**

```typescript
// great-circle.ts

export function calculateInitialBearing(
  from: Coordinates,
  to: Coordinates
): number {
  const φ1 = degreesToRadians(from.latitude);
  const φ2 = degreesToRadians(to.latitude);
  const Δλ = degreesToRadians(to.longitude - from.longitude);

  const x = Math.sin(Δλ) * Math.cos(φ2);
  const y = Math.cos(φ1) * Math.sin(φ2) -
            Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ);

  const θ = Math.atan2(x, y);

  // Convert to degrees and normalize to 0-360
  return (radiansToDegrees(θ) + 360) % 360;
}

// Optional: Calculate distance
export function calculateDistance(
  from: Coordinates,
  to: Coordinates
): number {
  // Haversine formula
  // Returns distance in kilometers
}
```

---

### Task B.3 - Qibla Calculator

**Deskripsi:** Fungsi utama `computeQiblaDirection()`.

**Files:**
- `src/qibla/calculator.ts`
- `src/qibla/index.ts`

**Implementation:**

```typescript
// calculator.ts

export function computeQiblaDirection(
  input: QiblaInput,
  options?: { includeTrace?: boolean; includeDistance?: boolean }
): Result<QiblaResult> {
  // 1. Validate coordinates
  const validation = validateCoordinates(input.coordinates);
  if (!validation.success) {
    return validation;
  }

  const trace: TraceStep[] = [];

  // 2. Get Kaaba coordinates
  const kaaba = KAABA_COORDINATES;

  if (options?.includeTrace) {
    trace.push({
      step: 1,
      description: 'Using Kaaba coordinates',
      value: kaaba
    });
  }

  // 3. Calculate bearing
  const bearing = calculateInitialBearing(input.coordinates, kaaba);

  if (options?.includeTrace) {
    trace.push({
      step: 2,
      description: 'Calculated initial bearing using great-circle formula',
      value: bearing
    });
  }

  // 4. Optional: Calculate distance
  let distance: number | undefined;
  if (options?.includeDistance) {
    distance = calculateDistance(input.coordinates, kaaba);
  }

  return {
    success: true,
    data: {
      bearing: Math.round(bearing * 100) / 100,  // 2 decimal places
      meta: {
        userLocation: input.coordinates,
        kaabaLocation: kaaba,
        distance
      },
      trace: options?.includeTrace ? trace : undefined
    }
  };
}

// index.ts (public API)
export { computeQiblaDirection } from './calculator';
export * from './types';
```

---

### Task B.4 - Unit Tests

**Deskripsi:** Unit tests untuk Qibla calculations.

**Files:**
- `tests/unit/qibla/great-circle.test.ts`
- `tests/unit/qibla/calculator.test.ts`

**Test Cases:**

| Location | Expected Bearing (approx) |
|----------|--------------------------|
| Jakarta, Indonesia | ~295° (WNW) |
| London, UK | ~119° (ESE) |
| New York, USA | ~58° (ENE) |
| Tokyo, Japan | ~293° (WNW) |
| Sydney, Australia | ~277° (W) |
| Cape Town, SA | ~35° (NE) |
| At Kaaba | 0° (undefined/any) |

```typescript
// calculator.test.ts

describe('computeQiblaDirection', () => {
  it('should calculate correct bearing for Jakarta', () => {
    const result = computeQiblaDirection({
      coordinates: { latitude: -6.2088, longitude: 106.8456 }
    });

    expect(result.success).toBe(true);
    expect(result.data?.bearing).toBeCloseTo(295, 0);
  });

  it('should handle invalid coordinates', () => {
    const result = computeQiblaDirection({
      coordinates: { latitude: 100, longitude: 0 }  // invalid
    });

    expect(result.success).toBe(false);
    expect(result.error?.code).toBe('INVALID_COORDINATES');
  });

  it('should include trace when requested', () => {
    const result = computeQiblaDirection(
      { coordinates: { latitude: 0, longitude: 0 } },
      { includeTrace: true }
    );

    expect(result.data?.trace).toBeDefined();
    expect(result.data?.trace?.length).toBeGreaterThan(0);
  });
});
```

---

### Task B.5 - Edge Cases Handling

**Deskripsi:** Handle special cases.

**Files:**
- Update `src/qibla/calculator.ts`

**Edge Cases:**

1. **At or very near Kaaba:**
   - User berada di Ka'bah atau sangat dekat
   - Return bearing 0 atau special case

2. **Antipodal point:**
   - Titik di sisi berlawanan bumi dari Ka'bah
   - Multiple valid bearings, return any valid bearing with note

3. **Poles:**
   - Di kutub utara: semua arah adalah selatan (valid bearing = ~119°)
   - Di kutub selatan: semua arah adalah utara (valid bearing)

```typescript
// Handle edge cases in calculator
function handleEdgeCases(
  userCoords: Coordinates,
  kaabaCoords: Coordinates
): { isEdgeCase: boolean; bearing?: number; note?: string } {
  const distance = calculateDistance(userCoords, kaabaCoords);

  // Very close to Kaaba (within 100 meters)
  if (distance < 0.1) {
    return {
      isEdgeCase: true,
      bearing: 0,
      note: 'User is at or very near the Kaaba'
    };
  }

  return { isEdgeCase: false };
}
```

---

## ✅ Definition of Done

- [ ] Bearing calculation accurate to 2 decimal places
- [ ] All edge cases handled
- [ ] Unit tests >90% coverage
- [ ] Trace mode functional
- [ ] Validated against known reference values

---

## 📊 Progress Tracking

| Task | Status | Notes |
|------|--------|-------|
| B.1 Types | 🔴 TODO | |
| B.2 Great Circle | 🔴 TODO | |
| B.3 Calculator | 🔴 TODO | |
| B.4 Unit Tests | 🔴 TODO | |
| B.5 Edge Cases | 🔴 TODO | |

---

*Previous: [PHASE_A_PRAYER_TIMES.md](./PHASE_A_PRAYER_TIMES.md) | Next: [PHASE_C_INHERITANCE.md](./PHASE_C_INHERITANCE.md)*
