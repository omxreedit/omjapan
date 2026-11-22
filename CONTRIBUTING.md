# Contributing to OMJAPAN

Thanks for helping improve OMJAPAN. Please keep the project offline-first,
evidence-led and respectful of source data.

## Ground rules

- No invented creator names, handles, channel URLs, video links, playlists or subscriber counts.
- No invented scholarship dates, eligibility claims, statuses or application links.
- Publication dates are never deadlines. Store a deadline only when the official source publishes one.
- Do not replace the marked placeholder logo unless the project owner supplies the official `1000005646.jpg` asset.
- Keep the runtime dependency-free: local HTML/CSS/JS, native Java bridge and bundled JSON only.
- Do not commit keystores, passphrases, API keys, local SDK jars or generated build output.

## Development loop

```sh
cd ~/projects/omjapan
sh android/build.sh
```

Static and logic checks:

```sh
for f in web/js/*.js; do node --check "$f"; done
python3 -m py_compile tools/*.py
for f in data/*.json; do python3 -m json.tool "$f" >/dev/null; done
node --test tests/
```

## Adding learning content

1. Edit the relevant generator in `tools/` or the JSON file in `data/`.
2. Keep stable, lowercase `id` values.
3. For practice questions, `answer` is a zero-based index into `options`, and every question needs an `explanation`.
4. Run the JSON validation and logic tests.

## Adding a creator

Use `docs/creator-research.md` as the pattern. A creator must teach Japanese in Hindi or Hinglish and must have a verified channel URL. Add evidence, verification date, teaching language, subjects and any genuinely verified playlist. If an avatar cannot be confirmed, omit it and let the UI show the monogram fallback.

## Adding an opportunity

Use `research/scholarship_evidence.md` as the evidence table. Only official Study in Japan, MEXT, JASSO, JSPS, embassy or official foundation pages are acceptable. Add `sourceUrl`, `evidence`, `verifiedOn`, `publishedDate` (if known) and either an explicit `deadline` or `null` with `DEADLINE UNKNOWN`. Never turn “every year” into a date.

## Pull requests

- One concern per PR.
- Say what was changed, what was tested and what could not be verified.
- Update docs or tests when behaviour or data policy changes.
- Keep the UI token-driven; see `docs/theme-tokens.md`.

Bug reports and feature requests are welcome through the GitHub issue templates.
