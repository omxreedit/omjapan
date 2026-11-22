# Scholarship evidence — Japan Opportunity Radar

**Verification date:** 2026-11-22  
**Data files:** `data/scholarships.json` (18 entries), `data/feeds.json` (12 tested feed URLs, all `works:false`)

## Method and limits

- Source pages were fetched directly with `curl`/Python `urllib` and a browser-like User-Agent. Every URL cited in `scholarships.json` returned HTTP 200 on 2026-11-22.
- MEXT English PDF guidelines were downloaded and text-extracted with `pypdf` after installing `pycryptodome`. Dates were taken only from extracted text, never inferred from filenames or URLs.
- The web-search integration repeatedly returned `Web search cancelled`; no search-result snippet was used as evidence.
- `https://www.in.emb-japan.go.jp/` and `https://www.mumbai.in.emb-japan.go.jp/` returned HTTP 403 from this environment. They are **not** used as evidence and no India-specific embassy deadline is asserted.
- JASSO English news is client-side rendered and no public RSS/Atom endpoint was found. No working official feed was identified.
- No subscriber counts, no fabricated links, no guessed deadlines.

## Date/status rules applied

- `publishedDate` is set only when the source page shows an explicit publication date.
- `deadline` is set only for an explicit **application** deadline. Internal screening dates, provisional-acceptance dates, result dates and annual windows without a year were not used.
- Where the official guideline says the deadline is designated by the Japanese diplomatic mission or varies locally, `deadline` is `null` and status is `DEADLINE UNKNOWN`.
- Where an evergreen page gives no current-cycle dates, `publishedDate`, `deadline` and `status` are `null`.
- `CLOSED` and `UPCOMING` are relative to the verification date, 2026-11-22.

## Verified source facts

### MEXT — official recruitment and programme pages

| Source URL | Verified facts | Use in data |
|---|---|---|
| `https://www.mext.go.jp/a_menu/koutou/ryugaku/boshu/1415354_00011.htm` | Official MEXT page for 2027 embassy-recommended Undergraduate, College of Technology (Kosen) and Specialized Training College recruitment; links the English guidelines. | `sourceUrl` for the three 2027 embassy entries; evidence for category availability. |
| `https://www.mext.go.jp/content/20260420-mxt-kotokoku01-000049232_02.pdf` | English 2027 Undergraduate (Embassy Recommendation) guideline. Applicants submit documents to the Japanese diplomatic mission “by the designated deadline”; no single MEXT-wide date is printed. | Undergraduate entry: `deadline:null`, `DEADLINE UNKNOWN`. |
| `https://www.mext.go.jp/content/20260420-mxt-kotokoku01-000049243_02.pdf` | English 2027 Research guideline. It explicitly says the application-document deadline “varies according to each Japanese diplomatic mission” and must be confirmed on the mission’s website. | Research entry: `deadline:null`, `DEADLINE UNKNOWN`. |
| `https://www.mext.go.jp/content/20260420-mxt-kotokoku01-000049232_06.pdf` | English 2027 Kosen guideline; documents go to the diplomatic mission by its designated deadline; no global date stated. | Kosen entry: `deadline:null`, `DEADLINE UNKNOWN`. |
| `https://www.mext.go.jp/content/20260420-mxt-kotokoku01-000049232_10.pdf` | English 2027 Specialized Training College guideline; documents go to the diplomatic mission by its designated deadline; no global date stated. | Specialized entry: `deadline:null`, `DEADLINE UNKNOWN`. |
| `https://www.mext.go.jp/a_menu/koutou/ryugaku/06032818.htm` | MEXT explains the Japanese Government Scholarship system and the embassy/university application routes. | Supporting evidence for the MEXT overview entry. |
| `https://www.mext.go.jp/a_menu/koutou/ryugaku/boshu/1330944.htm` | Official multilingual warning: applications are made through embassies/consulates or higher-education institutions, and MEXT scholarship application is free of charge. | Supporting evidence for embassy-route entries; guard against fee-charging intermediaries. |
| `https://www.studyinjapan.go.jp/en/planning/scholarships/mext-scholarships/` | Official overview of seven MEXT categories and two routes (embassy recommendation and university recommendation); states that the latest guidelines must be checked. | Overview, university-recommendation, YLP, teacher-training and Japanese-studies entries. |
| `https://www.jasso.go.jp/en/ryugaku/scholarship_j/kokuhi.html` | Official JASSO page describing MEXT scholarship administration/support. | Supporting evidence for the university-recommendation entry. |
| `https://www.mext.go.jp/a_menu/koutou/ryugaku/ylp.htm` | MEXT Young Leaders Program page. | Supporting evidence for the YLP entry. |

### JASSO and exchange programmes

| Source URL | Verified facts | Use in data |
|---|---|---|
| `https://www.jasso.go.jp/en/ryugaku/scholarship_j/shoreihi/about.html` | Monbukagakusho Honors Scholarship: JPY48,000/month at universities, JPY30,000/month at Japanese language institutions; application through the enrolled institution. | JASSO Honors entry. |
| `https://www.studyinjapan.go.jp/en/planning/scholarships/jasso-scholarships/` | Confirms the Honors amounts and the Student Exchange Support Program: JPY80,000/month, 8 days–1 year, countries with diplomatic relations with Japan (Taiwan and Palestine also eligible). | JASSO Honors and exchange entries. |
| `https://www.jasso.go.jp/en/ryugaku/scholarship_j/ukeire.html` | Official JASSO page for Scholarship for Study in Japan under Agreement; applications are handled by the Japanese host institution. | Exchange entry. |
| `https://www.jasso.go.jp/en/ryugaku/scholarship_j/shoreihi/yoyaku_eju/index.html` | Official index for the EJU-based reservation route to the Honors Scholarship. | Supporting evidence for the 2026-11 EJU reservation entry. |
| `https://www.jasso.go.jp/en/ryugaku/scholarship_j/shoreihi/yoyaku_eju/202611.html` | Official session page for the November 2026 EJU reservation route; no separate scholarship application date is stated there. | EJU reservation entry: no inferred deadline. |

### Dated opportunities

| Source URL | Verified facts | Use in data |
|---|---|---|
| `https://www.studyinjapan.go.jp/en/news/2610161600.html` | “MITSUI & CO. SCHOLARSHIP PROGRAM FOR INDIA in 2027”, published `2026.10.16`; application period `09 October 2026 to 08 November 2026`; Indian bachelor’s-degree aspirants. | `publishedDate:2026-10-16`, `deadline:2026-11-08`, `CLOSED`. |
| `https://www.studyinjapan.go.jp/en/news/2602131600.html` | “MITSUI & CO. SCHOLARSHIP PROGRAM FOR INDIA in 2026”, published `2026.2.13`; application period `10th - 22nd February, 2026`; 5.5-year structure for Indian students. | `publishedDate:2026-02-13`, `deadline:2026-02-22`, `CLOSED`. |
| `https://www.studyinjapan.go.jp/en/news/` | Official news archive used to confirm both Mitsui announcements are published items, not guessed URLs. | Supporting evidence only. |
| `https://www.jsps.go.jp/english/e-fellow/e-ippan/appliguidelines.html` | Official Standard Postdoctoral schedule: FY2027 1st deadline `August 28, 2026` (passed); FY2027 2nd deadline `April 23, 2027` by 5 p.m. JST; results early August 2027. | 2nd recruitment: `deadline:2027-04-23`, `UPCOMING`. |
| `https://www.jsps.go.jp/english/e-fellow/e-ippan/index.html` | Official programme page for JSPS Standard Postdoctoral Fellowships. | Supporting evidence. |
| `https://www.jsps.go.jp/english/e-inv/application/index.html` | Official Invitational Fellowships schedule: 1st deadline `August 28, 2026`; FY2027 2nd Short-term deadline `April 23, 2027` by 5 p.m. JST. | Short-term 2nd recruitment: `deadline:2027-04-23`, `UPCOMING`. |
| `https://www.jsps.go.jp/english/e-inv/how.html` | Official explanation of the Invitational Fellowships application route through a Japanese host institution. | Supporting evidence and eligibility wording. |

### Official scholarship database entries

| Source URL | Verified facts | Use in data |
|---|---|---|
| `https://www.studyinjapan.go.jp/en/search-for-scholarships/detail.php?lang=en&mid=5-00014515` | Aichi Scholarship Program [Pre-Arrival Admission]; last update `2026/08/19`; JPY150,000/month for 2.5 years; UN-member-state citizens excluding Japan and North Korea (India included); application period shown only as `Late Feb.- Mid May` with no year. | Entry kept with `deadline:null`; do not invent a year. |
| `https://www.studyinjapan.go.jp/en/search-for-scholarships/detail.php?lang=en&mid=4-00044379` | Atsumi International Foundation Scholarship; last update `2026/08/19`; final-year doctoral students; JPY250,000/month; All Region; `Sep. 1-Sep. 20` with no year. | Entry kept with `deadline:null`; do not invent a year. |
| `https://www.aisf.or.jp/jp/index.php` | Official foundation homepage, HTTP 200. | Supporting evidence for the Atsumi entry. |

## Feed verification

All tested URLs are recorded in `data/feeds.json` with `works:false`, `lastChecked:"2026-11-22"` and a specific failure note. No working RSS/Atom feed was found, and no entries were fabricated.

| Tested URL | Result at 2026-11-22 |
|---|---|
| `https://www.mext.go.jp/en/news/rss.xml` | HTTP 404 |
| `https://www.mext.go.jp/b_menu/rss/mext.xml` | HTTP 404 |
| `https://www.mext.go.jp/rss/mext.xml` | HTTP 404 |
| `https://www.mext.go.jp/b_menu/rss/news.xml` | HTTP 404 |
| `https://www.jasso.go.jp/rss/news.xml` | HTTP 200, HTML soft-404, not XML |
| `https://www.jasso.go.jp/rss/index.xml` | HTTP 200, HTML, not XML |
| `https://www.jasso.go.jp/en/feed/` | HTTP 200, HTML 404 page, not XML |
| `https://www.studyinjapan.go.jp/en/news/feed.xml` | HTTP 404 |
| `https://www.studyinjapan.go.jp/en/rss.xml` | HTTP 404 |
| `https://www.jsps.go.jp/english/rss.xml` | HTTP 404 |
| `https://www.jsps.go.jp/english/e-news/feed.xml` | HTTP 404 |
| `https://www.jpf.go.jp/e/feed.xml` | HTTP 403 from this environment; not confirmed as a feed |

Homepages for MEXT, JASSO, Study in Japan, JSPS and the Japan Foundation were also inspected for `<link rel="alternate" type="application/rss+xml">` or Atom links; none were found.

## Known gaps / do not infer

- No India-specific Japanese embassy deadline was added: the embassy domains are inaccessible (HTTP 403) here.
- The MEXT research PDF contains an “Until Sep. 1, 2026” item for requesting provisional acceptance from universities; this is **not** an application deadline and was not used.
- Aichi and Atsumi annual windows lack a year; they were not converted into concrete deadlines.
- FALIA Essay Competition 2026 was verified earlier as an official announcement with no stated application deadline, but it was omitted to keep the final set at 18 entries focused on scholarships and opportunities with clearer eligibility.
- Old guessed URLs such as `https://www.mext.go.jp/en/programs/scholarship/index.htm` and `https://www.studyinjapan.go.jp/en/plan/scholarship.html` return HTTP 404 and must not be reintroduced.

## Refresh notes

1. Re-run HTTP status checks for every `sourceUrl` and every URL in each `evidence` array before the next publish.
2. Recheck the MEXT 2027 pages for revised English PDFs; if a mission-specific Indian deadline becomes officially visible, add it with the exact source and date.
3. Recheck JSPS application schedules when moving past 2027-04-23; update `status` and add future rounds only from the official schedule.
4. Keep closed Mitsui entries only as historical evidence; replace them with a new official announcement when one is published.
5. For Aichi/Atsumi, add a deadline only when the official page supplies both a year and an application cut-off.
6. Before adding any feed, require a live XML/Atom document and an official homepage link; record `works:true` only after successful parsing. No subscriber counts should be added.
