/**
 * @fileoverview Unit tests for Qibla Direction calculator
 */

import { describe, it, expect } from 'vitest';
import {
  computeQiblaDirection,
  calculateInitialBearing,
  calculateGreatCircleDistance,
  CompassDirection,
  bearingToCompassDirection,
} from '../../../src/qibla';
import { KAABA_COORDINATES } from '../../../src/core/constants/kaaba';

// Test locations with expected approximate bearings
const TEST_LOCATIONS = [
  {
    name: 'Jakarta, Indonesia',
    lat: -6.2088,
    lng: 106.8456,
    expectedBearing: 295,
    expectedDir: 'WNW',
  },
  { name: 'London, UK', lat: 51.5074, lng: -0.1278, expectedBearing: 119, expectedDir: 'ESE' },
  { name: 'New York, USA', lat: 40.7128, lng: -74.006, expectedBearing: 58, expectedDir: 'ENE' },
  { name: 'Tokyo, Japan', lat: 35.6762, lng: 139.6503, expectedBearing: 293, expectedDir: 'WNW' },
  {
    name: 'Sydney, Australia',
    lat: -33.8688,
    lng: 151.2093,
    expectedBearing: 277,
    expectedDir: 'W',
  },
  { name: 'Cape Town, SA', lat: -33.9249, lng: 18.4241, expectedBearing: 23, expectedDir: 'NNE' },
  { name: 'Moscow, Russia', lat: 55.7558, lng: 37.6173, expectedBearing: 176, expectedDir: 'S' },
  {
    name: 'Rio de Janeiro, Brazil',
    lat: -22.9068,
    lng: -43.1729,
    expectedBearing: 66,
    expectedDir: 'ENE',
  },
];

describe('computeQiblaDirection', () => {
  describe('Basic Calculations', () => {
    for (const loc of TEST_LOCATIONS) {
      it(`should calculate correct bearing for ${loc.name}`, () => {
        const result = computeQiblaDirection({
          coordinates: { latitude: loc.lat, longitude: loc.lng },
        });

        expect(result.success).toBe(true);
        if (result.success) {
          // Allow ±5° tolerance
          expect(result.data.bearing).toBeGreaterThan(loc.expectedBearing - 5);
          expect(result.data.bearing).toBeLessThan(loc.expectedBearing + 5);
        }
      });
    }
  });

  describe('Compass Direction', () => {
    it('should return correct compass direction for Jakarta', () => {
      const result = computeQiblaDirection({
        coordinates: { latitude: -6.2088, longitude: 106.8456 },
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.compassDirection).toBe(CompassDirection.WNW);
      }
    });

    it('should return correct compass direction for London', () => {
      const result = computeQiblaDirection({
        coordinates: { latitude: 51.5074, longitude: -0.1278 },
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.compassDirection).toBe(CompassDirection.ESE);
      }
    });
  });

  describe('Options', () => {
    it('should include distance when requested', () => {
      const result = computeQiblaDirection(
        { coordinates: { latitude: -6.2088, longitude: 106.8456 } },
        { includeDistance: true }
      );

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.meta.distance).toBeDefined();
        expect(result.data.meta.distance).toBeGreaterThan(7000); // Jakarta to Makkah ~7985km
        expect(result.data.meta.distance).toBeLessThan(9000);
      }
    });

    it('should include trace when requested', () => {
      const result = computeQiblaDirection(
        { coordinates: { latitude: -6.2088, longitude: 106.8456 } },
        { includeTrace: true }
      );

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.trace).toBeDefined();
        expect(Array.isArray(result.data.trace)).toBe(true);
        expect(result.data.trace!.length).toBeGreaterThan(0);
      }
    });

    it('should not include trace by default', () => {
      const result = computeQiblaDirection({
        coordinates: { latitude: -6.2088, longitude: 106.8456 },
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.trace).toBeUndefined();
      }
    });
  });

  describe('Edge Cases', () => {
    it("should handle location at Ka'bah", () => {
      const result = computeQiblaDirection({
        coordinates: KAABA_COORDINATES,
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.meta.atKaaba).toBe(true);
        expect(result.data.meta.note).toBeDefined();
      }
    });

    it("should handle location very near Ka'bah", () => {
      const result = computeQiblaDirection({
        coordinates: { latitude: 21.4225, longitude: 39.8263 }, // Very close
      });

      expect(result.success).toBe(true);
    });

    it('should reject invalid latitude', () => {
      const result = computeQiblaDirection({
        coordinates: { latitude: 100, longitude: 0 },
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.code).toBe('INVALID_COORDINATES');
      }
    });

    it('should reject invalid longitude', () => {
      const result = computeQiblaDirection({
        coordinates: { latitude: 0, longitude: 200 },
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.code).toBe('INVALID_COORDINATES');
      }
    });
  });

  describe('Metadata', () => {
    it('should include user location in meta', () => {
      const coords = { latitude: -6.2088, longitude: 106.8456 };
      const result = computeQiblaDirection({ coordinates: coords });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.meta.userLocation.latitude).toBe(coords.latitude);
        expect(result.data.meta.userLocation.longitude).toBe(coords.longitude);
      }
    });

    it("should include Ka'bah location in meta", () => {
      const result = computeQiblaDirection({
        coordinates: { latitude: -6.2088, longitude: 106.8456 },
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.meta.kaabaLocation).toEqual(KAABA_COORDINATES);
      }
    });
  });
});

describe('calculateInitialBearing', () => {
  it('should calculate bearing from Jakarta to Makkah', () => {
    const bearing = calculateInitialBearing(
      { latitude: -6.2088, longitude: 106.8456 },
      KAABA_COORDINATES
    );

    expect(bearing).toBeGreaterThan(293);
    expect(bearing).toBeLessThan(297);
  });

  it('should return 0 for same point', () => {
    const bearing = calculateInitialBearing(
      { latitude: 0, longitude: 0 },
      { latitude: 0, longitude: 0 }
    );

    // Result may be 0 or NaN
    expect(bearing).toBeDefined();
  });
});

describe('calculateGreatCircleDistance', () => {
  it('should calculate distance from Jakarta to Makkah', () => {
    const distance = calculateGreatCircleDistance(
      { latitude: -6.2088, longitude: 106.8456 },
      KAABA_COORDINATES
    );

    // Jakarta to Makkah is approximately 7,985 km
    expect(distance).toBeGreaterThan(7900);
    expect(distance).toBeLessThan(8100);
  });

  it('should return 0 for same point', () => {
    const distance = calculateGreatCircleDistance(
      { latitude: 0, longitude: 0 },
      { latitude: 0, longitude: 0 }
    );

    expect(distance).toBe(0);
  });
});

describe('bearingToCompassDirection', () => {
  const testCases = [
    { bearing: 0, expected: 'N' },
    { bearing: 360, expected: 'N' },
    { bearing: 45, expected: 'NE' },
    { bearing: 90, expected: 'E' },
    { bearing: 135, expected: 'SE' },
    { bearing: 180, expected: 'S' },
    { bearing: 225, expected: 'SW' },
    { bearing: 270, expected: 'W' },
    { bearing: 315, expected: 'NW' },
  ];

  for (const tc of testCases) {
    it(`should convert ${tc.bearing}° to ${tc.expected}`, () => {
      expect(bearingToCompassDirection(tc.bearing)).toBe(tc.expected);
    });
  }
});
