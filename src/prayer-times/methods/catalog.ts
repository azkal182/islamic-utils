/**
 * @fileoverview Built-in calculation methods catalog
 * @module prayer-times/methods/catalog
 *
 * This module provides pre-configured calculation methods used by
 * various Islamic organizations around the world.
 *
 * @remarks
 * Each method defines specific angles for Fajr and Isha prayers.
 * You can also register custom methods at runtime.
 *
 * @example
 * ```typescript
 * import { CALCULATION_METHODS, getMethod } from 'islamic-utils';
 *
 * // Use a built-in method
 * const method = CALCULATION_METHODS.KEMENAG;
 *
 * // Get method by key
 * const mwlMethod = getMethod('MWL');
 * ```
 */

import type { CalculationMethod } from '../types';

// ═══════════════════════════════════════════════════════════════════════════
// Built-in Calculation Methods
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Muslim World League calculation method.
 *
 * @remarks
 * One of the most widely used methods globally.
 * - Fajr: 18°
 * - Isha: 17°
 */
export const MWL: CalculationMethod = {
  name: 'Muslim World League',
  fajrAngle: 18,
  ishaAngle: 17,
  description: 'Standard method used by the Muslim World League',
  regions: ['Europe', 'Far East', 'Parts of USA'],
} as const;

/**
 * Islamic Society of North America calculation method.
 *
 * @remarks
 * Used in North America.
 * - Fajr: 15°
 * - Isha: 15°
 */
export const ISNA: CalculationMethod = {
  name: 'Islamic Society of North America',
  fajrAngle: 15,
  ishaAngle: 15,
  description: 'Used in North America (USA & Canada)',
  regions: ['USA', 'Canada'],
} as const;

/**
 * Egyptian General Authority of Survey calculation method.
 *
 * @remarks
 * Official method used in Egypt.
 * - Fajr: 19.5°
 * - Isha: 17.5°
 */
export const EGYPT: CalculationMethod = {
  name: 'Egyptian General Authority of Survey',
  fajrAngle: 19.5,
  ishaAngle: 17.5,
  description: 'Official method of Egyptian General Authority of Survey',
  regions: ['Africa', 'Syria', 'Iraq', 'Lebanon', 'Malaysia'],
} as const;

/**
 * Umm al-Qura University, Makkah calculation method.
 *
 * @remarks
 * Used in Saudi Arabia.
 * Uses fixed 90-minute interval for Isha instead of angle.
 * - Fajr: 18.5°
 * - Isha: 90 minutes after Maghrib
 */
export const MAKKAH: CalculationMethod = {
  name: 'Umm al-Qura University, Makkah',
  fajrAngle: 18.5,
  ishaIntervalMinutes: 90,
  description: 'Used in Arabian Peninsula (during Ramadan, Isha is 120 minutes)',
  regions: ['Saudi Arabia', 'Gulf States'],
} as const;

/**
 * University of Islamic Sciences, Karachi calculation method.
 *
 * @remarks
 * Used in Pakistan and surrounding regions.
 * - Fajr: 18°
 * - Isha: 18°
 */
export const KARACHI: CalculationMethod = {
  name: 'University of Islamic Sciences, Karachi',
  fajrAngle: 18,
  ishaAngle: 18,
  description: 'Used in Pakistan, Bangladesh, India, Afghanistan',
  regions: ['Pakistan', 'Bangladesh', 'India', 'Afghanistan'],
} as const;

/**
 * Institute of Geophysics, University of Tehran calculation method.
 *
 * @remarks
 * Used in Iran and Shia regions.
 * - Fajr: 17.7°
 * - Isha: 14°
 * - Maghrib: 4.5° (sun below horizon)
 */
export const TEHRAN: CalculationMethod = {
  name: 'Institute of Geophysics, University of Tehran',
  fajrAngle: 17.7,
  ishaAngle: 14,
  maghribAngle: 4.5,
  description: 'Used in Iran and Shia communities',
  regions: ['Iran', 'Shia communities'],
} as const;

/**
 * JAKIM (Jabatan Kemajuan Islam Malaysia) calculation method.
 *
 * @remarks
 * Used in Malaysia.
 * - Fajr: 20°
 * - Isha: 18°
 */
export const JAKIM: CalculationMethod = {
  name: 'Jabatan Kemajuan Islam Malaysia',
  fajrAngle: 20,
  ishaAngle: 18,
  description: 'Official method of JAKIM, Malaysia',
  regions: ['Malaysia', 'Brunei'],
} as const;

/**
 * Majlis Ugama Islam Singapura (MUIS) calculation method.
 *
 * @remarks
 * Used in Singapore.
 * - Fajr: 20°
 * - Isha: 18°
 */
export const SINGAPORE: CalculationMethod = {
  name: 'Majlis Ugama Islam Singapura',
  fajrAngle: 20,
  ishaAngle: 18,
  description: 'Official method of MUIS, Singapore',
  regions: ['Singapore'],
} as const;

/**
 * Kementerian Agama Republik Indonesia calculation method.
 *
 * @remarks
 * Official method used in Indonesia.
 * - Fajr: 20°
 * - Isha: 18°
 */
export const KEMENAG: CalculationMethod = {
  name: 'Kementerian Agama Republik Indonesia',
  fajrAngle: 20,
  ishaAngle: 18,
  description: 'Official method of Kemenag (Ministry of Religious Affairs), Indonesia',
  regions: ['Indonesia'],
} as const;

/**
 * Diyanet İşleri Başkanlığı, Turkey calculation method.
 *
 * @remarks
 * Used in Turkey and Balkans.
 * - Fajr: 18°
 * - Isha: 17°
 */
export const DIYANET: CalculationMethod = {
  name: 'Diyanet İşleri Başkanlığı',
  fajrAngle: 18,
  ishaAngle: 17,
  description: 'Presidency of Religious Affairs, Turkey',
  regions: ['Turkey', 'Balkans'],
} as const;

/**
 * Union des Organisations Islamiques de France calculation method.
 *
 * @remarks
 * Used in France and French-speaking regions.
 * - Fajr: 12°
 * - Isha: 12°
 */
export const UOIF: CalculationMethod = {
  name: 'Union des Organisations Islamiques de France',
  fajrAngle: 12,
  ishaAngle: 12,
  description: 'Used in France for reducing prayer time differences in summer',
  regions: ['France'],
} as const;

/**
 * Kuwait calculation method.
 *
 * @remarks
 * Used in Kuwait.
 * - Fajr: 18°
 * - Isha: 17.5°
 */
export const KUWAIT: CalculationMethod = {
  name: 'Kuwait',
  fajrAngle: 18,
  ishaAngle: 17.5,
  description: 'Standard Kuwait calculation',
  regions: ['Kuwait'],
} as const;

/**
 * Qatar calculation method.
 *
 * @remarks
 * Used in Qatar.
 * - Fajr: 18°
 * - Isha: 90 minutes after Maghrib
 */
export const QATAR: CalculationMethod = {
  name: 'Qatar',
  fajrAngle: 18,
  ishaIntervalMinutes: 90,
  description: 'Qatar calendar calculation',
  regions: ['Qatar'],
} as const;

// ═══════════════════════════════════════════════════════════════════════════
// Methods Catalog
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Catalog of all built-in calculation methods.
 *
 * @remarks
 * Access methods by their key (string identifier).
 *
 * @example
 * ```typescript
 * const method = CALCULATION_METHODS.KEMENAG;
 * console.log(method.fajrAngle); // 20
 * ```
 */
export const CALCULATION_METHODS = {
  /** Muslim World League */
  MWL,
  /** Islamic Society of North America */
  ISNA,
  /** Egyptian General Authority of Survey */
  EGYPT,
  /** Umm al-Qura University, Makkah */
  MAKKAH,
  /** University of Islamic Sciences, Karachi */
  KARACHI,
  /** Institute of Geophysics, University of Tehran */
  TEHRAN,
  /** Jabatan Kemajuan Islam Malaysia */
  JAKIM,
  /** Majlis Ugama Islam Singapura */
  SINGAPORE,
  /** Kementerian Agama Republik Indonesia */
  KEMENAG,
  /** Diyanet İşleri Başkanlığı, Turkey */
  DIYANET,
  /** Union des Organisations Islamiques de France */
  UOIF,
  /** Kuwait */
  KUWAIT,
  /** Qatar */
  QATAR,
} as const;

/**
 * Type for built-in method keys.
 */
export type CalculationMethodKey = keyof typeof CALCULATION_METHODS;

// ═══════════════════════════════════════════════════════════════════════════
// Custom Methods Registry
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Registry for custom calculation methods.
 *
 * @internal
 */
const customMethods: Map<string, CalculationMethod> = new Map();

/**
 * Registers a custom calculation method.
 *
 * @param key - Unique identifier for the method
 * @param method - The calculation method configuration
 * @throws Error if key conflicts with a built-in method
 *
 * @example
 * ```typescript
 * registerMethod('CUSTOM', {
 *   name: 'My Custom Method',
 *   fajrAngle: 19,
 *   ishaAngle: 16,
 * });
 *
 * const method = getMethod('CUSTOM');
 * ```
 */
export function registerMethod(key: string, method: CalculationMethod): void {
  // Prevent overwriting built-in methods
  if (key in CALCULATION_METHODS) {
    throw new Error(`Cannot override built-in method "${key}"`);
  }

  customMethods.set(key, method);
}

/**
 * Unregisters a custom calculation method.
 *
 * @param key - The method key to remove
 * @returns True if the method was removed, false if it didn't exist
 */
export function unregisterMethod(key: string): boolean {
  return customMethods.delete(key);
}

/**
 * Gets a calculation method by its key.
 *
 * @param key - The method key (built-in or custom)
 * @returns The calculation method or undefined if not found
 *
 * @example
 * ```typescript
 * const method = getMethod('MWL');
 * if (method) {
 *   console.log(`Fajr angle: ${method.fajrAngle}°`);
 * }
 * ```
 */
export function getMethod(key: string): CalculationMethod | undefined {
  // Check built-in methods first
  if (key in CALCULATION_METHODS) {
    return CALCULATION_METHODS[key as CalculationMethodKey];
  }

  // Check custom methods
  return customMethods.get(key);
}

/**
 * Lists all available calculation method keys.
 *
 * @returns Array of method keys (built-in and custom)
 */
export function listMethodKeys(): string[] {
  return [...Object.keys(CALCULATION_METHODS), ...customMethods.keys()];
}

/**
 * Clears all custom methods.
 *
 * @remarks
 * This is primarily useful for testing.
 * Built-in methods are not affected.
 */
export function clearCustomMethods(): void {
  customMethods.clear();
}
