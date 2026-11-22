# Creator research — Hindi/Hinglish Japanese teachers on YouTube

**Verification date:** 2026-11-22 (all checks in this session)
**Output:** `data/creators.json` — 14 verified creator entries.

## Verification note

No channel name, handle, URL, avatar, playlist URL, video reference, level or
subject was guessed. Every included entry was re-checked directly against
YouTube in this session:

1. `https://www.youtube.com/@handle` — fetched; the returned page title matched
   the creator name and the embedded `vanityChannelUrl` matched the handle.
2. `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=<video>&format=json`
   — fetched for one identified video per creator; `author_name` and
   `author_url` were read from YouTube's own JSON response.
3. `https://www.youtube.com/@handle/videos` — fetched; video titles were read
   from the page's `lockupMetadataViewModel.title.content` fields, and the
   avatar URL from the channel's `avatar.thumbnails[0].url` metadata. Only
   avatar URLs actually observed in that metadata were written to the JSON.
4. `https://www.youtube.com/playlist?list=<id>` — fetched; each `playlistUrl`
   in the JSON was confirmed by the returned page `<title>` (and handle on the
   page). No unverified playlist link was included.
5. Teaching-language evidence came from the channel's own about description,
   from Hindi/Hinglish words in verified video titles, and — where available —
   from the watch page's audio-track metadata (`Hindi original`). The app data
   does not claim to have listened to full videos.

**Not included:** subscriber counts (not reliably read from the fetched pages),
invented video links, and guessed avatar sizes. `tags`, `subjects` and `jlpt`
are derived only from the verified titles/playlists/about text listed below.
Channels mixing Hindi and English in their titles/descriptions are marked
`Hinglish`; channels whose titles/about explicitly say Hindi are marked
`Hindi`.

## Verified creators

| id | Channel (official URL) | Language | Evidence seen on 2026-11-22 |
|---|---|---|---|
| c01 | Japan With Adi — https://www.youtube.com/@japanwithadi | Hinglish | oEmbed for `VtrWlno3RJI`: "Kihon Summer Camp Japanese from 0 I Day 1"; watch page lists "Hindi original" audio track; playlist `PLJnmf2_AZvXu2jgbP2yGstNvJksFZfCYx` titled "Japanese From 0 I Complete FREE Course". Channel about: study-in-Japan education/vlogs. |
| c02 | Japanese In Hindi — https://www.youtube.com/@nakuljapanese | Hindi | oEmbed for `UAxD94OqO0A`: "Japanese for Beginners in Hindi \| Learn Japanese from Zero \| One Shot Course"; titles show an ongoing N5+N4 course; playlist `PLSEI38thboWQ` titled "JLPT from Zero to N4". |
| c03 | Japanese Hacks — https://www.youtube.com/@JapaneseHacks | Hindi | oEmbed for `GimchJW_hDU`: "Introduction to Japanese \| Japanese Language Series \| जापानी हिंदी में"; many titles repeat "जापानी हिंदी में" with JLPT N5 topics; playlist `PLI3T8MPXDawONZjRRJZMJI5gf2GS75osJ` titled "Japanese Language Series N5". |
| c04 | Japanese with Vishal — https://www.youtube.com/@JapanesewithVishal | Hindi | About describes a Japan Embassy-certified, JLPT N1 trainer; oEmbed for `OxHdViPJLkE` is a Hindi N5 course guide; titles include "JLPT N4 & N5 Level Reading Practice Test with Answers in Hindi" and N1–N5 roadmaps; playlist `PLGO-PB6BdVZtMJD_B3gAIkeF7UbIXhMjw` titled "JLPT Guide for beginners". |
| c06 | Indo Sensei — https://www.youtube.com/@Indosensei | Hinglish | About: "Learn Japanese Language in Hindi (जापानी हिंदी में) ... online classes in India in Hindi/English"; titles include a hiragana foundation course "in Hindi and English" and Minna no Nihongo particles; playlist `PL4jDEw46AELvsM39gGXG6QBJaaf2tbyJD` titled "Japanese Foundation Course". |
| c07 | Ohayou Japanese — https://www.youtube.com/@OhayouJapanese | Hindi | oEmbed for `1MWO5OwF6DA`: "JLPT N5 Question Solving Strategy \| Real Exam Tricks in Hindi" (watch page audio: "Hindi original"); titles include "Minna no Nihongo N4 Lesson 28 Grammar Explained in Hindi"; playlist `PLeYdnJmvMOJyfbcYlene22cTTzEFXv2jC` titled "N5 Grammar". |
| c08 | Learn Japanese by SK — https://www.youtube.com/@LearnJapanesebySK | Hinglish | oEmbed for `tg1CdmJjNaU`: "Minna No Nihongo Lesson 1 Grammar\| Learn Japanese in Hindi \| JLPT N5"; other titles use Hindi-in-Hinglish phrasing; playlist `PLWEXO33W2qtdgNQMP5TebnH4J_LXIDwVS` titled "Listening Practice". |
| c09 | Japanese With Punam — https://www.youtube.com/@japanesewithpunam9334 | Hindi | About: "Japanese in Hindi"; oEmbed for `L1NP8nhCxx4`: "JLPT N2 Grammar Complete Course in Hindi \| All 131 Grammar Patterns Explained with Examples"; N3/N4/N5 grammar, kanji and listening titles; playlist `PLMAkVnQwv1pHVelBsc-sDRPeVFdABMPeO` titled "Hiragana". |
| c10 | Chauhan JLPT All levels — https://www.youtube.com/@chauhanjlptalllevels | Hinglish | About: "learning Japanese language through Hindi"; titles include N3 Nihongo So-Matome "Hindi Explanation", Genki N5 lessons and N4/N5 revision; playlist `PLZ9oJHrTDEgs` titled "N3". |
| c11 | GA Japanese Learning — https://www.youtube.com/@GAJapaneselearningofficial | Hindi | About lists "Easy-to-follow lessons for JLPT N5 & N4" with grammar/vocabulary/kanji; oEmbed for `4qrSQHLrJYE`: "Master Japanese Katakana in Hindi \| Easy JLPT N5 Lesson for Complete Beginners (Part 1)"; playlist `PLaItBEX-Xpel5C0YI3bFLTcEXWxSbGVy0` titled "Complete Hiragana Course for Beginners in Hindi". |
| c12 | Shige sensei — https://www.youtube.com/@shige_japani_guruji | Hinglish | oEmbed for `JbT0ARytQsw`: "Hiragana① Japanese character kaise padhte hai? Kaise likhte hai?"; Hiragana①–④ and Katakana①–③ titles in the same Hinglish style; playlist `PL8WmZ6zNFQkQRN59BNpr6ZKaik2D9ReQf` titled "Hiragana&Katakana in Hindi!!!!". No verified JLPT content, so `jlpt` is empty. |
| c13 | Nihongo Pathshala by Karuna — https://www.youtube.com/@NihongoPathshalaByKaruna | Hinglish | About: "Japanese भाषा को हिंदी में आसान तरीके से सीखें"; oEmbed for `xLuCJ4ajKFA`: "JLPT N3 Grammar ようとする Explained in Hindi & English"; many N3 grammar titles say Hindi & English, plus Minna no Nihongo N4 lessons; playlist `PLclkXhMyEB4MfLD4Wr59m1SSbrVnXX9FZ` titled "Jlpt N3 grammar in Hindi". |
| c14 | Learn Japanese with Yuki Sensei — https://www.youtube.com/@YukiDevi | Hindi | About: "I have been teaching Japanese to Indian over 20 years ... how to learn Japanese in Hindi"; oEmbed for `BQZC246tDWA`: "Learn Japanese in Hindi Lesson1 (Hiragana)"; numbered JLPT N5 kanji tests; playlist `PLlSkcqVXQKtiUoQiVuQqlgXaw-Om-DTlb` titled "Learn Japanese in Hindi". |
| c15 | Nihongo With Parul — https://www.youtube.com/@Nihongowithparul | Hinglish | About: "Simple Hindi explanation ke sath Japanese step by step seekho" with JLPT N5/N4/N3; oEmbed for `2KXQjPpJus8`: "Learn Katakana Complete Course in Hindi"; playlist `PLiYeJi-7TJTnf7vkHLHN-v7FgogrRBt3P` titled "Minna no Nihongo N5 Complete Course (Hindi) \| Lesson 1–25 🇯🇵". |

## Excluded after verification

- **मायो जापान Mayo Japan** — https://www.youtube.com/@mayojapan . The handle,
  channel title, avatar and oEmbed for `eZsvEvHVVCc` ("Hindi🇮🇳VS🇯🇵Japanese |
  Learn Japanese Greetings in Hindi! ...") were verified, but the about page
  says the channel makes videos about India and Japan in Hindi, and the
  observed upload list is overwhelmingly culture/travel/vlog content. It does
  not meet the "Japanese-language teaching channel" bar, so it was left out.

## Reproduction

The checks used plain HTTPS GET requests for the URLs listed above with a
normal desktop user-agent. YouTube's oEmbed endpoint supplied author name and
canonical handle; channel and playlist pages supplied titles, about text,
playlist ownership and avatar metadata. All JSON fields were written from
those observed values only; `verifiedAt` is the date the checks were run.
