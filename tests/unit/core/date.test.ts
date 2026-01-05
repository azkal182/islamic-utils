/**
 * @fileoverview Unit tests for date validation
 */

import { describe, it, expect } from 'vitest';
import {
  validateDate,
  isLeapYear,
  getDaysInMonth,
  getDayOfYear,
  addDays,
} from '../../../src/core/validators/date';

describe('isLeapYear', () => {
  it('should identify leap years divisible by 4', () => {
    expect(isLeapYear(2024)).toBe(true);
    expect(isLeapYear(2020)).toBe(true);
  });

  it('should identify non-leap years not divisible by 4', () => {
    expect(isLeapYear(2023)).toBe(false);
    expect(isLeapYear(2021)).toBe(false);
  });

  it('should identify century years not divisible by 400 as non-leap', () => {
    expect(isLeapYear(1900)).toBe(false);
    expect(isLeapYear(2100)).toBe(false);
  });

  it('should identify century years divisible by 400 as leap', () => {
    expect(isLeapYear(2000)).toBe(true);
    expect(isLeapYear(1600)).toBe(true);
  });
});

describe('getDaysInMonth', () => {
  it('should return correct days for each month in non-leap year', () => {
    const expectedDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

    for (let month = 1; month <= 12; month++) {
      expect(getDaysInMonth(2023, month)).toBe(expectedDays[month - 1]);
    }
  });

  it('should return 29 for February in leap year', () => {
    expect(getDaysInMonth(2024, 2)).toBe(29);
  });

  it('should return 28 for February in non-leap year', () => {
    expect(getDaysInMonth(2023, 2)).toBe(28);
  });
});

describe('validateDate', () => {
  describe('valid dates', () => {
    it('should accept valid date', () => {
      const result = validateDate({ year: 2024, month: 1, day: 15 });
      expect(result.success).toBe(true);
    });

    it('should accept February 29 in leap year', () => {
      const result = validateDate({ year: 2024, month: 2, day: 29 });
      expect(result.success).toBe(true);
    });

    it('should accept last day of months', () => {
      expect(validateDate({ year: 2024, month: 1, day: 31 }).success).toBe(true);
      expect(validateDate({ year: 2024, month: 4, day: 30 }).success).toBe(true);
    });
  });

  describe('invalid dates', () => {
    it('should reject invalid month', () => {
      const result = validateDate({ year: 2024, month: 13, day: 1 });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.code).toBe('INVALID_DATE');
      }
    });

    it('should reject invalid day', () => {
      const result = validateDate({ year: 2024, month: 1, day: 32 });
      expect(result.success).toBe(false);
    });

    it('should reject February 29 in non-leap year', () => {
      const result = validateDate({ year: 2023, month: 2, day: 29 });
      expect(result.success).toBe(false);
    });

    it('should reject day 31 in months with 30 days', () => {
      const result = validateDate({ year: 2024, month: 4, day: 31 });
      expect(result.success).toBe(false);
    });

    it('should reject zero day', () => {
      const result = validateDate({ year: 2024, month: 1, day: 0 });
      expect(result.success).toBe(false);
    });

    it('should reject zero month', () => {
      const result = validateDate({ year: 2024, month: 0, day: 15 });
      expect(result.success).toBe(false);
    });
  });
});

describe('getDayOfYear', () => {
  it('should return 1 for January 1', () => {
    expect(getDayOfYear({ year: 2024, month: 1, day: 1 })).toBe(1);
  });

  it('should return 32 for February 1', () => {
    expect(getDayOfYear({ year: 2024, month: 2, day: 1 })).toBe(32);
  });

  it('should return 366 for December 31 in leap year', () => {
    expect(getDayOfYear({ year: 2024, month: 12, day: 31 })).toBe(366);
  });

  it('should return 365 for December 31 in non-leap year', () => {
    expect(getDayOfYear({ year: 2023, month: 12, day: 31 })).toBe(365);
  });
});

describe('addDays', () => {
  it('should add days within month', () => {
    const result = addDays({ year: 2024, month: 1, day: 15 }, 5);
    expect(result).toEqual({ year: 2024, month: 1, day: 20 });
  });

  it('should handle month boundary', () => {
    const result = addDays({ year: 2024, month: 1, day: 31 }, 1);
    expect(result).toEqual({ year: 2024, month: 2, day: 1 });
  });

  it('should handle year boundary', () => {
    const result = addDays({ year: 2023, month: 12, day: 31 }, 1);
    expect(result).toEqual({ year: 2024, month: 1, day: 1 });
  });

  it('should handle negative days', () => {
    const result = addDays({ year: 2024, month: 1, day: 1 }, -1);
    expect(result).toEqual({ year: 2023, month: 12, day: 31 });
  });
});
