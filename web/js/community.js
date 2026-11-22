/* Creators, global search, library, analytics, settings, About and privacy. */
(function (OM) {
  'use strict';
  var u = OM.util, ui = OM.ui;
  OM.pages = OM.pages || {};
  OM.state.filters = OM.state.filters || {};

  function avatar(c, size) {
    if (c.avatarUrl && navigator.onLine !== false) {
      return '<img src="' + u.esc(c.avatarUrl) + '" alt="" loading="lazy" style="width:' + (size || 48) +
        'px;height:' + (size || 48) + 'px;border-radius:14px;object-fit:cover">';
    }
    return u.esc((c.name || '?').slice(0, 2).toUpperCase());
  }

  /* ---------------- creators ---------------- */
  OM.pages.creators = function () {
    var all = OM.data.get('creators');
    if (!OM.state.filters.creators) OM.state.filters.creators = { q: '', sort: 'featured', category: 'all', language: 'all' };
    var f = OM.state.filters.creators;
    var cats = ['all'].concat(u.uniq(all.reduce(function (a, c) { return a.concat(c.categories || []); }, []))).slice(0, 14);
    var langs = ['all'].concat(u.uniq(all.reduce(function (a, c) { return a.concat(c.teachingLanguages || []); }, [])));
    var list = all.filter(function (c) {
      if (f.category !== 'all' && (c.categories || []).indexOf(f.category) === -1) return false;
      if (f.language !== 'all' && (c.teachingLanguages || []).indexOf(f.language) === -1) return false;
      if (f.q) {
        var hay = (c.name + ' ' + c.handle + ' ' + c.description + ' ' +
          (c.subjects || []).join(' ') + ' ' + (c.jlpt || []).join(' ')).toLowerCase();
        if (hay.indexOf(f.q.toLowerCase()) === -1) return false;
      }
      return true;
    });
    if (f.sort === 'name') list.sort(function (a, b) { return a.name.localeCompare(b.name); });
    else list.sort(function (a, b) { return (b.featured ? 1 : 0) - (a.featured ? 1 : 0); });

    return ui.header('Japanese learning creators',
      'Verified Hindi / Hinglish teachers. Links open the real channel externally.',
      { overline: 'CREATOR DIRECTORY' }) +
      '<div class="notice">Only channels verified from YouTube metadata are listed. No subscriber counts or invented video links are shown. Avatars load only when online.</div>' +
      '<input class="search-input" style="margin-top:16px" type="search" data-action="creator-q" placeholder="Search name, subject or JLPT level" value="' + u.esc(f.q) + '" aria-label="Search creators">' +
      '<div class="chip-row" style="margin-top:12px">' + langs.map(function (l) {
        return ui.chip(l === 'all' ? 'All languages' : l, { active: f.language === l, action: 'creator-language', value: l });
      }).join('') + '</div>' +
      '<div class="chip-row">' + [['featured', 'Featured'], ['name', 'A → Z']].map(function (p) {
        return ui.chip(p[1], { active: f.sort === p[0], action: 'creator-sort', value: p[0] });
      }).join('') + '</div>' +
      '<div class="chip-row">' + cats.map(function (c) {
        return ui.chip(c === 'all' ? 'All topics' : c.replace(/^./, function (x) { return x.toUpperCase(); }),
          { active: f.category === c, action: 'creator-category', value: c });
      }).join('') + '</div>' +
      ui.section('Verified channels (' + list.length + ')',
        list.length ? list.map(function (c) {
          return '<button class="card" style="width:100%;text-align:left" data-go="/creator/' + u.esc(c.id) + '">' +
            '<div class="news-top"><div style="display:flex;gap:12px;min-width:0">' +
            '<div class="avatar" style="padding:0">' + avatar(c) + '</div>' +
            '<div style="min-width:0"><b style="font-size:15px">' + u.esc(c.name) + '</b>' +
            '<p class="small muted">' + u.esc(c.handle) + ' · ' + u.esc((c.teachingLanguages || []).join('/')) + '</p></div></div>' +
            (c.featured ? ui.tag('Featured') : '') + '</div>' +
            '<p class="small muted" style="margin-top:10px">' + u.esc(c.description.slice(0, 130)) +
            (c.description.length > 130 ? '…' : '') + '</p>' +
            '<div class="tags">' + (c.jlpt || []).map(function (l) { return ui.tag(l, u.levelColor(l)); }).join('') +
            (c.subjects || []).slice(0, 2).map(function (s) { return ui.tag(s); }).join('') + '</div></button>';
        }).join('') : ui.empty('No creators match', 'Try another topic or clear the search.'));
  };

  OM.pages.creator = function (id) {
    var c = OM.data.find('creators', id);
    if (!c) return ui.header('Creator not found', '', {}) + ui.empty('Creator unavailable', 'This channel is not in the verified directory.');
    return ui.header(c.name, c.handle + ' · ' + (c.teachingLanguages || []).join('/'), { overline: 'VERIFIED CREATOR' }) +
      '<div class="hero-card" style="display:flex;gap:16px;align-items:center">' +
      '<div class="avatar" style="padding:0;width:64px;height:64px;flex-basis:64px">' + avatar(c, 64) + '</div>' +
      '<div><h2 style="font-size:21px">' + u.esc(c.name) + '</h2><p>' + u.esc(c.handle) +
      ' · verified ' + u.esc(c.verifiedOn || '—') + '</p></div></div>' +
      '<p>' + u.esc(c.description) + '</p>' +
      '<div class="tags" style="margin-top:16px">' + (c.jlpt || []).map(function (l) { return ui.tag(l, u.levelColor(l)); }).join('') +
      (c.subjects || []).map(function (s) { return ui.tag(s); }).join('') +
      (c.levels || []).map(function (l) { return ui.tag(l); }).join('') + '</div>' +
      '<button class="btn btn-primary" style="margin-top:20px" data-action="open" data-url="' + u.esc(c.channelUrl) + '">' +
      'Open YouTube channel ' + ui.icon('external') + '</button>' +
      ui.section('Verified playlists',
        (c.playlists || []).length ? c.playlists.map(function (p) {
          return '<button class="row" data-action="open" data-url="' + u.esc(p.url) + '">' +
            '<div class="avatar">' + ui.icon('play') + '</div><div class="row-main"><b>' + u.esc(p.title) +
            '</b><span>Playlist · verified link</span></div><div class="row-end">' + ui.icon('external') + '</div></button>';
        }).join('') : ui.empty('No playlists verified', 'Only the channel link is available for this creator.')) +
      ui.section('Verification', '<p class="small muted">Channel and playlist links were checked against YouTube metadata on ' +
        u.esc(c.verifiedOn || 'the verification date') + '. The app never embeds video players.</p>' +
        '<button class="btn btn-ghost" style="margin-top:12px" data-action="bookmark" data-type="creator" data-id="' +
        u.esc(c.id) + '" data-data="' + u.esc(JSON.stringify(c)) + '">Save creator</button>');
  };

  /* ---------------- global search ---------------- */
  OM.pages.search = function () {
    if (!OM.state.filters.search) OM.state.filters.search = { q: '' };
    var q = OM.state.filters.search.q.trim();
    var groups = q.length >= 2 ? searchAll(q) : [];
    return ui.header('Search', 'One search across lessons, words, kanji, grammar, creators and opportunities.',
      { overline: 'LIBRARY SEARCH', back: false }) +
      '<input class="search-input" type="search" data-action="global-q" placeholder="Try 「は」, JLPT N4, scholarship, Hindi" value="' + u.esc(q) + '" aria-label="Global search">' +
      (q.length < 2 ? ui.empty('Type at least two characters', 'Search runs locally over bundled content and your saved items.') :
        (groups.length ? groups.map(function (g) {
          return ui.section(g.title + ' (' + g.items.length + ')', g.items.slice(0, 8).map(g.render).join(''));
        }).join('') : ui.empty('Nothing found', 'Try a different spelling, kana or romaji.')));
  };

  function resultRow(title, sub, action, attrs) {
    var data = Object.keys(attrs || {}).map(function (k) { return ' data-' + k + '="' + u.esc(attrs[k]) + '"'; }).join('');
    return '<button class="row" data-action="' + action + '"' + data + '>' +
      '<div class="avatar">' + ui.icon('search') + '</div><div class="row-main"><b>' + u.esc(title) +
      '</b><span>' + u.esc(sub) + '</span></div><div class="row-end">' + ui.icon('external') + '</div></button>';
  }

  function searchAll(q) {
    var lower = q.toLowerCase();
    var has = function (s) { return String(s || '').toLowerCase().indexOf(lower) !== -1; };
    var groups = [];
    var vocab = OM.data.get('vocabulary').filter(function (x) {
      return has(x.word) || has(x.kana) || has(x.romaji) || has(x.meaning);
    });
    if (vocab.length) groups.push({ title: 'Vocabulary', items: vocab, render: function (v) {
      return resultRow(v.word + ' · ' + v.meaning, v.kana + ' · ' + v.level, 'vocab-detail', { id: v.id });
    } });
    var kanji = OM.data.get('kanji').filter(function (x) {
      return has(x.char) || has(x.meaning) || has(x.onyomi) || has(x.kunyomi);
    });
    if (kanji.length) groups.push({ title: 'Kanji', items: kanji, render: function (k) {
      return resultRow(k.char + ' · ' + k.meaning, k.onyomi + ' · ' + k.level, 'kanji-detail', { id: k.id });
    } });
    var grammar = OM.data.get('grammar').filter(function (x) {
      return has(x.title) || has(x.pattern) || has(x.explanation);
    });
    if (grammar.length) groups.push({ title: 'Grammar', items: grammar, render: function (g) {
      return resultRow(g.title, g.pattern + ' · ' + g.level, 'grammar-detail', { id: g.id });
    } });
    var lessons = OM.data.get('lessons').filter(function (x) {
      return has(x.title) || has(x.objective) || has(x.category);
    });
    if (lessons.length) groups.push({ title: 'Lessons', items: lessons, render: function (l) {
      return resultRow(l.title, l.level + ' · ' + l.category, 'go', { go: '/lesson/' + l.id });
    } });
    var kana = OM.data.get('kana').filter(function (x) { return has(x.char) || has(x.romaji) || has(x.exampleMeaning); });
    if (kana.length) groups.push({ title: 'Kana', items: kana, render: function (k) {
      return resultRow(k.char + ' · ' + k.romaji, k.type + ' · ' + k.exampleMeaning, 'kana-detail', { id: k.id });
    } });
    var jlpt = OM.data.get('jlpt').filter(function (x) { return has(x.question); });
    if (jlpt.length) groups.push({ title: 'JLPT questions', items: jlpt, render: function (j) {
      return resultRow(j.question, j.level + ' · ' + j.section, 'go', { go: '/jlpt' });
    } });
    var creators = OM.data.get('creators').filter(function (x) {
      return has(x.name) || has(x.handle) || has(x.description) || has((x.subjects || []).join(' '));
    });
    if (creators.length) groups.push({ title: 'Creators', items: creators, render: function (c) {
      return resultRow(c.name, c.handle + ' · ' + (c.teachingLanguages || []).join('/'), 'go', { go: '/creator/' + c.id });
    } });
    var opportunities = OM.bridge.newsCache().concat(OM.data.get('scholarships')).filter(function (x) {
      return has(x.title) || has(x.program) || has(x.summary) || has(x.provider || x.institution);
    });
    if (opportunities.length) groups.push({ title: 'Opportunities', items: opportunities, render: function (o) {
      return resultRow(o.title || o.program, o.provider || o.institution || 'Official source', 'go',
        { go: '/radar/' + (o.id || '') });
    } });
    var saved = OM.bookmarks.all().filter(function (b) { return has(JSON.stringify(b.data || {})); });
    if (saved.length) groups.push({ title: 'Saved', items: saved, render: function (b) {
      return resultRow(b.type + ': ' + (b.data && (b.data.title || b.data.word || b.data.name || b.id)),
        'Bookmarked on your device', 'go', { go: '/' + (b.type === 'opportunity' ? 'radar' : b.type) });
    } });
    return groups;
  }

  /* ---------------- library ---------------- */
  OM.pages.library = function () {
    var marks = OM.bookmarks.all();
    var progress = OM.store.all('progress');
    var cache = OM.bridge.newsCache();
    return ui.header('Library', 'Everything you saved, learned or cached on this device.', { overline: 'YOUR LIBRARY' }) +
      '<div class="stat-row"><div class="stat accent"><b>' + marks.length + '</b><span>Bookmarks</span></div>' +
      '<div class="stat"><b>' + progress.length + '</b><span>Progress items</span></div>' +
      '<div class="stat"><b>' + cache.length + '</b><span>Cached updates</span></div></div>' +
      ui.section('Bookmarks', marks.length ? marks.map(function (b) {
        var d = b.data || {};
        var title = d.title || d.word || d.char || d.name || b.id;
        var path = b.type === 'opportunity' ? '/radar/' + b.id :
          b.type === 'creator' ? '/creator/' + b.id : '/search';
        return '<div class="row"><div class="avatar">' + ui.icon('bookmark') + '</div>' +
          '<div class="row-main"><b>' + u.esc(title) + '</b><span>' + u.esc(b.type) + '</span></div>' +
          '<button class="icon-btn on" data-action="bookmark" data-type="' + u.esc(b.type) + '" data-id="' + u.esc(b.id) + '">' +
          ui.icon('bookmark') + '</button><button class="link-btn" data-go="' + u.esc(path) + '">Open</button></div>';
      }).join('') : ui.empty('No bookmarks yet', 'Use the bookmark button on any word, kanji, lesson, creator or opportunity.')) +
      ui.section('Study progress', progress.length ? progress.slice(0, 30).map(function (p) {
        return '<div class="row"><div class="avatar">' + ui.icon('check') + '</div><div class="row-main"><b>' +
          u.esc(p.key || p.id) + '</b><span>' + u.esc(p.status || 'studied') +
          (p.score !== undefined ? ' · ' + p.score + '%' : '') + '</span></div></div>';
      }).join('') : ui.empty('No progress recorded', 'Finish a lesson or mark an item learned to see it here.')) +
      ui.section('Offline content', '<p class="small muted">All lessons, kana, vocabulary, kanji, grammar and JLPT questions are bundled in the APK. ' +
        'Opportunity updates are cached when you refresh while online.</p>' +
        '<button class="btn btn-ghost" style="margin-top:12px" data-action="preload">Preload content into memory</button>');
  };

  /* ---------------- analytics ---------------- */
  OM.pages.analytics = function () {
    var totals = OM.stats.totals();
    var history = OM.stats.quizHistory();
    var days = [];
    for (var i = 6; i >= 0; i--) {
      var d = new Date(); d.setDate(d.getDate() - i);
      var key = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
      var a = OM.store.get('activity', key, { minutes: 0, quizzes: 0, lessons: 0 });
      days.push({ key: key, label: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][d.getDay()],
        value: (a.minutes || 0) + (a.lessons || 0) + (a.quizzes || 0) });
    }
    var max = Math.max.apply(null, days.map(function (d) { return d.value; }).concat([1]));
    return ui.header('Analytics', 'Measured only from your own study activity on this device.', { overline: 'PROGRESS' }) +
      '<div class="stat-row"><div class="stat accent"><b>' + totals.streak + '</b><span>Day streak</span></div>' +
      '<div class="stat"><b>' + (totals.accuracy === null ? '—' : totals.accuracy + '%') + '</b><span>Accuracy</span></div>' +
      '<div class="stat"><b>' + totals.minutes + '</b><span>Minutes</span></div></div>' +
      '<div class="stat-row" style="margin-top:8px"><div class="stat"><b>' + totals.lessons + '</b><span>Lessons</span></div>' +
      '<div class="stat"><b>' + totals.words + '</b><span>Words</span></div>' +
      '<div class="stat"><b>' + totals.kanji + '</b><span>Kanji</span></div></div>' +
      ui.section('Last 7 days', '<div style="display:flex;align-items:flex-end;gap:8px;height:150px;padding:12px 0">' +
        days.map(function (d) {
          return '<div style="flex:1;text-align:center"><div style="height:' + Math.max(3, Math.round((d.value / max) * 110)) +
            'px;background:var(--accent);border-radius:6px 6px 2px 2px;margin:0 auto 8px;width:100%;max-width:28px;opacity:' +
            (d.value ? 1 : .25) + '"></div><span class="small muted">' + u.esc(d.label) + '</span></div>';
        }).join('') + '</div>') +
      ui.section('Quiz history', history.length ? history.slice(-10).reverse().map(function (h) {
        return '<div class="row"><div class="avatar">' + ui.icon('star') + '</div><div class="row-main"><b>' +
          u.esc(h.type || 'quiz') + ' · ' + u.esc(h.correct || 0) + '/' + u.esc(h.total || 0) +
          '</b><span>' + u.esc(u.ago(Math.floor((h.at || Date.now()) / 1000))) + '</span></div></div>';
      }).join('') : ui.empty('No quiz history yet', 'Your results will appear here after the first quiz.')) +
      '<p class="small muted" style="margin-top:20px">Nothing is uploaded. These values are read from the local database.</p>';
  };

  /* ---------------- more + settings ---------------- */
  OM.pages.more = function () {
    var cfg = OM.cfg;
    return ui.header('More', 'Settings, library and information about OMJAPAN.', { overline: 'OMJAPAN', back: false }) +
      '<div class="hero-card"><div class="overline">ABOUT</div><h2>Made by ' + u.esc(cfg.developer.name) + '</h2>' +
      '<p>' + u.esc(cfg.developer.youtubeHandle) + ' · version ' + u.esc(cfg.version) + '</p></div>' +
      ui.section('Your space', [
        ['/library', 'library', 'Library & bookmarks'], ['/analytics', 'star', 'Analytics'],
        ['/review', 'learn', 'Review mistakes']
      ].map(function (p) { return linkRow(p[0], p[1], p[2]); }).join('')) +
      ui.section('Discover', [
        ['/creators', 'youtube', 'Japanese learning creators'], ['/radar', 'radar', 'Japan Opportunity Radar']
      ].map(function (p) { return linkRow(p[0], p[1], p[2]); }).join('')) +
      ui.section('Preferences & information', [
        ['/settings', 'more', 'Settings'], ['/about', 'learn', 'About OMJAPAN'],
        ['/privacy', 'check', 'Privacy & data']
      ].map(function (p) { return linkRow(p[0], p[1], p[2]); }).join('')) +
      '<button class="row" data-action="open" data-url="' + u.esc(cfg.githubUrl) + '">' +
      '<div class="avatar">' + ui.icon('external') + '</div><div class="row-main"><b>GitHub repository</b><span>Source, issues and releases</span></div></button>' +
      '<p class="small muted" style="margin-top:24px;text-align:center">OMJAPAN v' + u.esc(cfg.version) +
      ' · offline-first · no account required</p>';
  };

  function linkRow(path, icon, label) {
    return '<button class="row" data-go="' + path + '"><div class="avatar">' + ui.icon(icon) +
      '</div><div class="row-main"><b>' + u.esc(label) + '</b></div><div class="row-end">' + ui.icon('back') + '</div></button>';
  }

  function toggle(label, sub, action, on) {
    return '<div class="check-row"><div style="flex:1"><b>' + u.esc(label) + '</b><div class="small muted">' + u.esc(sub) + '</div></div>' +
      '<button class="check-box' + (on ? ' done' : '') + '" data-action="' + action + '" aria-label="Toggle ' +
      u.esc(label) + '">' + (on ? ui.icon('check') : '') + '</button></div>';
  }

  OM.pages.settings = function () {
    var s = OM.state.settings;
    var p = OM.store.get('profile', 'me', { dailyGoal: 10, jlptTarget: 'N5', displayName: 'Learner' });
    return ui.header('Settings', 'Stored locally on this device. No account needed.', { overline: 'PREFERENCES' }) +
      ui.section('Appearance',
        '<div class="field-label">Theme</div><div class="chip-row">' +
        [['dark', 'Dark'], ['contrast', 'Dark · high contrast']].map(function (o) {
          return ui.chip(o[1], { active: (s.theme || 'dark') === o[0], action: 'set-theme', value: o[0] });
        }).join('') + '</div>' +
        '<div class="field-label">Accent</div><div class="chip-row">' +
        [['lime', 'Lime'], ['cyan', 'Cyan'], ['amber', 'Amber']].map(function (o) {
          return ui.chip(o[1], { active: (s.accent || 'lime') === o[0], action: 'set-accent', value: o[0] });
        }).join('') + '</div>' +
        toggle('Reduce motion', 'Shortens splash and transitions', 'toggle-motion', !!s.reduceMotion)) +
      ui.section('Learning',
        '<div class="field-label">Daily goal</div><div class="chip-row">' +
        [5, 10, 20, 30].map(function (n) {
          return ui.chip(n + ' actions', { active: Number(p.dailyGoal || 10) === n, action: 'set-goal', value: String(n) });
        }).join('') + '</div>' +
        '<div class="field-label">JLPT target</div><div class="chip-row">' +
        ['N5', 'N4', 'N3', 'N2', 'N1'].map(function (l) {
          return ui.chip(l, { active: p.jlptTarget === l, action: 'set-target', value: l });
        }).join('') + '</div>' +
        toggle('Show furigana', 'Show kana readings above kanji', 'toggle-furigana', s.furigana !== false) +
        toggle('Show romaji', 'Show Latin pronunciation as you learn', 'toggle-romaji', s.romaji !== false) +
        toggle('Audio', 'Allow text-to-speech buttons', 'toggle-audio', s.audio !== false)) +
      ui.section('Notifications',
        toggle('Deadline reminders', 'User-controlled; permission requested only when enabled',
          'toggle-notifications', !!s.notifications) +
        '<p class="small muted">Reminders are scheduled only for opportunities with an explicitly published deadline.</p>') +
      ui.section('Data',
        '<p class="small muted">Core lessons are bundled and always offline. Opportunity feeds are cached after a successful refresh.</p>' +
        '<button class="btn btn-ghost" style="margin-top:12px" data-action="preload">Preload bundled content</button>' +
        '<button class="btn btn-ghost" style="margin-top:8px" data-action="export">Backup / export JSON</button>' +
        '<button class="btn btn-ghost" style="margin-top:8px" data-action="clear-cache">Clear content cache (keeps progress)</button>' +
        '<button class="btn btn-ghost" style="margin-top:8px;color:var(--danger)" data-action="erase">Erase all local data</button>') +
      ui.section('Information', [
        ['/about', 'learn', 'About & credits'], ['/privacy', 'check', 'Privacy'],
        ['/analytics', 'star', 'Analytics']
      ].map(function (p) { return linkRow(p[0], p[1], p[2]); }).join(''));
  };

  OM.pages.about = function () {
    var c = OM.cfg, d = c.developer;
    return ui.header('About OMJAPAN', 'Your Japanese journey — offline first.', { overline: 'ABOUT' }) +
      '<div class="hero-card" style="text-align:center"><div class="splash-logo" style="width:104px;height:104px;margin:0 auto">' +
      '<img src="img/logo_placeholder.png" alt="OMJAPAN placeholder logo"><span class="logo-ring"></span></div>' +
      '<h2 style="margin-top:20px">OMJAPAN</h2><p>Version ' + u.esc(c.version) + ' · package ' + u.esc(c.package) + '</p>' +
      '<div class="placeholder-note" style="display:inline-block;margin-top:12px">PLACEHOLDER LOGO — REPLACE WITH 1000005646.jpg</div></div>' +
      '<p>OMJAPAN is an offline-first Japanese learning app for Hindi-speaking learners: kana, vocabulary, kanji, grammar, JLPT practice, a verified Hindi creator directory and an official-source opportunity radar.</p>' +
      ui.section('Creator', '<div class="card"><b>' + u.esc('Made by ' + d.name) + '</b>' +
        '<p class="small muted" style="margin-top:6px">YouTube: ' + u.esc(d.youtubeHandle) + '</p>' +
        '<p class="small muted">Instagram: ' + u.esc(d.instagramHandle) + '</p>' +
        '<p class="small muted">Discord: ' + u.esc(d.discordUrl) + '</p></div>' +
        ui.external('YouTube', d.youtubeUrl) +
        '<div class="btn-row">' + ui.external('Instagram', d.instagramUrl) + ui.external('Discord', d.discordUrl) + '</div>') +
      ui.section('Project', ui.external('GitHub repository', c.githubUrl) +
        '<p class="small muted" style="margin-top:10px">Source code, issues, changelog and contribution guide live in the public repository.</p>') +
      ui.section('Credits & licenses', '<p class="small muted">App code, content generators and bundled JSON datasets: © 2026 OMJAPAN. ' +
        'Licensed under MIT (see LICENSE in the repository). Japanese text examples are educational sentences written for this app. ' +
        'YouTube channel names, handles and avatars belong to their respective creators and link back to YouTube. ' +
        'Opportunity information belongs to the linked official sources. No third-party runtime libraries are bundled in the APK.</p>') +
      ui.section('Contact & support', '<p class="small muted">Use the GitHub repository issues page for bug reports and feedback. ' +
        'Open the link below to create an issue.</p>' +
        ui.external('Open GitHub issues', c.githubUrl + '/issues'));
  };

  OM.pages.privacy = function () {
    return ui.header('Privacy & data', 'Plain-language explanation of what the app stores.', { overline: 'PRIVACY' }) +
      '<div class="card"><div class="overline">ON THIS DEVICE</div><p style="margin-top:8px">' +
      'Your progress, bookmarks, notes, quiz history, settings and opportunity tracker are stored in a local SQLite database. ' +
      'They never leave the device unless you explicitly use the backup/export button.</p></div>' +
      '<div class="card"><div class="overline">NETWORK</div><p style="margin-top:8px">' +
      'The app fetches only the official feeds listed in the radar when you tap Refresh. Creator avatars, if shown, load from YouTube only while online. ' +
      'Links open externally; the app does not embed or track video playback.</p></div>' +
      '<div class="card"><div class="overline">PERMISSIONS</div><p style="margin-top:8px">' +
      'Internet is used for official feed refresh and external links. Notifications are optional and only requested when you enable reminders. ' +
      'There is no account, no advertising SDK, no analytics upload and no crash reporting.</p></div>' +
      '<div class="card"><div class="overline">YOUR CONTROL</div><p style="margin-top:8px">' +
      'Settings → Erase all local data removes your saved state. Uninstalling the app also removes it.</p></div>';
  };
})(window.OM);
