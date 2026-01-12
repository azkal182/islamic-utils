/**
 * @fileoverview Ummul Qura Hijri calendar method implementation.
 * @module hijri-calendar/methods/ummul-qura
 */

import type { HijriCalculationMethod } from '../types';
import {
  ummulQuraConvertGregorianToHijri,
  ummulQuraConvertHijriToGregorian,
  ummulQuraGetHijriMonthLength,
} from './lookup';
import { HIJRI_METHODS } from '../../constants';

export const UMMUL_QURA_METHOD: HijriCalculationMethod = {
  id: 'ummul_qura',
  name: HIJRI_METHODS.ummul_qura.name,
  description: HIJRI_METHODS.ummul_qura.description,
  supportedGregorianYears: HIJRI_METHODS.ummul_qura.supportedGregorianYears,
  supportedHijriYears: HIJRI_METHODS.ummul_qura.supportedHijriYears,
  convertGregorianToHijri: ummulQuraConvertGregorianToHijri,
  convertHijriToGregorian: ummulQuraConvertHijriToGregorian,
  getHijriMonthLength: ummulQuraGetHijriMonthLength,
};
