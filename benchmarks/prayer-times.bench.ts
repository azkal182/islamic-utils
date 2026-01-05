/**
 * @fileoverview Performance benchmarks for Prayer Times module
 *
 * Run: npx vitest bench benchmarks/prayer-times.bench.ts
 */

import { bench, describe } from 'vitest';
import { computePrayerTimes, CALCULATION_METHODS, KEMENAG } from '../src';

// Test location - Jakarta
const JAKARTA = { latitude: -6.2088, longitude: 106.8456 };
const MAKKAH = { latitude: 21.4225, longitude: 39.8262 };

describe('Prayer Times Performance', () => {
  bench('single calculation - KEMENAG method', () => {
    computePrayerTimes(
      JAKARTA,
      { date: { year: 2024, month: 1, day: 15 }, timezone: 7 },
      { method: KEMENAG }
    );
  });

  bench('single calculation - MWL method', () => {
    computePrayerTimes(
      MAKKAH,
      { date: { year: 2024, month: 1, day: 15 }, timezone: 3 },
      { method: CALCULATION_METHODS.MWL }
    );
  });

  bench('single calculation with trace', () => {
    computePrayerTimes(
      JAKARTA,
      { date: { year: 2024, month: 1, day: 15 }, timezone: 7 },
      { method: KEMENAG },
      { includeTrace: true }
    );
  });

  bench('week calculation (7 days)', () => {
    for (let day = 1; day <= 7; day++) {
      computePrayerTimes(
        JAKARTA,
        { date: { year: 2024, month: 1, day }, timezone: 7 },
        { method: KEMENAG }
      );
    }
  });

  bench('month calculation (30 days)', () => {
    for (let day = 1; day <= 30; day++) {
      computePrayerTimes(
        JAKARTA,
        { date: { year: 2024, month: 1, day }, timezone: 7 },
        { method: KEMENAG }
      );
    }
  });

  bench('year calculation (365 days)', () => {
    const daysInMonth = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]; // 2024 is leap year
    for (let month = 1; month <= 12; month++) {
      for (let day = 1; day <= daysInMonth[month - 1]; day++) {
        computePrayerTimes(
          JAKARTA,
          { date: { year: 2024, month, day }, timezone: 7 },
          { method: KEMENAG }
        );
      }
    }
  });

  bench('all 13 methods for same date', () => {
    const methods = Object.values(CALCULATION_METHODS);
    for (const method of methods) {
      computePrayerTimes(
        MAKKAH,
        { date: { year: 2024, month: 1, day: 15 }, timezone: 3 },
        { method }
      );
    }
  });

  bench('100 different locations', () => {
    for (let i = 0; i < 100; i++) {
      const lat = Math.random() * 180 - 90; // -90 to 90
      const lng = Math.random() * 360 - 180; // -180 to 180
      computePrayerTimes(
        { latitude: lat, longitude: lng },
        { date: { year: 2024, month: 1, day: 15 }, timezone: 0 },
        { method: KEMENAG }
      );
    }
  });
});
