/**
 * @fileoverview Prayer calculation methods exports
 * @module prayer-times/methods
 */

export {
  // Individual methods
  MWL,
  ISNA,
  EGYPT,
  MAKKAH,
  KARACHI,
  TEHRAN,
  JAKIM,
  SINGAPORE,
  KEMENAG,
  DIYANET,
  UOIF,
  KUWAIT,
  QATAR,
  // Catalog
  CALCULATION_METHODS,
  // Registry functions
  registerMethod,
  unregisterMethod,
  getMethod,
  listMethodKeys,
  clearCustomMethods,
} from './catalog';

export type { CalculationMethodKey } from './catalog';
