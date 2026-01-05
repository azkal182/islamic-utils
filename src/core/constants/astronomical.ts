/**
 * @fileoverview Astronomical constants
 * @module core/constants/astronomical
 *
 * This module defines fundamental astronomical constants used in
 * solar position and prayer time calculations.
 *
 * @remarks
 * These values are based on standard astronomical references and
 * are optimized for accuracy in the date range relevant to prayer times.
 */

/**
 * Fundamental astronomical constants.
 *
 * @remarks
 * These constants are used in solar position calculations.
 * Sources: USNO, NASA JPL, and IAU standards.
 */
export const ASTRONOMICAL = {
  /**
   * Atmospheric refraction at the horizon in degrees.
   *
   * @remarks
   * When the sun's geometric center is exactly at the horizon (0°),
   * atmospheric refraction causes it to appear about 34 arcminutes
   * (0.567°) higher than its true position.
   *
   * Combined with the sun's semi-diameter (16 arcminutes), the sun
   * appears to touch the horizon when its center is about 50 arcminutes
   * (0.833°) below the horizon.
   *
   * This value is used for sunrise/sunset calculations.
   */
  REFRACTION_AT_HORIZON: 0.833,

  /**
   * Sun's angular semi-diameter in degrees.
   *
   * @remarks
   * The sun subtends an angle of about 32 arcminutes (0.533°).
   * The semi-diameter is half of this.
   *
   * Used to calculate when the sun's upper limb touches the horizon.
   */
  SUN_SEMI_DIAMETER: 0.266,

  /**
   * Standard atmospheric refraction correction in degrees.
   *
   * @remarks
   * Value at sea level under standard atmospheric conditions.
   * About 34 arcminutes.
   */
  STANDARD_REFRACTION: 0.5667,

  /**
   * Mean obliquity of the ecliptic (Earth's axial tilt) in degrees.
   *
   * @remarks
   * This value slowly changes over time. The value here is
   * appropriate for calculations in the 21st century.
   *
   * ~ 23.44° as of J2000.0
   */
  EARTH_OBLIQUITY: 23.4397,

  /**
   * Julian date of the J2000.0 epoch.
   *
   * @remarks
   * J2000.0 = January 1, 2000, at 12:00 TT (Terrestrial Time)
   * This is the standard epoch for modern astronomical calculations.
   */
  J2000_EPOCH: 2451545.0,

  /**
   * Days in a Julian century.
   */
  JULIAN_CENTURY: 36525,

  /**
   * Number of degrees the Earth rotates per hour.
   *
   * @remarks
   * 360° / 24 hours = 15° per hour
   * Used in hour angle calculations.
   */
  DEGREES_PER_HOUR: 15,

  /**
   * Number of hours per degree of longitude.
   *
   * @remarks
   * 24 hours / 360° = 1/15 hours per degree
   * Used for timezone and solar time calculations.
   */
  HOURS_PER_DEGREE: 1 / 15,
} as const;

/**
 * Standard angles used in prayer time calculations.
 *
 * @remarks
 * These are the sun elevation angles that define various prayer times.
 * Different organizations and madhabs may use slightly different values.
 */
export const PRAYER_ANGLES = {
  /**
   * Sun elevation angle for sunrise/sunset.
   *
   * @remarks
   * Includes refraction correction (0.833°).
   * Sun's upper limb just touches the horizon.
   */
  SUNRISE_SUNSET: -0.833,

  /**
   * Default angle for Fajr (dawn).
   *
   * @remarks
   * When the first light appears on the eastern horizon (true dawn).
   * This is when the sun is 18° below the horizon according to MWL.
   * Different methods use 15°-20°.
   */
  FAJR_DEFAULT: 18,

  /**
   * Default angle for Isha (nightfall).
   *
   * @remarks
   * When the twilight disappears completely.
   * MWL uses 17°. Different methods use 15°-18°.
   */
  ISHA_DEFAULT: 17,

  /**
   * Sun elevation for beginning of civil twilight.
   *
   * @remarks
   * 6° below horizon. Enough light for most outdoor activities.
   */
  CIVIL_TWILIGHT: 6,

  /**
   * Sun elevation for beginning of nautical twilight.
   *
   * @remarks
   * 12° below horizon. Horizon still visible at sea.
   */
  NAUTICAL_TWILIGHT: 12,

  /**
   * Sun elevation for beginning of astronomical twilight.
   *
   * @remarks
   * 18° below horizon. Sky is completely dark.
   */
  ASTRONOMICAL_TWILIGHT: 18,

  /**
   * Default sun altitude for Dhuha start.
   *
   * @remarks
   * When the sun has risen sufficiently for Dhuha prayer.
   * Typically 3°-15° above the horizon depending on opinion.
   */
  DHUHA_START_DEFAULT: 4.5,
} as const;

/**
 * Constants for trigonometric calculations.
 */
export const TRIG = {
  /**
   * Degrees to radians conversion factor.
   */
  DEG_TO_RAD: Math.PI / 180,

  /**
   * Radians to degrees conversion factor.
   */
  RAD_TO_DEG: 180 / Math.PI,

  /**
   * Full circle in degrees.
   */
  FULL_CIRCLE: 360,

  /**
   * Half circle in degrees.
   */
  HALF_CIRCLE: 180,
} as const;
