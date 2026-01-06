/**
 * @fileoverview Fraction utilities for precise inheritance calculations
 * @module inheritance/utils/fraction
 *
 * Provides exact fractional arithmetic to avoid floating-point errors
 * in Islamic inheritance calculations where shares like 1/6, 1/8, 2/3 are common.
 */

// ═══════════════════════════════════════════════════════════════════════════
// Types
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Represents a fraction with numerator and denominator.
 *
 * @example
 * ```typescript
 * const half: Fraction = { numerator: 1, denominator: 2 };
 * const third: Fraction = { numerator: 1, denominator: 3 };
 * ```
 */
export interface Fraction {
  readonly numerator: number;
  readonly denominator: number;
}

// ═══════════════════════════════════════════════════════════════════════════
// Constants - Common Fractions in Faraidh
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Common fractions used in Islamic inheritance.
 */
export const FRACTION = {
  ZERO: { numerator: 0, denominator: 1 } as Fraction,
  ONE: { numerator: 1, denominator: 1 } as Fraction,

  // Furudh shares
  HALF: { numerator: 1, denominator: 2 } as Fraction, // النصف
  THIRD: { numerator: 1, denominator: 3 } as Fraction, // الثلث
  QUARTER: { numerator: 1, denominator: 4 } as Fraction, // الربع
  SIXTH: { numerator: 1, denominator: 6 } as Fraction, // السدس
  EIGHTH: { numerator: 1, denominator: 8 } as Fraction, // الثمن
  TWO_THIRDS: { numerator: 2, denominator: 3 } as Fraction, // الثلثان
} as const;

// ═══════════════════════════════════════════════════════════════════════════
// Factory Functions
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Creates a fraction from numerator and denominator.
 *
 * @param numerator - The numerator
 * @param denominator - The denominator (must not be 0)
 * @returns Simplified fraction
 * @throws Error if denominator is 0
 *
 * @example
 * ```typescript
 * const f = fraction(2, 4);  // Returns { numerator: 1, denominator: 2 }
 * ```
 */
export function fraction(numerator: number, denominator: number): Fraction {
  if (denominator === 0) {
    throw new Error('Denominator cannot be zero');
  }

  // Handle negative fractions
  if (denominator < 0) {
    numerator = -numerator;
    denominator = -denominator;
  }

  return simplify({ numerator, denominator });
}

/**
 * Creates a fraction from a decimal value.
 *
 * @param decimal - Decimal value
 * @param precision - Maximum denominator for approximation (default: 1000)
 * @returns Approximated fraction
 */
export function fromDecimal(decimal: number, precision: number = 1000): Fraction {
  if (decimal === 0) return FRACTION.ZERO;
  if (decimal === 1) return FRACTION.ONE;

  // Simple continued fraction approximation
  let bestNumerator = Math.round(decimal * precision);
  let bestDenominator = precision;

  return simplify({ numerator: bestNumerator, denominator: bestDenominator });
}

// ═══════════════════════════════════════════════════════════════════════════
// Arithmetic Operations
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Adds two fractions.
 *
 * @param a - First fraction
 * @param b - Second fraction
 * @returns Sum as simplified fraction
 *
 * @example
 * ```typescript
 * add(FRACTION.HALF, FRACTION.QUARTER);  // Returns 3/4
 * ```
 */
export function add(a: Fraction, b: Fraction): Fraction {
  const commonDenom = lcm(a.denominator, b.denominator);
  const aNumerator = a.numerator * (commonDenom / a.denominator);
  const bNumerator = b.numerator * (commonDenom / b.denominator);

  return simplify({
    numerator: aNumerator + bNumerator,
    denominator: commonDenom,
  });
}

/**
 * Subtracts second fraction from first.
 *
 * @param a - First fraction
 * @param b - Second fraction
 * @returns Difference as simplified fraction
 */
export function subtract(a: Fraction, b: Fraction): Fraction {
  const commonDenom = lcm(a.denominator, b.denominator);
  const aNumerator = a.numerator * (commonDenom / a.denominator);
  const bNumerator = b.numerator * (commonDenom / b.denominator);

  return simplify({
    numerator: aNumerator - bNumerator,
    denominator: commonDenom,
  });
}

/**
 * Multiplies two fractions.
 *
 * @param a - First fraction
 * @param b - Second fraction
 * @returns Product as simplified fraction
 */
export function multiply(a: Fraction, b: Fraction): Fraction {
  return simplify({
    numerator: a.numerator * b.numerator,
    denominator: a.denominator * b.denominator,
  });
}

/**
 * Divides first fraction by second.
 *
 * @param a - Dividend
 * @param b - Divisor
 * @returns Quotient as simplified fraction
 * @throws Error if divisor is zero
 */
export function divide(a: Fraction, b: Fraction): Fraction {
  if (b.numerator === 0) {
    throw new Error('Cannot divide by zero');
  }

  return simplify({
    numerator: a.numerator * b.denominator,
    denominator: a.denominator * b.numerator,
  });
}

/**
 * Multiplies a fraction by an integer.
 *
 * @param f - Fraction
 * @param n - Integer multiplier
 * @returns Product as simplified fraction
 */
export function multiplyByInt(f: Fraction, n: number): Fraction {
  return simplify({
    numerator: f.numerator * n,
    denominator: f.denominator,
  });
}

/**
 * Divides a fraction by an integer.
 *
 * @param f - Fraction
 * @param n - Integer divisor
 * @returns Quotient as simplified fraction
 */
export function divideByInt(f: Fraction, n: number): Fraction {
  if (n === 0) {
    throw new Error('Cannot divide by zero');
  }

  return simplify({
    numerator: f.numerator,
    denominator: f.denominator * n,
  });
}

// ═══════════════════════════════════════════════════════════════════════════
// Comparison Operations
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Compares two fractions.
 *
 * @param a - First fraction
 * @param b - Second fraction
 * @returns -1 if a < b, 0 if equal, 1 if a > b
 */
export function compare(a: Fraction, b: Fraction): -1 | 0 | 1 {
  const diff = a.numerator * b.denominator - b.numerator * a.denominator;
  if (diff < 0) return -1;
  if (diff > 0) return 1;
  return 0;
}

/**
 * Checks if two fractions are equal.
 */
export function equals(a: Fraction, b: Fraction): boolean {
  return compare(a, b) === 0;
}

/**
 * Checks if fraction a is less than fraction b.
 */
export function lessThan(a: Fraction, b: Fraction): boolean {
  return compare(a, b) < 0;
}

/**
 * Checks if fraction a is greater than fraction b.
 */
export function greaterThan(a: Fraction, b: Fraction): boolean {
  return compare(a, b) > 0;
}

/**
 * Checks if a fraction is zero.
 */
export function isZero(f: Fraction): boolean {
  return f.numerator === 0;
}

/**
 * Checks if a fraction is positive.
 */
export function isPositive(f: Fraction): boolean {
  return f.numerator > 0;
}

/**
 * Checks if a fraction is negative.
 */
export function isNegative(f: Fraction): boolean {
  return f.numerator < 0;
}

// ═══════════════════════════════════════════════════════════════════════════
// Utility Functions
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Simplifies a fraction to its lowest terms.
 *
 * @param f - Fraction to simplify
 * @returns Simplified fraction
 */
export function simplify(f: Fraction): Fraction {
  if (f.numerator === 0) {
    return { numerator: 0, denominator: 1 };
  }

  const divisor = gcd(Math.abs(f.numerator), Math.abs(f.denominator));

  return {
    numerator: f.numerator / divisor,
    denominator: f.denominator / divisor,
  };
}

/**
 * Converts a fraction to decimal.
 *
 * @param f - Fraction
 * @returns Decimal value
 */
export function toDecimal(f: Fraction): number {
  return f.numerator / f.denominator;
}

/**
 * Converts a fraction to percentage.
 *
 * @param f - Fraction
 * @param decimals - Number of decimal places (default: 2)
 * @returns Percentage string (e.g., "50.00%")
 */
export function toPercentage(f: Fraction, decimals: number = 2): string {
  const pct = (f.numerator / f.denominator) * 100;
  return `${pct.toFixed(decimals)}%`;
}

/**
 * Formats a fraction as a string.
 *
 * @param f - Fraction
 * @returns String representation (e.g., "1/2")
 */
export function toString(f: Fraction): string {
  if (f.denominator === 1) {
    return `${f.numerator}`;
  }
  return `${f.numerator}/${f.denominator}`;
}

/**
 * Gets the Arabic name for common fractions.
 *
 * @param f - Fraction
 * @returns Arabic name or null if not a standard fraction
 */
export function toArabicName(f: Fraction): string | null {
  const simplified = simplify(f);
  const key = `${simplified.numerator}/${simplified.denominator}`;

  const names: Record<string, string> = {
    '1/2': 'النصف',
    '1/3': 'الثلث',
    '1/4': 'الربع',
    '1/6': 'السدس',
    '1/8': 'الثمن',
    '2/3': 'الثلثان',
  };

  return names[key] ?? null;
}

// ═══════════════════════════════════════════════════════════════════════════
// Sum Operations
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Sums an array of fractions.
 *
 * @param fractions - Array of fractions
 * @returns Sum as simplified fraction
 */
export function sum(fractions: Fraction[]): Fraction {
  if (fractions.length === 0) {
    return FRACTION.ZERO;
  }

  return fractions.reduce((acc, f) => add(acc, f), FRACTION.ZERO);
}

/**
 * Finds the common denominator for multiple fractions.
 *
 * @param fractions - Array of fractions
 * @returns Least common multiple of all denominators
 */
export function findCommonDenominator(fractions: Fraction[]): number {
  if (fractions.length === 0) return 1;

  return fractions.reduce((acc, f) => lcm(acc, f.denominator), 1);
}

/**
 * Converts all fractions to use a common denominator.
 *
 * @param fractions - Array of fractions
 * @returns Array of fractions with common denominator
 */
export function toCommonDenominator(fractions: Fraction[]): {
  fractions: Fraction[];
  commonDenominator: number;
} {
  const commonDenom = findCommonDenominator(fractions);

  const converted = fractions.map((f) => ({
    numerator: f.numerator * (commonDenom / f.denominator),
    denominator: commonDenom,
  }));

  return {
    fractions: converted,
    commonDenominator: commonDenom,
  };
}

// ═══════════════════════════════════════════════════════════════════════════
// Mathematical Helpers
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Greatest Common Divisor using Euclidean algorithm.
 *
 * @param a - First number
 * @param b - Second number
 * @returns GCD of a and b
 */
export function gcd(a: number, b: number): number {
  a = Math.abs(a);
  b = Math.abs(b);

  while (b !== 0) {
    const temp = b;
    b = a % b;
    a = temp;
  }

  return a;
}

/**
 * Least Common Multiple.
 *
 * @param a - First number
 * @param b - Second number
 * @returns LCM of a and b
 */
export function lcm(a: number, b: number): number {
  if (a === 0 || b === 0) return 0;
  return Math.abs(a * b) / gcd(a, b);
}

// ═══════════════════════════════════════════════════════════════════════════
// Asal Masalah (Base Denominator for Inheritance)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Standard base denominators (Asal Masalah) in Islamic inheritance.
 *
 * These are the common denominators that appear when combining
 * the standard furudh fractions (1/2, 1/3, 1/4, 1/6, 1/8, 2/3).
 */
export const ASAL_MASALAH = [2, 3, 4, 6, 8, 12, 24] as const;

/**
 * Finds the smallest valid Asal Masalah for given fractions.
 *
 * @param fractions - Array of share fractions
 * @returns Appropriate Asal Masalah
 */
export function findAsalMasalah(fractions: Fraction[]): number {
  const commonDenom = findCommonDenominator(fractions);

  // Find the smallest standard Asal Masalah that works
  for (const asal of ASAL_MASALAH) {
    if (commonDenom <= asal && asal % commonDenom === 0) {
      return asal;
    }
  }

  // If no standard works, use the actual common denominator
  return commonDenom;
}
