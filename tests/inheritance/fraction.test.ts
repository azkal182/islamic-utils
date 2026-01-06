/**
 * @fileoverview Unit tests for fraction utilities
 */

import { describe, it, expect } from 'vitest';
import {
  fraction,
  add,
  subtract,
  multiply,
  divide,
  simplify,
  toDecimal,
  toPercentage,
  toString,
  toArabicName,
  equals,
  lessThan,
  greaterThan,
  isZero,
  isPositive,
  compare,
  gcd,
  lcm,
  sum,
  FRACTION,
  findAsalMasalah,
} from '../../src/inheritance/utils/fraction';

describe('Fraction Utilities', () => {
  describe('fraction()', () => {
    it('should create a fraction with positive values', () => {
      const f = fraction(1, 2);
      expect(f.numerator).toBe(1);
      expect(f.denominator).toBe(2);
    });

    it('should auto-simplify fractions', () => {
      const f = fraction(4, 8);
      expect(f.numerator).toBe(1);
      expect(f.denominator).toBe(2);
    });

    it('should throw error for zero denominator', () => {
      expect(() => fraction(1, 0)).toThrow();
    });

    it('should handle negative numerator', () => {
      const f = fraction(-1, 2);
      expect(f.numerator).toBe(-1);
      expect(f.denominator).toBe(2);
    });
  });

  describe('FRACTION constants', () => {
    it('should have correct values', () => {
      expect(toDecimal(FRACTION.HALF)).toBe(0.5);
      expect(toDecimal(FRACTION.THIRD)).toBeCloseTo(0.333333, 5);
      expect(toDecimal(FRACTION.QUARTER)).toBe(0.25);
      expect(toDecimal(FRACTION.SIXTH)).toBeCloseTo(0.166667, 5);
      expect(toDecimal(FRACTION.EIGHTH)).toBe(0.125);
      expect(toDecimal(FRACTION.TWO_THIRDS)).toBeCloseTo(0.666667, 5);
    });
  });

  describe('add()', () => {
    it('should add fractions with same denominator', () => {
      const result = add(fraction(1, 4), fraction(1, 4));
      expect(toDecimal(result)).toBe(0.5);
    });

    it('should add fractions with different denominators', () => {
      const result = add(fraction(1, 2), fraction(1, 3));
      expect(toDecimal(result)).toBeCloseTo(0.833333, 5);
    });
  });

  describe('subtract()', () => {
    it('should subtract fractions correctly', () => {
      const result = subtract(fraction(1, 1), fraction(1, 2));
      expect(toDecimal(result)).toBe(0.5);
    });

    it('should handle negative results', () => {
      const result = subtract(fraction(1, 4), fraction(1, 2));
      expect(toDecimal(result)).toBe(-0.25);
    });
  });

  describe('multiply()', () => {
    it('should multiply fractions correctly', () => {
      const result = multiply(fraction(1, 2), fraction(1, 3));
      expect(toDecimal(result)).toBeCloseTo(0.166667, 5);
    });
  });

  describe('divide()', () => {
    it('should divide fractions correctly', () => {
      const result = divide(fraction(1, 2), fraction(1, 4));
      expect(toDecimal(result)).toBe(2);
    });

    it('should throw error for division by zero fraction', () => {
      expect(() => divide(fraction(1, 2), FRACTION.ZERO)).toThrow();
    });
  });

  describe('simplify()', () => {
    it('should simplify reducible fractions', () => {
      const f = { numerator: 6, denominator: 9 };
      const result = simplify(f);
      expect(result.numerator).toBe(2);
      expect(result.denominator).toBe(3);
    });
  });

  describe('comparison functions', () => {
    it('equals() should compare fractions correctly', () => {
      expect(equals(fraction(1, 2), fraction(2, 4))).toBe(true);
      expect(equals(fraction(1, 2), fraction(1, 3))).toBe(false);
    });

    it('lessThan() should compare correctly', () => {
      expect(lessThan(fraction(1, 3), fraction(1, 2))).toBe(true);
      expect(lessThan(fraction(1, 2), fraction(1, 3))).toBe(false);
    });

    it('greaterThan() should compare correctly', () => {
      expect(greaterThan(fraction(1, 2), fraction(1, 3))).toBe(true);
    });

    it('isZero() should identify zero fractions', () => {
      expect(isZero(FRACTION.ZERO)).toBe(true);
      expect(isZero(FRACTION.HALF)).toBe(false);
    });

    it('isPositive() should identify positive fractions', () => {
      expect(isPositive(FRACTION.HALF)).toBe(true);
      expect(isPositive(FRACTION.ZERO)).toBe(false);
      expect(isPositive(fraction(-1, 2))).toBe(false);
    });
  });

  describe('toString()', () => {
    it('should format fractions correctly', () => {
      expect(toString(fraction(1, 2))).toBe('1/2');
      expect(toString(fraction(2, 4))).toBe('1/2');
    });
  });

  describe('toArabicName()', () => {
    it('should return Arabic names for standard fractions', () => {
      expect(toArabicName(FRACTION.HALF)).toBe('النصف');
      expect(toArabicName(FRACTION.THIRD)).toBe('الثلث');
      expect(toArabicName(FRACTION.QUARTER)).toBe('الربع');
      expect(toArabicName(FRACTION.SIXTH)).toBe('السدس');
      expect(toArabicName(FRACTION.EIGHTH)).toBe('الثمن');
      expect(toArabicName(FRACTION.TWO_THIRDS)).toBe('الثلثان');
    });

    it('should return null for non-standard fractions', () => {
      expect(toArabicName(fraction(3, 7))).toBeNull();
    });
  });

  describe('toPercentage()', () => {
    it('should convert to percentage correctly', () => {
      expect(toPercentage(FRACTION.HALF)).toBe('50.00%');
      expect(toPercentage(FRACTION.THIRD, 1)).toBe('33.3%');
    });
  });

  describe('sum()', () => {
    it('should sum multiple fractions', () => {
      const result = sum([FRACTION.QUARTER, FRACTION.QUARTER, FRACTION.HALF]);
      expect(toDecimal(result)).toBe(1);
    });
  });

  describe('gcd() and lcm()', () => {
    it('gcd() should find greatest common divisor', () => {
      expect(gcd(12, 8)).toBe(4);
      expect(gcd(7, 5)).toBe(1);
    });

    it('lcm() should find least common multiple', () => {
      expect(lcm(4, 6)).toBe(12);
      expect(lcm(3, 7)).toBe(21);
    });
  });

  describe('findAsalMasalah()', () => {
    it('should find common denominator for standard shares', () => {
      // Wife 1/8 + Daughter 2/3 => LCM needed
      const shares = [FRACTION.EIGHTH, FRACTION.TWO_THIRDS];
      const asal = findAsalMasalah(shares);
      expect(asal).toBeGreaterThan(0);
    });
  });
});
