/**
 * @fileoverview Unit tests for Hijri calendar validators.
 */

import { describe, expect, it } from 'vitest';

import {
  isValidHijriMethodId,
  normalizeHijriCalendarOptions,
  validateHijriAdjustment,
  validateHijriAdjustments,
  validateHijriAdjustmentsConfig,
  validateHijriDate,
  validateHijriMethodId,
  validateHijriMonthIdentifier,
} from '../../../src/hijri-calendar/utils/validators';
import {
  DEFAULT_ADJUSTMENT_CONFIG,
  DEFAULT_HIJRI_METHOD,
  DEFAULT_WEEK_START,
  ADJUSTMENT_SHIFT_RANGE,
  HIJRI_DAY_RANGE,
  HIJRI_MONTH_RANGE,
  HIJRI_YEAR_RANGE,
} from '../../../src/hijri-calendar/constants';

describe('isValidHijriMethodId', () => {
  it('returns true for supported methods', () => {
    expect(isValidHijriMethodId('ummul_qura')).toBe(true);
    expect(isValidHijriMethodId('nu_falakiyah')).toBe(true);
  });

  it('returns false for unsupported methods', () => {
    expect(isValidHijriMethodId('custom')).toBe(false);
    expect(isValidHijriMethodId(123)).toBe(false);
  });
});

describe('validateHijriMethodId', () => {
  it('accepts known method identifiers', () => {
    const result = validateHijriMethodId('ummul_qura');
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toBe<'ummul_qura'>('ummul_qura');
    }
  });

  it('rejects unknown method identifiers', () => {
    const result = validateHijriMethodId('unsupported');
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.code).toBe('INVALID_PARAMETER_TYPE');
    }
  });
});

describe('validateHijriMonthIdentifier', () => {
  it('accepts valid year and month combination', () => {
    const result = validateHijriMonthIdentifier({ year: 1446, month: 9 });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual({ year: 1446, month: 9 });
    }
  });

  it('rejects out-of-range year', () => {
    const result = validateHijriMonthIdentifier({ year: HIJRI_YEAR_RANGE.MAX + 1, month: 9 });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.code).toBe('OUT_OF_SUPPORTED_RANGE');
    }
  });

  it('rejects out-of-range month', () => {
    const result = validateHijriMonthIdentifier({ year: 1446, month: HIJRI_MONTH_RANGE.MAX + 1 });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.code).toBe('OUT_OF_SUPPORTED_RANGE');
    }
  });
});

describe('validateHijriDate', () => {
  it('accepts valid Hijri date', () => {
    const result = validateHijriDate({ year: 1446, month: 9, day: 15 });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual({ year: 1446, month: 9, day: 15 });
    }
  });

  it('rejects invalid day values', () => {
    const result = validateHijriDate({ year: 1446, month: 9, day: HIJRI_DAY_RANGE.MAX + 1 });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.code).toBe('OUT_OF_SUPPORTED_RANGE');
    }
  });
});

describe('validateHijriAdjustment', () => {
  it('accepts valid adjustment payload', () => {
    const result = validateHijriAdjustment({
      method: 'ummul_qura',
      hijriYear: 1446,
      hijriMonth: 9,
      shiftDays: 1,
      source: 'official-announcement',
      issuedAt: '2025-03-10T00:00:00.000Z',
      revision: 1,
    });

    expect(result.success).toBe(true);
  });

  it('rejects adjustment with unsupported method', () => {
    const result = validateHijriAdjustment({
      method: 'custom-method' as unknown as 'ummul_qura',
      hijriYear: 1446,
      hijriMonth: 9,
      shiftDays: 0,
      source: 'manual',
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.code).toBe('INVALID_PARAMETER_TYPE');
    }
  });

  it('rejects adjustment with shiftDays outside allowed range', () => {
    const result = validateHijriAdjustment({
      method: 'ummul_qura',
      hijriYear: 1446,
      hijriMonth: 9,
      shiftDays: ADJUSTMENT_SHIFT_RANGE.MAX + 1,
      source: 'manual',
    } as const);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.code).toBe('INVALID_ADJUSTMENT');
    }
  });

  it('rejects adjustment with fractional shiftDays', () => {
    const result = validateHijriAdjustment({
      method: 'ummul_qura',
      hijriYear: 1446,
      hijriMonth: 9,
      shiftDays: 0.5,
      source: 'manual',
    } as const);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.code).toBe('INVALID_PARAMETER_TYPE');
    }
  });

  it('rejects adjustment with empty source', () => {
    const result = validateHijriAdjustment({
      method: 'ummul_qura',
      hijriYear: 1446,
      hijriMonth: 9,
      shiftDays: 0,
      source: '   ',
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.code).toBe('INVALID_PARAMETER_TYPE');
    }
  });

  it('rejects adjustment with invalid revision value', () => {
    const result = validateHijriAdjustment({
      method: 'ummul_qura',
      hijriYear: 1446,
      hijriMonth: 9,
      shiftDays: 0,
      source: 'manual',
      revision: -1,
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.code).toBe('INVALID_PARAMETER_TYPE');
    }
  });
});

describe('validateHijriAdjustments', () => {
  it('accepts a collection of valid adjustments', () => {
    const result = validateHijriAdjustments([
      {
        method: 'ummul_qura',
        hijriYear: 1446,
        hijriMonth: 9,
        shiftDays: 1,
        source: 'official',
      },
      {
        method: 'nu_falakiyah',
        hijriYear: 1446,
        hijriMonth: 10,
        shiftDays: 0,
        source: 'official',
      },
    ]);

    expect(result.success).toBe(true);
  });

  it('fails fast on invalid adjustment entry', () => {
    const result = validateHijriAdjustments([
      {
        method: 'ummul_qura',
        hijriYear: 1446,
        hijriMonth: 9,
        shiftDays: 3,
        source: 'official',
      },
    ]);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.code).toBe('INVALID_ADJUSTMENT');
    }
  });
});

describe('validateHijriAdjustmentsConfig', () => {
  it('accepts none mode configuration', () => {
    const result = validateHijriAdjustmentsConfig({ mode: 'none' });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual({ mode: 'none' });
    }
  });

  it('accepts memory mode with valid data', () => {
    const result = validateHijriAdjustmentsConfig({
      mode: 'memory',
      data: [
        {
          method: 'ummul_qura',
          hijriYear: 1446,
          hijriMonth: 9,
          shiftDays: 0,
          source: 'official',
        },
      ],
    });

    expect(result.success).toBe(true);
    if (result.success && result.data.mode === 'memory') {
      expect(result.data.data).toHaveLength(1);
    }
  });

  it('rejects memory mode with invalid adjustments', () => {
    const result = validateHijriAdjustmentsConfig({
      mode: 'memory',
      data: [
        {
          method: 'ummul_qura',
          hijriYear: 1446,
          hijriMonth: 9,
          shiftDays: 3,
          source: 'official',
        },
      ],
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.code).toBe('INVALID_ADJUSTMENT');
    }
  });

  it('rejects json mode with empty file path', () => {
    const result = validateHijriAdjustmentsConfig({ mode: 'json', filePath: '   ' });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.code).toBe('INVALID_PARAMETER_TYPE');
    }
  });

  it('rejects provider mode with non-function getter', () => {
    const result = validateHijriAdjustmentsConfig({
      mode: 'provider',
      getAdjustments: 'not-a-function' as unknown as () => [],
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.code).toBe('INVALID_PARAMETER_TYPE');
    }
  });
});

describe('normalizeHijriCalendarOptions', () => {
  it('applies defaults when options are undefined', () => {
    const result = normalizeHijriCalendarOptions(undefined);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual({
        method: DEFAULT_HIJRI_METHOD,
        adjustments: DEFAULT_ADJUSTMENT_CONFIG,
        weekStartsOn: DEFAULT_WEEK_START,
      });
    }
  });

  it('allows overriding method and week start', () => {
    const result = normalizeHijriCalendarOptions({
      method: 'nu_falakiyah',
      weekStartsOn: 1,
      adjustments: { mode: 'none' },
    });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.method).toBe('nu_falakiyah');
      expect(result.data.weekStartsOn).toBe(1);
    }
  });

  it('rejects unsupported weekStartsOn values', () => {
    const result = normalizeHijriCalendarOptions({
      weekStartsOn: 2,
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.code).toBe('INVALID_PARAMETER_TYPE');
    }
  });

  it('bubbles up adjustment config validation errors', () => {
    const result = normalizeHijriCalendarOptions({
      adjustments: {
        mode: 'memory',
        data: [
          {
            method: 'ummul_qura',
            hijriYear: 1446,
            hijriMonth: 9,
            shiftDays: 3,
            source: 'invalid',
          },
        ],
      },
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.code).toBe('INVALID_ADJUSTMENT');
    }
  });
});
