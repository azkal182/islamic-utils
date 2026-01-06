# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.2.2] - 2026-01-06

### Changed

#### Breaking: Simplified getNextPrayer and getCurrentPrayer API
- **Before:** `getNextPrayer(currentTime, prayerTimes, timezone)`
- **After:** `getNextPrayer(location, timezone, params, currentTime?)`
- No longer requires calling `computePrayerTimes` first
- `currentTime` parameter is now optional (defaults to `new Date()`)
- Returns `Result<NextPrayerInfo>` with `.prayerTimes` included
- Same changes apply to `getCurrentPrayer`

---

## [0.2.1] - 2026-01-06

### Added

#### Monthly Prayer Times
- `computeMonthlyPrayerTimes()` - Calculate prayer times for an entire month
- Efficient batch calculation using daily calculator internally
- Support for leap year February (28/29 days)
- Metadata includes year, month, days count, and calculation method

#### Next Prayer Time Utilities
- `getNextPrayer()` - Determine next upcoming prayer based on current time
- `getCurrentPrayer()` - Get current prayer period
- `formatMinutesUntil()` - Format countdown as "1h 30m"
- Support for day wrap (after Isha → tomorrow's Imsak)

#### Timezone Utilities
- `dateToLocalTime()` - Convert JavaScript Date to local time
- `getTimezoneOffset()` - Get UTC offset for any timezone
- `isIanaTimezone()` - Validate IANA timezone names
- Full support for both IANA names (`"Asia/Jakarta"`) and UTC offsets (`7`)

### Changed
- Updated README with Monthly Prayer Times, Next Prayer Time, and Timezone documentation
- Added Example 8 for next prayer usage

---

## [0.2.0] - 2026-01-06

### Added

#### Inheritance (Faraidh) Module
- `computeInheritance()` - Complete Islamic inheritance calculator
- 30+ heir types (spouses, parents, children, siblings, extended family)
- 7 hijab (blocking) rules for heir exclusion
- 10 special cases: Umariyatayn, Mushtarakah, Akdariyyah, etc.
- Furudh (fixed shares) calculator for all standard fractions
- Asabah (residuary) calculator with priority order
- Aul (over-subscription) handler
- Radd (remainder redistribution) handler
- Estate calculator with wasiyyah 1/3 cap enforcement
- Rule conflict validator
- Fraction utilities for precise calculations
- Full trace mode with Arabic terms
- Comprehensive unit tests (65+ tests)
- Golden test suite (124 real-world cases)
- Example file with 5 demo scenarios

---

## [0.1.0] - 2026-01-06

### Added

#### Prayer Times Module
- `computePrayerTimes()` - Calculate 9 daily prayer times
- 13 built-in calculation methods (MWL, ISNA, EGYPT, MAKKAH, KARACHI, TEHRAN, JAKIM, SINGAPORE, KEMENAG, DIYANET, UOIF, KUWAIT, QATAR)
- Support for Imsak and Dhuha times
- Asr calculation for Standard (Shafi'i) and Hanafi madhhab
- High latitude handling (Middle of Night, One-Seventh, Angle-Based)
- Manual adjustments and safety buffer (ihtiyath)
- Multiple rounding rules
- Trace mode for debugging

#### Qibla Direction Module
- `computeQiblaDirection()` - Calculate bearing to Ka'bah
- Great circle distance calculation
- 16-point compass direction conversion
- Edge case handling (at Ka'bah location)
- Distance to Makkah (optional)
- Trace mode for debugging

### Core Utilities
- Coordinate validation
- Date validation
- Timezone validation and UTC offset calculation
- Trigonometry utilities (degree-based)
- Result type with success/failure handling
- Error codes and LibraryError class
- Ka'bah coordinates constant
- Astronomical constants

---

### Changed
- Updated main entry point to export inheritance module
- Updated README with inheritance documentation
