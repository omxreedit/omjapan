# OMJAPAN 1.0.1 release notes

**Release date:** 2026-11-22  
**APK:** `omjapan-1.0.1.apk`  
**SHA-256:** `4dfeebbd4aad73f3b9c5f0a280a7add1526002d37e6203b083080a5fb2e8965b`

## What changed in this release

- The owner-supplied official OMJAPAN logo now replaces the marked placeholder everywhere: launcher icon, splash screen, onboarding and About screen.
- `branding/logo.jpg` is now the single source of brand artwork.
- `tools/make_logo.py` applies the official logo to generated Android and WebView assets on every build.
- Version bumped to `1.0.1` (version code `2`) so installed devices can distinguish this build from `1.0.0`.

## Unchanged from 1.0.0

- Full offline Japanese learning library, quizzes, review, analytics, search and library.
- Verified Hindi/Hinglish creator directory and official-source Opportunity Radar.
- Local-first privacy: no account, ad SDK, analytics upload or automatic data sync.

## Important notes

- No official RSS/Atom feed was verified. The radar continues to show a bundled, source-linked directory rather than inventing live updates.
- Device-level visual and runtime testing was not available in the build environment; see `docs/TESTING.md`.
