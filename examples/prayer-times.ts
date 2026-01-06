/**
 * @fileoverview Prayer Times Example
 *
 * Demonstrates how to use the Prayer Times module.
 *
 * Run: npx tsx examples/prayer-times.ts
 */

import {
  computePrayerTimes,
  CALCULATION_METHODS,
  AsrMadhhab,
  HighLatitudeRule,
  PrayerRoundingRule,
} from '../src';

// ═══════════════════════════════════════════════════════════════════════════
// Example 1: Basic Usage (Jakarta, Indonesia)
// ═══════════════════════════════════════════════════════════════════════════

console.log('='.repeat(60));
console.log('Example 1: Basic Usage - Jakarta, Indonesia');
console.log('='.repeat(60));

const jakartaResult = computePrayerTimes(
  { latitude: -6.2088, longitude: 106.8456 },
  { date: { year: 2026, month: 1, day: 6 }, timezone: 7 },
  { method: CALCULATION_METHODS.KEMENAG }
);

if (jakartaResult.success) {
  console.log('\nPrayer Times for Jakarta (Jan 6, 2026):');
  console.log(`  Imsak   : ${jakartaResult.data.formatted.imsak}`);
  console.log(`  Fajr    : ${jakartaResult.data.formatted.fajr}`);
  console.log(`  Sunrise : ${jakartaResult.data.formatted.sunrise}`);
  console.log(
    `  Dhuha   : ${jakartaResult.data.formatted.dhuha_start} - ${jakartaResult.data.formatted.dhuha_end}`
  );
  console.log(`  Dhuhr   : ${jakartaResult.data.formatted.dhuhr}`);
  console.log(`  Asr     : ${jakartaResult.data.formatted.asr}`);
  console.log(`  Maghrib : ${jakartaResult.data.formatted.maghrib}`);
  console.log(`  Isha    : ${jakartaResult.data.formatted.isha}`);
} else {
  console.error('Error:', jakartaResult.error.message);
}

// ═══════════════════════════════════════════════════════════════════════════
// Example 2: Different Calculation Methods
// ═══════════════════════════════════════════════════════════════════════════

console.log('\n' + '='.repeat(60));
console.log('Example 2: Comparing Calculation Methods - Makkah');
console.log('='.repeat(60));

const makkahLocation = { latitude: 21.4225, longitude: 39.8262 };
const date = { year: 2024, month: 6, day: 21 };
const timezone = 3;

const methods = ['MWL', 'MAKKAH', 'EGYPT'] as const;

for (const methodName of methods) {
  const method = CALCULATION_METHODS[methodName];
  const result = computePrayerTimes(makkahLocation, { date, timezone }, { method });

  if (result.success) {
    console.log(`\n${method.name}:`);
    console.log(`  Fajr: ${result.data.formatted.fajr}, Isha: ${result.data.formatted.isha}`);
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// Example 3: Hanafi vs Standard Asr
// ═══════════════════════════════════════════════════════════════════════════

console.log('\n' + '='.repeat(60));
console.log('Example 3: Asr Calculation - Standard vs Hanafi');
console.log('='.repeat(60));

const standardAsr = computePrayerTimes(
  { latitude: -6.2088, longitude: 106.8456 },
  { date: { year: 2024, month: 1, day: 15 }, timezone: 7 },
  { method: CALCULATION_METHODS.KEMENAG, asrMadhhab: AsrMadhhab.STANDARD }
);

const hanafiAsr = computePrayerTimes(
  { latitude: -6.2088, longitude: 106.8456 },
  { date: { year: 2024, month: 1, day: 15 }, timezone: 7 },
  { method: CALCULATION_METHODS.KEMENAG, asrMadhhab: AsrMadhhab.HANAFI }
);

if (standardAsr.success && hanafiAsr.success) {
  console.log(`\nStandard (Shafi'i) Asr: ${standardAsr.data.formatted.asr}`);
  console.log(`Hanafi Asr:             ${hanafiAsr.data.formatted.asr}`);
}

// ═══════════════════════════════════════════════════════════════════════════
// Example 4: High Latitude Location
// ═══════════════════════════════════════════════════════════════════════════

console.log('\n' + '='.repeat(60));
console.log('Example 4: High Latitude - London');
console.log('='.repeat(60));

const londonResult = computePrayerTimes(
  { latitude: 51.5074, longitude: -0.1278 },
  { date: { year: 2024, month: 6, day: 21 }, timezone: 1 }, // Summer solstice
  {
    method: CALCULATION_METHODS.MWL,
    highLatitudeRule: HighLatitudeRule.MIDDLE_OF_NIGHT,
  }
);

if (londonResult.success) {
  console.log('\nLondon Summer Solstice (with high latitude adjustment):');
  console.log(`  Fajr    : ${londonResult.data.formatted.fajr}`);
  console.log(`  Sunrise : ${londonResult.data.formatted.sunrise}`);
  console.log(`  Maghrib : ${londonResult.data.formatted.maghrib}`);
  console.log(`  Isha    : ${londonResult.data.formatted.isha}`);

  if (londonResult.data.meta.highLatitudeAdjusted) {
    console.log(
      `  [High latitude rule applied to: ${londonResult.data.meta.adjustedPrayers?.join(', ')}]`
    );
  }
} else {
  console.log('Could not calculate (extreme latitude)');
}

// ═══════════════════════════════════════════════════════════════════════════
// Example 5: Custom Adjustments
// ═══════════════════════════════════════════════════════════════════════════

console.log('\n' + '='.repeat(60));
console.log('Example 5: Custom Adjustments');
console.log('='.repeat(60));

const adjustedResult = computePrayerTimes(
  { latitude: -6.2088, longitude: 106.8456 },
  { date: { year: 2024, month: 1, day: 15 }, timezone: 7 },
  {
    method: CALCULATION_METHODS.KEMENAG,
    adjustments: {
      fajr: 2, // 2 minutes later
      maghrib: -1, // 1 minute earlier
    },
    safetyBuffer: 2, // 2-minute safety buffer
    roundingRule: PrayerRoundingRule.CEIL, // Always round up
  }
);

if (adjustedResult.success) {
  console.log('\nWith 2-min safety buffer and ceiling rounding:');
  console.log(`  Fajr (+2min adj): ${adjustedResult.data.formatted.fajr}`);
  console.log(`  Maghrib (-1min adj): ${adjustedResult.data.formatted.maghrib}`);
}

// ═══════════════════════════════════════════════════════════════════════════
// Example 6: With Trace (for debugging)
// ═══════════════════════════════════════════════════════════════════════════

console.log('\n' + '='.repeat(60));
console.log('Example 6: Trace Mode');
console.log('='.repeat(60));

const tracedResult = computePrayerTimes(
  { latitude: -6.2088, longitude: 106.8456 },
  { date: { year: 2024, month: 1, day: 15 }, timezone: 7 },
  { method: CALCULATION_METHODS.KEMENAG },
  { includeTrace: true }
);

if (tracedResult.success && tracedResult.data.trace) {
  console.log('\nCalculation Trace:');
  for (const step of tracedResult.data.trace) {
    console.log(`  Step ${step.step}: ${step.description}`);
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// Example 7: Monthly Prayer Times
// ═══════════════════════════════════════════════════════════════════════════

import { computeMonthlyPrayerTimes } from '../src';

console.log('\n' + '='.repeat(60));
console.log('Example 7: Monthly Prayer Times - Ramadan 2024');
console.log('='.repeat(60));

const monthlyResult = computeMonthlyPrayerTimes({
  year: 2024,
  month: 3, // March (Ramadan 2024)
  location: { latitude: -6.2088, longitude: 106.8456 },
  timezone: 7,
  params: { method: CALCULATION_METHODS.KEMENAG },
});

if (monthlyResult.success) {
  console.log(`\nPrayer times for ${monthlyResult.data.meta.daysInMonth} days of March 2024:`);
  console.log('');
  console.log('Day  | Imsak | Fajr  | Dhuhr | Asr   | Maghrib | Isha');
  console.log('-----|-------|-------|-------|-------|---------|------');

  // Show first 5 days and last 5 days
  for (const day of monthlyResult.data.days.slice(0, 5)) {
    console.log(
      `${String(day.day).padStart(3)}  | ${day.formatted.imsak} | ${day.formatted.fajr}  | ${day.formatted.dhuhr} | ${day.formatted.asr}  | ${day.formatted.maghrib}   | ${day.formatted.isha}`
    );
  }
  console.log('...  |  ...  |  ...  |  ...  |  ...  |   ...   |  ...');
  for (const day of monthlyResult.data.days.slice(-3)) {
    console.log(
      `${String(day.day).padStart(3)}  | ${day.formatted.imsak} | ${day.formatted.fajr}  | ${day.formatted.dhuhr} | ${day.formatted.asr}  | ${day.formatted.maghrib}   | ${day.formatted.isha}`
    );
  }

  console.log(
    `\nMeta: ${monthlyResult.data.meta.method.name} method, ${monthlyResult.data.meta.daysInMonth} days`
  );
} else {
  console.error('Error:', monthlyResult.error.message);
}

console.log('\n' + '='.repeat(60));
console.log('Done!');
console.log('='.repeat(60));

// ═══════════════════════════════════════════════════════════════════════════
// Example 8: Next Prayer Time
// ═══════════════════════════════════════════════════════════════════════════

import { getNextPrayer, getCurrentPrayer, formatMinutesUntil } from '../src';

console.log('\n' + '='.repeat(60));
console.log('Example 8: Next Prayer Time');
console.log('='.repeat(60));

// First, get today's prayer times
const todayResult = computePrayerTimes(
  { latitude: -6.2088, longitude: 106.8456 },
  { date: { year: 2026, month: 1, day: 6 }, timezone: 'Asia/Jakarta' },
  { method: CALCULATION_METHODS.KEMENAG }
);

if (todayResult.success) {
  // Get next prayer based on current time
  const now = new Date();
  const next = getNextPrayer(now, todayResult.data, 'Asia/Jakarta');
  const current = getCurrentPrayer(now, todayResult.data, 'Asia/Jakarta');

  console.log(`\nCurrent time: ${now.toLocaleTimeString('id-ID', { timeZone: 'Asia/Jakarta' })}`);

  if (current.current) {
    console.log(`Current period: ${current.current.toUpperCase()}`);
  }

  console.log(`\nNext prayer: ${next.name.toUpperCase()}`);
  console.log(`  Time: ${next.time}`);
  console.log(`  In: ${formatMinutesUntil(next.minutesUntil)}`);

  if (next.isNextDay) {
    console.log('  (Tomorrow)');
  }
}

console.log('\n' + '='.repeat(60));
console.log('All Examples Complete!');
console.log('='.repeat(60));
