import type { HijriMonthAdjustment, HijriMonthIdentifier } from '../types';
import type { AdjustmentResolution, ResolvedHijriMonthAdjustment } from './types';

function parseIssuedAtMillis(value: string | undefined): number {
  if (!value) return 0;
  const t = Date.parse(value);
  return Number.isFinite(t) ? t : 0;
}

export function resolveHijriMonthAdjustments(
  identifier: HijriMonthIdentifier,
  adjustments: readonly HijriMonthAdjustment[]
): AdjustmentResolution {
  const matches = adjustments.filter(
    (a) => a.hijriYear === identifier.year && a.hijriMonth === identifier.month
  );

  if (matches.length === 0) {
    return { identifier };
  }

  let best: HijriMonthAdjustment = matches[0]!;

  for (let i = 1; i < matches.length; i += 1) {
    const candidate = matches[i]!;
    const bestRevision = best.revision ?? 0;
    const candidateRevision = candidate.revision ?? 0;

    if (candidateRevision > bestRevision) {
      best = candidate;
      continue;
    }

    if (candidateRevision < bestRevision) {
      continue;
    }

    const bestIssuedAt = parseIssuedAtMillis(best.issuedAt);
    const candidateIssuedAt = parseIssuedAtMillis(candidate.issuedAt);

    if (candidateIssuedAt > bestIssuedAt) {
      best = candidate;
      continue;
    }

    if (candidateIssuedAt < bestIssuedAt) {
      continue;
    }

    best = candidate;
  }

  const resolved: ResolvedHijriMonthAdjustment = {
    method: best.method,
    hijriYear: best.hijriYear,
    hijriMonth: best.hijriMonth,
    shiftDays: best.shiftDays,
    source: best.source,
    issuedAt: best.issuedAt,
    revision: best.revision,
  };

  return { identifier, adjustment: resolved };
}
