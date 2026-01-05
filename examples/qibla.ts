/**
 * @fileoverview Qibla Direction Example
 *
 * Demonstrates how to use the Qibla Direction module.
 *
 * Run: pnpm run example:qibla
 */

import {
  computeQiblaDirection,
  CompassDirection,
  calculateGreatCircleDistance,
  KAABA_COORDINATES,
} from '../src';

// ═══════════════════════════════════════════════════════════════════════════
// Example 1: Basic Usage
// ═══════════════════════════════════════════════════════════════════════════

console.log('='.repeat(60));
console.log('Example 1: Basic Usage - Jakarta, Indonesia');
console.log('='.repeat(60));

const jakartaResult = computeQiblaDirection({
  coordinates: { latitude: -6.2088, longitude: 106.8456 },
});

if (jakartaResult.success) {
  console.log(`\nQibla Direction: ${jakartaResult.data.bearing}°`);
  console.log(`Compass: ${jakartaResult.data.compassDirection}`);
  console.log(`Face approximately ${jakartaResult.data.compassDirection} (West-Northwest)`);
}

// ═══════════════════════════════════════════════════════════════════════════
// Example 2: Multiple Cities
// ═══════════════════════════════════════════════════════════════════════════

console.log('\n' + '='.repeat(60));
console.log('Example 2: Qibla Direction from Various Cities');
console.log('='.repeat(60));

const cities = [
  { name: 'Jakarta, Indonesia', lat: -6.2088, lng: 106.8456 },
  { name: 'London, UK', lat: 51.5074, lng: -0.1278 },
  { name: 'New York, USA', lat: 40.7128, lng: -74.006 },
  { name: 'Tokyo, Japan', lat: 35.6762, lng: 139.6503 },
  { name: 'Sydney, Australia', lat: -33.8688, lng: 151.2093 },
  { name: 'Cape Town, South Africa', lat: -33.9249, lng: 18.4241 },
];

console.log('\nCity                      | Bearing  | Direction');
console.log('-'.repeat(50));

for (const city of cities) {
  const result = computeQiblaDirection({
    coordinates: { latitude: city.lat, longitude: city.lng },
  });

  if (result.success) {
    const name = city.name.padEnd(25);
    const bearing = (result.data.bearing.toFixed(2) + '°').padEnd(9);
    console.log(`${name}| ${bearing}| ${result.data.compassDirection}`);
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// Example 3: With Distance
// ═══════════════════════════════════════════════════════════════════════════

console.log('\n' + '='.repeat(60));
console.log('Example 3: Distance to Makkah');
console.log('='.repeat(60));

const resultWithDistance = computeQiblaDirection(
  { coordinates: { latitude: -6.2088, longitude: 106.8456 } },
  { includeDistance: true }
);

if (resultWithDistance.success) {
  console.log(`\nFrom Jakarta to Makkah:`);
  console.log(`  Distance: ${resultWithDistance.data.meta.distance} km`);
  console.log(
    `  Direction: ${resultWithDistance.data.bearing}° (${resultWithDistance.data.compassDirection})`
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// Example 4: With Trace
// ═══════════════════════════════════════════════════════════════════════════

console.log('\n' + '='.repeat(60));
console.log('Example 4: Trace Mode');
console.log('='.repeat(60));

const resultWithTrace = computeQiblaDirection(
  { coordinates: { latitude: 51.5074, longitude: -0.1278 } },
  { includeTrace: true, includeDistance: true }
);

if (resultWithTrace.success && resultWithTrace.data.trace) {
  console.log('\nCalculation Trace:');
  for (const step of resultWithTrace.data.trace) {
    console.log(`  Step ${step.step}: ${step.description}`);
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// Example 5: Edge Case - At Ka'bah
// ═══════════════════════════════════════════════════════════════════════════

console.log('\n' + '='.repeat(60));
console.log("Example 5: At Ka'bah");
console.log('='.repeat(60));

const atKaabaResult = computeQiblaDirection({
  coordinates: KAABA_COORDINATES,
});

if (atKaabaResult.success) {
  console.log(`\nLocation: Ka'bah (${KAABA_COORDINATES.latitude}, ${KAABA_COORDINATES.longitude})`);
  console.log(`At Ka'bah: ${atKaabaResult.data.meta.atKaaba}`);
  if (atKaabaResult.data.meta.note) {
    console.log(`Note: ${atKaabaResult.data.meta.note}`);
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// Example 6: Compass Direction Conversion
// ═══════════════════════════════════════════════════════════════════════════

console.log('\n' + '='.repeat(60));
console.log('Example 6: Understanding Compass Directions');
console.log('='.repeat(60));

console.log('\n16-Point Compass Rose:');
console.log('  N  = 0°    (North)');
console.log('  NNE = 22.5°');
console.log('  NE = 45°   (Northeast)');
console.log('  ENE = 67.5°');
console.log('  E  = 90°   (East)');
console.log('  ESE = 112.5°');
console.log('  SE = 135°  (Southeast)');
console.log('  SSE = 157.5°');
console.log('  S  = 180°  (South)');
console.log('  SSW = 202.5°');
console.log('  SW = 225°  (Southwest)');
console.log('  WSW = 247.5°');
console.log('  W  = 270°  (West)');
console.log('  WNW = 292.5°');
console.log('  NW = 315°  (Northwest)');
console.log('  NNW = 337.5°');

console.log('\n' + '='.repeat(60));
console.log('Done!');
console.log('='.repeat(60));
