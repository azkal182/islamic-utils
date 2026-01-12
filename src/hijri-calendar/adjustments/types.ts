import type { HijriMethodId, HijriMonthAdjustment, HijriMonthIdentifier } from '../types';

export interface ResolvedHijriMonthAdjustment {
  readonly method: HijriMethodId;
  readonly hijriYear: number;
  readonly hijriMonth: number;
  readonly shiftDays: number;
  readonly source: string;
  readonly issuedAt?: string;
  readonly revision?: number;
}

export interface AdjustmentResolution {
  readonly identifier: HijriMonthIdentifier;
  readonly adjustment?: ResolvedHijriMonthAdjustment;
}

export interface AdjustmentMeta {
  readonly isAdjusted: boolean;
  readonly shiftDays: number;
  readonly source?: string;
}

export type HijriMonthAdjustmentRecord = HijriMonthAdjustment;
