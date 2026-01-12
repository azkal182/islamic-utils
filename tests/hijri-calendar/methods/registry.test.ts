/**
 * @fileoverview Unit tests for Hijri method registry.
 */

import { describe, expect, it } from 'vitest';

import { getMethod, listMethodKeys } from '../../../src/hijri-calendar/methods';

describe('Hijri methods registry', () => {
  it('should expose built-in method keys', () => {
    const keys = listMethodKeys();
    expect(keys).toContain('ummul_qura');
    expect(keys).toContain('nu_falakiyah');
  });

  it('should resolve built-in methods', () => {
    const ummulQura = getMethod('ummul_qura');
    const nuFalakiyah = getMethod('nu_falakiyah');

    expect(ummulQura).toBeDefined();
    expect(nuFalakiyah).toBeDefined();

    if (ummulQura && nuFalakiyah) {
      expect(ummulQura.id).toBe('ummul_qura');
      expect(nuFalakiyah.id).toBe('nu_falakiyah');
    }
  });

  it('should return undefined for unknown method key', () => {
    const method = getMethod('unknown-method');
    expect(method).toBeUndefined();
  });
});
