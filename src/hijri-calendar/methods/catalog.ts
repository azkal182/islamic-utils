/**
 * @fileoverview Built-in Hijri calendar calculation methods and registry.
 * @module hijri-calendar/methods/catalog
 */

import type { HijriMethodId } from '../types';
import type { HijriCalculationMethod } from './types';
import { UMMUL_QURA_METHOD } from './ummul-qura';
import { NU_FALAKIYAH_METHOD } from './nu-falakiyah';

export const UMMUL_QURA = UMMUL_QURA_METHOD;
export const NU_FALAKIYAH = NU_FALAKIYAH_METHOD;

export const HIJRI_METHOD_CATALOG: Record<HijriMethodId, HijriCalculationMethod> = {
  ummul_qura: UMMUL_QURA_METHOD,
  nu_falakiyah: NU_FALAKIYAH_METHOD,
};

const customMethods = new Map<string, HijriCalculationMethod>();

export type HijriMethodKey = HijriMethodId | string;

export function registerMethod(key: string, method: HijriCalculationMethod): void {
  customMethods.set(key, method);
}

export function unregisterMethod(key: string): boolean {
  return customMethods.delete(key);
}

export function clearCustomMethods(): void {
  customMethods.clear();
}

export function getMethod(key: HijriMethodKey): HijriCalculationMethod | undefined {
  const builtIn = (HIJRI_METHOD_CATALOG as Record<string, HijriCalculationMethod | undefined>)[key];
  if (builtIn) return builtIn;
  return customMethods.get(key);
}

export function listMethodKeys(): string[] {
  const keys = new Set<string>(Object.keys(HIJRI_METHOD_CATALOG));
  for (const key of customMethods.keys()) {
    keys.add(key);
  }
  return Array.from(keys);
}
