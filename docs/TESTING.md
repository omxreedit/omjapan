# Testing evidence — OMJAPAN 1.0.1

**Date:** 2026-11-22  
**Environment:** Linux/Termux-style toolchain with `aapt`, `javac`, `d8`, `apksigner`, Python 3 and Node.js.  
**Scope:** source checks, real UI module logic, bundled data integrity, official logo packaging, signed APK build and APK inspection.

## Commands run and results

| Check | Command | Result |
|---|---|---|
| JavaScript syntax | `for f in web/js/*.js; do node --check "$f"; done` | `syntax_fail=0` |
| Python generator syntax | `python3 -m py_compile tools/*.py` | `python=ok` |
| JSON validity | `for f in data/*.json; do python3 -m json.tool "$f" >/dev/null; done` | all files parsed; no `BAD_JSON` |
| UI/data logic tests | `node --test tests/` | 7 tests, 7 pass, 0 fail |
| Signed APK build | `sh android/build.sh` | build completed; signing verified |
| Signature verification | `apksigner verify --verbose release/omjapan-1.0.1.apk` | `Verifies`; v1, v2 and v3 signing all true; 1 signer |
| Manifest inspection | `aapt dump badging release/omjapan-1.0.1.apk` | `com.omjapan.app`, version `1.0.1`, code `2`, minSdk `23`, targetSdk `34`, label `OMJAPAN` |
| Permissions | `aapt dump badging` permission lines | only `INTERNET`, `ACCESS_NETWORK_STATE`, `POST_NOTIFICATIONS` |
| Checksum | `sha256sum release/omjapan-1.0.1.apk` | `4dfeebbd4aad73f3b9c5f0a280a7add1526002d37e6203b083080a5fb2e8965b` |
| Packaged assets | `unzip -l release/omjapan-1.0.1.apk` | `classes.dex`, all JS modules, all JSON datasets, `assets/www/img/logo.jpg` and `res/drawable/ic_launcher.jpg` |
| Logo integrity | `unzip -p ... assets/www/img/logo.jpg \| sha256sum` | packaged logo hash equals `branding/logo.jpg`: `8e0f163f2d85c272e38ab34473d3437b7dd09c9cd3ecdec9879c41efabef9628` |
| No placeholder references | logic test over `index.html`, `app.js`, `community.js` | no `logo_placeholder` or placeholder-logo wording remains |

## Logic tests actually exercised

`tests/logic.test.js` boots the real browser modules with a deterministic DOM and storage shim, then exercises:

1. **Seven-step onboarding** — all seven steps advance, onboarding closes, profile persists and the dashboard renders.
2. **Navigation and back** — splash/onboarding transitions, `data-go` navigation, native-style back action and every named route.
3. **Route rendering** — home, kana paths, all content libraries, writing, grammar, listening, speaking, JLPT, lesson detail, review, empty quiz, empty search, library, analytics, radar, timeline, opportunity detail, creators, creator detail, more, settings, About and privacy. Each route asserts no error screen and an expected section heading.
4. **Persistence** — vocabulary filters, radar category/status filters, private tracker status, checklist state, creator bookmark, global search input and settings toggles are read back from local storage.
5. **Data controls** — theme/accent persistence, bundled-content preload, JSON backup sheet, content-cache clearing and full local erase.
6. **Quizzes and analytics** — correct and wrong answers, quiz result screen, real quiz-history rows, accuracy calculation and mistake logging.
7. **Official logo regression check** — splash, onboarding and About all reference `img/logo.jpg`; no placeholder asset or wording remains; `branding/logo.jpg` is a valid JPEG; the build applies it through `tools/make_logo.py`.
8. **Content integrity** — exact dataset counts, lesson shape, answer bounds, explanations, creator URL/evidence rules, no subscriber claims, official scholarship source rules, allowed statuses, explicit deadline formats and all unverified feeds disabled.

## Research verification

- Every creator channel URL and scholarship source URL was fetched directly on 2026-11-22 and recorded in `docs/creator-research.md`, `research/creators_evidence.md`, `docs/opportunity-research.md` and `research/scholarship_evidence.md`.
- No official RSS/Atom endpoint was confirmed; every candidate in `data/feeds.json` is marked `works: false`.
- The app's refresh path returns an honest no-verified-feed result and keeps the bundled official directory available offline.

## Not verified in this environment

- **Visual/browser pass:** the in-app browser reported `No desktop browser is connected`, and no standalone Chromium/Firefox or DOM library was installed. Screenshots and click-through visual inspection were therefore not performed.
- **Device runtime:** no emulator or `adb` device was available. Installation, launcher icon appearance on a real home screen, WebView rendering on a physical device, text-to-speech audio, status-bar notification display and external intent opening were not executed.
- **Performance profiling:** no low-end device profile, frame-time capture or memory measurement was available.
- **Live notifications:** reminder scheduling logic is present and user-controlled, but no notification was observed on a device.
- **In-app external link opening:** link destinations were verified at research time; the Android `ACTION_VIEW` path itself was not device-tested.

## Required checks before public release

1. Install the APK on a physical Android device and confirm the official logo appears correctly in the launcher, splash, onboarding and About screen.
2. Complete the onboarding, navigation, lesson, quiz, review, bookmark, search, radar, settings/export and About flows visually.
3. Confirm external links open in the correct apps/browser and notifications appear when explicitly enabled.
4. Recheck official opportunity URLs and deadlines immediately before publication.
