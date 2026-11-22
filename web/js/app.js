/* Boot, splash, onboarding, router and one delegated event handler. */
(function (OM) {
  'use strict';
  var u = OM.util, ui = OM.ui;

  var DEFAULT_SETTINGS = {
    theme: 'dark', accent: 'lime', romaji: true, furigana: true,
    audio: true, notifications: false, reduceMotion: false
  };
  var LOADING_LINES = [
    'Reading your local lessons...',
    'Preparing kana and kanji...',
    'Checking cached opportunities...',
    'Ready when you are.'
  ];

  OM.closeSheet = ui.closeSheet;

  OM.applySettings = function () {
    var s = OM.store.get('settings', 'prefs', DEFAULT_SETTINGS);
    OM.state.settings = s;
    document.documentElement.setAttribute('data-accent', s.accent || 'lime');
    document.body.classList.toggle('contrast', s.theme === 'contrast');
    document.body.classList.toggle('reduce-motion', !!s.reduceMotion);
  };

  OM.saveSettings = function (patch) {
    var s = OM.store.get('settings', 'prefs', DEFAULT_SETTINGS);
    Object.keys(patch || {}).forEach(function (k) { s[k] = patch[k]; });
    OM.store.set('settings', 'prefs', s);
    OM.state.settings = s;
    OM.applySettings();
  };

  OM.profile = function () {
    return OM.store.get('profile', 'me',
      { displayName: 'Learner', jlptTarget: 'N5', dailyGoal: 10, onboarded: false });
  };

  OM.saveProfile = function (patch) {
    var p = OM.profile();
    Object.keys(patch || {}).forEach(function (k) { p[k] = patch[k]; });
    OM.store.set('profile', 'me', p);
  };

  /* ---------------- routing ---------------- */
  function activeNav(path) {
    if (path.indexOf('/radar') === 0) return '/radar';
    if (path.indexOf('/search') === 0) return '/search';
    if (path.indexOf('/more') === 0 || path.indexOf('/settings') === 0 ||
      path.indexOf('/about') === 0 || path.indexOf('/privacy') === 0 ||
      path.indexOf('/library') === 0 || path.indexOf('/analytics') === 0 ||
      path.indexOf('/creators') === 0 || path.indexOf('/creator/') === 0) return '/more';
    return '/learn';
  }

  OM.render = function () {
    var path = OM.state.route || '/home';
    var parts = path.split('/').filter(Boolean);
    var page = null;
    switch (parts[0]) {
      case undefined: case 'home': page = OM.pages.home; break;
      case 'learn': page = OM.pages.learn; break;
      case 'kana': page = function () { return OM.pages.kana(parts[1]); }; break;
      case 'vocabulary': page = OM.pages.vocabulary; break;
      case 'kanji': page = OM.pages.kanji; break;
      case 'writing': page = OM.pages.writing; break;
      case 'grammar': page = OM.pages.grammar; break;
      case 'listening': page = OM.pages.listening; break;
      case 'speaking': page = OM.pages.speaking; break;
      case 'jlpt': page = OM.pages.jlpt; break;
      case 'lesson': page = function () { return OM.pages.lesson(parts[1]); }; break;
      case 'review': page = OM.pages.review; break;
      case 'quiz': page = OM.pages.quiz; break;
      case 'search': page = OM.pages.search; break;
      case 'library': page = OM.pages.library; break;
      case 'analytics': page = OM.pages.analytics; break;
      case 'radar': page = parts[1] === 'timeline' ? OM.pages.radarTimeline :
        function () { return parts[1] ? OM.pages.radarDetail(parts[1]) : OM.pages.radar(); }; break;
      case 'creators': page = OM.pages.creators; break;
      case 'creator': page = function () { return OM.pages.creator(parts[1]); }; break;
      case 'more': page = OM.pages.more; break;
      case 'settings': page = OM.pages.settings; break;
      case 'about': page = OM.pages.about; break;
      case 'privacy': page = OM.pages.privacy; break;
      default: page = OM.pages.home;
    }
    var html = '';
    try { html = page() || ''; } catch (e) {
      html = ui.header('Something went wrong', '', {}) +
        ui.empty('Could not render this screen', String(e && e.message || e),
          '<button class="btn btn-ghost" data-go="/home">Go home</button>');
    }
    document.getElementById('view').innerHTML = html;
    document.getElementById('navhost').innerHTML = ui.nav(activeNav(path));
    var title = (html.match(/<h1>([^<]*)<\/h1>/) || [])[1] || 'OMJAPAN';
    document.title = title + ' — OMJAPAN';
  };

  /* ---------------- splash ---------------- */
  function runSplash(done) {
    var start = Date.now();
    var line = 0;
    var el = document.getElementById('loadText');
    var tick = setInterval(function () {
      line = Math.min(LOADING_LINES.length - 1, line + 1);
      if (el) el.textContent = LOADING_LINES[line];
    }, 520);
    var delay = OM.state.settings.reduceMotion ? 700 : 1900;
    setTimeout(function () {
      clearInterval(tick);
      document.getElementById('splash').classList.add('hidden');
      document.getElementById('app').classList.remove('hidden');
      done();
      if (Date.now() - start < delay) { /* timer already enforced */ }
    }, delay);
  }

  /* ---------------- onboarding (7 optional steps) ---------------- */
  var ONB = {
    step: 0,
    data: { displayName: 'Learner', jlptTarget: 'N5', level: 'beginner', dailyGoal: 10, reminders: false }
  };

  function onbChoose(key, value) { ONB.data[key] = value; OM.renderOnboarding(); }

  OM.renderOnboarding = function () {
    var host = document.getElementById('onboarding');
    var steps = [
      function () {
        return '<div class="onboard-step" style="text-align:center">' +
          '<div class="splash-logo" style="width:120px;height:120px;margin:0 auto 28px"><img src="img/logo.jpg" alt="OMJAPAN logo">' +
          '<span class="logo-ring"></span></div>' +
          '<h1>Welcome to<br>OMJAPAN</h1><p>Your Japanese journey, offline and on your terms. Seven quick steps — every answer is optional.</p></div>';
      },
      function () {
        return '<div class="onboard-step"><h1>What should we call you?</h1><p>Only used on your home screen. Stored on this device.</p>' +
          '<input class="input" id="onbName" type="text" maxlength="24" placeholder="Learner" value="' + u.esc(ONB.data.displayName) + '">' +
          '<button class="choice" data-action="onb-choice" data-key="displayName" data-value="Learner">Use “Learner”</button></div>';
      },
      function () {
        return '<div class="onboard-step"><h1>Which JLPT level are you aiming for?</h1><p>We will prioritise matching practice. You can change this later.</p>' +
          ['N5', 'N4', 'N3', 'N2', 'N1'].map(function (l) {
            return '<button class="choice' + (ONB.data.jlptTarget === l ? ' on' : '') +
              '" data-action="onb-choice" data-key="jlptTarget" data-value="' + l + '">' + l + '</button>';
          }).join('') + '</div>';
      },
      function () {
        return '<div class="onboard-step"><h1>Where are you starting?</h1><p>Honest starting points make better recommendations.</p>' +
          [['beginner', 'Zero — start with hiragana'], ['some', 'Some experience — I know a little'], ['returning', 'Returning learner — refresh and practise']].map(function (o) {
            return '<button class="choice' + (ONB.data.level === o[0] ? ' on' : '') +
              '" data-action="onb-choice" data-key="level" data-value="' + o[0] + '">' + u.esc(o[1]) + '</button>';
          }).join('') + '</div>';
      },
      function () {
        return '<div class="onboard-step"><h1>Set a daily goal</h1><p>A quiz, a lesson, or a few minutes of study each counts as an action.</p>' +
          [5, 10, 20].map(function (n) {
            return '<button class="choice' + (ONB.data.dailyGoal === n ? ' on' : '') +
              '" data-action="onb-choice" data-key="dailyGoal" data-value="' + n + '">' + n + ' actions a day</button>';
          }).join('') + '</div>';
      },
      function () {
        return '<div class="onboard-step"><h1>Deadline reminders?</h1><p>Only for opportunities with a published deadline. You can switch this off any time.</p>' +
          '<button class="choice' + (ONB.data.reminders ? ' on' : '') +
          '" data-action="onb-choice" data-key="reminders" data-value="true">Yes, remind me before deadlines</button>' +
          '<button class="choice' + (!ONB.data.reminders ? ' on' : '') +
          '" data-action="onb-choice" data-key="reminders" data-value="false">No, keep it silent</button></div>';
      },
      function () {
        return '<div class="onboard-step"><h1>You are ready.</h1><p>' +
          'Goal: ' + u.esc(ONB.data.jlptTarget) + ' · ' + u.esc(ONB.data.dailyGoal) + ' actions a day · ' +
          u.esc(ONB.data.displayName) + '</p>' +
          '<div class="notice">Everything works offline. No account, no tracking, no fake progress.</div></div>';
      }
    ];
    host.innerHTML = '<div class="onboard-top"><button class="link-btn" data-action="onb-skip">Skip setup</button>' +
      '<div class="onboard-dots">' + steps.map(function (_, i) {
        return '<i class="' + (i === ONB.step ? 'on' : '') + '"></i>';
      }).join('') + '</div></div>' +
      steps[ONB.step]() +
      '<div class="onboard-actions">' +
      (ONB.step > 0 ? '<button class="btn btn-ghost" data-action="onb-back">Back</button>' : '') +
      '<button class="btn btn-primary" data-action="onb-next">' +
      (ONB.step === steps.length - 1 ? 'Start learning' : 'Continue') + '</button></div>';
  };

  function finishOnboarding() {
    var name = document.getElementById('onbName');
    if (name && name.value.trim()) ONB.data.displayName = name.value.trim().slice(0, 24);
    OM.saveProfile({
      displayName: ONB.data.displayName, jlptTarget: ONB.data.jlptTarget,
      dailyGoal: Number(ONB.data.dailyGoal), onboarded: true
    });
    OM.saveSettings({ notifications: !!ONB.data.reminders });
    if (ONB.data.reminders) OM.bridge.requestNotifications();
    document.getElementById('onboarding').classList.add('hidden');
    OM.go('/home', true);
    OM.render();
  }

  OM.onbNext = function () {
    if (ONB.step === 1) {
      var name = document.getElementById('onbName');
      if (name && name.value.trim()) ONB.data.displayName = name.value.trim().slice(0, 24);
    }
    if (ONB.step === 6) { finishOnboarding(); return; }
    ONB.step++;
    OM.renderOnboarding();
  };

  /* ---------------- actions ---------------- */
  function setTrack(id, patch) {
    var t = OM.store.get('opportunity', id, { status: 'not tracking', notes: '', checklist: [] });
    Object.keys(patch).forEach(function (k) { t[k] = patch[k]; });
    OM.store.set('opportunity', id, t);
  }

  function exportBackup() {
    var ns = ['profile', 'settings', 'progress', 'bookmarks', 'quiz', 'activity', 'mistakes', 'opportunity'];
    var data = {};
    ns.forEach(function (n) { data[n] = OM.store.all(n); });
    var payload = JSON.stringify({ app: 'OMJAPAN', version: OM.cfg.version,
      exportedAt: new Date().toISOString(), data: data }, null, 1);
    ui.showSheet('<div class="overline">BACKUP</div><h2>Your local data</h2>' +
      '<p class="small muted" style="margin:10px 0">Copy this JSON to a safe place. It contains your progress, bookmarks and notes — no passwords.</p>' +
      '<textarea class="textarea" id="backupText" style="height:220px">' + u.esc(payload) + '</textarea>' +
      '<div class="btn-row"><button class="btn btn-ghost" data-action="copy-backup">Copy</button>' +
      '<button class="btn btn-primary" data-action="share-backup">Share</button></div>', 'Backup');
  }

  var ACTIONS = {
    'back': function () { if (!OM.handleBack()) OM.go('/home', true); },
    'go': function (el) { OM.go(el.getAttribute('data-go')); },
    'open': function (el) { OM.bridge.open(el.getAttribute('data-url')); },
    'close-sheet': function () { ui.closeSheet(); },
    'bookmark': function (el) {
      var type = el.getAttribute('data-type'), id = el.getAttribute('data-id');
      var raw = el.getAttribute('data-data');
      var data = {};
      try { data = JSON.parse(raw || '{}'); } catch (e) { data = {}; }
      var added = OM.bookmarks.toggle(type, id, data);
      OM.bridge.toast(added ? 'Saved to library' : 'Removed from library');
      OM.render();
      if (OM.state.sheetOpen) {
        var b = el;
        b.classList.toggle('on', added);
      }
    },
    'speak': function (el) {
      if (OM.state.settings.audio === false) { OM.bridge.toast('Audio is off in Settings'); return; }
      var ok = OM.bridge.speak(el.getAttribute('data-text'), 'ja');
      if (!ok) OM.bridge.toast('Japanese voice unavailable — text is shown instead');
    },
    'kana-detail': function (el) { OM.showKana(el.getAttribute('data-id')); },
    'vocab-detail': function (el) { OM.showVocab(el.getAttribute('data-id')); },
    'kanji-detail': function (el) { OM.showKanji(el.getAttribute('data-id')); },
    'grammar-detail': function (el) { OM.showGrammar(el.getAttribute('data-id')); },
    'master-kana': function (el) {
      var id = el.getAttribute('data-id');
      OM.progress.set('kana', id, 'mastered');
      OM.stats.activity({ minutes: 1 });
      ui.closeSheet(); OM.bridge.toast('Kana mastered'); OM.render();
    },
    'learn-vocab': function (el) {
      OM.progress.set('vocabulary', el.getAttribute('data-id'), 'learned');
      OM.stats.activity({ words: 1, minutes: 1 });
      ui.closeSheet(); OM.bridge.toast('Word saved as learned'); OM.render();
    },
    'learn-kanji': function (el) {
      OM.progress.set('kanji', el.getAttribute('data-id'), 'learned');
      OM.stats.activity({ minutes: 1 });
      ui.closeSheet(); OM.bridge.toast('Kanji saved as learned'); OM.render();
    },
    'learn-grammar': function (el) {
      OM.progress.set('grammar', el.getAttribute('data-id'), 'learned');
      OM.stats.activity({ minutes: 1 });
      ui.closeSheet(); OM.bridge.toast('Grammar point studied'); OM.render();
    },
    'complete-lesson': function (el) {
      OM.progress.set('lesson', el.getAttribute('data-id'), 'completed');
      OM.stats.activity({ lessons: 1 });
      OM.bridge.toast('Lesson marked complete'); OM.render();
    },
    'quiz-lesson': function (el) { OM.startQuiz('lesson', el.getAttribute('data-id')); },
    'quiz-vocab': function (el) { ui.closeSheet(); OM.startQuiz('vocab', el.getAttribute('data-id')); },
    'quiz-kanji': function (el) { ui.closeSheet(); OM.startQuiz('kanji', el.getAttribute('data-id')); },
    'quiz-jlpt': function (el) { OM.startQuiz('jlpt', '', el.getAttribute('data-level') || 'All'); },
    'quiz-listening': function () { OM.startQuiz('listening'); },
    'quiz-again': function () {
      var q = OM.state.quiz;
      if (q) OM.startQuiz(q.kind, q.id, q.level);
    },
    'answer': function (el) { OM.answerQuestion(Number(el.getAttribute('data-index'))); },
    'next-question': function () { OM.nextQuestion(); },
    'load-more': function (el) {
      var key = el.getAttribute('data-key');
      OM.state.limits[key] = (OM.state.limits[key] || 30) + Number(el.getAttribute('data-step') || 30);
      OM.render();
    },
    'filter-level': function (el) {
      OM.state.filters[el.getAttribute('data-scope')].level = el.getAttribute('data-value'); OM.render();
    },
    'filter-category': function (el) {
      OM.state.filters[el.getAttribute('data-scope')].category = el.getAttribute('data-value'); OM.render();
    },
    'radar-category': function (el) { OM.state.filters.radar.category = el.getAttribute('data-value'); OM.render(); },
    'radar-status': function (el) { OM.state.filters.radar.status = el.getAttribute('data-value'); OM.render(); },
    'radar-sort': function (el) { OM.state.filters.radar.sort = el.getAttribute('data-value'); OM.render(); },
    'refresh-feeds': function () { OM.radarRefresh(); },
    'dismiss-radar-error': function () { OM.state.radarError = null; OM.render(); },
    'track-status': function (el) {
      setTrack(el.getAttribute('data-id'), { status: el.getAttribute('data-value') });
      OM.bridge.toast('Tracker updated'); OM.render();
    },
    'check-item': function (el) {
      var id = el.getAttribute('data-id'), label = el.getAttribute('data-label');
      var t = OM.store.get('opportunity', id, { checklist: [] });
      t.checklist = t.checklist || [];
      var found = false;
      t.checklist.forEach(function (c) { if (c.label === label) { c.done = !c.done; found = true; } });
      if (!found) t.checklist.push({ label: label, done: true });
      OM.store.set('opportunity', id, t); OM.render();
    },
    'remind': function (el) {
      if (!OM.bridge.canNotify()) { OM.bridge.requestNotifications(); OM.bridge.toast('Enable notifications, then tap again'); return; }
      var due = el.getAttribute('data-due');
      var ms = new Date(due + 'T09:00:00').getTime() - 86400000;
      if (isNaN(ms) || ms < Date.now()) { OM.bridge.toast('Deadline has passed or is today'); return; }
      OM.bridge.notify('om-deadline-' + el.getAttribute('data-id'), el.getAttribute('data-title'), ms);
      setTrack(el.getAttribute('data-id'), { reminderAt: ms });
      OM.bridge.toast('Reminder set for one day before the published deadline');
    },
    'creator-q': function () { /* input event handles it */ },
    'creator-sort': function (el) { OM.state.filters.creators.sort = el.getAttribute('data-value'); OM.render(); },
    'creator-category': function (el) { OM.state.filters.creators.category = el.getAttribute('data-value'); OM.render(); },
    'creator-language': function (el) { OM.state.filters.creators.language = el.getAttribute('data-value'); OM.render(); },
    'set-theme': function (el) { OM.saveSettings({ theme: el.getAttribute('data-value') }); OM.render(); },
    'set-accent': function (el) { OM.saveSettings({ accent: el.getAttribute('data-value') }); OM.render(); },
    'set-goal': function (el) { OM.saveProfile({ dailyGoal: Number(el.getAttribute('data-value')) }); OM.render(); },
    'set-target': function (el) { OM.saveProfile({ jlptTarget: el.getAttribute('data-value') }); OM.render(); },
    'toggle-motion': function () { OM.saveSettings({ reduceMotion: !OM.state.settings.reduceMotion }); OM.render(); },
    'toggle-furigana': function () { OM.saveSettings({ furigana: OM.state.settings.furigana === false }); OM.render(); },
    'toggle-romaji': function () { OM.saveSettings({ romaji: OM.state.settings.romaji === false }); OM.render(); },
    'toggle-audio': function () { OM.saveSettings({ audio: OM.state.settings.audio === false }); OM.render(); },
    'toggle-notifications': function () {
      var on = !OM.state.settings.notifications;
      OM.saveSettings({ notifications: on });
      if (on) OM.bridge.requestNotifications();
      OM.render();
    },
    'preload': function () {
      ['kana', 'vocabulary', 'kanji', 'grammar', 'lessons', 'jlpt', 'listening', 'speaking', 'creators', 'scholarships']
        .forEach(function (n) { OM.data.get(n); });
      OM.bridge.toast('Bundled content loaded');
    },
    'export': exportBackup,
    'copy-backup': function () {
      var t = document.getElementById('backupText');
      if (t) { t.select(); try { document.execCommand('copy'); OM.bridge.toast('Copied'); } catch (e) {} }
    },
    'share-backup': function () {
      var t = document.getElementById('backupText');
      if (t) OM.bridge.share(t.value);
    },
    'clear-cache': function () { OM.data.clear(); OM.bridge.toast('Content cache cleared'); },
    'erase': function () {
      if (!window.confirm('Erase all local progress, bookmarks and notes? This cannot be undone.')) return;
      ['profile', 'settings', 'progress', 'bookmarks', 'quiz', 'activity', 'mistakes', 'opportunity']
        .forEach(function (n) { OM.store.clear(n); });
      OM.data.clear(); OM.applySettings(); OM.bridge.toast('Local data erased'); OM.go('/home', true); OM.render();
    },
    'onb-next': function () { OM.onbNext(); },
    'onb-back': function () { ONB.step = Math.max(0, ONB.step - 1); OM.renderOnboarding(); },
    'onb-skip': function () { finishOnboarding(); },
    'onb-choice': function (el) { onbChoose(el.getAttribute('data-key'), el.getAttribute('data-value')); }
  };

  function bind() {
    document.addEventListener('click', function (e) {
      var el = e.target.closest('[data-action]');
      if (!el) return;
      var name = el.getAttribute('data-action');
      if (ACTIONS[name]) { e.preventDefault(); ACTIONS[name](el); }
    });
    document.addEventListener('click', function (e) {
      var el = e.target.closest('[data-go]');
      if (!el || el.hasAttribute('data-action')) return;
      e.preventDefault();
      OM.go(el.getAttribute('data-go'));
    });
    document.addEventListener('input', u.debounce(function (e) {
      var el = e.target;
      var a = el.getAttribute && el.getAttribute('data-action');
      if (a === 'global-q') { OM.state.filters.search.q = el.value; OM.render(); }
      else if (a === 'filter-q') { OM.state.filters[el.getAttribute('data-scope')].q = el.value; OM.render(); }
      else if (a === 'creator-q') { OM.state.filters.creators.q = el.value; OM.render(); }
      else if (a === 'radar-q') { OM.state.filters.radar.q = el.value; OM.render(); }
    }, 260));
    document.addEventListener('change', function (e) {
      if (e.target.getAttribute && e.target.getAttribute('data-action') === 'track-notes') {
        setTrack(e.target.getAttribute('data-id'), { notes: e.target.value });
        OM.bridge.toast('Note saved');
      }
    });
    document.addEventListener('blur', function (e) {
      if (e.target.getAttribute && e.target.getAttribute('data-action') === 'track-notes') {
        setTrack(e.target.getAttribute('data-id'), { notes: e.target.value });
      }
    }, true);
    document.addEventListener('error', function (e) {
      if (e.target && e.target.tagName === 'IMG' && e.target.closest('.avatar')) e.target.style.display = 'none';
    }, true);
    window.addEventListener('online', function () { if (OM.state.route.indexOf('/radar') === 0) OM.render(); });
    window.addEventListener('offline', function () { if (OM.state.route.indexOf('/radar') === 0) OM.render(); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && OM.state.sheetOpen) { e.preventDefault(); ui.closeSheet(); }
    });
  }

  /* ---------------- boot ---------------- */
  function init() {
    OM.applySettings();
    bind();
    OM.state.route = (location.hash || '#/home').slice(1);
    runSplash(function () {
      if (OM.profile().onboarded) {
        OM.render();
      } else {
        document.getElementById('onboarding').classList.remove('hidden');
        OM.renderOnboarding();
      }
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})(window.OM);
