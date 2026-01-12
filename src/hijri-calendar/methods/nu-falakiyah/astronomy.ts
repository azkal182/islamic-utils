import { ASTRONOMICAL } from '../../../core/constants/astronomical';
import { wrap } from '../../../core/utils/math';
import {
  acosDeg,
  asinDeg,
  atan2Deg,
  cosDeg as cosD,
  sinDeg as sinD,
  tanDeg,
  toDegrees,
} from '../../../core/utils/trigonometry';
import {
  dateToJulianDay,
  julianCentury,
  obliquityCorrection,
  sunApparentLongitude,
} from '../../../astronomy/solar';

export interface EquatorialCoords {
  readonly ra: number;
  readonly dec: number;
}

export interface LunarPosition {
  readonly ra: number;
  readonly dec: number;
  readonly distanceKm: number;
}

export function gregorianDateToJulianDayUtc(date: { year: number; month: number; day: number }): number {
  return dateToJulianDay(date.year, date.month, date.day);
}

export function julianDayUtcToSiderealDeg(jd: number): number {
  const T = (jd - ASTRONOMICAL.J2000_EPOCH) / ASTRONOMICAL.JULIAN_CENTURY;
  const theta =
    280.46061837 +
    360.98564736629 * (jd - ASTRONOMICAL.J2000_EPOCH) +
    0.000387933 * T * T -
    (T * T * T) / 38710000;
  return wrap(theta, 0, 360);
}

export function eclipticToEquatorial(lambda: number, beta: number, epsilon: number): EquatorialCoords {
  const sinLambda = sinD(lambda);
  const cosLambda = cosD(lambda);
  const sinBeta = sinD(beta);
  const cosBeta = cosD(beta);
  const sinEps = sinD(epsilon);
  const cosEps = cosD(epsilon);

  const x = cosBeta * cosLambda;
  const y = cosBeta * sinLambda * cosEps - sinBeta * sinEps;
  const z = cosBeta * sinLambda * sinEps + sinBeta * cosEps;

  const ra = wrap(atan2Deg(y, x), 0, 360);
  const dec = asinDeg(z);

  return { ra, dec };
}

export function sunEquatorialPosition(jd: number): EquatorialCoords {
  const T = julianCentury(jd);
  const lambda = sunApparentLongitude(T);
  const epsilon = obliquityCorrection(T);
  return eclipticToEquatorial(lambda, 0, epsilon);
}

function moonMeanLongitude(T: number): number {
  return wrap(218.3164477 + 481267.88123421 * T - 0.0015786 * T * T + (T * T * T) / 538841 - (T * T * T * T) / 65194000, 0, 360);
}

function moonMeanElongation(T: number): number {
  return wrap(297.8501921 + 445267.1114034 * T - 0.0018819 * T * T + (T * T * T) / 545868 - (T * T * T * T) / 113065000, 0, 360);
}

function moonMeanAnomaly(T: number): number {
  return wrap(134.9633964 + 477198.8675055 * T + 0.0087414 * T * T + (T * T * T) / 69699 - (T * T * T * T) / 14712000, 0, 360);
}

function moonArgumentOfLatitude(T: number): number {
  return wrap(93.272095 + 483202.0175233 * T - 0.0036539 * T * T - (T * T * T) / 3526000 + (T * T * T * T) / 863310000, 0, 360);
}

export function moonGeocentricPosition(jd: number): LunarPosition {
  const T = julianCentury(jd);

  const Lp = moonMeanLongitude(T);
  const D = moonMeanElongation(T);
  const Mp = moonMeanAnomaly(T);
  const F = moonArgumentOfLatitude(T);

  const E = 1 - 0.002516 * T - 0.0000074 * T * T;

  const lon =
    Lp +
    6.289 * sinD(Mp) +
    1.274 * sinD(2 * D - Mp) +
    0.658 * sinD(2 * D) +
    0.214 * sinD(2 * Mp) +
    0.11 * sinD(D);

  const lat =
    5.128 * sinD(F) +
    0.28 * sinD(Mp + F) +
    0.277 * sinD(Mp - F) +
    0.173 * sinD(2 * D - F) +
    0.055 * sinD(2 * D - Mp + F) +
    0.046 * sinD(2 * D - Mp - F) +
    0.033 * sinD(2 * D + F) +
    0.017 * sinD(2 * Mp + F);

  const distanceKm =
    385000.56 -
    20905.355 * cosD(Mp) -
    3699.111 * cosD(2 * D - Mp) -
    2955.968 * cosD(2 * D) -
    569.925 * cosD(2 * Mp);

  void E;

  const epsilon = obliquityCorrection(T);
  const eq = eclipticToEquatorial(wrap(lon, 0, 360), lat, epsilon);

  return { ra: eq.ra, dec: eq.dec, distanceKm };
}

export function angularSeparationDeg(a: EquatorialCoords, b: EquatorialCoords): number {
  const cosSep =
    sinD(a.dec) * sinD(b.dec) +
    cosD(a.dec) * cosD(b.dec) * cosD(wrap(a.ra - b.ra, -180, 180));
  return acosDeg(cosSep);
}

export function topocentricAltitudeDeg(
  raDeg: number,
  decDeg: number,
  jd: number,
  latitudeDeg: number,
  longitudeDeg: number
): number {
  const gst = julianDayUtcToSiderealDeg(jd);
  const lst = wrap(gst + longitudeDeg, 0, 360);
  const ha = wrap(lst - raDeg, -180, 180);

  const sinAlt = sinD(latitudeDeg) * sinD(decDeg) + cosD(latitudeDeg) * cosD(decDeg) * cosD(ha);
  return asinDeg(sinAlt);
}

export function approximateMoonParallaxDeg(distanceKm: number): number {
  const earthRadiusKm = 6378.14;
  const ratio = earthRadiusKm / distanceKm;
  const clamped = Math.max(-1, Math.min(1, ratio));
  return toDegrees(Math.asin(clamped));
}

export function applyApproximateParallaxToAltitude(altitudeDeg: number, parallaxDeg: number): number {
  return altitudeDeg - parallaxDeg * cosD(altitudeDeg);
}

export function refractionCorrectionDeg(altitudeDeg: number): number {
  if (altitudeDeg < -1 || altitudeDeg > 90) return 0;
  const R = 1.02 / tanDeg(altitudeDeg + 10.3 / (altitudeDeg + 5.11));
  return R / 60;
}

export interface IrnuCheckResult {
  readonly sunsetJd: number;
  readonly moonAltitudeMariDeg: number;
  readonly moonElongationHaqiqyDeg: number;
}

export function computeIrnuAtSunset(
  date: { year: number; month: number; day: number },
  sunsetLocalHours: number,
  timezone: number,
  latitudeDeg: number,
  longitudeDeg: number
): IrnuCheckResult {
  const jd0 = gregorianDateToJulianDayUtc(date);
  const sunsetJd = jd0 + (sunsetLocalHours - timezone) / 24;

  const sunEq = sunEquatorialPosition(sunsetJd);
  const moon = moonGeocentricPosition(sunsetJd);

  const elongation = angularSeparationDeg(sunEq, { ra: moon.ra, dec: moon.dec });

  const altitudeGeo = topocentricAltitudeDeg(moon.ra, moon.dec, sunsetJd, latitudeDeg, longitudeDeg);
  const parallax = approximateMoonParallaxDeg(moon.distanceKm);
  const altitudeTopo = applyApproximateParallaxToAltitude(altitudeGeo, parallax);
  const altitudeMari = altitudeTopo + refractionCorrectionDeg(altitudeTopo);

  return {
    sunsetJd,
    moonAltitudeMariDeg: altitudeMari,
    moonElongationHaqiqyDeg: elongation,
  };
}
