/**
 * @fileoverview Unit tests for solar calculations
 */

import { describe, it, expect } from 'vitest';
import {
  dateToJulianDay,
  julianCentury,
  solarDeclination,
  equationOfTime,
  hourAngle,
  solarNoon,
} from '../../../src/astronomy/solar';

describe('dateToJulianDay', () => {
  it('should calculate J2000.0 epoch correctly', () => {
    // January 1, 2000, at noon = JD 2451545.0
    const jd = dateToJulianDay(2000, 1, 1.5);
    expect(jd).toBeCloseTo(2451545.0, 5);
  });

  it('should calculate Julian Day for known dates', () => {
    // March 15, 2024 at midnight
    const jd = dateToJulianDay(2024, 3, 15);
    expect(jd).toBeCloseTo(2460384.5, 1);
  });

  it('should handle January and February adjustment', () => {
    // January 1, 2024
    const jan = dateToJulianDay(2024, 1, 1);
    // February 1, 2024
    const feb = dateToJulianDay(2024, 2, 1);

    expect(feb - jan).toBe(31); // 31 days apart
  });
});

describe('julianCentury', () => {
  it('should return 0 for J2000.0 epoch', () => {
    const T = julianCentury(2451545.0);
    expect(T).toBeCloseTo(0, 10);
  });

  it('should return 1 for 100 years after J2000.0', () => {
    const T = julianCentury(2451545.0 + 36525);
    expect(T).toBeCloseTo(1.0, 10);
  });
});

describe('solarDeclination', () => {
  it('should be near +23.4° at summer solstice', () => {
    // Around June 21, 2024
    const jd = dateToJulianDay(2024, 6, 21);
    const T = julianCentury(jd);
    const decl = solarDeclination(T);

    expect(decl).toBeGreaterThan(23);
    expect(decl).toBeLessThan(24);
  });

  it('should be near -23.4° at winter solstice', () => {
    // Around December 21, 2024
    const jd = dateToJulianDay(2024, 12, 21);
    const T = julianCentury(jd);
    const decl = solarDeclination(T);

    expect(decl).toBeLessThan(-23);
    expect(decl).toBeGreaterThan(-24);
  });

  it('should be near 0° at equinox', () => {
    // Around March 20, 2024
    const jd = dateToJulianDay(2024, 3, 20);
    const T = julianCentury(jd);
    const decl = solarDeclination(T);

    expect(Math.abs(decl)).toBeLessThan(1);
  });
});

describe('equationOfTime', () => {
  it('should return value in reasonable range', () => {
    const jd = dateToJulianDay(2024, 1, 15);
    const T = julianCentury(jd);
    const eot = equationOfTime(T);

    // EoT ranges from about -14 to +16 minutes
    expect(eot).toBeGreaterThan(-15);
    expect(eot).toBeLessThan(17);
  });

  it('should be near 0 around April 15 and September 1', () => {
    // April 15 is approximately when EoT crosses zero
    const jd = dateToJulianDay(2024, 4, 15);
    const T = julianCentury(jd);
    const eot = equationOfTime(T);

    expect(Math.abs(eot)).toBeLessThan(2);
  });
});

describe('hourAngle', () => {
  it('should return valid hour angle for equatorial location', () => {
    // At equator, hour angle should always exist
    const ha = hourAngle(0, 0, -0.833); // Sunrise angle
    expect(ha).not.toBeNull();
    expect(ha).toBeGreaterThan(0);
  });

  it('should return null for polar day', () => {
    // At high latitude in summer with high declination
    // Sun never sets
    const ha = hourAngle(70, 23.4, -0.833);
    expect(ha).toBeNull();
  });

  it('should return ~90° for equator at equinox', () => {
    // At equator with 0 declination, sunrise is at approximately 90° from noon
    // The -0.833° angle accounts for refraction, so it won't be exactly 90°
    const ha = hourAngle(0, 0, -0.833);
    expect(ha).not.toBeNull();
    expect(ha).toBeGreaterThan(89);
    expect(ha).toBeLessThan(91);
  });
});

describe('solarNoon', () => {
  it('should be around 12:00 at prime meridian with UTC', () => {
    const jd = dateToJulianDay(2024, 1, 15);
    const noon = solarNoon(0, 0, jd);

    // Should be within 15 minutes of 12:00
    expect(noon).toBeGreaterThan(11.75);
    expect(noon).toBeLessThan(12.25);
  });

  it('should adjust for longitude and timezone', () => {
    // Jakarta: longitude ~107°, timezone UTC+7
    const jd = dateToJulianDay(2024, 1, 15);
    const noon = solarNoon(106.8456, 7, jd);

    // Solar noon in Jakarta should be around 11:50-12:10
    expect(noon).toBeGreaterThan(11.5);
    expect(noon).toBeLessThan(12.5);
  });
});
