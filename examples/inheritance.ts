/**
 * @fileoverview Example usage of the Inheritance (Faraidh) module
 * @example npx ts-node examples/inheritance.ts
 */

import { computeInheritance, HeirType, getHeirArabicName } from '../src';

// ═══════════════════════════════════════════════════════════════════════════
// Example 1: Basic Case - Wife + Sons
// ═══════════════════════════════════════════════════════════════════════════

console.log('═══════════════════════════════════════════════════════════════');
console.log('Example 1: Basic Case - Wife + 2 Sons');
console.log('═══════════════════════════════════════════════════════════════\n');

const example1 = computeInheritance({
  estate: {
    grossValue: 1_000_000_000, // 1 Billion IDR
    debts: 50_000_000,
    funeralCosts: 10_000_000,
    wasiyyah: 100_000_000,
  },
  heirs: [
    { type: HeirType.WIFE, count: 1 },
    { type: HeirType.SON, count: 2 },
  ],
  deceased: { gender: 'male' },
});

if (example1.success) {
  console.log(`Gross Estate: Rp ${example1.data.meta.estate.grossValue.toLocaleString()}`);
  console.log(`Net Estate:   Rp ${example1.data.netEstate.toLocaleString()}\n`);

  console.log('Shares:');
  for (const share of example1.data.shares) {
    const arabicName = getHeirArabicName(share.heirType);
    console.log(`  ${share.heirType} (${arabicName}): Rp ${share.totalValue.toLocaleString()}`);
  }

  console.log(`\nAul Applied: ${example1.data.summary.aulApplied}`);
  console.log(`Radd Applied: ${example1.data.summary.raddApplied}`);
  console.log(`Verification: ${example1.data.verification.isValid ? '✓ Valid' : '✗ Invalid'}`);
}

// ═══════════════════════════════════════════════════════════════════════════
// Example 2: Complex Case with Parents
// ═══════════════════════════════════════════════════════════════════════════

console.log('\n═══════════════════════════════════════════════════════════════');
console.log('Example 2: Wife + Parents + Children');
console.log('═══════════════════════════════════════════════════════════════\n');

const example2 = computeInheritance({
  estate: {
    grossValue: 600_000_000,
  },
  heirs: [
    { type: HeirType.WIFE, count: 1 },
    { type: HeirType.FATHER, count: 1 },
    { type: HeirType.MOTHER, count: 1 },
    { type: HeirType.SON, count: 1 },
    { type: HeirType.DAUGHTER, count: 2 },
  ],
  deceased: { gender: 'male' },
});

if (example2.success) {
  console.log(`Net Estate: Rp ${example2.data.netEstate.toLocaleString()}\n`);

  console.log('Shares:');
  for (const share of example2.data.shares) {
    const formatted = `  ${share.heirType.padEnd(20)} ${share.category.padEnd(15)} Rp ${share.totalValue.toLocaleString()}`;
    console.log(formatted);
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// Example 3: Special Case - Umariyatayn
// ═══════════════════════════════════════════════════════════════════════════

console.log('\n═══════════════════════════════════════════════════════════════');
console.log('Example 3: Umariyatayn (العُمَرِيَّتَان) - Husband + Parents');
console.log('═══════════════════════════════════════════════════════════════\n');

const example3 = computeInheritance({
  estate: {
    grossValue: 600_000_000,
  },
  heirs: [
    { type: HeirType.HUSBAND, count: 1 },
    { type: HeirType.MOTHER, count: 1 },
    { type: HeirType.FATHER, count: 1 },
  ],
  deceased: { gender: 'female' },
});

if (example3.success) {
  console.log('Special Case:', example3.data.summary.specialCase ?? 'None');
  console.log(`\nNet Estate: Rp ${example3.data.netEstate.toLocaleString()}\n`);

  console.log('Shares (Mother gets 1/3 of remainder, not 1/3 of total):');
  for (const share of example3.data.shares) {
    const arabicName = getHeirArabicName(share.heirType);
    console.log(
      `  ${share.heirType} (${arabicName}): ${share.category} = Rp ${share.totalValue.toLocaleString()}`
    );
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// Example 4: Trace Mode for Debugging
// ═══════════════════════════════════════════════════════════════════════════

console.log('\n═══════════════════════════════════════════════════════════════');
console.log('Example 4: Trace Mode (detailed calculation steps)');
console.log('═══════════════════════════════════════════════════════════════\n');

const example4 = computeInheritance(
  {
    estate: { grossValue: 100_000_000 },
    heirs: [
      { type: HeirType.WIFE, count: 1 },
      { type: HeirType.SON, count: 1 },
    ],
    deceased: { gender: 'male' },
  },
  { includeTrace: true }
);

if (example4.success) {
  console.log('Trace Steps:');
  for (const step of example4.data.trace.slice(0, 10)) {
    console.log(
      `  [${step.phase}] ${step.description}${step.arabicTerm ? ` (${step.arabicTerm})` : ''}`
    );
  }
  console.log(`  ... (${example4.data.trace.length} total steps)`);
}

// ═══════════════════════════════════════════════════════════════════════════
// Example 5: Hijab (Blocking) Scenario
// ═══════════════════════════════════════════════════════════════════════════

console.log('\n═══════════════════════════════════════════════════════════════');
console.log('Example 5: Hijab - Son blocks siblings');
console.log('═══════════════════════════════════════════════════════════════\n');

const example5 = computeInheritance({
  estate: { grossValue: 500_000_000 },
  heirs: [
    { type: HeirType.SON, count: 1 },
    { type: HeirType.BROTHER_FULL, count: 1 },
    { type: HeirType.SISTER_FULL, count: 1 },
  ],
  deceased: { gender: 'male' },
});

if (example5.success) {
  console.log('Shares:');
  for (const share of example5.data.shares) {
    const status = share.isBlocked ? '(BLOCKED)' : '';
    console.log(
      `  ${share.heirType.padEnd(20)} Rp ${share.totalValue.toLocaleString().padStart(15)} ${status}`
    );
  }
}

console.log('\n═══════════════════════════════════════════════════════════════');
console.log('All examples completed successfully!');
console.log('═══════════════════════════════════════════════════════════════\n');
