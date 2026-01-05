/**
 * @fileoverview Performance benchmarks for Qibla Direction module
 *
 * Run: pnpm run bench
 */

import { bench, describe } from 'vitest';
import {
  computeQiblaDirection,
  calculateInitialBearing,
  calculateGreatCircleDistance,
  KAABA_COORDINATES,
} from '../src';

// Test locations
const JAKARTA = { latitude: -6.2088, longitude: 106.8456 };
const LONDON = { latitude: 51.5074, longitude: -0.1278 };

describe('Qibla Direction Performance', () => {
  bench('computeQiblaDirection - basic', () => {
    computeQiblaDirection({ coordinates: JAKARTA });
  });

  bench('computeQiblaDirection - with distance', () => {
    computeQiblaDirection({ coordinates: JAKARTA }, { includeDistance: true });
  });

  bench('computeQiblaDirection - with trace', () => {
    computeQiblaDirection({ coordinates: JAKARTA }, { includeTrace: true });
  });

  bench('computeQiblaDirection - with all options', () => {
    computeQiblaDirection({ coordinates: JAKARTA }, { includeDistance: true, includeTrace: true });
  });

  bench('calculateInitialBearing', () => {
    calculateInitialBearing(JAKARTA, KAABA_COORDINATES);
  });

  bench('calculateGreatCircleDistance', () => {
    calculateGreatCircleDistance(JAKARTA, KAABA_COORDINATES);
  });

  bench('100 different locations', () => {
    for (let i = 0; i < 100; i++) {
      const lat = Math.random() * 180 - 90;
      const lng = Math.random() * 360 - 180;
      computeQiblaDirection({ coordinates: { latitude: lat, longitude: lng } });
    }
  });

  bench('compare bearing from 10 cities', () => {
    const cities = [
      JAKARTA,
      LONDON,
      { latitude: 40.7128, longitude: -74.006 }, // New York
      { latitude: 35.6762, longitude: 139.6503 }, // Tokyo
      { latitude: -33.8688, longitude: 151.2093 }, // Sydney
      { latitude: 30.0444, longitude: 31.2357 }, // Cairo
      { latitude: 25.2048, longitude: 55.2708 }, // Dubai
      { latitude: 3.139, longitude: 101.6869 }, // Kuala Lumpur
      { latitude: 55.7558, longitude: 37.6173 }, // Moscow
      { latitude: -22.9068, longitude: -43.1729 }, // Rio
    ];

    for (const city of cities) {
      computeQiblaDirection({ coordinates: city });
    }
  });
});
