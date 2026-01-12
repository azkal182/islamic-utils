import type { Result } from '../../core/types/result';
import { failure, success } from '../../core/types/result';
import { Errors } from '../../core/errors';
import type { HijriAdjustmentsConfig, HijriMethodId, HijriMonthAdjustment } from '../types';

import { loadAdjustmentsFromMemory } from './stores/memory';
import { loadAdjustmentsFromJson } from './stores/json';
import { loadAdjustmentsFromProvider } from './stores/provider';

export function loadHijriAdjustmentsForYear(
  config: HijriAdjustmentsConfig,
  hijriYear: number,
  method: HijriMethodId
): Result<readonly HijriMonthAdjustment[]> {
  switch (config.mode) {
    case 'none':
      return success([]);
    case 'memory':
      return loadAdjustmentsFromMemory(config, hijriYear, method);
    case 'json':
      return loadAdjustmentsFromJson(config, hijriYear, method);
    case 'provider':
      return loadAdjustmentsFromProvider(config, hijriYear, method);
    default:
      return failure(
        Errors.invalidParameterType('Unknown adjustments config mode', {
          mode: (config as { mode: unknown }).mode,
        })
      );
  }
}
