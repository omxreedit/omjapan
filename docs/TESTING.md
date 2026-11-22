# Testing evidence — OMJAPAN 1.0.0

**Date:** 2026-11-22  
**Environment:** Linux/Termux-style toolchain with `aapt`, `javac`, `d8`, `apksigner`, Python 3 and Node.js.  
**Scope:** source checks, real UI module logic, bundled data integrity, signed APK build and APK inspection.

## Commands run and results

| Check | Command | Result |
|---|---|---|
| JavaScript syntax | `for f in web/js/*.js; do node --check "$f"; done` | `syntax_fail=0` |
| Python generator syntax | `python3 -m py_compile tools/*.py` | `python compile ok` |
| JSON validity | `for f in data/*.json; do python3 -m json.tool "$f" >/dev/null; done` | all files parsed; no `BAD_JSON` |
| UI/data logic tests | `node --test tests/` | 6 tests, 6 pass, 0 fail |
| Signed APK build | `sh android/build.sh` | build completed; signing verified |
| Signature verification | `apksigner verify --verbose release/omjapan-1.0.0.apk` | `Verifies`; v1, v2 and v3 signing all true; 1 signer |
| Manifest inspection | `aapt dump badging release/omjapan-1.0.0.apk` | `com.omjapan.app`, version `1.0.0`, code `1`, minSdk `23`, targetSdk `34`, label `OMJAPAN` |
| Permissions | `aapt dump badging` permission lines | only `INTERNET`, `ACCESS_NETWORK_STATE`, `POST_NOTIFICATIONS` |
| Checksum | `sha256sum release/omjapan-1.0.0.apk` | `9255ff7939977ceb406bb0b34af981da18c44651508a285f6225f45a6dae227d` |
| Packaged assets | `unzip -l release/omjapan-1.0.0.apk` | `classes.dex`, all `assets/www/js/*.js`, `assets/content/*.json` and the marked placeholder logo are present |

## Logic tests actually exercised

`tests/logic.test.js` boots the real browser modules with a deterministic DOM and storage shim, then exercises:

1. **Seven-step onboarding** — all seven steps advance, onboarding closes, profile persists and the dashboard renders.
2. **Navigation and back** — splash/onboarding transitions, `data-go` navigation, native-style back action and every named route.
3. **Route rendering** — home, kana paths, all content libraries, writing, grammar, listening, speaking, JLPT, lesson detail, review, empty quiz, empty search, library, analytics, radar, timeline, opportunity detail, creators, creator detail, more, settings, About and privacy. Each route asserts no error screen and an expected section heading.
4. **Persistence** — vocabulary filters, radar category/status filters, private tracker status, checklist state, creator bookmark, global search input and settings toggles are read back from local storage.
5. **Data controls** — theme/accent persistence, bundled-content preload, JSON backup sheet, content-cache clearing and full local erase.
6. **Quizzes and analytics** — correct and wrong answers, quiz result screen, real quiz-history rows, accuracy calculation and mistake logging.
7. **Content integrity** — exact dataset counts, lesson objective/sections/examples/practice shape, answer bounds, explanations, creator URL/evidence rules, no subscriber claims, official scholarship source rules, allowed statuses, explicit deadline formats and all unverified feeds disabled.

## Research verification

- Every creator channel URL and scholarship source URL was fetched directly on 2026-11-22 and recorded in `docs/creator-research.md`, `research/creators_evidence.md`, `docs/opportunity-research.md` and `research/scholarship_evidence.md`.
- No official RSS/Atom endpoint was confirmed; every candidate in `data/feeds.json` is marked `works: false`.
- The app's refresh path returns an honest no-verified-feed result and keeps the bundled official directory available offline.

## Not verified in this environment

- **Visual/browser pass:** the in-app browser reported `No desktop browser is connected`, and no standalone Chromium/Firefox or DOM library was installed. Screenshots and click-through visual inspection were therefore not performed.
- **Device runtime:** no emulator or `adb` device was available. Installation, launcher icon appearance, WebView rendering on a physical device, text-to-speech audio, status-bar notification display and external intent opening were not executed.
- **Performance profiling:** no low-end device profile, frame-time capture or memory measurement was available. Low-RAM choices were implemented (local assets, lazy JSON parsing, paginated lists, no heavy runtime libraries, reduced motion) but not instrumented here.
- **Live notifications:** reminder scheduling logic is present and user-controlled, but no notification was observed on a device.
- **In-app external link opening:** link destinations were verified at research time; the Android `ACTION_VIEW` path itself was not device-tested.
- **Real logo:** the official `1000005646.jpg` file was unavailable, so final branded artwork was not verified.

## Required checks before public release

1. Replace the marked placeholder with the owner-supplied official logo and rebuild.
2. Install the APK on a physical Android device and complete the onboarding, navigation, lesson, quiz, review, bookmark, search, radar, settings/export and About flows visually.
3. Confirm external links open in the correct apps/browser and notifications appear when explicitly enabled.
4. Recheck official opportunity URLs and deadlines immediately before publication.
