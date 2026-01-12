/**
 * @fileoverview Hijri calendar methods exports.
 * @module hijri-calendar/methods
 */

export {
  UMMUL_QURA,
  NU_FALAKIYAH,
  HIJRI_METHOD_CATALOG,
  registerMethod,
  unregisterMethod,
  clearCustomMethods,
  getMethod,
  listMethodKeys,
} from './catalog';

export type { HijriMethodKey } from './catalog';
export type { HijriCalculationMethod } from './types';
