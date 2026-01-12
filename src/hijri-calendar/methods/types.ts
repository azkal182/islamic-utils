/**
 * @fileoverview Hijri calendar calculation method contract.
 * @module hijri-calendar/methods/types
 */

import type { GregorianDate, HijriDate, HijriMethodId, HijriMonthIdentifier } from '../types';

export interface HijriCalculationMethod {
  readonly id: HijriMethodId;
  readonly name: string;
  readonly description: string;

  readonly supportedGregorianYears?: {
    readonly start: number;
    readonly end: number;
  };

  readonly supportedHijriYears?: {
    readonly start: number;
    readonly end: number;
  };

  /**
   * Converts a Gregorian date to Hijri.
   */
  convertGregorianToHijri(date: GregorianDate): HijriDate;

  /**
   * Converts a Hijri date to Gregorian.
   */
  convertHijriToGregorian(date: HijriDate): GregorianDate;

  /**
   * Returns the month length (29 or 30 days) for a given Hijri year/month.
   */
  getHijriMonthLength(identifier: HijriMonthIdentifier): 29 | 30;
}
