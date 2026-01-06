/**
 * @fileoverview Inheritance module public API
 * @module inheritance
 */

// Calculator
export { computeInheritance } from './calculator';

// Types
export type {
  InheritanceInput,
  InheritanceOptions,
  InheritanceResult,
  InheritanceTraceStep,
  InheritancePolicy,
  HeirInput,
  HeirShare,
  EstateInput,
  EstateResult,
  DerivedFlags,
  InheritanceSummary,
  InheritanceMeta,
  SpecialCase,
  ConflictValidationResult,
} from './types';

export {
  HeirType,
  HeirCategory,
  ShareCategory,
  AsabahType,
  SpecialCaseId,
  SPECIAL_CASES,
  DEFAULT_POLICY,
  getHeirCategory,
  getHeirArabicName,
  isMaleHeir,
  isFemaleHeir,
} from './types';

// Flags
export { calculateFlags, getHeirCount, getTotalHeirCount } from './flags';

// Estate
export { calculateNetEstate } from './estate';

// Rules
export { applyHijab } from './rules/hijab';
export { calculateFurudh, type FurudhResult, type FurudhShareResult } from './rules/furudh';
export { calculateAsabah, type AsabahResult, type AsabahShareResult } from './rules/asabah';
export { detectAul, applyAul, type AulResult } from './rules/aul';
export { detectRadd, applyRadd, type RaddResult } from './rules/radd';
export { detectSpecialCase, type SpecialCaseDetection } from './rules/special-cases';

// Validation
export { validateNoConflicts, verifyMutualExclusivity } from './validation/rule-conflict';

// Fraction utilities
export type { Fraction } from './utils/fraction';
export {
  fraction,
  add,
  subtract,
  multiply,
  divide,
  simplify,
  toDecimal,
  toString,
  toPercentage,
  toArabicName,
  sum,
  gcd,
  lcm,
  findCommonDenominator,
  FRACTION,
  ASAL_MASALAH,
  findAsalMasalah,
} from './utils/fraction';
