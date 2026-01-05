/**
 * @fileoverview Integration tests for Qibla Direction module
 */

import { describe, it, expect } from 'vitest';
import {
  // Main calculator
  computeQiblaDirection,

  // Types and enums
  CompassDirection,
  bearingToCompassDirection,

  // Great circle utilities
  calculateInitialBearing,
  calculateFinalBearing,
  calculateGreatCircleDistance,
  calculateMidpoint,

  // Ka'bah constant
  KAABA_COORDINATES,

  // Result utilities
  isSuccess,
  isError,
} from '../../src';

describe('Qibla Direction Integration', () => {
  describe('Module Exports', () => {
    it('should export computeQiblaDirection function', () => {
      expect(computeQiblaDirection).toBeDefined();
      expect(typeof computeQiblaDirection).toBe('function');
    });

    it('should export CompassDirection enum', () => {
      expect(CompassDirection.N).toBe('N');
      expect(CompassDirection.E).toBe('E');
      expect(CompassDirection.S).toBe('S');
      expect(CompassDirection.W).toBe('W');
      expect(CompassDirection.NE).toBe('NE');
      expect(CompassDirection.SE).toBe('SE');
      expect(CompassDirection.SW).toBe('SW');
      expect(CompassDirection.NW).toBe('NW');
    });

    it('should export great circle functions', () => {
      expect(calculateInitialBearing).toBeDefined();
      expect(calculateFinalBearing).toBeDefined();
      expect(calculateGreatCircleDistance).toBeDefined();
      expect(calculateMidpoint).toBeDefined();
    });

    it("should export Ka'bah coordinates", () => {
      expect(KAABA_COORDINATES).toBeDefined();
      expect(KAABA_COORDINATES.latitude).toBeCloseTo(21.4225, 4);
      expect(KAABA_COORDINATES.longitude).toBeCloseTo(39.8262, 4);
    });
  });

  describe('Result Type Compatibility', () => {
    it('should return success result with data', () => {
      const result = computeQiblaDirection({
        coordinates: { latitude: -6.2088, longitude: 106.8456 },
      });

      expect(isSuccess(result)).toBe(true);
      expect(isError(result)).toBe(false);

      if (result.success) {
        expect(result.data).toBeDefined();
        expect(result.data.bearing).toBeDefined();
        expect(result.data.compassDirection).toBeDefined();
        expect(result.data.meta).toBeDefined();
      }
    });

    it('should return error result for invalid input', () => {
      const result = computeQiblaDirection({
        coordinates: { latitude: 200, longitude: 0 },
      });

      expect(isSuccess(result)).toBe(false);
      expect(isError(result)).toBe(true);

      if (!result.success) {
        expect(result.error).toBeDefined();
        expect(result.error.code).toBe('INVALID_COORDINATES');
      }
    });
  });

  describe('Cross-Module Consistency', () => {
    it("should use same Ka'bah coordinates as constants module", () => {
      const result = computeQiblaDirection({
        coordinates: { latitude: -6.2088, longitude: 106.8456 },
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.meta.kaabaLocation).toEqual(KAABA_COORDINATES);
      }
    });

    it('should produce consistent results for same input', () => {
      const input = { coordinates: { latitude: -6.2088, longitude: 106.8456 } };

      const result1 = computeQiblaDirection(input);
      const result2 = computeQiblaDirection(input);
      const result3 = computeQiblaDirection(input);

      expect(result1.success).toBe(true);
      expect(result2.success).toBe(true);
      expect(result3.success).toBe(true);

      if (result1.success && result2.success && result3.success) {
        expect(result1.data.bearing).toBe(result2.data.bearing);
        expect(result2.data.bearing).toBe(result3.data.bearing);
      }
    });
  });

  describe('Global Locations', () => {
    const locations = [
      { name: 'Jakarta', lat: -6.2088, lng: 106.8456 },
      { name: 'London', lat: 51.5074, lng: -0.1278 },
      { name: 'New York', lat: 40.7128, lng: -74.006 },
      { name: 'Tokyo', lat: 35.6762, lng: 139.6503 },
      { name: 'Sydney', lat: -33.8688, lng: 151.2093 },
      { name: 'Cairo', lat: 30.0444, lng: 31.2357 },
      { name: 'Dubai', lat: 25.2048, lng: 55.2708 },
      { name: 'Kuala Lumpur', lat: 3.139, lng: 101.6869 },
    ];

    for (const loc of locations) {
      it(`should calculate Qibla for ${loc.name}`, () => {
        const result = computeQiblaDirection({
          coordinates: { latitude: loc.lat, longitude: loc.lng },
        });

        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data.bearing).toBeGreaterThanOrEqual(0);
          expect(result.data.bearing).toBeLessThan(360);
          expect(result.data.compassDirection).toBeDefined();
        }
      });
    }
  });

  describe('Bearing to Compass Conversion', () => {
    it('should correctly convert all 16 directions', () => {
      const cases = [
        { bearing: 0, expected: 'N' },
        { bearing: 22.5, expected: 'NNE' },
        { bearing: 45, expected: 'NE' },
        { bearing: 67.5, expected: 'ENE' },
        { bearing: 90, expected: 'E' },
        { bearing: 112.5, expected: 'ESE' },
        { bearing: 135, expected: 'SE' },
        { bearing: 157.5, expected: 'SSE' },
        { bearing: 180, expected: 'S' },
        { bearing: 202.5, expected: 'SSW' },
        { bearing: 225, expected: 'SW' },
        { bearing: 247.5, expected: 'WSW' },
        { bearing: 270, expected: 'W' },
        { bearing: 292.5, expected: 'WNW' },
        { bearing: 315, expected: 'NW' },
        { bearing: 337.5, expected: 'NNW' },
      ];

      for (const tc of cases) {
        expect(bearingToCompassDirection(tc.bearing)).toBe(tc.expected);
      }
    });
  });

  describe('Great Circle Utilities', () => {
    it('should calculate midpoint correctly', () => {
      const midpoint = calculateMidpoint(
        { latitude: 0, longitude: 0 },
        { latitude: 0, longitude: 10 }
      );

      expect(midpoint.latitude).toBeCloseTo(0, 1);
      expect(midpoint.longitude).toBeCloseTo(5, 1);
    });

    it('should calculate final bearing as reverse of initial', () => {
      const from = { latitude: 0, longitude: 0 };
      const to = { latitude: 10, longitude: 10 };

      const initial = calculateInitialBearing(from, to);
      const final = calculateFinalBearing(from, to);

      // Final should be different from initial for non-equator routes
      expect(final).not.toBe(initial);
    });
  });
});
