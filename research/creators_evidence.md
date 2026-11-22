# Hindi/Hinglish Japanese-learning YouTube creators — verification evidence

**Verified on:** 2026-11-22  
**Method:** The `websearch` tool was cancelled in this environment, so candidates were discovered by fetching YouTube's own search-results HTML with `curl`/`urllib` and parsing `ytInitialData`. Every channel below was then checked by (a) YouTube oEmbed for a real video (`author_name`, `author_url`, `thumbnail_url`), (b) the channel page's `og:title`/`og:image`/`channelMetadataRenderer`, and (c) the channel's `/videos` and `/playlists` pages. Every playlist URL in `creators.json` was fetched directly and returned HTTP 200 with the expected `og:title`. **No subscriber counts were copied into the JSON** (one was observed on a channel page solely to judge "featured" status and was not stored).

## Verified creators

| # | Creator (exact YouTube name) | Exact URLs fetched | What it confirmed |
|---|---|---|---|
| 1 | Japan With Adi | `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=VtrWlno3RJI&format=json`; `https://www.youtube.com/@japanwithadi`; `https://www.youtube.com/@japanwithadi/videos`; `https://www.youtube.com/@japanwithadi/playlists` | oEmbed: name "Japan With Adi", handle `@japanwithadi`. Channel page: og:image avatar, description "I make Study in Japan Education related videos and Vlogs". Videos page: "How to learn Japanese in ONE MONTH", "How to Speak in Japanese: A Beginner's Guide", "How to Learn Japanese from Zero", MEXT/study-in-Japan guides. Playlist "Japanese From 0 I Complete FREE Course" retrieved. |
| 2 | Japanese In Hindi | `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=UAxD94OqO0A&format=json`; `https://www.youtube.com/@nakuljapanese`; `https://www.youtube.com/@nakuljapanese/videos`; `https://www.youtube.com/@nakuljapanese/playlists` | oEmbed: name "Japanese In Hindi", handle `@nakuljapanese`, video "Japanese for Beginners in Hindi | Learn Japanese from Zero". Videos page: active "Japanese N5 + N4 Complete Course" lessons, "Japanese Kanji Kaise Yaad Kare?", "Katakana Part-10", "Japanese Grammar for Beginners in Hindi". Playlists "JLPT from Zero to N4" and "Japanese For Beginners" retrieved. |
| 3 | Japanese Hacks | `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=GimchJW_hDU&format=json`; `https://www.youtube.com/@JapaneseHacks`; `https://www.youtube.com/@JapaneseHacks/videos`; `https://www.youtube.com/@JapaneseHacks/playlists` | oEmbed: name "Japanese Hacks", handle `@JapaneseHacks`. About: "an Indian living in Japan" sharing Japanese learning tips. Videos: "JLPT N5 Grammar/Vocabulary ... जापानी हिंदी में", "Sounds in Japanese | जापानी हिंदी में", "Top 5 Business Phrases in Japanese". Playlists: "Japanese Language Series N5", "Hiragana 3 Day Challenge", "Katakana 3 Day Challenge". |
| 4 | Japanese with Vishal | `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=OxHdViPJLkE&format=json`; `https://www.youtube.com/@JapanesewithVishal`; `https://www.youtube.com/@JapanesewithVishal/videos`; `https://www.youtube.com/@JapanesewithVishal/playlists` | oEmbed: name "Japanese with Vishal", handle `@JapanesewithVishal`. About: "Japan Embassy-certified Japanese language trainer, JLPT N1 certified", studied/worked in Okayama. Videos: "JLPT N5 COURSE GUIDE ... IN HINDI", "JLPT N1/N2/N3 Full Information guide", "JLPT N4 & N5 Level Reading Practice Test with Answers in Hindi". 28 playlists listed; "JLPT Guide for beginners" and "Japanese Reading Playlist" fetched directly. |
| 5 | मायो जापान Mayo Japan | `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=eZsvEvHVVCc&format=json`; `https://www.youtube.com/@mayojapan`; `https://www.youtube.com/@mayojapan/videos`; `https://www.youtube.com/@mayojapan/playlists` | oEmbed: exact name "मायो जापान Mayo Japan", handle `@mayojapan`. About: "Main Hindi bolne wali Japani ladki hoon! ... videos about India and Japan in Hindi." Video confirmed: "Learn Japanese Greetings in Hindi"; other Hindi phrase videos and "30 जापानी वचन". Playlists "जापानी संस्कृति ! Japanese culture!" and "जापान घूमने चलें? Japan Tour with Mayo!" fetched. |
| 6 | Indo Sensei | `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=N2Ms9P73L7Q&format=json`; `https://www.youtube.com/@Indosensei`; `https://www.youtube.com/@Indosensei/videos`; `https://www.youtube.com/@Indosensei/playlists` | oEmbed: name "Indo Sensei", handle `@Indosensei`. About: "Learn Japanese Language in Hindi (जापानी हिंदी में) ... online classes in India in Hindi/English ... JLPT N5 and N4 ... Hiragana, Katakana and Kanji". Videos: "Hiragana Part 1–4 ... in Hindi and English", "How to use wa particle | जापानी भाषा में वा पार्टिकल". Playlists "Japanese Foundation Course", "Basic Japanese Vocabulary", "Japanese Writing" fetched. |
| 7 | Ohayou Japanese | `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=1MWO5OwF6DA&format=json`; `https://www.youtube.com/@OhayouJapanese`; `https://www.youtube.com/@OhayouJapanese/videos`; `https://www.youtube.com/@OhayouJapanese/playlists` | oEmbed: name "Ohayou Japanese", handle `@OhayouJapanese`. Videos: "JLPT N5 Question Solving Strategy ... in Hindi", "Minna no Nihongo N4 Lesson 28 Grammar Explained in Hindi", "How to Read and Write Hiragana Alphabet 1", "JLPT N5 Moji Goi ... (Hindi)". Playlists "N5 Grammar", "N4 Grammar", "n5 kanji" fetched. |
| 8 | Learn Japanese by SK | `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=tg1CdmJjNaU&format=json`; `https://www.youtube.com/@LearnJapanesebySK`; `https://www.youtube.com/@LearnJapanesebySK/videos`; `https://www.youtube.com/@LearnJapanesebySK/playlists` | oEmbed: name "Learn Japanese by SK", handle `@LearnJapanesebySK`. Videos: "Minna No Nihongo Lesson 1 Grammar| Learn Japanese in Hindi | JLPT N5", "Japanese में『に』और『で』कब लगाएं? | आसान Hindi Explanation", "Minna no Nihongo Lesson 3 Practice | Japanese Practice in Hindi". Playlists "Listening Practice", "Grammar Practice Videos", "JLPT N5 Kanji" fetched. |
| 9 | Japanese With Punam | `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=L1NP8nhCxx4&format=json`; `https://www.youtube.com/@japanesewithpunam9334`; `https://www.youtube.com/@japanesewithpunam9334/videos`; `https://www.youtube.com/@japanesewithpunam9334/playlists` | oEmbed: name "Japanese With Punam", handle `@japanesewithpunam9334`. About: "learning the Japanese language in your own mother tongue", "Japanese in Hindi", "Help you prepare for the JLPT exam". Videos: N2 grammar course (131 patterns), N3 grammar (110 patterns), N5/N4 kanji and "JLPT N3 Listening ... Hindi Explanation". Playlists "Hiragana", "JLPT N3 Hindi", "JLPT N4 Grammar", "N2" fetched. |
| 10 | Chauhan JLPT All levels | `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=ZYVV0a3dApY&format=json`; `https://www.youtube.com/@chauhanjlptalllevels`; `https://www.youtube.com/@chauhanjlptalllevels/videos`; `https://www.youtube.com/@chauhanjlptalllevels/playlists` | oEmbed: name "Chauhan JLPT All levels", handle `@chauhanjlptalllevels`. About: "Tarun Chauhan ... support you in learning Japanese language through Hindi". Videos: "JLPT N3 Grammar | Nihongo So-Matome ... Hindi Explanation", "Genki Lesson 8 Vocabulary | Easy Japanese Words Explained", "Japanese Kanji in Hindi". Playlists "N3" and "Kanji'sTrick" fetched. |
| 11 | GA Japanese Learning | `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=4qrSQHLrJYE&format=json`; `https://www.youtube.com/@GAJapaneselearningofficial`; `https://www.youtube.com/@GAJapaneselearningofficial/videos`; `https://www.youtube.com/@GAJapaneselearningofficial/playlists` | oEmbed: name "GA Japanese Learning", handle `@GAJapaneselearningofficial`. About: "Easy-to-follow lessons for JLPT N5 & N4 ... grammar, vocabulary, and kanji ... pronunciation tips ... Minna no Nihongo-based lessons". Videos: "Complete Hiragana Course ... in Hindi", "Learn ALL Japanese Language from Starting for New Beginners", "Learn Japanese Adverbs ... in Hindi". Playlists "Complete Hiragana Course for Beginners in Hindi", katakana course and N5 kanji course fetched. |
| 12 | Shige sensei | `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=JbT0ARytQsw&format=json`; `https://www.youtube.com/@shige_japani_guruji`; `https://www.youtube.com/@shige_japani_guruji/videos`; `https://www.youtube.com/@shige_japani_guruji/playlists` | oEmbed: name "Shige sensei", handle `@shige_japani_guruji`. Videos: "Hiragana① Japanese character kaise padhte hai? Kaise likhte hai?", "Katakana①/②/③", "[Hindi] Japani log sach mein Japani akshar padh sakte hai?(kanji)". Playlist "Hiragana&Katakana in Hindi!!!!" fetched. |
| 13 | Nihongo Pathshala by Karuna | `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=xLuCJ4ajKFA&format=json`; `https://www.youtube.com/@NihongoPathshalaByKaruna`; `https://www.youtube.com/@NihongoPathshalaByKaruna/videos`; `https://www.youtube.com/@NihongoPathshalaByKaruna/playlists` | oEmbed: name "Nihongo Pathshala by Karuna", handle `@NihongoPathshalaByKaruna`. About: "Japanese भाषा को हिंदी में आसान तरीके से सीखें", "JLPT N5, N4, N3", "Japan Study & Work Guidance". Videos: "JLPT N3 Grammar ようとする Explained in Hindi & English", "JLPT N3 Grammar ～とおりに | Hindi Explanation", "Minna no nihongo grammar Lesson #50". Playlists "Jlpt N3 grammar in Hindi" and "Japanese script" fetched. |
| 14 | Learn Japanese with Yuki Sensei | `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=BQZC246tDWA&format=json`; `https://www.youtube.com/@YukiDevi`; `https://www.youtube.com/@YukiDevi/videos`; `https://www.youtube.com/@YukiDevi/playlists` | oEmbed: name "Learn Japanese with Yuki Sensei", handle `@YukiDevi`. About: "I have been teaching Japanese to Indian over 20 years ... how to learn Japanese in Hindi". Video confirmed: "Learn Japanese in Hindi Lesson1 (Hiragana)". Channel has a numbered "JLPT N5 Kanji Test" series and an engineers' Japanese course for work in Japan. Playlists "Learn Japanese in Hindi" and "N4" fetched. |
| 15 | Nihongo With Parul | `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=2KXQjPpJus8&format=json`; `https://www.youtube.com/@Nihongowithparul`; `https://www.youtube.com/@Nihongowithparul/videos`; `https://www.youtube.com/@Nihongowithparul/playlists` | oEmbed: name "Nihongo With Parul", handle `@Nihongowithparul`. About: "JLPT N5 / N4/N3 preparation", "Hiragana, grammar & pronunciation", "beginners who want to start Japanese from zero". Videos: "Learn Katakana Complete Course in Hindi", "Learn Hiragana Complete Course in Hindi", "JLPT N5 Lesson 11 | Japanese Counters Explained in Hindi". Playlists "Minna no Nihongo N5 Complete Course (Hindi)", "Japanese Writing Scripts", "JLPT N3 Complete Grammar" fetched. |

## Playlist URL verification

All of these were fetched directly (HTTP 200, expected `og:title`) in addition to appearing on the channels' `/playlists` pages:

- `PLJnmf2_AZvXu2jgbP2yGstNvJksFZfCYx` — Japanese From 0 I Complete FREE  Course
- `PLSEI38thboWQ` — JLPT from Zero to N4
- `PLMD7iz1NAulebY6YDoVG_CFa-DXl69DrY` — Japanese For Beginners
- `PLI3T8MPXDawONZjRRJZMJI5gf2GS75osJ` — Japanese Language Series N5
- `PLI3T8MPXDawPHnuh_xYWGqIppbxdSGVl9` — Hiragana 3 Day Challenge
- `PLI3T8MPXDawO3NdQ9Sz_deU5T5WIMYdTW` — Katakana 3 Day Challenge
- `PLGO-PB6BdVZtMJD_B3gAIkeF7UbIXhMjw` — JLPT Guide for beginners
- `PLNgvSIPsQSYY` — Japanese Reading Playlist
- `PL8A9Nye0FxDHcmbBeaV1n1qNv1U2iDppf` — जापानी संस्कृति ! Japanese culture!
- `PL8A9Nye0FxDE6JQ8eM_XC32W4gWWK6lNg` — जापान घूमने चलें? Japan Tour with Mayo!
- `PL4jDEw46AELvsM39gGXG6QBJaaf2tbyJD` — Japanese Foundation Course
- `PL4jDEw46AELuZyumEJHpHL3iE0ExUCKq9` — Basic Japanese Vocabulary
- `PL4jDEw46AELsfaIzdldYf56nI_-AHCYRy` — Japanese Writing
- `PLeYdnJmvMOJyfbcYlene22cTTzEFXv2jC` — N5 Grammar
- `PLeYdnJmvMOJxFjAoEZxEBpPdYrcQ41rK9` — N4 Grammar
- `PLeYdnJmvMOJwyxZROCTwxrJcdPEccDgNY` — n5 kanji
- `PLWEXO33W2qtdgNQMP5TebnH4J_LXIDwVS` — Listening Practice
- `PLWEXO33W2qtf1M-QnN3wsGRphsNpvfkTf` — Grammar Practice Videos
- `PLWEXO33W2qtfIyu7Bn5mNgc1YKpAUN-el` — JLPT N5 Kanji
- `PLMAkVnQwv1pHVelBsc-sDRPeVFdABMPeO` — Hiragana
- `PLMAkVnQwv1pFebMbUeH3Us65M2pVtBtyD` — JLPT N3 Hindi
- `PLMAkVnQwv1pHKIZPaaqts_p0VnWXi3vH5` — JLPT N4 Grammar
- `PLMAkVnQwv1pHjNwii549VceTvGwSDt6Zf` — N2
- `PLZ9oJHrTDEgs` — N3
- `PLt3_FuUMq-IWmOqJd-_O3emrluBB-NkhZ` — Kanji'sTrick
- `PLaItBEX-Xpel5C0YI3bFLTcEXWxSbGVy0` — Complete Hiragana Course for Beginners in Hindi
- `PLaItBEX-Xpelfym_FKEwFuac-Jp0ZAFti` — LEARN JAPANESE KATAKANA WITH EASY & DETAILED EXPLANATION FOR JLPT N5 | IN HINDI |
- `PLaItBEX-XpekS4pN5aegvdbJiPTtWURr0` — JLPT N5 Kanji Easily Explained with Examples & Vocab | Japanese in Hindi
- `PL8WmZ6zNFQkQRN59BNpr6ZKaik2D9ReQf` — Hiragana&Katakana in Hindi!!!!
- `PLclkXhMyEB4MfLD4Wr59m1SSbrVnXX9FZ` — Jlpt N3 grammar in Hindi
- `PLclkXhMyEB4NYJtCk7raDqSzR837ACd2H` — Japanese script
- `PLlSkcqVXQKtiUoQiVuQqlgXaw-Om-DTlb` — Learn Japanese in Hindi
- `PLlSkcqVXQKtiSZybgzThGb6My4RXWT4lu` — N4
- `PLiYeJi-7TJTnf7vkHLHN-v7FgogrRBt3P` — Minna no Nihongo N5 Complete Course (Hindi) | Lesson 1–25 🇯🇵
- `PLWFZp6Mhmjls` — Japanese Writing Scripts
- `PLiYeJi-7TJTm7lkrygX2Qg0_J_WaTUZYk` — JLPT N3 Complete Grammar | Japanese Grammar for JLPT N3

## Rejected candidates (with reasons)

| Candidate | URL checked | Reason for rejection |
|---|---|---|
| Learn Japanese with JapanesePod101.com | `https://www.youtube.com/@JapanesePod101` (appeared in Hindi-titled search results) | Channel's own lessons are in English; Hindi-titled uploads are dubbed compilations, not Hindi-taught lessons. |
| Learn Japanese with Mayo & Indu | `https://www.youtube.com/@learnjapanesewithmayoindu9692` | About page now says "I teach the Japanese language in English!" and that only early videos were in Hindi. |
| JLPT MARATHI | `https://www.youtube.com/@JLPTMARATHI` | About page and most titles are Marathi; Hindi is only partial. Excluded to respect the Hindi/Hinglish teaching-language rule. |
| Japanese Language Channel | `https://www.youtube.com/@japaneselanguagechannel1418` | Teaches in Urdu and Hindi together; primary teaching language could not be established as Hindi/Hinglish. |
| StudyIn Daily Japanese | `https://www.youtube.com/@StudyInDailyJapanese` | Verified channel and videos, but titles/descriptions and lessons are English. |
| Learn Japanese for beginners 【 あいう 】 | `https://www.youtube.com/@JapaneseBeginnersChannel` | Some Hindi-titled conversation videos, but most uploads are Japanese/English immersion with English subtitles; teaching language not reliably Hindi. |
| Japanese Suki | `https://www.youtube.com/@JapaneseSuki88` | Older search snippets were in Hindi, but the current video description fetched from `https://www.youtube.com/watch?v=ai88mtke_P0` is English and the content is subtitle-based listening practice. |
| PickNihon | `https://www.youtube.com/@PickNihon` | English-language quizzes. |
| Japanese with Jaee | `https://www.youtube.com/@ensoschooloflanguages` | Verified channel, but about page/video evidence does not establish Hindi/Hinglish as the teaching language. |
| Rom Rom Ji | `https://www.youtube.com/@RomRomJi` | Hinglish India-in-Japan vlogs with occasional learning tips, not a Japanese-lessons channel. |
| Tokyo Hulchul | `https://www.youtube.com/@Ganeshjapan-n4h` | Hindi basic phrases and JLPT tips, but sparse/irregular teaching content; omitted in favour of 15 stronger verified channels. |
| Explore2Know | `https://www.youtube.com/@explorejapan2know` | Hindi Japanese-language videos confirmed, but very thin catalogue and generic "blogging channel" description; omitted due to the 15-creator cap. |

## Notes on fields left empty/null

- **Subscribers:** deliberately omitted from every object; no invented or copied counts.
- **avatarUrl:** every included channel had a real `og:image` from its fetched channel page; no placeholder URLs were used.
- **jlpt:** left empty only where no verified JLPT-specific lesson/playlist was found (Mayo Japan, Shige sensei).
- **featured:** reserved for channels with notably deep catalogues/active structured courses (7 channels); no guess based on unverified popularity claims.
