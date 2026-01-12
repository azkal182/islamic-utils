import type { Result } from '../../../core/types/result';
import { success } from '../../../core/types/result';
import type { HijriAdjustmentsConfig, HijriMethodId, HijriMonthAdjustment } from '../../types';

export function loadAdjustmentsFromMemory(
  config: Extract<HijriAdjustmentsConfig, { mode: 'memory' }>,
  hijriYear: number,
  method: HijriMethodId
): Result<readonly HijriMonthAdjustment[]> {
  const items = config.data.filter((a) => a.hijriYear === hijriYear && a.method === method);
  return success(items);
}
