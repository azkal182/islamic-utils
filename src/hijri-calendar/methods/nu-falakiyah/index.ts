/**
 * @fileoverview NU Falakiyah Hijri calendar method implementation.
 * @module hijri-calendar/methods/nu-falakiyah
 */

import type { HijriCalculationMethod } from '../types';
import {
  nuFalakiyahConvertGregorianToHijri,
  nuFalakiyahConvertHijriToGregorian,
  nuFalakiyahGetHijriMonthLength,
} from './engine';
import { HIJRI_METHODS } from '../../constants';

export const NU_FALAKIYAH_METHOD: HijriCalculationMethod = {
  id: 'nu_falakiyah',
  name: HIJRI_METHODS.nu_falakiyah.name,
  description: HIJRI_METHODS.nu_falakiyah.description,
  supportedGregorianYears: HIJRI_METHODS.nu_falakiyah.supportedGregorianYears,
  supportedHijriYears: HIJRI_METHODS.nu_falakiyah.supportedHijriYears,
  convertGregorianToHijri: nuFalakiyahConvertGregorianToHijri,
  convertHijriToGregorian: nuFalakiyahConvertHijriToGregorian,
  getHijriMonthLength: nuFalakiyahGetHijriMonthLength,
};
