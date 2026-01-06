/**
 * @fileoverview Unit tests for hijab (exclusion) rules
 */

import { describe, it, expect } from 'vitest';
import { applyHijab } from '../../src/inheritance/rules/hijab';
import { calculateFlags } from '../../src/inheritance/flags';
import { HeirType } from '../../src/inheritance/types';

describe('Hijab Rules', () => {
  describe('applyHijab()', () => {
    it('should block siblings when son exists (Rule E1)', () => {
      const heirs = [
        { type: HeirType.SON, count: 1 },
        { type: HeirType.BROTHER_FULL, count: 1 },
        { type: HeirType.SISTER_FULL, count: 1 },
      ];
      const flags = calculateFlags(heirs);
      const result = applyHijab(heirs, flags);

      expect(result.blockedHeirs.length).toBe(2);
      expect(result.blockedHeirs.map((b) => b.heir.type)).toContain(HeirType.BROTHER_FULL);
      expect(result.blockedHeirs.map((b) => b.heir.type)).toContain(HeirType.SISTER_FULL);
      expect(result.activeHeirs.length).toBe(1);
    });

    it('should block siblings when daughter exists (Rule E1)', () => {
      const heirs = [
        { type: HeirType.DAUGHTER, count: 1 },
        { type: HeirType.BROTHER_UTERINE, count: 1 },
      ];
      const flags = calculateFlags(heirs);
      const result = applyHijab(heirs, flags);

      expect(result.blockedHeirs.length).toBe(1);
      expect(result.blockedHeirs[0].heir.type).toBe(HeirType.BROTHER_UTERINE);
    });

    it('should block grandfather when father exists (Rule E2)', () => {
      const heirs = [
        { type: HeirType.FATHER, count: 1 },
        { type: HeirType.GRANDFATHER_PATERNAL, count: 1 },
      ];
      const flags = calculateFlags(heirs);
      const result = applyHijab(heirs, flags);

      expect(result.blockedHeirs.length).toBe(1);
      expect(result.blockedHeirs[0].heir.type).toBe(HeirType.GRANDFATHER_PATERNAL);
    });

    it('should block brothers and uncles when father exists (Rule E2)', () => {
      const heirs = [
        { type: HeirType.FATHER, count: 1 },
        { type: HeirType.BROTHER_FULL, count: 1 },
        { type: HeirType.UNCLE_FULL, count: 1 },
      ];
      const flags = calculateFlags(heirs);
      const result = applyHijab(heirs, flags);

      expect(result.blockedHeirs.length).toBe(2);
      expect(result.activeHeirs.length).toBe(1);
    });

    it('should block grandson when son exists (Rule E3)', () => {
      const heirs = [
        { type: HeirType.SON, count: 1 },
        { type: HeirType.GRANDSON_SON, count: 1 },
      ];
      const flags = calculateFlags(heirs);
      const result = applyHijab(heirs, flags);

      expect(result.blockedHeirs.length).toBe(1);
      expect(result.blockedHeirs[0].heir.type).toBe(HeirType.GRANDSON_SON);
    });

    it('should block maternal grandmother when mother exists (Rule E4)', () => {
      const heirs = [
        { type: HeirType.MOTHER, count: 1 },
        { type: HeirType.GRANDMOTHER_MATERNAL, count: 1 },
      ];
      const flags = calculateFlags(heirs);
      const result = applyHijab(heirs, flags);

      expect(result.blockedHeirs.length).toBe(1);
      expect(result.blockedHeirs[0].heir.type).toBe(HeirType.GRANDMOTHER_MATERNAL);
    });

    it('should block paternal grandmother when father exists (Rule E5)', () => {
      const heirs = [
        { type: HeirType.FATHER, count: 1 },
        { type: HeirType.GRANDMOTHER_PATERNAL, count: 1 },
      ];
      const flags = calculateFlags(heirs);
      const result = applyHijab(heirs, flags);

      expect(result.blockedHeirs.length).toBe(1);
      expect(result.blockedHeirs[0].heir.type).toBe(HeirType.GRANDMOTHER_PATERNAL);
    });

    it('should block paternal siblings when full brother exists (Rule E6)', () => {
      const heirs = [
        { type: HeirType.BROTHER_FULL, count: 1 },
        { type: HeirType.BROTHER_PATERNAL, count: 1 },
        { type: HeirType.SISTER_PATERNAL, count: 1 },
      ];
      const flags = calculateFlags(heirs);
      const result = applyHijab(heirs, flags);

      expect(result.blockedHeirs.length).toBe(2);
      expect(result.blockedHeirs.map((b) => b.heir.type)).toContain(HeirType.BROTHER_PATERNAL);
      expect(result.blockedHeirs.map((b) => b.heir.type)).toContain(HeirType.SISTER_PATERNAL);
    });

    it('should not block anyone when no conflicting heirs', () => {
      const heirs = [
        { type: HeirType.WIFE, count: 1 },
        { type: HeirType.SON, count: 2 },
        { type: HeirType.DAUGHTER, count: 1 },
      ];
      const flags = calculateFlags(heirs);
      const result = applyHijab(heirs, flags);

      expect(result.blockedHeirs.length).toBe(0);
      expect(result.activeHeirs.length).toBe(3);
    });

    it('should include trace steps', () => {
      const heirs = [{ type: HeirType.SON, count: 1 }];
      const flags = calculateFlags(heirs);
      const result = applyHijab(heirs, flags);

      expect(result.trace.length).toBeGreaterThan(0);
      expect(result.trace[0].phase).toBe('HIJAB');
    });
  });
});
