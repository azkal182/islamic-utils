import type { GregorianDate, HijriDate, HijriMonthIdentifier } from '../../types';
import {
  convertGregorianToHijri,
  convertHijriToGregorian,
  gregorianToJulianDay,
  julianDayToGregorian,
} from '../../core/conversion';
import { timeForSunAngle, dateToJulianDay } from '../../../astronomy/solar';

import { computeIrnuAtSunset } from './astronomy';

const MARKAZ_JAKARTA = {
  latitude: -(6 + 11 / 60 + 25 / 3600),
  longitude: 106 + 50 / 60 + 50 / 3600,
  timezone: 7,
} as const;

const IRNU_CRITERIA = {
  minAltitudeMariDeg: 3,
  minElongationHaqiqyDeg: 6.4,
} as const;

function addDays(date: GregorianDate, days: number): GregorianDate {
  const jd = gregorianToJulianDay(date);
  return julianDayToGregorian(jd + days);
}

function findMonthStartCandidateNearTabular(tabularMonthStart: GregorianDate): GregorianDate {
  for (let offset = -2; offset <= 2; offset += 1) {
    const candidate = addDays(tabularMonthStart, offset);
    const evaluationDate = addDays(candidate, -1);

    const jd = dateToJulianDay(evaluationDate.year, evaluationDate.month, evaluationDate.day);
    const sunsetLocalHours = timeForSunAngle(
      jd,
      MARKAZ_JAKARTA.latitude,
      MARKAZ_JAKARTA.longitude,
      MARKAZ_JAKARTA.timezone,
      -0.833,
      false
    );

    if (sunsetLocalHours === null) {
      continue;
    }

    const irnu = computeIrnuAtSunset(
      evaluationDate,
      sunsetLocalHours,
      MARKAZ_JAKARTA.timezone,
      MARKAZ_JAKARTA.latitude,
      MARKAZ_JAKARTA.longitude
    );

    if (
      irnu.moonAltitudeMariDeg >= IRNU_CRITERIA.minAltitudeMariDeg &&
      irnu.moonElongationHaqiqyDeg >= IRNU_CRITERIA.minElongationHaqiqyDeg
    ) {
      return candidate;
    }
  }

  return tabularMonthStart;
}

function getNuMonthStart(identifier: HijriMonthIdentifier): GregorianDate {
  const tabularStart = convertHijriToGregorian({ year: identifier.year, month: identifier.month, day: 1 });
  return findMonthStartCandidateNearTabular(tabularStart);
}

function getNextHijriMonth(identifier: HijriMonthIdentifier): HijriMonthIdentifier {
  if (identifier.month === 12) {
    return { year: identifier.year + 1, month: 1 };
  }
  return { year: identifier.year, month: identifier.month + 1 };
}

function getPrevHijriMonth(identifier: HijriMonthIdentifier): HijriMonthIdentifier {
  if (identifier.month === 1) {
    return { year: identifier.year - 1, month: 12 };
  }
  return { year: identifier.year, month: identifier.month - 1 };
}

export function nuFalakiyahGetHijriMonthLength(identifier: HijriMonthIdentifier): 29 | 30 {
  const start = getNuMonthStart(identifier);
  const nextId = getNextHijriMonth(identifier);
  const nextStart = getNuMonthStart(nextId);

  const length = gregorianToJulianDay(nextStart) - gregorianToJulianDay(start);
  return length === 30 ? 30 : 29;
}

export function nuFalakiyahConvertHijriToGregorian(date: HijriDate): GregorianDate {
  const start = getNuMonthStart({ year: date.year, month: date.month });
  const length = nuFalakiyahGetHijriMonthLength({ year: date.year, month: date.month });

  if (date.day < 1 || date.day > length) {
    return convertHijriToGregorian(date);
  }

  return addDays(start, date.day - 1);
}

export function nuFalakiyahConvertGregorianToHijri(date: GregorianDate): HijriDate {
  const approx = convertGregorianToHijri(date);

  let currentMonth: HijriMonthIdentifier = { year: approx.year, month: approx.month };
  let start = getNuMonthStart(currentMonth);

  const jd = gregorianToJulianDay(date);
  let startJd = gregorianToJulianDay(start);

  if (jd < startJd) {
    currentMonth = getPrevHijriMonth(currentMonth);
    start = getNuMonthStart(currentMonth);
    startJd = gregorianToJulianDay(start);
  } else {
    const nextMonth = getNextHijriMonth(currentMonth);
    const nextStart = getNuMonthStart(nextMonth);
    const nextStartJd = gregorianToJulianDay(nextStart);

    if (jd >= nextStartJd) {
      currentMonth = nextMonth;
      start = nextStart;
      startJd = nextStartJd;
    }
  }

  const day = jd - startJd + 1;

  const length = nuFalakiyahGetHijriMonthLength(currentMonth);
  const clampedDay = day < 1 ? 1 : day > length ? length : day;

  return { year: currentMonth.year, month: currentMonth.month, day: clampedDay };
}
