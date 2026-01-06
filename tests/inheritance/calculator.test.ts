/**
 * @fileoverview Integration tests for the main inheritance calculator
 */

import { describe, it, expect } from 'vitest';
import { computeInheritance } from '../../src/inheritance/calculator';
import { HeirType } from '../../src/inheritance/types';
import { toDecimal } from '../../src/inheritance/utils/fraction';

describe('Inheritance Calculator', () => {
  describe('Basic cases', () => {
    it('should calculate for wife and sons', () => {
      const result = computeInheritance({
        estate: { grossValue: 1_000_000_000 },
        heirs: [
          { type: HeirType.WIFE, count: 1 },
          { type: HeirType.SON, count: 2 },
        ],
        deceased: { gender: 'male' },
      });

      expect(result.success).toBe(true);
      if (result.success) {
        // Wife gets 1/8 with descendants
        const wifeShare = result.data.shares.find((s) => s.heirType === HeirType.WIFE);
        expect(wifeShare).toBeDefined();
        expect(toDecimal(wifeShare!.finalShare)).toBeCloseTo(0.125, 5);

        // Sons get remaining as asabah
        const sonShare = result.data.shares.find((s) => s.heirType === HeirType.SON);
        expect(sonShare).toBeDefined();

        // Verification
        expect(result.data.verification.isValid).toBe(true);
      }
    });

    it('should calculate for husband and daughter', () => {
      const result = computeInheritance({
        estate: { grossValue: 1_200_000_000 },
        heirs: [
          { type: HeirType.HUSBAND, count: 1 },
          { type: HeirType.DAUGHTER, count: 1 },
        ],
        deceased: { gender: 'female' },
      });

      expect(result.success).toBe(true);
      if (result.success) {
        // Husband gets 1/4 with descendants
        const husbandShare = result.data.shares.find((s) => s.heirType === HeirType.HUSBAND);
        expect(toDecimal(husbandShare!.finalShare)).toBeCloseTo(0.25, 5);

        // Single daughter gets at least 1/2 (may get more with radd)
        const daughterShare = result.data.shares.find((s) => s.heirType === HeirType.DAUGHTER);
        expect(toDecimal(daughterShare!.finalShare)).toBeGreaterThanOrEqual(0.5);

        // Total should be valid
        expect(result.data.verification.isValid).toBe(true);
      }
    });

    it('should calculate for parents without descendants', () => {
      const result = computeInheritance({
        estate: { grossValue: 600_000_000 },
        heirs: [
          { type: HeirType.FATHER, count: 1 },
          { type: HeirType.MOTHER, count: 1 },
        ],
        deceased: { gender: 'male' },
      });

      expect(result.success).toBe(true);
      if (result.success) {
        // Mother gets 1/3 (no descendants, no 2+ siblings)
        const motherShare = result.data.shares.find((s) => s.heirType === HeirType.MOTHER);
        expect(toDecimal(motherShare!.finalShare)).toBeCloseTo(0.333333, 4);

        // Father gets remainder as asabah
        const fatherShare = result.data.shares.find((s) => s.heirType === HeirType.FATHER);
        expect(toDecimal(fatherShare!.finalShare)).toBeCloseTo(0.666667, 4);
      }
    });
  });

  describe('Complex cases with deductions', () => {
    it('should handle debts and wasiyyah correctly', () => {
      const result = computeInheritance({
        estate: {
          grossValue: 1_000_000_000,
          debts: 100_000_000,
          funeralCosts: 50_000_000,
          wasiyyah: 200_000_000,
        },
        heirs: [{ type: HeirType.SON, count: 1 }],
        deceased: { gender: 'male' },
      });

      expect(result.success).toBe(true);
      if (result.success) {
        // Net = 1B - 100M - 50M = 850M
        // Wasiyyah 1/3 of 850M = 283.33M (capped from 200M, so 200M allowed)
        expect(result.data.netEstate).toBe(650_000_000);
        expect(result.data.verification.isValid).toBe(true);
      }
    });
  });

  describe('Hijab (blocking) scenarios', () => {
    it('should block siblings when son exists', () => {
      const result = computeInheritance({
        estate: { grossValue: 1_000_000_000 },
        heirs: [
          { type: HeirType.WIFE, count: 1 },
          { type: HeirType.SON, count: 1 },
          { type: HeirType.BROTHER_FULL, count: 1 },
        ],
        deceased: { gender: 'male' },
      });

      expect(result.success).toBe(true);
      if (result.success) {
        const brotherShare = result.data.shares.find((s) => s.heirType === HeirType.BROTHER_FULL);
        expect(brotherShare?.isBlocked).toBe(true);
        expect(brotherShare?.totalValue).toBe(0);
      }
    });
  });

  describe('Trace output', () => {
    it('should include comprehensive trace', () => {
      const result = computeInheritance({
        estate: { grossValue: 1_000_000_000 },
        heirs: [
          { type: HeirType.WIFE, count: 1 },
          { type: HeirType.SON, count: 1 },
        ],
        deceased: { gender: 'male' },
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.trace.length).toBeGreaterThan(5);

        // Check phases are present
        const phases = result.data.trace.map((t) => t.phase);
        expect(phases).toContain('VALIDATION');
        expect(phases).toContain('ESTATE');
        expect(phases).toContain('FLAGS');
        expect(phases).toContain('HIJAB');
      }
    });
  });

  describe('Error handling', () => {
    it('should fail for empty heirs', () => {
      const result = computeInheritance({
        estate: { grossValue: 1_000_000_000 },
        heirs: [],
        deceased: { gender: 'male' },
      });

      expect(result.success).toBe(false);
    });
  });
});
