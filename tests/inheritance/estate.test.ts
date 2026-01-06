/**
 * @fileoverview Unit tests for estate calculator
 */

import { describe, it, expect } from 'vitest';
import { calculateNetEstate, validateEstateInput } from '../../src/inheritance/estate';

describe('Estate Calculator', () => {
  describe('calculateNetEstate()', () => {
    it('should calculate net estate with all deductions', () => {
      const result = calculateNetEstate({
        grossValue: 1_000_000_000,
        debts: 100_000_000,
        funeralCosts: 50_000_000,
        wasiyyah: 100_000_000,
      });

      expect(result.success).toBe(true);
      if (result.success) {
        const { result: estate } = result.data;
        expect(estate.grossValue).toBe(1_000_000_000);
        expect(estate.deductions.debts).toBe(100_000_000);
        expect(estate.deductions.funeralCosts).toBe(50_000_000);
        expect(estate.deductions.wasiyyah).toBe(100_000_000);
        expect(estate.netEstate).toBe(750_000_000);
      }
    });

    it('should cap wasiyyah to 1/3 if exceeds limit', () => {
      const result = calculateNetEstate({
        grossValue: 900_000_000,
        wasiyyah: 500_000_000, // More than 1/3
      });

      expect(result.success).toBe(true);
      if (result.success) {
        const { result: estate } = result.data;
        expect(estate.deductions.wasiyyahCapped).toBe(true);
        expect(estate.deductions.wasiyyahOriginal).toBe(500_000_000);
        // 1/3 of 900M = 300M
        expect(estate.deductions.wasiyyah).toBe(300_000_000);
        expect(estate.netEstate).toBe(600_000_000);
      }
    });

    it('should allow wasiyyah > 1/3 if approved by heirs', () => {
      const result = calculateNetEstate({
        grossValue: 900_000_000,
        wasiyyah: 500_000_000,
        wasiyyahApprovedByHeirs: true,
      });

      expect(result.success).toBe(true);
      if (result.success) {
        const { result: estate } = result.data;
        expect(estate.deductions.wasiyyahCapped).toBe(false);
        expect(estate.deductions.wasiyyah).toBe(500_000_000);
        expect(estate.netEstate).toBe(400_000_000);
      }
    });

    it('should fail for zero gross value', () => {
      const result = calculateNetEstate({ grossValue: 0 });
      expect(result.success).toBe(false);
    });

    it('should fail for negative gross value', () => {
      const result = calculateNetEstate({ grossValue: -100 });
      expect(result.success).toBe(false);
    });

    it('should fail if debts exceed estate', () => {
      const result = calculateNetEstate({
        grossValue: 100_000_000,
        debts: 200_000_000,
      });
      expect(result.success).toBe(false);
    });

    it('should include trace steps', () => {
      const result = calculateNetEstate({
        grossValue: 1_000_000_000,
        debts: 50_000_000,
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.trace.length).toBeGreaterThan(0);
        expect(result.data.trace[0].phase).toBe('ESTATE');
      }
    });
  });

  describe('validateEstateInput()', () => {
    it('should validate correct input', () => {
      const result = validateEstateInput({
        grossValue: 1_000_000_000,
      });
      expect(result.success).toBe(true);
    });

    it('should reject invalid gross value', () => {
      const result = validateEstateInput({
        grossValue: NaN,
      });
      expect(result.success).toBe(false);
    });

    it('should reject negative debts', () => {
      const result = validateEstateInput({
        grossValue: 1_000_000,
        debts: -100,
      });
      expect(result.success).toBe(false);
    });
  });
});
