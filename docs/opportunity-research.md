# Opportunity research — Japan Opportunity Radar

**Research date:** 2026-11-22  
**Shipped data:** `data/scholarships.json` (18 verified entries), `data/feeds.json` (12 tested feed candidates, all disabled)  
**Full evidence table:** `research/scholarship_evidence.md`

## Summary

- All 18 entries were written from official Study in Japan, MEXT, JASSO, JSPS or official foundation pages. Every cited page was fetched directly on 2026-11-22; no search-result snippet was used as evidence.
- No official RSS/Atom endpoint could be confirmed for MEXT, JASSO, Study in Japan, JSPS or the Japan Foundation. Every candidate in `feeds.json` has `"works": false`, so the app never presents an untested feed as live.
- Because no usable feed exists, the radar ships an offline directory of verified official pages. Each card links to its official source and displays source attribution, verification date and cache state.
- `publishedDate` and `deadline` are separate fields. A publication date is never treated as a deadline. A deadline is stored only when the source explicitly publishes an application-period end date.
- Where a guideline says the deadline is set by each diplomatic mission or varies locally, `deadline` is `null` and the status is `DEADLINE UNKNOWN`. Annual windows without a year were not converted into dates.
- No invented dates, statuses, eligibility claims or application links were added.

## Explicit deadlines in the shipped dataset

| Opportunity | Published deadline | Meaning given by source | Status |
|---|---|---|---|
| Mitsui & Co. Scholarship Program for India 2027 | `2026-11-08` | Application period end on the Study in Japan announcement | `CLOSED` |
| Mitsui & Co. Scholarship Program for India 2026 | `2026-02-22` | Application period end on the Study in Japan announcement | `CLOSED` |
| JSPS Standard Postdoctoral Fellowship, FY2027 second recruitment | `2027-04-23` | Application deadline, 5 p.m. JST, on the official JSPS schedule | `UPCOMING` |
| JSPS Invitational Fellowship, FY2027 second short-term recruitment | `2027-04-23` | Application deadline, 5 p.m. JST, on the official JSPS schedule | `UPCOMING` |

All other entries have `deadline: null`. Some have `status: DEADLINE UNKNOWN`; evergreen programme pages without a current cycle have `status: null`.

## Feed discovery result

Candidate endpoints were fetched directly. Observed failures were HTTP 404, HTTP 403, or HTTP 200 with an HTML page instead of RSS/Atom XML. Homepages and news pages also contained no `<link rel="alternate" type="application/rss+xml">` or Atom discovery tag. The app therefore reports “No official RSS/Atom endpoint could be verified” rather than faking a live feed.

The Embassy of Japan in India domains returned HTTP 403 from this environment. No India-specific embassy deadline is asserted.

## App behaviour derived from this research

- Bundle the verified directory in `assets/content/scholarships.json`.
- Cache live feed items only if a feed is explicitly marked `works: true` and returns parseable XML; currently none are enabled.
- Show last verification date, refresh button, loading/empty/offline states and source attribution.
- Keep tracker status, notes and checklist local to the device; they never alter source facts.
- Schedule reminders only for opportunities with an explicitly published deadline.

Refresh before publication: recheck source URLs, watch for mission-specific MEXT dates, and enable a feed only after parsing a live official XML/Atom document.
