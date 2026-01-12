import type { Result } from '../../../core/types/result';
import { failure, success } from '../../../core/types/result';
import { Errors } from '../../../core/errors';
import type { HijriAdjustmentsConfig, HijriMethodId, HijriMonthAdjustment } from '../../types';
import { validateHijriAdjustments } from '../../utils/validators';

const cache = new Map<string, readonly HijriMonthAdjustment[]>();

export function loadAdjustmentsFromProvider(
  config: Extract<HijriAdjustmentsConfig, { mode: 'provider' }>,
  hijriYear: number,
  method: HijriMethodId
): Result<readonly HijriMonthAdjustment[]> {
  const cacheKey = `${method}-${hijriYear}`;
  const cached = cache.get(cacheKey);
  if (cached) {
    return success(cached);
  }

  const result = config.getAdjustments(hijriYear, method);
  if (result && typeof (result as Promise<unknown>).then === 'function') {
    return failure(
      Errors.invalidAdjustment('Async adjustment provider is not supported by synchronous APIs', {
        method,
        hijriYear,
      })
    );
  }

  const list = (result ?? []) as readonly HijriMonthAdjustment[];
  const validated = validateHijriAdjustments(list);
  if (!validated.success) {
    return failure(validated.error);
  }

  cache.set(cacheKey, validated.data);
  return success(validated.data);
}
