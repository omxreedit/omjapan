# OMJAPAN

**Your Japanese journey — offline first.**

OMJAPAN is a native Android shell around a fully local WebView UI. It bundles real Japanese-learning content, a verified Hindi/Hinglish creator directory, and a Japan Opportunity Radar built only from official sources. No account, analytics SDK, ad SDK or remote UI dependency is required.

- Package: `com.omjapan.app`
- Version: `1.0.1` (version code 2)
- Repository: <https://github.com/omxreedit/omjapan>
- Creator: **om gohil** — YouTube `@ogomgaming`, Instagram `ogomgaming`, Discord <https://discord.gg/Mdz2B6vRe3>

> **Branding:** the official OMJAPAN logo is bundled at `branding/logo.jpg`. `tools/make_logo.py` copies it into the launcher icon, splash, onboarding and About screen on every build.

## What is included

### Learning

- 92 kana characters (hiragana + katakana) with examples and mastery tracking
- 222 vocabulary entries with kana, romaji, meanings, levels and topics
- 114 kanji entries with readings, radicals and compounds
- 58 grammar points with explanations and examples
- 16 structured lessons with objective, sections, examples, practice and quiz
- 58 JLPT questions, 12 listening drills and 10 speaking phrases
- Review of wrong answers, local quiz history and real progress analytics

### Discovery

- 14 verified Hindi/Hinglish Japanese teaching channels, with genuine channel and playlist links
- Avatar images load only when online; monogram fallback offline
- No subscriber counts, invented video links or invented handles
- Global search across vocabulary, kanji, grammar, lessons, kana, JLPT, creators, opportunities and bookmarks

### Japan Opportunity Radar

- 18 opportunities from official Study in Japan, MEXT, JASSO, JSPS and foundation pages
- Explicit published deadlines only, kept separate from publication dates
- Local tracker, private notes, checklist, deadline timeline and user-controlled reminders
- Last verification date, refresh button, loading/empty/offline/error states and source attribution
- No usable official RSS/Atom feed was found, so all feed candidates are disabled and the app honestly shows a bundled official directory

### Privacy and settings

- Local SQLite source of truth: progress, bookmarks, notes, quiz history, settings and caches
- Theme, accent, daily goal, JLPT target, furigana, romaji, audio, notifications and reduced motion
- JSON backup/export, cache clear and full local-data erase
- Privacy screen explains permissions, network use and user control

## Architecture

```text
Android (Java, API 23+)
├── OmJapanActivity      WebView shell, back handling, external links
├── OmBridge             JS ↔ Android APIs, SQLite store, TTS, reminders, feed refresh
├── OmDatabase           SQLite schema and local source of truth
├── OmFeedService        bounded official RSS/Atom parser, disabled feeds stay disabled
├── OmNotifier           optional deadline reminders
└── assets/
    ├── www/             local UI (HTML/CSS/JS)
    ├── content/         bundled JSON datasets
    └── img/             official OMJAPAN logo

web/js/
├── config.js            real developer/repo/official links
├── dev-shim.js          browser-only OmBridge mirror for testing
├── core.js              store, bridge wrappers, progress, bookmarks, stats, routing
├── data.js              lazy cached content access and creator schema normalization
├── ui.js                shared UI atoms
├── home.js              dashboard
├── learn.js             learning paths, detail sheets and quiz engine
├── radar.js             opportunity radar and tracker
├── community.js         creators, search, library, analytics, settings, About, privacy
└── app.js               splash, 7-step onboarding, router and delegated actions
```

The UI renders from local assets only. Native features are exposed through one narrow `OmBridge` interface, so the same modules can be exercised in a browser with `dev-shim.js`.

## Build

Requires `aapt`, `javac`, `keytool`, `d8`, `apksigner`, Python 3 and an API 34 `android.jar`. No Gradle or Android Studio is needed.

```sh
cd ~/projects/omjapan
sh android/build.sh
```

Output:

```text
release/omjapan-1.0.1.apk
release/omjapan-1.0.1.apk.sha256
```

The release keystore and passphrase are generated outside the repository at `~/.omjapan/` on first build. The build also copies `data/*.json` into `assets/content/` and applies the official logo from `branding/logo.jpg`.

## Test

```sh
cd ~/projects/omjapan
for f in web/js/*.js; do node --check "$f"; done
python3 -m py_compile tools/*.py
for f in data/*.json; do python3 -m json.tool "$f" >/dev/null; done
node --test tests/
sh android/build.sh
apksigner verify --verbose release/omjapan-1.0.1.apk
```

See `docs/TESTING.md` for the evidence ledger, including what could not be verified in this environment.

## Research and data provenance

- `docs/creator-research.md` — 14 verified creator channels and explicit exclusions
- `research/creators_evidence.md` — earlier verification evidence and rejected candidates
- `docs/opportunity-research.md` — official-source opportunity policy and explicit deadlines
- `research/scholarship_evidence.md` — URL-to-fact evidence table and feed checks
- `docs/design-brief.md` and `docs/theme-tokens.md` — UI/UX pre-flight and design tokens

No dataset contains invented subscriber counts, video links, deadlines or handles.

## Limitations

- No working official RSS/Atom feed was verified; the radar uses a bundled, source-linked directory.
- Installation and device runtime were not performed here because no `adb`/emulator is available.
- The in-app browser was disconnected during verification, so visual screenshot testing was not possible; logic tests use the real UI modules through a deterministic DOM shim.

## License

MIT — see `LICENSE`. Creator names, avatars and channel links belong to their respective owners. Opportunity information belongs to the linked official sources.
