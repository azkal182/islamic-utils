/**
 * @fileoverview Constants used by the Hijri Calendar module.
 * @module hijri-calendar/constants
 */

import type {
  HijriAdjustmentsConfig,
  HijriMethodId,
  HijriMethodMeta,
  HijriWeekday,
} from './types';

/**
 * Default calculation method for Hijri calendar conversion.
 */
export const DEFAULT_HIJRI_METHOD: HijriMethodId = 'ummul_qura';

/**
 * Supported week start values (0 = Sunday, 1 = Monday, 6 = Saturday).
 */
export const SUPPORTED_WEEK_STARTS: readonly HijriWeekday[] = [0, 1, 6] as const;

/**
 * Default week start for calendar grid generation.
 */
export const DEFAULT_WEEK_START: HijriWeekday = 0;

/**
 * Supported Hijri year range (broad validation guard).
 */
export const HIJRI_YEAR_RANGE = {
  MIN: 1,
  MAX: 1700,
} as const;

/**
 * Supported Hijri month range.
 */
export const HIJRI_MONTH_RANGE = {
  MIN: 1,
  MAX: 12,
} as const;

/**
 * Supported Hijri day range (calendar days).
 */
export const HIJRI_DAY_RANGE = {
  MIN: 1,
  MAX: 30,
} as const;

/**
 * Allowed adjustment shift range in days.
 */
export const ADJUSTMENT_SHIFT_RANGE = {
  MIN: -2,
  MAX: 2,
} as const;

/**
 * Nominal Hijri month lengths (alternating 30/29 pattern).
 *
 * @remarks
 * Real month lengths are determined by calculation method and adjustments.
 */
export const NOMINAL_HIJRI_MONTH_LENGTHS: readonly (29 | 30)[] = [
  30, // Muharram
  29, // Safar
  30, // Rabi' al-awwal
  29, // Rabi' al-thani
  30, // Jumada al-awwal
  29, // Jumada al-thani
  30, // Rajab
  29, // Sha'ban
  30, // Ramadan
  29, // Shawwal
  30, // Dhu al-Qa'dah
  29, // Dhu al-Hijjah (adjusted per method)
] as const;

/**
 * Hijri month metadata (name and transliteration).
 */
export const HIJRI_MONTHS = [
  { number: 1, latin: 'Muharram', arabic: 'محرم' },
  { number: 2, latin: 'Safar', arabic: 'صفر' },
  { number: 3, latin: "Rabi' al-awwal", arabic: 'ربيع الأول' },
  { number: 4, latin: "Rabi' al-thani", arabic: 'ربيع الآخر' },
  { number: 5, latin: 'Jumada al-awwal', arabic: 'جمادى الأولى' },
  { number: 6, latin: 'Jumada al-thani', arabic: 'جمادى الآخرة' },
  { number: 7, latin: 'Rajab', arabic: 'رجب' },
  { number: 8, latin: "Sha'ban", arabic: 'شعبان' },
  { number: 9, latin: 'Ramadan', arabic: 'رمضان' },
  { number: 10, latin: 'Shawwal', arabic: 'شوال' },
  { number: 11, latin: "Dhu al-Qa'dah", arabic: 'ذو القعدة' },
  { number: 12, latin: 'Dhu al-Hijjah', arabic: 'ذو الحجة' },
] as const;

/**
 * Friendly lookup table for Hijri months keyed by number.
 */
export const HIJRI_MONTH_NAME_MAP = HIJRI_MONTHS.reduce<Record<number, (typeof HIJRI_MONTHS)[number]>>(
  (acc, month) => {
    acc[month.number] = month;
    return acc;
  },
  {}
);

/**
 * Metadata describing supported calculation methods.
 */
export const HIJRI_METHODS: Record<HijriMethodId, HijriMethodMeta> = {
  ummul_qura: {
    id: 'ummul_qura',
    name: 'Umm al-Qura (Saudi Arabia)',
    description: 'Official calendar used in the Kingdom of Saudi Arabia.',
    region: 'Saudi Arabia',
    source: 'Umm al-Qura University, Makkah',
    supportedGregorianYears: { start: 1937, end: 2077 },
    supportedHijriYears: { start: 1356, end: 1500 },
  },
  nu_falakiyah: {
    id: 'nu_falakiyah',
    name: 'Nahdlatul Ulama Falakiyah',
    description: 'Astronomical hisab (calculation) method by Lembaga Falakiyah PBNU.',
    region: 'Indonesia',
    source: 'Lembaga Falakiyah PBNU',
    notes: 'Pure hisab implementation without official rukyat adjustments.',
    supportedGregorianYears: { start: 1900, end: 2100 },
    supportedHijriYears: { start: 1318, end: 1524 },
  },
};

/**
 * Default adjustments configuration (no adjustments).
 */
export const DEFAULT_ADJUSTMENT_CONFIG: HijriAdjustmentsConfig = { mode: 'none' };
