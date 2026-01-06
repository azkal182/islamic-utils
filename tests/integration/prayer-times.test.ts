/**
 * @fileoverview Integration tests for Prayer Times module
 *
 * Tests the module as a whole from the main entry point,
 * verifying exports, type compatibility, and cross-module consistency.
 */

import { describe, it, expect } from 'vitest';
import {
  // Main calculator
  computePrayerTimes,

  // Calculation methods
  CALCULATION_METHODS,
  MWL,
  ISNA,
  EGYPT,
  MAKKAH,
  KARACHI,
  TEHRAN,
  JAKIM,
  SINGAPORE,
  KEMENAG,
  DIYANET,
  UOIF,
  KUWAIT,
  QATAR,
  getMethod,
  listMethodKeys,

  // Types and enums
  PrayerName,
  PRAYER_NAMES_ORDERED,
  AsrMadhhab,
  HighLatitudeRule,
  PrayerRoundingRule,
  DEFAULT_IMSAK_RULE,
  DEFAULT_DHUHA_RULE,
  getAsrShadowFactor,

  // Result utilities
  isSuccess,
  isError,
} from '../../src';

describe('Prayer Times Integration', () => {
  describe('Module Exports', () => {
    it('should export computePrayerTimes function', () => {
      expect(computePrayerTimes).toBeDefined();
      expect(typeof computePrayerTimes).toBe('function');
    });

    it('should export all 13 calculation methods', () => {
      expect(Object.keys(CALCULATION_METHODS)).toHaveLength(13);

      // Individual methods
      expect(MWL).toBeDefined();
      expect(ISNA).toBeDefined();
      expect(EGYPT).toBeDefined();
      expect(MAKKAH).toBeDefined();
      expect(KARACHI).toBeDefined();
      expect(TEHRAN).toBeDefined();
      expect(JAKIM).toBeDefined();
      expect(SINGAPORE).toBeDefined();
      expect(KEMENAG).toBeDefined();
      expect(DIYANET).toBeDefined();
      expect(UOIF).toBeDefined();
      expect(KUWAIT).toBeDefined();
      expect(QATAR).toBeDefined();
    });

    it('should export method registry functions', () => {
      expect(getMethod).toBeDefined();
      expect(listMethodKeys).toBeDefined();

      // Test registry
      expect(getMethod('KEMENAG')).toBe(KEMENAG);
      expect(listMethodKeys()).toContain('KEMENAG');
    });

    it('should export all enums and constants', () => {
      // PrayerName
      expect(PrayerName.IMSAK).toBe('imsak');
      expect(PrayerName.FAJR).toBe('fajr');
      expect(PrayerName.SUNRISE).toBe('sunrise');
      expect(PrayerName.DHUHR).toBe('dhuhr');
      expect(PrayerName.ASR).toBe('asr');
      expect(PrayerName.MAGHRIB).toBe('maghrib');
      expect(PrayerName.ISHA).toBe('isha');

      // PRAYER_NAMES_ORDERED
      expect(PRAYER_NAMES_ORDERED).toHaveLength(9);

      // AsrMadhhab
      expect(AsrMadhhab.STANDARD).toBe('standard');
      expect(AsrMadhhab.HANAFI).toBe('hanafi');

      // HighLatitudeRule
      expect(HighLatitudeRule.NONE).toBe('none');
      expect(HighLatitudeRule.MIDDLE_OF_NIGHT).toBe('middle_of_night');
      expect(HighLatitudeRule.ONE_SEVENTH).toBe('one_seventh');
      expect(HighLatitudeRule.ANGLE_BASED).toBe('angle_based');

      // PrayerRoundingRule
      expect(PrayerRoundingRule.NONE).toBe('none');
      expect(PrayerRoundingRule.NEAREST).toBe('nearest');
      expect(PrayerRoundingRule.CEIL).toBe('ceil');
      expect(PrayerRoundingRule.FLOOR).toBe('floor');

      // Default rules
      expect(DEFAULT_IMSAK_RULE.type).toBe('minutes_before_fajr');
      expect(DEFAULT_DHUHA_RULE.start.type).toBe('minutes_after_sunrise');
    });

    it('should export utility functions', () => {
      expect(getAsrShadowFactor(AsrMadhhab.STANDARD)).toBe(1);
      expect(getAsrShadowFactor(AsrMadhhab.HANAFI)).toBe(2);
    });
  });

  describe('Result Type Compatibility', () => {
    it('should return success result with data', () => {
      const result = computePrayerTimes(
        { latitude: -6.2088, longitude: 106.8456 },
        { date: { year: 2024, month: 1, day: 15 }, timezone: 7 },
        { method: KEMENAG }
      );

      expect(isSuccess(result)).toBe(true);
      expect(isError(result)).toBe(false);

      if (result.success) {
        expect(result.data).toBeDefined();
        expect(result.data.times).toBeDefined();
        expect(result.data.formatted).toBeDefined();
        expect(result.data.meta).toBeDefined();
      }
    });

    it('should return error result for invalid input', () => {
      const result = computePrayerTimes(
        { latitude: 200, longitude: 0 }, // Invalid
        { date: { year: 2024, month: 1, day: 15 }, timezone: 7 },
        { method: KEMENAG }
      );

      expect(isSuccess(result)).toBe(false);
      expect(isError(result)).toBe(true);

      if (!result.success) {
        expect(result.error).toBeDefined();
        expect(result.error.code).toBe('INVALID_COORDINATES');
      }
    });
  });

  describe('Full Calculation Flow', () => {
    it('should calculate prayer times for multiple locations', () => {
      const locations = [
        { name: 'Jakarta', coords: { latitude: -6.2088, longitude: 106.8456 }, tz: 7 },
        { name: 'Makkah', coords: { latitude: 21.4225, longitude: 39.8262 }, tz: 3 },
        { name: 'Cairo', coords: { latitude: 30.0444, longitude: 31.2357 }, tz: 2 },
        { name: 'Kuala Lumpur', coords: { latitude: 3.139, longitude: 101.6869 }, tz: 8 },
      ];

      for (const loc of locations) {
        const result = computePrayerTimes(
          loc.coords,
          { date: { year: 2024, month: 1, day: 15 }, timezone: loc.tz },
          { method: KEMENAG }
        );

        expect(result.success).toBe(true);
        if (result.success) {
          // All times should be valid numbers
          for (const prayer of PRAYER_NAMES_ORDERED) {
            expect(result.data.times[prayer]).not.toBeNull();
            expect(typeof result.data.times[prayer]).toBe('number');
          }
        }
      }
    });

    it('should calculate prayer times for full year', () => {
      const location = { latitude: -6.2088, longitude: 106.8456 };

      for (let month = 1; month <= 12; month++) {
        const result = computePrayerTimes(
          location,
          { date: { year: 2024, month, day: 15 }, timezone: 7 },
          { method: KEMENAG }
        );

        expect(result.success).toBe(true);
        if (result.success) {
          // Fajr should always be before 6 AM in tropical regions
          expect(result.data.times.fajr!).toBeLessThan(6);
          // Maghrib should be around 17:30-18:30 in tropical regions
          expect(result.data.times.maghrib!).toBeGreaterThan(17);
          expect(result.data.times.maghrib!).toBeLessThan(19);
        }
      }
    });

    it('should produce consistent results with same input', () => {
      const input = {
        location: { latitude: -6.2088, longitude: 106.8456 },
        context: { date: { year: 2024, month: 1, day: 15 }, timezone: 7 },
        params: { method: KEMENAG },
      } as const;

      const result1 = computePrayerTimes(input.location, input.context, input.params);
      const result2 = computePrayerTimes(input.location, input.context, input.params);
      const result3 = computePrayerTimes(input.location, input.context, input.params);

      expect(result1.success).toBe(true);
      expect(result2.success).toBe(true);
      expect(result3.success).toBe(true);

      if (result1.success && result2.success && result3.success) {
        // All results should be identical
        expect(result1.data.times).toEqual(result2.data.times);
        expect(result2.data.times).toEqual(result3.data.times);
      }
    });
  });

  describe('All Calculation Methods', () => {
    const methodKeys = listMethodKeys();

    for (const key of methodKeys) {
      it(`should calculate with ${key} method`, () => {
        const method = getMethod(key);
        expect(method).toBeDefined();

        const result = computePrayerTimes(
          { latitude: 21.4225, longitude: 39.8262 }, // Makkah
          { date: { year: 2024, month: 1, day: 15 }, timezone: 3 },
          { method: method! }
        );

        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data.meta.method.name).toBe(method!.name);
        }
      });
    }
  });

  describe('Error Handling Consistency', () => {
    it('should return consistent error format', () => {
      const testCases = [
        {
          location: { latitude: 100, longitude: 0 },
          expectedCode: 'INVALID_COORDINATES',
        },
        {
          location: { latitude: 0, longitude: 200 },
          expectedCode: 'INVALID_COORDINATES',
        },
      ];

      for (const tc of testCases) {
        const result = computePrayerTimes(
          tc.location,
          { date: { year: 2024, month: 1, day: 15 }, timezone: 7 },
          { method: KEMENAG }
        );

        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.code).toBe(tc.expectedCode);
          expect(result.error.message).toBeDefined();
          expect(result.error.timestamp).toBeDefined();
        }
      }
    });
  });

  describe('Monthly Prayer Times', () => {
    it('should export computeMonthlyPrayerTimes function', async () => {
      const { computeMonthlyPrayerTimes } = await import('../../src');
      expect(computeMonthlyPrayerTimes).toBeDefined();
      expect(typeof computeMonthlyPrayerTimes).toBe('function');
    });

    it('should calculate prayer times for January (31 days)', async () => {
      const { computeMonthlyPrayerTimes, KEMENAG } = await import('../../src');

      const result = computeMonthlyPrayerTimes({
        year: 2024,
        month: 1,
        location: { latitude: -6.2088, longitude: 106.8456 },
        timezone: 7,
        params: { method: KEMENAG },
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.meta.daysInMonth).toBe(31);
        expect(result.data.days).toHaveLength(31);
        expect(result.data.days[0].day).toBe(1);
        expect(result.data.days[30].day).toBe(31);
      }
    });

    it('should calculate prayer times for February in leap year (29 days)', async () => {
      const { computeMonthlyPrayerTimes, KEMENAG } = await import('../../src');

      const result = computeMonthlyPrayerTimes({
        year: 2024, // 2024 is a leap year
        month: 2,
        location: { latitude: -6.2088, longitude: 106.8456 },
        timezone: 7,
        params: { method: KEMENAG },
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.meta.daysInMonth).toBe(29);
        expect(result.data.meta.isLeapYear).toBe(true);
        expect(result.data.days).toHaveLength(29);
      }
    });

    it('should calculate prayer times for February in non-leap year (28 days)', async () => {
      const { computeMonthlyPrayerTimes, KEMENAG } = await import('../../src');

      const result = computeMonthlyPrayerTimes({
        year: 2023, // 2023 is not a leap year
        month: 2,
        location: { latitude: -6.2088, longitude: 106.8456 },
        timezone: 7,
        params: { method: KEMENAG },
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.meta.daysInMonth).toBe(28);
        expect(result.data.meta.isLeapYear).toBe(false);
        expect(result.data.days).toHaveLength(28);
      }
    });

    it('should return valid formatted times for all days', async () => {
      const { computeMonthlyPrayerTimes, KEMENAG } = await import('../../src');

      const result = computeMonthlyPrayerTimes({
        year: 2024,
        month: 4,
        location: { latitude: -6.2088, longitude: 106.8456 },
        timezone: 7,
        params: { method: KEMENAG },
      });

      expect(result.success).toBe(true);
      if (result.success) {
        for (const day of result.data.days) {
          // Each day should have formatted times
          expect(day.formatted.fajr).toMatch(/^\d{2}:\d{2}$/);
          expect(day.formatted.dhuhr).toMatch(/^\d{2}:\d{2}$/);
          expect(day.formatted.asr).toMatch(/^\d{2}:\d{2}$/);
          expect(day.formatted.maghrib).toMatch(/^\d{2}:\d{2}$/);
          expect(day.formatted.isha).toMatch(/^\d{2}:\d{2}$/);
        }
      }
    });

    it('should return error for invalid month', async () => {
      const { computeMonthlyPrayerTimes, KEMENAG } = await import('../../src');

      const result = computeMonthlyPrayerTimes({
        year: 2024,
        month: 13, // Invalid
        location: { latitude: -6.2088, longitude: 106.8456 },
        timezone: 7,
        params: { method: KEMENAG },
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.code).toBe('INVALID_DATE');
      }
    });

    it('should return error for invalid year', async () => {
      const { computeMonthlyPrayerTimes, KEMENAG } = await import('../../src');

      const result = computeMonthlyPrayerTimes({
        year: 1800, // Too old
        month: 1,
        location: { latitude: -6.2088, longitude: 106.8456 },
        timezone: 7,
        params: { method: KEMENAG },
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.code).toBe('INVALID_DATE');
      }
    });

    it('should include meta information', async () => {
      const { computeMonthlyPrayerTimes, KEMENAG } = await import('../../src');

      const result = computeMonthlyPrayerTimes({
        year: 2024,
        month: 6,
        location: { latitude: -6.2088, longitude: 106.8456 },
        timezone: 7,
        params: { method: KEMENAG },
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.meta.year).toBe(2024);
        expect(result.data.meta.month).toBe(6);
        expect(result.data.meta.daysInMonth).toBe(30);
        expect(result.data.meta.method.name).toBe(KEMENAG.name);
        expect(result.data.meta.location.latitude).toBe(-6.2088);
      }
    });
  });

  describe('getNextPrayer Helper', () => {
    it('should export getNextPrayer function', async () => {
      const { getNextPrayer } = await import('../../src');
      expect(getNextPrayer).toBeDefined();
      expect(typeof getNextPrayer).toBe('function');
    });

    it('should find next prayer when in middle of day', async () => {
      const { computePrayerTimes, getNextPrayer, KEMENAG } = await import('../../src');

      const result = computePrayerTimes(
        { latitude: -6.2088, longitude: 106.8456 },
        { date: { year: 2024, month: 1, day: 15 }, timezone: 7 },
        { method: KEMENAG }
      );

      expect(result.success).toBe(true);
      if (result.success) {
        // Simulate 14:00 local time (before Asr)
        const simulatedTime = new Date(Date.UTC(2024, 0, 15, 7, 0)); // 7 UTC = 14 WIB
        const next = getNextPrayer(simulatedTime, result.data, 7);

        expect(next).toBeDefined();
        expect(next.name).toBeDefined();
        expect(next.time).toBeDefined();
        expect(next.minutesUntil).toBeGreaterThanOrEqual(0);
        expect(typeof next.isNextDay).toBe('boolean');
      }
    });

    it('should wrap to next day after Isha', async () => {
      const { computePrayerTimes, getNextPrayer, KEMENAG } = await import('../../src');

      const result = computePrayerTimes(
        { latitude: -6.2088, longitude: 106.8456 },
        { date: { year: 2024, month: 1, day: 15 }, timezone: 7 },
        { method: KEMENAG }
      );

      expect(result.success).toBe(true);
      if (result.success) {
        // Simulate 23:00 local time (after Isha)
        const simulatedTime = new Date(Date.UTC(2024, 0, 15, 16, 0)); // 16 UTC = 23 WIB
        const next = getNextPrayer(simulatedTime, result.data, 7);

        expect(next.isNextDay).toBe(true);
        expect(next.minutesUntil).toBeGreaterThan(0);
      }
    });

    it('should work with IANA timezone string', async () => {
      const { computePrayerTimes, getNextPrayer, KEMENAG } = await import('../../src');

      const result = computePrayerTimes(
        { latitude: -6.2088, longitude: 106.8456 },
        { date: { year: 2024, month: 1, day: 15 }, timezone: 'Asia/Jakarta' },
        { method: KEMENAG }
      );

      expect(result.success).toBe(true);
      if (result.success) {
        const next = getNextPrayer(new Date(), result.data, 'Asia/Jakarta');
        expect(next).toBeDefined();
        expect(next.name).toBeDefined();
      }
    });

    it('should export formatMinutesUntil utility', async () => {
      const { formatMinutesUntil } = await import('../../src');

      expect(formatMinutesUntil(45)).toBe('45m');
      expect(formatMinutesUntil(60)).toBe('1h');
      expect(formatMinutesUntil(90)).toBe('1h 30m');
      expect(formatMinutesUntil(150)).toBe('2h 30m');
    });

    it('should export getCurrentPrayer function', async () => {
      const { computePrayerTimes, getCurrentPrayer, KEMENAG } = await import('../../src');

      const result = computePrayerTimes(
        { latitude: -6.2088, longitude: 106.8456 },
        { date: { year: 2024, month: 1, day: 15 }, timezone: 7 },
        { method: KEMENAG }
      );

      expect(result.success).toBe(true);
      if (result.success) {
        // Simulate 14:00 local time (Dhuhr period)
        const simulatedTime = new Date(Date.UTC(2024, 0, 15, 7, 0)); // 7 UTC = 14 WIB
        const current = getCurrentPrayer(simulatedTime, result.data, 7);

        expect(current).toBeDefined();
        expect(current.current).toBeDefined();
      }
    });
  });
});
