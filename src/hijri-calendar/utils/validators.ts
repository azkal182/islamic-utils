/**
 * @fileoverview Validation helpers for the Hijri Calendar module.
 * @module hijri-calendar/utils/validators
 */

import { failure, success } from '../../core/types/result';
import { Errors } from '../../core/errors';
import type {
  HijriAdjustmentsConfig,
  HijriCalendarOptions,
  HijriCalendarOptionsNormalized,
  HijriDate,
  HijriMethodId,
  HijriMonthAdjustment,
  HijriMonthIdentifier,
} from '../types';
import {
  ADJUSTMENT_SHIFT_RANGE,
  DEFAULT_ADJUSTMENT_CONFIG,
  DEFAULT_HIJRI_METHOD,
  DEFAULT_WEEK_START,
  HIJRI_DAY_RANGE,
  HIJRI_METHODS,
  HIJRI_MONTH_RANGE,
  HIJRI_YEAR_RANGE,
  SUPPORTED_WEEK_STARTS,
} from '../constants';
import type { Result } from '../../core/types/result';

/**
 * Checks whether a value is a supported Hijri calculation method.
 */
export function isValidHijriMethodId(method: unknown): method is HijriMethodId {
  return typeof method === 'string' && Object.prototype.hasOwnProperty.call(HIJRI_METHODS, method);
}

/**
 * Validates that the method exists in the registry.
 */
export function validateHijriMethodId(method: unknown): Result<HijriMethodId> {
  if (!isValidHijriMethodId(method)) {
    return failure(
      Errors.invalidParameterType('Hijri method must be a supported identifier', {
        method,
        supported: Object.keys(HIJRI_METHODS),
      })
    );
  }

  return success(method);
}

/**
 * Validates a Hijri month identifier.
 */
export function validateHijriMonthIdentifier(
  identifier: HijriMonthIdentifier
): Result<HijriMonthIdentifier> {
  if (
    !Number.isInteger(identifier.year) ||
    identifier.year < HIJRI_YEAR_RANGE.MIN ||
    identifier.year > HIJRI_YEAR_RANGE.MAX
  ) {
    return failure(
      Errors.outOfSupportedRange('Hijri year is out of supported range', {
        year: identifier.year,
        range: HIJRI_YEAR_RANGE,
      })
    );
  }

  if (!Number.isInteger(identifier.month)) {
    return failure(
      Errors.invalidParameterType('Hijri month must be an integer between 1 and 12', {
        month: identifier.month,
      })
    );
  }

  if (identifier.month < HIJRI_MONTH_RANGE.MIN || identifier.month > HIJRI_MONTH_RANGE.MAX) {
    return failure(
      Errors.outOfSupportedRange('Hijri month must be between 1 and 12', {
        month: identifier.month,
        range: HIJRI_MONTH_RANGE,
      })
    );
  }

  return success(identifier);
}

/**
 * Validates an individual Hijri date.
 */
export function validateHijriDate(date: HijriDate): Result<HijriDate> {
  if (
    !Number.isInteger(date.year) ||
    date.year < HIJRI_YEAR_RANGE.MIN ||
    date.year > HIJRI_YEAR_RANGE.MAX
  ) {
    return failure(
      Errors.outOfSupportedRange('Hijri year is out of supported range', {
        year: date.year,
        range: HIJRI_YEAR_RANGE,
      })
    );
  }

  if (!Number.isInteger(date.month)) {
    return failure(
      Errors.invalidParameterType('Hijri month must be an integer', {
        month: date.month,
      })
    );
  }

  if (date.month < HIJRI_MONTH_RANGE.MIN || date.month > HIJRI_MONTH_RANGE.MAX) {
    return failure(
      Errors.outOfSupportedRange('Hijri month must be between 1 and 12', {
        month: date.month,
        range: HIJRI_MONTH_RANGE,
      })
    );
  }

  if (!Number.isInteger(date.day)) {
    return failure(
      Errors.invalidParameterType('Hijri day must be an integer', {
        day: date.day,
      })
    );
  }

  if (date.day < HIJRI_DAY_RANGE.MIN || date.day > HIJRI_DAY_RANGE.MAX) {
    return failure(
      Errors.outOfSupportedRange('Hijri day must be between 1 and 30', {
        day: date.day,
        range: HIJRI_DAY_RANGE,
      })
    );
  }

  return success(date);
}

/**
 * Validates a Hijri month adjustment record.
 */
export function validateHijriAdjustment(
  adjustment: HijriMonthAdjustment
): Result<HijriMonthAdjustment> {
  const methodResult = validateHijriMethodId(adjustment.method);
  if (!methodResult.success) {
    return failure(methodResult.error);
  }

  const monthResult = validateHijriMonthIdentifier({
    year: adjustment.hijriYear,
    month: adjustment.hijriMonth,
  });
  if (!monthResult.success) {
    return failure(monthResult.error);
  }

  if (!Number.isFinite(adjustment.shiftDays) || !Number.isInteger(adjustment.shiftDays)) {
    return failure(
      Errors.invalidParameterType('shiftDays must be an integer value', {
        shiftDays: adjustment.shiftDays,
      })
    );
  }

  if (
    adjustment.shiftDays < ADJUSTMENT_SHIFT_RANGE.MIN ||
    adjustment.shiftDays > ADJUSTMENT_SHIFT_RANGE.MAX
  ) {
    return failure(
      Errors.invalidAdjustment('shiftDays must be between -2 and +2', {
        shiftDays: adjustment.shiftDays,
        allowedRange: ADJUSTMENT_SHIFT_RANGE,
      })
    );
  }

  if (typeof adjustment.source !== 'string' || adjustment.source.trim().length === 0) {
    return failure(
      Errors.invalidParameterType('Adjustment source must be a non-empty string', {
        source: adjustment.source,
      })
    );
  }

  if (adjustment.issuedAt !== undefined && typeof adjustment.issuedAt !== 'string') {
    return failure(
      Errors.invalidParameterType('issuedAt must be an ISO-8601 string when provided', {
        issuedAt: adjustment.issuedAt,
      })
    );
  }

  if (adjustment.revision !== undefined) {
    if (!Number.isInteger(adjustment.revision) || adjustment.revision < 0) {
      return failure(
        Errors.invalidParameterType('revision must be a non-negative integer when provided', {
          revision: adjustment.revision,
        })
      );
    }
  }

  return success(adjustment);
}

/**
 * Validates a list of adjustments for a given method/year.
 */
export function validateHijriAdjustments(
  adjustments: readonly HijriMonthAdjustment[]
): Result<readonly HijriMonthAdjustment[]> {
  for (const entry of adjustments) {
    const entryResult = validateHijriAdjustment(entry);
    if (!entryResult.success) {
      return failure(entryResult.error);
    }
  }

  return success(adjustments);
}

/**
 * Normalizes calendar options by applying defaults.
 */
export function normalizeHijriCalendarOptions(
  options: HijriCalendarOptions | undefined
): Result<HijriCalendarOptionsNormalized> {
  const selectedMethod = options?.method ?? DEFAULT_HIJRI_METHOD;
  const methodResult = validateHijriMethodId(selectedMethod);
  if (!methodResult.success) {
    return failure(methodResult.error);
  }

  const weekStartsOn = options?.weekStartsOn ?? DEFAULT_WEEK_START;
  if (!SUPPORTED_WEEK_STARTS.includes(weekStartsOn)) {
    return failure(
      Errors.invalidParameterType('weekStartsOn must be one of the supported values', {
        weekStartsOn,
        supported: SUPPORTED_WEEK_STARTS,
      })
    );
  }

  const adjustmentsConfig = options?.adjustments ?? DEFAULT_ADJUSTMENT_CONFIG;
  const adjustmentsResult = validateHijriAdjustmentsConfig(adjustmentsConfig);
  if (!adjustmentsResult.success) {
    return failure(adjustmentsResult.error);
  }

  return success({
    method: methodResult.data,
    adjustments: adjustmentsResult.data,
    weekStartsOn,
  });
}

/**
 * Validates the adjustment configuration structure.
 */
export function validateHijriAdjustmentsConfig(
  config: HijriAdjustmentsConfig
): Result<HijriAdjustmentsConfig> {
  switch (config.mode) {
    case 'none':
      return success(config);
    case 'memory': {
      const dataResult = validateHijriAdjustments(config.data);
      if (!dataResult.success) {
        return failure(dataResult.error);
      }
      return success({ ...config, data: dataResult.data });
    }
    case 'json': {
      if (typeof config.filePath !== 'string' || config.filePath.trim().length === 0) {
        return failure(
          Errors.invalidParameterType('filePath must be a non-empty string for json mode', {
            filePath: config.filePath,
          })
        );
      }
      return success(config);
    }
    case 'provider': {
      if (typeof config.getAdjustments !== 'function') {
        return failure(
          Errors.invalidParameterType('getAdjustments must be a function for provider mode', {})
        );
      }
      return success(config);
    }
    default: {
      return failure(
        Errors.invalidParameterType('Unknown adjustments config mode', {
          mode: (config as { mode: unknown }).mode,
        })
      );
    }
  }
}
