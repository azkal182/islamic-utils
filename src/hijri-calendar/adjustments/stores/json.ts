import type { Result } from '../../../core/types/result';
import { failure, success } from '../../../core/types/result';
import { Errors } from '../../../core/errors';
import fs from 'node:fs';
import type { HijriAdjustmentsConfig, HijriMethodId, HijriMonthAdjustment } from '../../types';
import { validateHijriAdjustments } from '../../utils/validators';

interface HijriAdjustmentsJsonFile {
  readonly adjustments: readonly HijriMonthAdjustment[];
}

const cache = new Map<string, readonly HijriMonthAdjustment[]>();

function readJsonFile(filePath: string): unknown {
  const raw = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(raw) as unknown;
}

export function loadAdjustmentsFromJson(
  config: Extract<HijriAdjustmentsConfig, { mode: 'json' }>,
  hijriYear: number,
  method: HijriMethodId
): Result<readonly HijriMonthAdjustment[]> {
  const cacheKey = config.filePath;
  const cached = cache.get(cacheKey);

  let all: readonly HijriMonthAdjustment[];

  if (cached) {
    all = cached;
  } else {
    try {
      const parsed = readJsonFile(config.filePath) as Partial<HijriAdjustmentsJsonFile>;
      const list = Array.isArray(parsed.adjustments) ? parsed.adjustments : [];

      const validated = validateHijriAdjustments(list);
      if (!validated.success) {
        return failure(validated.error);
      }

      all = validated.data;
      cache.set(cacheKey, all);
    } catch (err) {
      return failure(
        Errors.invalidAdjustment('Failed to load Hijri adjustments from JSON file', {
          filePath: config.filePath,
          cause: err instanceof Error ? err.message : String(err),
        })
      );
    }
  }

  return success(all.filter((a) => a.hijriYear === hijriYear && a.method === method));
}
