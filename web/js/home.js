/* Home dashboard. Every number comes from local progress/activity, never mocked. */
(function (OM) {
  'use strict';
  var u = OM.util, ui = OM.ui;
  OM.pages = OM.pages || {};

  function greeting() {
    var h = new Date().getHours();
    if (h < 5) return 'Still up?';
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  }

  function firstName() {
    var p = OM.store.get('profile', 'me', { displayName: 'Learner' });
    return (p.displayName || 'Learner').split(' ')[0];
  }

  function dailyGoal() {
    var p = OM.store.get('profile', 'me', { dailyGoal: 10 });
    return Number(p.dailyGoal || 10);
  }

  OM.pages.home = function () {
    var totals = OM.stats.totals();
    var today = OM.store.get('activity', u.todayKey(), { minutes: 0, quizzes: 0, lessons: 0 });
    var goal = dailyGoal();
    var doneToday = Math.min(goal, (today.minutes || 0) + (today.lessons || 0) + (today.quizzes || 0));
    var lessons = OM.data.get('lessons');
    var kana = OM.data.get('kana').filter(function (k) { return k.type === 'hiragana'; });
    var mastered = kana.filter(function (k) { return OM.progress.isDone('kana', k.id); }).length;
    var current = kana.length ? Math.min(mastered, kana.length - 1) : 0;
    var next = null;
    for (var i = 0; i < lessons.length; i++) {
      if (!OM.progress.isDone('lesson', lessons[i].id)) { next = lessons[i]; break; }
    }
    var ticks = kana.map(function (k, i) {
      return '<span class="tick' + (i < mastered ? ' done' : '') + (i === current ? ' current' : '') +
        '" title="' + u.esc(k.char + ' ' + k.romaji) + '"></span>';
    }).join('');

    var creatorPreview = OM.data.get('creators').slice(0, 3);
    var opportunities = OM.bridge.newsCache();
    var staticOps = OM.data.get('scholarships');
    var opPreview = (opportunities.length ? opportunities : staticOps).slice(0, 2);
    var opNote = opportunities.length ? 'Live official feed' : (staticOps.length ? 'Verified directory' : 'Official sources');

    return ui.header(greeting() + ', ' + firstName(), 'A little Japanese every day adds up.',
      { back: false, overline: 'OMJAPAN · YOUR JAPANESE JOURNEY' }) +

      '<section class="hero-card">' +
        '<div class="overline">TODAY · ' + u.esc(u.fmtDate(u.todayKey())) + '</div>' +
        '<h2>' + doneToday + ' / ' + goal + ' daily actions</h2>' +
        '<p>' + (doneToday >= goal ? 'Goal reached. Anything more is a bonus.' :
          'Keep the path warm — a quiz, a lesson or a few minutes of study all count.') + '</p>' +
        '<div style="margin-top:16px"><div class="small muted">HIRAGANA PATH · ' + mastered + '/' + (kana.length || 46) + '</div>' +
        '<div class="kana-path" aria-label="Hiragana mastery path">' + ticks + '</div></div>' +
      '</section>' +

      '<div class="stat-row">' +
        '<div class="stat accent"><b>' + totals.streak + '</b><span>Day streak</span></div>' +
        '<div class="stat"><b>' + (totals.accuracy === null ? '—' : totals.accuracy + '%') + '</b><span>Accuracy</span></div>' +
        '<div class="stat"><b>' + totals.words + '</b><span>Words learned</span></div>' +
      '</div>' +

      ui.section('Continue learning',
        next ? '<button class="card" data-go="/lesson/' + u.esc(next.id) + '" style="width:100%;text-align:left">' +
          '<div class="overline">' + u.esc(next.level) + ' · ' + u.esc(next.category) + ' · ' + u.esc(next.minutes) + ' MIN</div>' +
          '<div style="font-size:17px;font-weight:700;margin-top:6px">' + u.esc(next.title) + '</div>' +
          '<p class="small muted" style="margin-top:6px">' + u.esc(next.objective) + '</p>' +
          '<div class="tag tone-success" style="margin-top:12px">Continue lesson →</div></button>' :
          ui.empty('All lessons complete', 'You have finished the bundled lessons. Use JLPT practice or review mistakes.',
            '<button class="btn btn-ghost" data-go="/jlpt">JLPT practice</button>'),
        '<button class="link-btn" data-go="/learn">All paths</button>') +

      ui.section('Quick paths',
        '<div class="quick-grid">' +
          quick('kana', 'Kana', '46 basic characters', '/kana') +
          quick('search', 'Vocabulary', '222 level-tagged words', '/vocabulary') +
          quick('library', 'Kanji', '114 characters', '/kanji') +
          quick('learn', 'Grammar', 'N5 → N1 points', '/grammar') +
          quick('radar', 'Opportunity radar', 'Official updates', '/radar') +
          quick('star', 'Creators', 'Hindi Japanese teachers', '/creators') +
        '</div>') +

      (creatorPreview.length ? ui.section('Japanese learning creators',
        creatorPreview.map(creatorRow).join(''),
        '<button class="link-btn" data-go="/creators">See all</button>') : '') +

      ui.section('Opportunity radar',
        opPreview.length ? opPreview.map(function (o) {
          return '<button class="row" data-go="/radar/' + u.esc(o.id) + '">' +
            '<div class="avatar">' + OM.ui.icon('radar') + '</div>' +
            '<div class="row-main"><b>' + u.esc(o.title || o.program || 'Opportunity') + '</b>' +
            '<span>' + u.esc(o.institution || o.provider || o.sourceName || '') + ' · ' + u.esc(opNote) + '</span></div>' +
            '<div class="row-end">' + (o.deadline ? u.esc(o.deadline) : '') + '</div></button>';
        }).join('') : ui.empty('No cached opportunities yet',
          'Open the radar and refresh from official sources. The app works offline with whatever it has cached.',
          '<button class="btn btn-ghost" data-go="/radar">Open radar</button>'),
        '<button class="link-btn" data-go="/radar">Open</button>') +

      (totals.reviewDue ? '<div class="notice" style="margin-top:24px">' + totals.reviewDue +
        ' item' + (totals.reviewDue === 1 ? '' : 's') + ' marked for review. ' +
        '<button class="link-btn" data-go="/review">Review now →</button></div>' : '');

    function quick(icon, label, sub, path) {
      return '<button class="quick-card" data-go="' + path + '">' + ui.icon(icon) +
        '<b>' + u.esc(label) + '</b><span>' + u.esc(sub) + '</span></button>';
    }
    function creatorRow(c) {
      return '<button class="row" data-go="/creator/' + u.esc(c.id) + '">' +
        '<div class="avatar">' + (c.avatarUrl && navigator.onLine !== false ?
          '<img src="' + u.esc(c.avatarUrl) + '" alt="" loading="lazy">' :
          u.esc((c.name || '?').slice(0, 2).toUpperCase())) + '</div>' +
        '<div class="row-main"><b>' + u.esc(c.name) + '</b><span>' +
          u.esc((c.teachingLanguages || ['Hindi']).join('/')) +
          ' · ' + u.esc((c.subjects || []).slice(0, 2).join(', ')) + '</span></div>' +
        '<div class="row-end">' + ui.icon('youtube') + '</div></button>';
    }
  };
})(window.OM);
