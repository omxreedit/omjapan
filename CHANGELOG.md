# Changelog

All notable changes to this project are documented here. This project follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and
[Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.1] — 2026-11-22

### Changed

- Replaced the marked placeholder with the owner-supplied official OMJAPAN logo across launcher, splash, onboarding and About.
- Added `branding/logo.jpg` as the single source of brand artwork and `tools/make_logo.py` to apply it during every build.
- Updated build defaults to version 1.0.1 / version code 2.

## [1.0.0] — 2026-11-22

### Added

- Native Android WebView shell with a narrow `OmBridge` API and local SQLite storage.
- Premium black/dark-gray/neon-lime UI with splash, seven-step optional onboarding, bottom navigation and reduced-motion support.
- Offline learning library: 92 kana, 222 vocabulary, 114 kanji, 58 grammar points, 16 structured lessons, 58 JLPT questions, 12 listening drills and 10 speaking phrases.
- Quiz engine with local scores, mistakes, wrong-answer review and real local analytics.
- Global search and library across lessons, vocabulary, kanji, grammar, kana, JLPT, bookmarks, creators and opportunities.
- Verified directory of 14 Hindi/Hinglish Japanese teaching channels with genuine external links and offline monogram fallbacks.
- Opportunity Radar with 18 official-source entries, separate publication/deadline fields, private tracker, checklist, timeline, user-controlled reminders and honest feed-state messaging.
- Settings for theme, accent, daily goal, JLPT target, furigana, romaji, audio, notifications and reduced motion, plus JSON backup/export, cache clear and local erase.
- About, privacy and credits screens with the creator's exact handles and links.
- Reproducible signed-APK build script, content generators, deterministic logic tests, CI and research evidence logs.

### Known limitations

- The launcher/branding image is an explicitly marked placeholder because the supplied `1000005646.jpg` was unavailable in the build environment.
- No official RSS/Atom feed was verified, so all feed candidates are disabled and the radar uses a bundled, source-linked directory.
- Device installation and visual browser testing were not available in the build environment.
