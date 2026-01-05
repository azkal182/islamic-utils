# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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

## [Unreleased]

### Planned
- Inheritance (Faraidh) module
