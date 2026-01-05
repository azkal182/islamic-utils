/**
 * @fileoverview Unit tests for Prayer Times calculator
 */

import { describe, it, expect } from 'vitest';
import {
  computePrayerTimes,
  CALCULATION_METHODS,
  PrayerName,
  AsrMadhhab,
  HighLatitudeRule,
  PrayerRoundingRule,
} from '../../../src/prayer-times';

// Test locations
const JAKARTA = { latitude: -6.2088, longitude: 106.8456 }; // Indonesia
const MAKKAH = { latitude: 21.4225, longitude: 39.8262 }; // Saudi Arabia
const LONDON = { latitude: 51.5074, longitude: -0.1278 }; // High latitude
const OSLO = { latitude: 59.9139, longitude: 10.7522 }; // Very high latitude

describe('computePrayerTimes', () => {
  describe('Basic calculation for Jakarta', () => {
    it('should calculate all 9 prayer times', () => {
      const result = computePrayerTimes(
        JAKARTA,
        { date: { year: 2024, month: 1, day: 15 }, timezone: 7 },
        { method: CALCULATION_METHODS.KEMENAG }
      );

      expect(result.success).toBe(true);
      if (result.success) {
        // Verify all times exist
        expect(result.data.times.imsak).not.toBeNull();
        expect(result.data.times.fajr).not.toBeNull();
        expect(result.data.times.sunrise).not.toBeNull();
        expect(result.data.times.dhuha_start).not.toBeNull();
        expect(result.data.times.dhuha_end).not.toBeNull();
        expect(result.data.times.dhuhr).not.toBeNull();
        expect(result.data.times.asr).not.toBeNull();
        expect(result.data.times.maghrib).not.toBeNull();
        expect(result.data.times.isha).not.toBeNull();

        // Verify formatted times exist
        expect(result.data.formatted.fajr).toBeDefined();
        expect(result.data.formatted.maghrib).toBeDefined();
      }
    });

    it('should return times in correct order', () => {
      const result = computePrayerTimes(
        JAKARTA,
        { date: { year: 2024, month: 1, day: 15 }, timezone: 7 },
        { method: CALCULATION_METHODS.KEMENAG }
      );

      expect(result.success).toBe(true);
      if (result.success) {
        const times = result.data.times;
        expect(times.imsak!).toBeLessThan(times.fajr!);
        expect(times.fajr!).toBeLessThan(times.sunrise!);
        expect(times.sunrise!).toBeLessThan(times.dhuha_start!);
        expect(times.dhuha_start!).toBeLessThan(times.dhuha_end!);
        expect(times.dhuha_end!).toBeLessThan(times.dhuhr!);
        expect(times.dhuhr!).toBeLessThan(times.asr!);
        expect(times.asr!).toBeLessThan(times.maghrib!);
        expect(times.maghrib!).toBeLessThan(times.isha!);
      }
    });

    it('should include meta data', () => {
      const result = computePrayerTimes(
        JAKARTA,
        { date: { year: 2024, month: 1, day: 15 }, timezone: 7 },
        { method: CALCULATION_METHODS.KEMENAG }
      );

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.meta.coordinates.latitude).toBe(JAKARTA.latitude);
        expect(result.data.meta.coordinates.longitude).toBe(JAKARTA.longitude);
        expect(result.data.meta.date.year).toBe(2024);
        expect(result.data.meta.method.name).toBe('Kementerian Agama Republik Indonesia');
      }
    });
  });

  describe('Calculation methods', () => {
    it('should use MWL method correctly', () => {
      const result = computePrayerTimes(
        MAKKAH,
        { date: { year: 2024, month: 6, day: 21 }, timezone: 3 },
        { method: CALCULATION_METHODS.MWL }
      );

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.meta.method.fajrAngle).toBe(18);
        expect(result.data.meta.method.ishaAngle).toBe(17);
      }
    });

    it('should use MAKKAH method with interval-based Isha', () => {
      const result = computePrayerTimes(
        MAKKAH,
        { date: { year: 2024, month: 6, day: 21 }, timezone: 3 },
        { method: CALCULATION_METHODS.MAKKAH }
      );

      expect(result.success).toBe(true);
      if (result.success) {
        // MAKKAH uses 90-minute interval
        expect(result.data.meta.method.ishaIntervalMinutes).toBe(90);

        // Isha should be approximately 90 minutes after Maghrib
        const maghrib = result.data.times.maghrib!;
        const isha = result.data.times.isha!;
        const diffMinutes = (isha - maghrib) * 60;
        expect(diffMinutes).toBeCloseTo(90, 0);
      }
    });
  });

  describe('Asr madhhab', () => {
    it('should calculate different Asr times for different madhabs', () => {
      const params = {
        method: CALCULATION_METHODS.MWL,
      };

      const standardResult = computePrayerTimes(
        JAKARTA,
        { date: { year: 2024, month: 1, day: 15 }, timezone: 7 },
        { ...params, asrMadhhab: AsrMadhhab.STANDARD }
      );

      const hanafiResult = computePrayerTimes(
        JAKARTA,
        { date: { year: 2024, month: 1, day: 15 }, timezone: 7 },
        { ...params, asrMadhhab: AsrMadhhab.HANAFI }
      );

      expect(standardResult.success).toBe(true);
      expect(hanafiResult.success).toBe(true);

      if (standardResult.success && hanafiResult.success) {
        // Hanafi Asr should be later than Standard
        expect(hanafiResult.data.times.asr!).toBeGreaterThan(standardResult.data.times.asr!);
      }
    });
  });

  describe('Adjustments', () => {
    it('should apply manual adjustments', () => {
      const baseResult = computePrayerTimes(
        JAKARTA,
        { date: { year: 2024, month: 1, day: 15 }, timezone: 7 },
        { method: CALCULATION_METHODS.KEMENAG }
      );

      const adjustedResult = computePrayerTimes(
        JAKARTA,
        { date: { year: 2024, month: 1, day: 15 }, timezone: 7 },
        {
          method: CALCULATION_METHODS.KEMENAG,
          adjustments: { fajr: 2 }, // 2 minutes later
        }
      );

      expect(baseResult.success).toBe(true);
      expect(adjustedResult.success).toBe(true);

      if (baseResult.success && adjustedResult.success) {
        const diff = (adjustedResult.data.times.fajr! - baseResult.data.times.fajr!) * 60;
        expect(diff).toBeCloseTo(2, 0);
      }
    });

    it('should apply safety buffer', () => {
      const baseResult = computePrayerTimes(
        JAKARTA,
        { date: { year: 2024, month: 1, day: 15 }, timezone: 7 },
        { method: CALCULATION_METHODS.KEMENAG }
      );

      const bufferedResult = computePrayerTimes(
        JAKARTA,
        { date: { year: 2024, month: 1, day: 15 }, timezone: 7 },
        {
          method: CALCULATION_METHODS.KEMENAG,
          safetyBuffer: 2, // 2 minutes
        }
      );

      expect(baseResult.success).toBe(true);
      expect(bufferedResult.success).toBe(true);

      if (baseResult.success && bufferedResult.success) {
        // Fajr should be 2 minutes later (safety added)
        const fajrDiff = (bufferedResult.data.times.fajr! - baseResult.data.times.fajr!) * 60;
        expect(fajrDiff).toBeCloseTo(2, 0);

        // Imsak should be 2 minutes earlier (safety subtracted)
        const imsakDiff = (bufferedResult.data.times.imsak! - baseResult.data.times.imsak!) * 60;
        expect(imsakDiff).toBeCloseTo(-2, 0);
      }
    });
  });

  describe('High latitude', () => {
    it('should handle high latitude locations', () => {
      // London at summer solstice - high latitude with potential Fajr/Isha issues
      const result = computePrayerTimes(
        LONDON,
        { date: { year: 2024, month: 6, day: 21 }, timezone: 1 }, // Summer solstice
        {
          method: CALCULATION_METHODS.MWL,
          highLatitudeRule: HighLatitudeRule.MIDDLE_OF_NIGHT,
        }
      );

      // At high latitude in summer, either should succeed with adjustments
      // or return an error for extreme cases
      if (result.success) {
        expect(result.data.times.fajr).not.toBeNull();
        expect(result.data.times.isha).not.toBeNull();
        // Times should still be in order
        expect(result.data.times.maghrib!).toBeLessThan(result.data.times.isha!);
      }
    });

    it('should handle Oslo at summer solstice', () => {
      // At Oslo's latitude (60°N) in summer, Fajr/Isha may be problematic
      // The calculator should either succeed with adjusted times or handle gracefully
      const result = computePrayerTimes(
        OSLO, // Very high latitude
        { date: { year: 2024, month: 6, day: 21 }, timezone: 2 },
        {
          method: CALCULATION_METHODS.MWL,
          highLatitudeRule: HighLatitudeRule.ONE_SEVENTH,
        }
      );

      // At extreme latitudes, we expect either success or a known error
      // Both are acceptable outcomes
      if (result.success) {
        expect(result.data.times.fajr).not.toBeNull();
        expect(result.data.times.isha).not.toBeNull();
      }
    });
  });

  describe('Trace mode', () => {
    it('should include trace when requested', () => {
      const result = computePrayerTimes(
        JAKARTA,
        { date: { year: 2024, month: 1, day: 15 }, timezone: 7 },
        { method: CALCULATION_METHODS.KEMENAG },
        { includeTrace: true }
      );

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.trace).toBeDefined();
        expect(Array.isArray(result.data.trace)).toBe(true);
        expect(result.data.trace!.length).toBeGreaterThan(0);
      }
    });

    it('should not include trace when not requested', () => {
      const result = computePrayerTimes(
        JAKARTA,
        { date: { year: 2024, month: 1, day: 15 }, timezone: 7 },
        { method: CALCULATION_METHODS.KEMENAG }
      );

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.trace).toBeUndefined();
      }
    });
  });

  describe('Input validation', () => {
    it('should reject invalid coordinates', () => {
      const result = computePrayerTimes(
        { latitude: 100, longitude: 0 }, // Invalid latitude
        { date: { year: 2024, month: 1, day: 15 }, timezone: 7 },
        { method: CALCULATION_METHODS.KEMENAG }
      );

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.code).toBe('INVALID_COORDINATES');
      }
    });

    it('should reject invalid date', () => {
      const result = computePrayerTimes(
        JAKARTA,
        { date: { year: 2024, month: 13, day: 15 }, timezone: 7 }, // Invalid month
        { method: CALCULATION_METHODS.KEMENAG }
      );

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.code).toBe('INVALID_DATE');
      }
    });
  });
});

describe('Calculation Methods Catalog', () => {
  it('should have all expected methods', () => {
    expect(CALCULATION_METHODS.MWL).toBeDefined();
    expect(CALCULATION_METHODS.ISNA).toBeDefined();
    expect(CALCULATION_METHODS.EGYPT).toBeDefined();
    expect(CALCULATION_METHODS.MAKKAH).toBeDefined();
    expect(CALCULATION_METHODS.KARACHI).toBeDefined();
    expect(CALCULATION_METHODS.TEHRAN).toBeDefined();
    expect(CALCULATION_METHODS.JAKIM).toBeDefined();
    expect(CALCULATION_METHODS.SINGAPORE).toBeDefined();
    expect(CALCULATION_METHODS.KEMENAG).toBeDefined();
    expect(CALCULATION_METHODS.DIYANET).toBeDefined();
  });

  it('should have correct angles for KEMENAG method', () => {
    expect(CALCULATION_METHODS.KEMENAG.fajrAngle).toBe(20);
    expect(CALCULATION_METHODS.KEMENAG.ishaAngle).toBe(18);
  });
});
