/**
 * @fileoverview Performance benchmarks for Inheritance (Faraidh) module
 * @description Run with: pnpm bench
 */

import { describe, bench } from 'vitest';
import { computeInheritance, HeirType } from '../src';

describe('Inheritance Benchmarks', () => {
  bench('simple case: wife + sons', () => {
    computeInheritance({
      estate: { grossValue: 1_000_000_000 },
      heirs: [
        { type: HeirType.WIFE, count: 1 },
        { type: HeirType.SON, count: 2 },
      ],
      deceased: { gender: 'male' },
    });
  });

  bench('complex case: all heir types', () => {
    computeInheritance({
      estate: {
        grossValue: 1_000_000_000,
        debts: 50_000_000,
        funeralCosts: 10_000_000,
        wasiyyah: 100_000_000,
      },
      heirs: [
        { type: HeirType.WIFE, count: 1 },
        { type: HeirType.FATHER, count: 1 },
        { type: HeirType.MOTHER, count: 1 },
        { type: HeirType.SON, count: 2 },
        { type: HeirType.DAUGHTER, count: 3 },
      ],
      deceased: { gender: 'male' },
    });
  });

  bench('aul case', () => {
    computeInheritance({
      estate: { grossValue: 1_000_000 },
      heirs: [
        { type: HeirType.HUSBAND, count: 1 },
        { type: HeirType.MOTHER, count: 1 },
        { type: HeirType.SISTER_FULL, count: 2 },
      ],
      deceased: { gender: 'female' },
    });
  });

  bench('batch: 100 calculations', () => {
    for (let i = 0; i < 100; i++) {
      computeInheritance({
        estate: { grossValue: 1_000_000 * (i + 1) },
        heirs: [
          { type: HeirType.WIFE, count: 1 },
          { type: HeirType.SON, count: (i % 5) + 1 },
        ],
        deceased: { gender: 'male' },
      });
    }
  });
});
