/**
 * @fileoverview Unit tests for derived flags calculator
 */

import { describe, it, expect } from 'vitest';
import {
  calculateFlags,
  getHeirCount,
  getTotalHeirCount,
  hasAnyHeirs,
} from '../../src/inheritance/flags';
import { HeirType } from '../../src/inheritance/types';

describe('Flags Calculator', () => {
  describe('calculateFlags()', () => {
    it('should detect son correctly', () => {
      const flags = calculateFlags([{ type: HeirType.SON, count: 2 }]);

      expect(flags.HAS_SON).toBe(true);
      expect(flags.HAS_CHILD).toBe(true);
      expect(flags.HAS_DESCENDANT).toBe(true);
    });

    it('should detect daughter correctly', () => {
      const flags = calculateFlags([{ type: HeirType.DAUGHTER, count: 1 }]);

      expect(flags.HAS_DAUGHTER).toBe(true);
      expect(flags.HAS_SON).toBe(false);
      expect(flags.HAS_CHILD).toBe(true);
      expect(flags.HAS_DESCENDANT).toBe(true);
    });

    it('should detect parents correctly', () => {
      const flags = calculateFlags([
        { type: HeirType.FATHER, count: 1 },
        { type: HeirType.MOTHER, count: 1 },
      ]);

      expect(flags.HAS_FATHER).toBe(true);
      expect(flags.HAS_MOTHER).toBe(true);
    });

    it('should detect grandchildren correctly', () => {
      const flags = calculateFlags([
        { type: HeirType.GRANDSON_SON, count: 1 },
        { type: HeirType.GRANDDAUGHTER_SON, count: 2 },
      ]);

      expect(flags.HAS_GRANDSON).toBe(true);
      expect(flags.HAS_GRANDDAUGHTER).toBe(true);
      expect(flags.HAS_DESCENDANT).toBe(true);
      expect(flags.HAS_CHILD).toBe(false);
    });

    it('should detect spouse correctly', () => {
      const flagsHusband = calculateFlags([{ type: HeirType.HUSBAND, count: 1 }]);
      expect(flagsHusband.HAS_HUSBAND).toBe(true);
      expect(flagsHusband.HAS_SPOUSE).toBe(true);

      const flagsWife = calculateFlags([{ type: HeirType.WIFE, count: 1 }]);
      expect(flagsWife.HAS_WIFE).toBe(true);
      expect(flagsWife.HAS_SPOUSE).toBe(true);
    });

    it('should count siblings correctly', () => {
      const flags = calculateFlags([
        { type: HeirType.BROTHER_FULL, count: 2 },
        { type: HeirType.SISTER_FULL, count: 1 },
        { type: HeirType.BROTHER_UTERINE, count: 1 },
      ]);

      expect(flags.HAS_SIBLINGS_TOTAL).toBe(4);
      expect(flags.HAS_TWO_OR_MORE_SIBLINGS).toBe(true);
      expect(flags.HAS_FULL_SIBLINGS).toBe(true);
      expect(flags.HAS_UTERINE_SIBLINGS).toBe(true);
    });

    it('should detect grandparents correctly', () => {
      const flags = calculateFlags([
        { type: HeirType.GRANDFATHER_PATERNAL, count: 1 },
        { type: HeirType.GRANDMOTHER_MATERNAL, count: 1 },
        { type: HeirType.GRANDMOTHER_PATERNAL, count: 1 },
      ]);

      expect(flags.HAS_GRANDFATHER).toBe(true);
      expect(flags.HAS_GRANDMOTHER).toBe(true);
    });
  });

  describe('getHeirCount()', () => {
    it('should return correct count for existing heir', () => {
      const heirs = [
        { type: HeirType.SON, count: 3 },
        { type: HeirType.DAUGHTER, count: 2 },
      ];

      expect(getHeirCount(heirs, HeirType.SON)).toBe(3);
      expect(getHeirCount(heirs, HeirType.DAUGHTER)).toBe(2);
    });

    it('should return 0 for non-existing heir', () => {
      const heirs = [{ type: HeirType.SON, count: 1 }];
      expect(getHeirCount(heirs, HeirType.DAUGHTER)).toBe(0);
    });
  });

  describe('getTotalHeirCount()', () => {
    it('should sum all heir counts', () => {
      const heirs = [
        { type: HeirType.SON, count: 2 },
        { type: HeirType.DAUGHTER, count: 3 },
        { type: HeirType.WIFE, count: 1 },
      ];

      expect(getTotalHeirCount(heirs)).toBe(6);
    });
  });

  describe('hasAnyHeirs()', () => {
    it('should return true when heirs exist', () => {
      expect(hasAnyHeirs([{ type: HeirType.SON, count: 1 }])).toBe(true);
    });

    it('should return false when no heirs', () => {
      expect(hasAnyHeirs([])).toBe(false);
      expect(hasAnyHeirs([{ type: HeirType.SON, count: 0 }])).toBe(false);
    });
  });
});
