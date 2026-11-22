/* Learning paths, detail sheets and the shared quiz engine. Data is lazy-loaded. */
(function (OM) {
  'use strict';
  var u = OM.util, ui = OM.ui;
  OM.pages = OM.pages || {};
  OM.state.filters = OM.state.filters || {};
  OM.state.limits = OM.state.limits || {};

  var LEVELS = ['All', 'N5', 'N4', 'N3', 'N2', 'N1'];

  function filter(scope) {
    if (!OM.state.filters[scope]) OM.state.filters[scope] = { level: 'All', category: 'all', q: '' };
    return OM.state.filters[scope];
  }

  function levelChips(scope, label) {
    var f = filter(scope);
    return '<div class="chip-row">' + LEVELS.map(function (l) {
      return ui.chip(l, { active: f.level === l, action: 'filter-level', value: l, scope: scope });
    }).join('') + '</div>' + (label ? '<div class="small muted">' + u.esc(label) + '</div>' : '');
  }

  function catChips(scope, cats) {
    var f = filter(scope);
    return '<div class="chip-row">' + cats.map(function (c) {
      return ui.chip(c === 'all' ? 'All' : c.replace(/^./, function (x) { return x.toUpperCase(); }),
        { active: f.category === c, action: 'filter-category', value: c, scope: scope });
    }).join('') + '</div>';
  }

  function searchBox(scope, placeholder) {
    return '<input class="search-input" type="search" data-action="filter-q" data-scope="' + scope +
      '" placeholder="' + u.esc(placeholder) + '" value="' + u.esc(filter(scope).q) + '" aria-label="' + u.esc(placeholder) + '">';
  }

  function matches(item, scope, fields) {
    var f = filter(scope);
    if (f.level !== 'All' && item.level && item.level !== f.level) return false;
    if (f.category !== 'all' && item.category && item.category !== f.category) return false;
    if (!f.q) return true;
    var q = f.q.toLowerCase();
    return fields.some(function (key) { return String(item[key] || '').toLowerCase().indexOf(q) !== -1; });
  }

  function paged(items, key, render, limit) {
    var max = OM.state.limits[key] || (limit || 30);
    var shown = items.slice(0, max);
    var html = shown.map(render).join('');
    if (items.length > max) {
      html += '<button class="btn btn-ghost" data-action="load-more" data-key="' + u.esc(key) +
        '" data-step="' + (limit || 30) + '">Show more · ' + (items.length - max) + ' left</button>';
    }
    return html;
  }

  /* ---------------- learn hub ---------------- */
  OM.pages.learn = function () {
    var lessons = OM.data.get('lessons');
    var done = lessons.filter(function (l) { return OM.progress.isDone('lesson', l.id); }).length;
    var paths = [
      ['kana', 'Kana', 'Hiragana + katakana', '92 chars', '/kana'],
      ['vocabulary', 'Vocabulary', 'N5 → N1 words', '222 words', '/vocabulary'],
      ['library', 'Kanji', 'Readings + compounds', '114 chars', '/kanji'],
      ['learn', 'Grammar', 'Patterns with examples', '58 points', '/grammar'],
      ['play', 'Listening', 'TTS drills', '12 drills', '/listening'],
      ['play', 'Speaking', 'Useful phrases', '10 phrases', '/speaking'],
      ['star', 'JLPT practice', 'Exam-style questions', '58 questions', '/jlpt'],
      ['search', 'Writing', 'Kanji form practice', 'trace prompts', '/writing']
    ];
    return ui.header('Learn', 'Choose a path. Everything here works offline.',
      { overline: 'LEARNING PATHS', action: '<button class="icon-btn" data-go="/analytics" aria-label="Analytics">' + ui.icon('star') + '</button>' }) +
      '<div class="hero-card"><div class="overline">YOUR LESSONS</div><h2>' + done + ' / ' + lessons.length + ' complete</h2>' +
      '<p>Lessons include an objective, short explanation, real examples and a quick check.</p>' +
      '<button class="btn btn-primary" style="margin-top:16px" data-go="/lesson/' + u.esc((lessons.find(function (l) { return !OM.progress.isDone('lesson', l.id); }) || lessons[0]).id) + '">Continue</button></div>' +
      ui.section('Paths', '<div class="quick-grid">' + paths.map(function (p) {
        return '<button class="quick-card" data-go="' + p[4] + '">' + ui.icon(p[0]) + '<b>' + u.esc(p[1]) +
          '</b><span>' + u.esc(p[2]) + '</span><span class="tag">' + u.esc(p[3]) + '</span></button>';
      }).join('') + '</div>') +
      ui.section('Structured lessons', levelChips('lessons') + paged(
        lessons.filter(function (l) { return matches(l, 'lessons', ['title', 'objective', 'category', 'level']); }),
        'lessons', function (l) {
          return '<button class="row" data-go="/lesson/' + u.esc(l.id) + '">' +
            '<div class="avatar">' + ui.icon('learn') + '</div><div class="row-main"><b>' + u.esc(l.title) + '</b>' +
            '<span>' + u.esc(l.level) + ' · ' + u.esc(l.category) + ' · ' + u.esc(l.minutes) + ' min</span></div>' +
            '<div class="row-end">' + (OM.progress.isDone('lesson', l.id) ? ui.icon('check') : '') + '</div></button>';
        }));
  };

  /* ---------------- kana ---------------- */
  OM.pages.kana = function (type) {
    type = type === 'katakana' || type === 'hiragana' ? type : 'hiragana';
    var f = filter('kana');
    var all = OM.data.get('kana').filter(function (k) { return k.type === type; });
    var groups = ['all'].concat(u.uniq(all.map(function (k) { return k.group; })));
    var list = all.filter(function (k) {
      return (f.category === 'all' || k.group === f.category) &&
        (!f.q || k.char === f.q || k.romaji.toLowerCase().indexOf(f.q.toLowerCase()) !== -1);
    });
    var mastered = all.filter(function (k) { return OM.progress.isDone('kana', k.id); }).length;
    return ui.header(type === 'hiragana' ? 'Hiragana' : 'Katakana',
      'Tap a character for its example and to mark it mastered.', { overline: 'KANA PATH', back: false }) +
      '<div class="chip-row"><button class="chip' + (type === 'hiragana' ? ' active' : '') + '" data-go="/kana/hiragana">Hiragana</button>' +
      '<button class="chip' + (type === 'katakana' ? ' active' : '') + '" data-go="/kana/katakana">Katakana</button></div>' +
      '<div class="stat-row" style="margin-bottom:20px"><div class="stat accent"><b>' + mastered + '/' + all.length + '</b><span>Mastered</span></div>' +
      '<div class="stat"><b>' + all.length + '</b><span>Characters</span></div>' +
      '<div class="stat"><b>' + Math.round((mastered / (all.length || 1)) * 100) + '%</b><span>Path</span></div></div>' +
      searchBox('kana', 'Search character or romaji') + catChips('kana', groups) +
      (list.length ? '<div class="kana-grid">' + list.map(function (k) {
        return '<button class="kana-tile' + (OM.progress.isDone('kana', k.id) ? ' done' : '') +
          '" data-action="kana-detail" data-id="' + u.esc(k.id) + '"><b>' + u.esc(k.char) + '</b><span>' + u.esc(k.romaji) + '</span></button>';
      }).join('') + '</div>' : ui.empty('No characters found', 'Try a different romaji or group.'));
  };

  OM.showKana = function (id) {
    var k = OM.data.find('kana', id);
    if (!k) return;
    ui.showSheet('<div class="news-top"><div><div class="overline">' + u.esc(k.type) + ' · ' + u.esc(k.group) + ' ROW</div>' +
      '<h2 style="font-size:64px;line-height:1.1;margin-top:8px">' + u.esc(k.char) + '</h2>' +
      '<p class="muted">' + u.esc(k.romaji) + ' · position ' + u.esc(k.position) + '</p></div>' +
      '<div style="display:flex;gap:8px">' + ui.speaker(k.example) + ui.bookmark('kana', k.id, k) + '</div></div>' +
      '<div class="card" style="margin-top:20px"><div class="overline">EXAMPLE</div>' +
      '<div class="example" style="margin-top:8px"><div class="jp-line"><span class="jp-main">' + u.esc(k.example) + '</span>' +
      '<span class="jp-roma">' + u.esc(k.exampleRomaji) + '</span></div><div class="en">' + u.esc(k.exampleMeaning) + '</div></div></div>' +
      '<button class="btn btn-primary" data-action="master-kana" data-id="' + u.esc(k.id) + '">' +
      (OM.progress.isDone('kana', k.id) ? 'Marked mastered ✓' : 'Mark as mastered') + '</button>',
      k.char + ' ' + k.romaji);
  };

  /* ---------------- vocabulary ---------------- */
  OM.pages.vocabulary = function () {
    var f = filter('vocabulary');
    var all = OM.data.get('vocabulary');
    var cats = ['all'].concat(u.uniq(all.map(function (v) { return v.category; })));
    var list = all.filter(function (v) { return matches(v, 'vocabulary', ['word', 'kana', 'romaji', 'meaning']); });
    return ui.header('Vocabulary', 'Real words, tagged by JLPT level and topic.', { overline: 'WORD LIBRARY' }) +
      searchBox('vocabulary', 'Search word, kana, romaji or meaning') + levelChips('vocabulary') + catChips('vocabulary', cats) +
      '<div class="small muted" style="margin-bottom:12px">' + list.length + ' of ' + all.length + ' words</div>' +
      (list.length ? paged(list, 'vocabulary', function (v) {
        return '<button class="row" data-action="vocab-detail" data-id="' + u.esc(v.id) + '">' +
          '<div class="avatar">' + u.esc(v.word.slice(0, 1)) + '</div><div class="row-main"><b>' + u.esc(v.word) +
          ' <span class="muted" style="font-size:12px">' + u.esc(v.kana) + '</span></b><span>' + u.esc(v.meaning) + '</span></div>' +
          '<div class="row-end"><span class="tag tone-' + u.levelColor(v.level) + '">' + u.esc(v.level) + '</span></div></button>';
      }) : ui.empty('No words match', 'Clear a filter or try another search term.'));
  };

  OM.showVocab = function (id) {
    var v = OM.data.find('vocabulary', id);
    if (!v) return;
    ui.showSheet('<div class="news-top"><div>' + ui.jp(v.word, v.kana, v.romaji) +
      '<p class="muted" style="margin-top:8px;font-size:16px">' + u.esc(v.meaning) + '</p></div>' +
      '<div style="display:flex;gap:8px">' + ui.speaker(v.word) + ui.bookmark('vocabulary', v.id, v) + '</div></div>' +
      '<div class="tags" style="margin:20px 0">' + ui.tag(v.level, u.levelColor(v.level)) + ui.tag(v.category) +
      (OM.progress.isDone('vocabulary', v.id) ? ui.tag('Learned', 'success') : '') + '</div>' +
      '<div class="btn-row"><button class="btn btn-ghost" data-action="quiz-vocab" data-id="' + u.esc(v.id) + '">Quick quiz</button>' +
      '<button class="btn btn-primary" data-action="learn-vocab" data-id="' + u.esc(v.id) + '">Mark learned</button></div>',
      v.word);
  };

  /* ---------------- kanji ---------------- */
  OM.pages.kanji = function () {
    var all = OM.data.get('kanji');
    var f = filter('kanji');
    var list = all.filter(function (k) { return matches(k, 'kanji', ['char', 'meaning', 'onyomi', 'kunyomi', 'radical']); });
    return ui.header('Kanji', 'Readings, radicals and real compounds.', { overline: 'CHARACTER LIBRARY' }) +
      searchBox('kanji', 'Search character, meaning or reading') + levelChips('kanji') +
      '<div class="small muted" style="margin-bottom:12px">' + list.length + ' of ' + all.length + ' characters</div>' +
      (list.length ? paged(list, 'kanji', function (k) {
        return '<button class="row" data-action="kanji-detail" data-id="' + u.esc(k.id) + '">' +
          '<div class="avatar" style="font-size:24px">' + u.esc(k.char) + '</div><div class="row-main"><b>' + u.esc(k.meaning) +
          '</b><span>' + u.esc(k.onyomi) + ' · ' + u.esc(k.kunyomi) + '</span></div>' +
          '<div class="row-end"><span class="tag">' + u.esc(k.level) + '</span></div></button>';
      }) : ui.empty('No kanji match', 'Try another reading or meaning.'));
  };

  OM.showKanji = function (id) {
    var k = OM.data.find('kanji', id);
    if (!k) return;
    ui.showSheet('<div class="news-top"><div><div style="font-size:64px;line-height:1">' + u.esc(k.char) + '</div>' +
      '<p class="muted" style="margin-top:6px">' + u.esc(k.meaning) + ' · grade ' + u.esc(k.grade) + '</p></div>' +
      '<div style="display:flex;gap:8px">' + ui.speaker(k.char) + ui.bookmark('kanji', k.id, k) + '</div></div>' +
      '<div class="card" style="margin-top:20px"><div class="overline">READINGS</div>' +
      '<p style="margin-top:8px"><b>Onyomi:</b> ' + u.esc(k.onyomi) + '</p><p><b>Kunyomi:</b> ' + u.esc(k.kunyomi || '—') + '</p>' +
      '<p class="small muted" style="margin-top:8px">' + u.esc(k.note) + '</p></div>' +
      '<div class="card"><div class="overline">COMPOUNDS</div>' +
      (k.compounds || []).map(function (c) { return '<div class="example" style="margin-top:8px">' + u.esc(c) + '</div>'; }).join('') + '</div>' +
      '<div class="btn-row"><button class="btn btn-ghost" data-action="quiz-kanji" data-id="' + u.esc(k.id) + '">Quick quiz</button>' +
      '<button class="btn btn-primary" data-action="learn-kanji" data-id="' + u.esc(k.id) + '">Mark learned</button></div>',
      k.char);
  };

  /* ---------------- writing ---------------- */
  OM.pages.writing = function () {
    var all = OM.data.get('kanji');
    var f = filter('kanji');
    var list = all.filter(function (k) { return matches(k, 'kanji', ['char', 'meaning']); }).slice(0, 40);
    return ui.header('Writing', 'Focus on form: radical, shape and one compound.', { overline: 'KANJI PRACTICE' }) +
      '<div class="notice">Trace each character with a finger or stylus on paper. The app shows the structure hint; it does not fake stroke animation.</div>' +
      searchBox('kanji', 'Find a character to trace') +
      (list.length ? '<div class="kana-grid" style="grid-template-columns:repeat(4,1fr);margin-top:16px">' + list.map(function (k) {
        return '<button class="kana-tile' + (OM.progress.isDone('kanji', k.id) ? ' done' : '') +
          '" data-action="kanji-detail" data-id="' + u.esc(k.id) + '"><b>' + u.esc(k.char) + '</b><span>' + u.esc(k.radical) + '</span></button>';
      }).join('') + '</div>' : ui.empty('No characters found', 'Try a different search.'));
  };

  /* ---------------- grammar ---------------- */
  OM.pages.grammar = function () {
    var all = OM.data.get('grammar');
    var f = filter('grammar');
    var list = all.filter(function (g) { return matches(g, 'grammar', ['title', 'pattern', 'explanation']); });
    return ui.header('Grammar', 'N5 through N1 patterns with genuine examples.', { overline: 'GRAMMAR REFERENCE' }) +
      searchBox('grammar', 'Search a pattern or title') + levelChips('grammar') +
      '<div class="small muted" style="margin-bottom:12px">' + list.length + ' of ' + all.length + ' points</div>' +
      (list.length ? paged(list, 'grammar', function (g) {
        return '<button class="row" data-action="grammar-detail" data-id="' + u.esc(g.id) + '">' +
          '<div class="row-main"><b>' + u.esc(g.title) + '</b><span>' + u.esc(g.pattern) + '</span></div>' +
          '<div class="row-end"><span class="tag tone-' + u.levelColor(g.level) + '">' + u.esc(g.level) + '</span></div></button>';
      }) : ui.empty('No grammar points match', 'Try another search or level.'));
  };

  OM.showGrammar = function (id) {
    var g = OM.data.find('grammar', id);
    if (!g) return;
    ui.showSheet('<div class="overline">' + u.esc(g.level) + ' · ' + u.esc(g.category) + '</div>' +
      '<h2 style="margin-top:6px">' + u.esc(g.title) + '</h2>' +
      '<div class="tag tone-success" style="margin-top:12px">' + u.esc(g.pattern) + '</div>' +
      '<p style="margin-top:20px">' + u.esc(g.explanation) + '</p>' +
      '<div class="overline" style="margin-top:24px">EXAMPLES</div>' +
      (g.examples || []).map(function (ex) {
        return '<div class="example" style="margin-top:10px">' + ui.jp(ex.jp, ex.kana, ex.romaji) +
          '<div class="en">' + u.esc(ex.en) + '</div>' +
          '<button class="link-btn" data-action="speak" data-text="' + u.esc(ex.jp) + '">▶ Listen</button></div>';
      }).join('') +
      '<div class="btn-row" style="margin-top:16px"><button class="btn btn-ghost" data-action="bookmark" data-type="grammar" data-id="' + u.esc(g.id) + '" data-data="' + u.esc(JSON.stringify(g)) + '">Bookmark</button>' +
      '<button class="btn btn-primary" data-action="learn-grammar" data-id="' + u.esc(g.id) + '">Mark studied</button></div>', g.title);
  };

  /* ---------------- listening & speaking ---------------- */
  OM.pages.listening = function () {
    var all = OM.data.get('listening');
    return ui.header('Listening', 'Play a phrase, then choose what you heard.', { overline: 'AUDIO DRILLS' }) +
      '<div class="notice">Uses the device Japanese text-to-speech voice. If no Japanese voice is installed, the Japanese text is shown so you can still study.</div>' +
      '<button class="btn btn-primary" style="margin-top:20px" data-action="quiz-listening">Start ' + all.length + ' drills</button>' +
      ui.section('Phrase bank', all.map(function (l) {
        return '<div class="row"><button class="icon-btn speaker" data-action="speak" data-text="' + u.esc(l.jp) + '" aria-label="Play">' + ui.icon('play') + '</button>' +
          '<div class="row-main"><b>' + u.esc(l.jp) + '</b><span>' + u.esc(l.kana) + '</span></div>' +
          '<div class="row-end">' + u.esc(l.en) + '</div></div>';
      }).join(''));
  };

  OM.pages.speaking = function () {
    var all = OM.data.get('speaking');
    return ui.header('Speaking', 'Phrases you can actually use, with tips.', { overline: 'SPEAKING PHRASES' }) +
      '<div class="card"><div class="overline">SHADOWING METHOD</div><p class="small muted" style="margin-top:8px">' +
      'Listen, repeat aloud, then say it once without looking. Record yourself on your phone and compare.</p></div>' +
      ui.section('Phrases', all.map(function (s) {
        return '<div class="card card-tight"><div class="news-top"><div>' + ui.jp(s.jp, s.kana, s.romaji) +
          '<p class="small muted" style="margin-top:6px">' + u.esc(s.en) + '</p></div>' +
          '<div style="display:flex;gap:8px"><button class="icon-btn speaker" data-action="speak" data-text="' + u.esc(s.jp) + '">' + ui.icon('play') + '</button>' +
          ui.bookmark('speaking', s.id, s) + '</div></div>' +
          '<p class="small muted" style="margin-top:10px">' + u.esc(s.tip) + '</p></div>';
      }).join(''));
  };

  /* ---------------- JLPT ---------------- */
  OM.pages.jlpt = function () {
    var all = OM.data.get('jlpt');
    var f = filter('jlpt');
    var list = all.filter(function (q) { return f.level === 'All' || q.level === f.level; });
    var counts = {};
    LEVELS.forEach(function (l) { if (l !== 'All') counts[l] = all.filter(function (q) { return q.level === l; }).length; });
    return ui.header('JLPT practice', 'Exam-style questions from the bundled question bank.', { overline: 'JLPT' }) +
      '<div class="hero-card"><div class="overline">QUESTION BANK</div><h2>' + all.length + ' questions</h2>' +
      '<p>Vocabulary, grammar, kanji and reading. Each answer shows why it is correct.</p>' +
      '<button class="btn btn-primary" style="margin-top:16px" data-action="quiz-jlpt" data-level="' + u.esc(f.level) + '">Start practice</button></div>' +
      levelChips('jlpt') +
      '<div class="stat-row">' + ['N5', 'N4', 'N3'].map(function (l) {
        return '<div class="stat"><b>' + counts[l] + '</b><span>' + l + ' questions</span></div>';
      }).join('') + '</div>' +
      '<div class="stat-row" style="margin-top:8px">' + ['N2', 'N1'].map(function (l) {
        return '<div class="stat"><b>' + counts[l] + '</b><span>' + l + ' questions</span></div>';
      }).join('') + '<div class="stat accent"><b>' + (OM.stats.accuracy() === null ? '—' : OM.stats.accuracy() + '%') + '</b><span>Accuracy</span></div></div>' +
      ui.section('Browse questions', paged(list, 'jlpt', function (q) {
        return '<div class="row"><div class="row-main"><b>' + u.esc(q.question) + '</b><span>' + u.esc(q.section) + '</span></div>' +
          '<div class="row-end"><span class="tag tone-' + u.levelColor(q.level) + '">' + u.esc(q.level) + '</span></div></div>';
      }));
  };

  /* ---------------- lesson detail ---------------- */
  OM.pages.lesson = function (id) {
    var l = OM.data.find('lessons', id);
    if (!l) return ui.header('Lesson not found', '', {}) + ui.empty('Lesson unavailable', 'This lesson is not in the bundled content.');
    return ui.header(l.title, l.level + ' · ' + l.category + ' · ' + l.minutes + ' min', { overline: 'LESSON ' + l.id }) +
      '<div class="hero-card"><div class="overline">OBJECTIVE</div><h2 style="font-size:23px">' + u.esc(l.objective) + '</h2>' +
      (OM.progress.isDone('lesson', l.id) ? '<div class="tag tone-success" style="margin-top:14px">Completed</div>' : '') + '</div>' +
      ui.section('Explanation', (l.sections || []).map(function (s) {
        return '<div class="card"><div class="overline">' + u.esc(s.heading) + '</div><p style="margin-top:8px">' + u.esc(s.text) + '</p></div>';
      }).join('')) +
      ui.section('Examples', (l.examples || []).map(function (ex) {
        return '<div class="example">' + ui.jp(ex.jp, ex.kana, ex.romaji) + '<div class="en">' + u.esc(ex.en) + '</div>' +
          '<button class="link-btn" data-action="speak" data-text="' + u.esc(ex.jp) + '">▶ Listen</button></div>';
      }).join('')) +
      '<button class="btn btn-primary" style="margin-top:24px" data-action="quiz-lesson" data-id="' + u.esc(l.id) + '">' +
      'Check understanding · ' + (l.practice || []).length + ' questions</button>' +
      '<div class="btn-row"><button class="btn btn-ghost" data-action="bookmark" data-type="lesson" data-id="' + u.esc(l.id) + '" data-data="' + u.esc(JSON.stringify(l)) + '">Bookmark lesson</button>' +
      '<button class="btn btn-ghost" data-action="complete-lesson" data-id="' + u.esc(l.id) + '">Mark complete</button></div>';
  };

  /* ---------------- review ---------------- */
  OM.pages.review = function () {
    var mistakes = OM.store.all('mistakes');
    return ui.header('Review', 'Items you answered incorrectly are collected here.', { overline: 'SPACED REVIEW' }) +
      (mistakes.length ? ui.section(mistakes.length + ' to review', paged(mistakes, 'review', function (m) {
        return '<div class="row"><div class="avatar">' + ui.icon('star') + '</div><div class="row-main"><b>' +
          u.esc(m.type || 'practice') + '</b><span>ID ' + u.esc(m.id || '—') + ' · ' + u.esc(m.count || 1) + ' miss' + ((m.count || 1) === 1 ? '' : 'es') + '</span></div>' +
          '<div class="row-end">' + u.esc(u.ago(Math.floor((m.at || Date.now()) / 1000))) + '</div></div>';
      })) + '<button class="btn btn-primary" data-action="quiz-jlpt" data-level="All">Practice again</button>' :
        ui.empty('Nothing to review yet', 'Wrong answers will appear here after a quiz.'));
  };

  /* ---------------- quiz engine ---------------- */
  function toQuestion(q, source) {
    return {
      q: q.q || q.question,
      options: q.options,
      answer: q.answer,
      explanation: q.explanation || q.answerText || 'Review this item in the learning path.',
      source: source
    };
  }

  function makeChoice(item, field, source, distractors) {
    var correct = item[field];
    var pool = u.shuffle(distractors.filter(function (v) { return v && v !== correct; })).slice(0, 3);
    var opts = u.shuffle([correct].concat(pool));
    return { q: 'What does 「' + item[field] + '」 mean?', options: opts, answer: opts.indexOf(correct),
      explanation: correct, source: source };
  }

  OM.startQuiz = function (kind, id, level) {
    var questions = [];
    if (kind === 'lesson') {
      var l = OM.data.find('lessons', id);
      questions = (l && l.practice || []).map(function (q) { return toQuestion(q, 'lesson'); });
    } else if (kind === 'jlpt') {
      questions = OM.data.get('jlpt').filter(function (q) {
        return (!level || level === 'All' || q.level === level);
      }).map(function (q) { return toQuestion(q, 'jlpt'); });
    } else if (kind === 'listening') {
      questions = OM.data.get('listening').map(function (q) {
        return { q: q.jp + '\n' + q.question, options: q.options, answer: q.answer,
          explanation: '「' + q.kana + '」 = ' + q.en, source: 'listening', speak: q.jp };
      });
    } else if (kind === 'vocab') {
      var vs = OM.data.get('vocabulary');
      var v = OM.data.find('vocabulary', id);
      if (v) questions = [makeChoice(v, 'meaning', 'vocabulary', vs.map(function (x) { return x.meaning; }))];
    } else if (kind === 'kanji') {
      var ks = OM.data.get('kanji');
      var k = OM.data.find('kanji', id);
      if (k) questions = [makeChoice(k, 'meaning', 'kanji', ks.map(function (x) { return x.meaning; }))];
    }
    if (!questions.length) { OM.bridge.toast('No questions available for this selection.'); return; }
    questions = u.shuffle(questions).slice(0, 15);
    OM.state.quiz = { kind: kind, id: id || '', questions: questions, index: 0, correct: 0,
      wrong: [], answered: false, selected: -1 };
    OM.go('/quiz');
  };

  OM.pages.quiz = function () {
    var qz = OM.state.quiz;
    if (!qz) return ui.header('Quiz', '', {}) + ui.empty('No active quiz', 'Start a quiz from a lesson or a practice path.');
    if (qz.index >= qz.questions.length) return quizResult(qz);
    var q = qz.questions[qz.index];
    var opts = q.options.map(function (opt, i) {
      var cls = 'option';
      if (qz.answered) {
        if (i === q.answer) cls += ' correct';
        else if (i === qz.selected) cls += ' wrong';
      }
      return '<button class="' + cls + '" data-action="answer" data-index="' + i + '">' +
        '<span class="tag">' + String.fromCharCode(65 + i) + '</span><span>' + u.esc(opt) + '</span></button>';
    }).join('');
    return ui.header('Question ' + (qz.index + 1) + ' / ' + qz.questions.length,
      'Correct so far: ' + qz.correct, { overline: (qz.kind || 'PRACTICE').toUpperCase() }) +
      '<div class="card"><div class="quiz-q">' + u.esc(q.q).replace(/\n/g, '<br>') + '</div>' +
      (q.speak ? '<button class="icon-btn speaker" data-action="speak" data-text="' + u.esc(q.speak) + '" aria-label="Play audio">' + ui.icon('play') + '</button>' : '') +
      '<div style="margin-top:16px">' + opts + '</div>' +
      (qz.answered ? '<p class="quiz-feedback">' + u.esc(q.explanation) + '</p>' +
        '<button class="btn btn-primary" data-action="next-question">' +
        (qz.index === qz.questions.length - 1 ? 'See result' : 'Next question') + '</button>' : '') +
      '</div>';
  };

  function quizResult(qz) {
    var total = qz.questions.length;
    var pct = Math.round((qz.correct / total) * 100);
    var id = qz.id || (qz.kind + '-set');
    if (qz.kind === 'lesson') OM.progress.set('lesson', id, qz.correct === total ? 'mastered' : 'completed', pct);
    OM.stats.addQuiz(qz.correct, total, qz.kind, id);
    OM.stats.activity({ minutes: Math.max(1, Math.round(total / 4)) });
    if (qz.kind === 'lesson') OM.stats.activity({ lessons: 1 });
    return ui.header('Result', qz.kind + ' practice', { overline: 'WELL DONE' }) +
      '<div class="hero-card" style="text-align:center"><div class="overline">YOUR SCORE</div>' +
      '<div class="score-hero">' + pct + '%</div><p>' + qz.correct + ' of ' + total + ' correct</p></div>' +
      (qz.wrong.length ? ui.section('Review these', qz.wrong.map(function (w) {
        return '<div class="card card-tight"><b>' + u.esc(w.q) + '</b><p class="small muted" style="margin-top:6px">' +
          u.esc(w.explanation) + '</p></div>';
      }).join('')) : '<div class="notice">No mistakes this time. Your accuracy has been recorded locally.</div>') +
      '<div class="btn-row" style="margin-top:20px"><button class="btn btn-ghost" data-action="quiz-again">Retry</button>' +
      '<button class="btn btn-primary" data-go="/learn">Back to learning</button></div>';
  }

  OM.answerQuestion = function (index) {
    var qz = OM.state.quiz;
    if (!qz || qz.answered || qz.index >= qz.questions.length) return;
    var q = qz.questions[qz.index];
    qz.answered = true;
    qz.selected = index;
    if (index === q.answer) qz.correct++;
    else qz.wrong.push(q);
    OM.render();
  };

  OM.nextQuestion = function () {
    var qz = OM.state.quiz;
    if (!qz) return;
    qz.index++;
    qz.answered = false;
    qz.selected = -1;
    OM.render();
  };
})(window.OM);
