# OMJAPAN — Design brief (filled 2026-11-22)

## 1. Product
- **Name:** OMJAPAN
- **One-line job:** Take an Indian/Hindi-speaking learner from zero Japanese to
  confident JLPT study and study-in-Japan planning, offline first.
- **Platform:** Android (WebView shell over local HTML/CSS/JS + native SQLite bridge)
- **Orientation:** portrait primary, landscape usable (max-width 720 content column)
- **Primary screen:** Home dashboard (streak + daily goal + continue learning)

## 2. Audience & context
- **Who:** Indian/Hindi-speaking students and beginners learning Japanese; JLPT
  N5→N1 aspirants; students planning study/work in Japan.
- **When/where:** commutes, short one-handed sessions, low-end phones, often offline.
- **Session length:** 3–15 minutes.
- **Device range:** Android 6.0 (API 23)+, 360dp wide minimum, 1–2 GB RAM.
- **Accessibility needs:** large touch targets, readable Japanese glyphs, reduce motion.

## 3. Emotional target
- **Primary:** focused · **Secondary:** trustworthy
- Adjectives: precise, calm, energetic-when-rewarded
- Must NOT evoke: generic "AI dashboard", cluttered, fake-gamified

## 4. Signature idea
- **The Kana Path:** a vertical 46-tick kana ribbon on the home dashboard that
  fills lime as hiragana/katakana are mastered, with the current position marked
  by a single soft lime glow. It is product-specific, cheap to render (CSS only),
  and gives a reason to return. Secondary signature: JLPT level ring.

## 5. Visual direction
- **Palette:** bg `#0A0C0A`, surface `#121612`, surface-2 `#191E19`,
  surface-3 `#222822`, border `#2B332B`, text `#F2F6EE`, muted `#9AA694`,
  accent `#B6F13C`, accent-soft `rgba(182,241,60,.12)`,
  success `#4ADE80`, warning `#FBBF24`, danger `#F87171`, info `#60A5FA`.
  *(Brand overrides the KB's "pure black + neon" caution: one lime accent on
  tinted near-black neutrals; no glass on every card.)*
- **Neutrals:** warm-green tinted dark neutrals (hue ~100°).
- **Type:** display `Barlow Condensed` (bundled woff2) 600/700; body `system-ui`
  400/500/600. Japanese glyphs fall back to system CJK font.
- **Radius:** 12 / 20 / 32 / pill.
- **Elevation:** surface lightness steps + one soft shadow; no glass in lists.
- **Imagery:** user-supplied logo (placeholder until supplied), creator avatars
  only when verified; otherwise monogram tiles. No fake embedded video.
- **Density:** standard (16px gutters, 24px section gaps).

## 6. Layout
- **Grid:** single column, max-width 720, 16px gutter, 24px section gap.
- **Screen skeleton:** header (title + one action) → hero focal → primary CTA →
  2–3 sections → nav. Bottom nav cleared by 96px padding.
- **Primary action:** bottom third, full-width lime pill on learning screens.
- **Responsive:** phone single column; landscape/tablet max-width column centred;
  `env(safe-area-inset-*)` used.
- **Safe-area:** top status bar, bottom gesture nav.

## 7. Motion
- **Entrance:** logo fade+scale 520ms, ring sweep 900ms, staggered card entrance
  (40ms, capped at 6 items).
- **Transition:** route cross-fade 180ms; detail slide-up 280ms.
- **Signature micro-interaction:** kana tick lights up with a 180ms lime pulse on
  mastery; quiz correct/wrong feedback 140ms.
- **Ambient:** none (battery friendly).
- **Reduced motion:** all durations 1ms via media query + in-app setting.

## 8. Content & states
- **Real content:** actual kana/vocabulary/kanji/grammar data in JSON; verified
  creator and scholarship data from research.
- **Empty state:** icon at 40%, one sentence, one action.
- **Loading:** skeleton cards, never a bare spinner.
- **Error/offline:** human message + retry + "offline cached" chip.
- **Long content:** scrollable detail sheets; titles ellipsize at 2 lines.

## 9. Constraints
- **Tech:** Java Activity + WebView, local assets, native SQLite + bridge, no Gradle.
- **Dependencies:** Android platform only (no third-party libs in APK).
- **Performance budget:** < 4 MB APK assets, lazy JSON load, no blur, no video.
- **Scope cuts:** no cloud sync, no fake playback, no invented dates.
- **Must-not-do:** no fake progress %, no placeholder videos, no invented links,
  no silently replaced logo.

## 10. Acceptance
- [x] One focal point per screen
- [x] Tokens defined
- [x] Signature idea implemented
- [x] All states designed
- [ ] Premium + anti-generic checklists passed (final review)
- [ ] Accessibility audit passed (final review)
- [ ] Tested at 320px, landscape, 1.3× text (final review)

## 11. Risks
| Risk | Mitigation |
| --- | --- |
| Logo never supplied | Clearly-marked placeholder; swap one asset at any time |
| Official sites block fetch | Native RSS fetch with cache; show offline cached + source link |
| TTS Japanese unavailable | Graceful fallback: text-only listening drill |
| WebView file:// fetch restrictions | Load JSON via native bridge `readAsset()` instead of XHR |
