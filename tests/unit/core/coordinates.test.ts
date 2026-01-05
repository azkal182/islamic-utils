/**
 * @fileoverview Unit tests for coordinate validation
 */

import { describe, it, expect } from 'vitest';
import {
  validateCoordinates,
  normalizeCoordinates,
  isHighLatitude,
} from '../../../src/core/validators/coordinates';

describe('validateCoordinates', () => {
  describe('valid coordinates', () => {
    it('should accept valid coordinates', () => {
      const result = validateCoordinates({
        latitude: -6.2088,
        longitude: 106.8456,
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.latitude).toBe(-6.2088);
        expect(result.data.longitude).toBe(106.8456);
      }
    });

    it('should accept coordinates at equator and prime meridian', () => {
      const result = validateCoordinates({ latitude: 0, longitude: 0 });
      expect(result.success).toBe(true);
    });

    it('should accept coordinates at poles', () => {
      const northPole = validateCoordinates({ latitude: 90, longitude: 0 });
      const southPole = validateCoordinates({ latitude: -90, longitude: 0 });

      expect(northPole.success).toBe(true);
      expect(southPole.success).toBe(true);
    });

    it('should accept coordinates at date line', () => {
      const east = validateCoordinates({ latitude: 0, longitude: 180 });
      const west = validateCoordinates({ latitude: 0, longitude: -180 });

      expect(east.success).toBe(true);
      expect(west.success).toBe(true);
    });

    it('should accept valid altitude', () => {
      const result = validateCoordinates({
        latitude: 21.4225,
        longitude: 39.8262,
        altitude: 277,
      });

      expect(result.success).toBe(true);
    });
  });

  describe('invalid coordinates', () => {
    it('should reject latitude out of range (positive)', () => {
      const result = validateCoordinates({
        latitude: 100,
        longitude: 0,
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.code).toBe('INVALID_COORDINATES');
      }
    });

    it('should reject latitude out of range (negative)', () => {
      const result = validateCoordinates({
        latitude: -100,
        longitude: 0,
      });

      expect(result.success).toBe(false);
    });

    it('should reject longitude out of range', () => {
      const result = validateCoordinates({
        latitude: 0,
        longitude: 200,
      });

      expect(result.success).toBe(false);
    });

    it('should reject negative altitude', () => {
      const result = validateCoordinates({
        latitude: 0,
        longitude: 0,
        altitude: -100,
      });

      expect(result.success).toBe(false);
    });

    it('should reject NaN values', () => {
      const result = validateCoordinates({
        latitude: NaN,
        longitude: 0,
      });

      expect(result.success).toBe(false);
    });

    it('should reject Infinity values', () => {
      const result = validateCoordinates({
        latitude: Infinity,
        longitude: 0,
      });

      expect(result.success).toBe(false);
    });
  });
});

describe('normalizeCoordinates', () => {
  it('should default altitude to 0', () => {
    const result = normalizeCoordinates({
      latitude: 0,
      longitude: 0,
    });

    expect(result.altitude).toBe(0);
  });

  it('should preserve provided altitude', () => {
    const result = normalizeCoordinates({
      latitude: 0,
      longitude: 0,
      altitude: 100,
    });

    expect(result.altitude).toBe(100);
  });

  it('should wrap longitude > 180', () => {
    const result = normalizeCoordinates({
      latitude: 0,
      longitude: 181,
    });

    expect(result.longitude).toBe(-179);
  });

  it('should wrap longitude < -180', () => {
    const result = normalizeCoordinates({
      latitude: 0,
      longitude: -181,
    });

    expect(result.longitude).toBe(179);
  });
});

describe('isHighLatitude', () => {
  it('should return true for London', () => {
    expect(isHighLatitude({ latitude: 51.5, longitude: -0.1 })).toBe(true);
  });

  it('should return false for Jakarta', () => {
    expect(isHighLatitude({ latitude: -6.2, longitude: 106.8 })).toBe(false);
  });

  it('should return true for Oslo', () => {
    expect(isHighLatitude({ latitude: 59.9, longitude: 10.7 })).toBe(true);
  });

  it('should respect custom threshold', () => {
    expect(isHighLatitude({ latitude: 55, longitude: 0 }, 60)).toBe(false);
    expect(isHighLatitude({ latitude: 65, longitude: 0 }, 60)).toBe(true);
  });
});
