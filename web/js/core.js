/* OMJAPAN core: bridge wrappers, local store, routing and shared utilities. */
window.OM = window.OM || {};
(function (OM) {
  'use strict';
  var B = window.OmBridge;
  OM.cfg = window.OM_CONFIG || {};
  OM.state = {
    route: '/home',
    stack: [],
    profile: null,
    settings: {},
    cache: {},
    sheetOpen: false,
    quiz: null,
    radarFilter: { category: 'all', status: 'all', q: '', sort: 'recommended' }
  };

  OM.store = {
    get: function (ns, key, fallback) {
      var raw = B.storeGet(ns, key);
      if (raw === 'null' || !raw) return fallback;
      try { return JSON.parse(raw); } catch (e) { return fallback; }
    },
    set: function (ns, key, value) { return B.storeSet(ns, key, JSON.stringify(value)); },
    del: function (ns, key) { return B.storeDelete(ns, key); },
    all: function (ns) { try { return JSON.parse(B.storeAll(ns)); } catch (e) { return []; } },
    clear: function (ns) { return B.storeClear(ns); }
  };

  OM.bridge = {
    info: function () { try { return JSON.parse(B.appInfo()); } catch (e) { return {}; } },
    open: function (url) {
      if (!/^https?:\/\//i.test(url || '')) return;
      B.openExternal(url);
    },
    asset: function (path) { return B.readAsset(path); },
    speak: function (text, lang) { return B.speak(text, lang || 'ja'); },
    stopSpeech: function () { B.stopSpeech(); },
    toast: function (msg) { B.toast(msg); },
    refreshFeeds: function () {
      try { return JSON.parse(B.refreshFeeds()); }
      catch (e) { return { success: false, count: 0, errors: [{ error: 'Refresh failed' }] }; }
    },
    newsCache: function () { try { return JSON.parse(B.newsCache()); } catch (e) { return []; } },
    feedState: function () { try { return JSON.parse(B.feedState()); } catch (e) { return {}; } },
    notify: function (id, title, dueAt) { B.scheduleReminder(id, title, dueAt); },
    cancelNotify: function (id) { B.cancelReminder(id); },
    requestNotifications: function () { B.requestNotifications(); },
    canNotify: function () { return !!B.canUseNotifications(); },
    share: function (text) { B.share(text); }
  };

  OM.util = {
    esc: function (v) {
      if (v === null || v === undefined) return '';
      return String(v).replace(/[&<>"']/g, function (c) {
        return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c];
      });
    },
    levelIndex: function (l) { return ['N5', 'N4', 'N3', 'N2', 'N1'].indexOf(l); },
    shuffle: function (arr) {
      var a = arr.slice();
      for (var i = a.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var t = a[i]; a[i] = a[j]; a[j] = t;
      }
      return a;
    },
    uniq: function (arr) { return arr.filter(function (v, i) { return arr.indexOf(v) === i; }); },
    daysUntil: function (iso) {
      if (!iso || !/^\d{4}-\d{2}-\d{2}$/.test(iso)) return null;
      var d = new Date(iso + 'T00:00:00Z');
      if (isNaN(d.getTime())) return null;
      return Math.ceil((d.getTime() - Date.now()) / 86400000);
    },
    fmtDate: function (iso) {
      if (!iso) return '—';
      try { return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }); }
      catch (e) { return iso; }
    },
    ago: function (epochSec) {
      if (!epochSec) return 'never';
      var mins = Math.floor((Date.now() / 1000 - Number(epochSec)) / 60);
      if ( mins < 1) return 'just now';
      if (mins < 60) return mins + ' min ago';
      var h = Math.floor(mins / 60);
      if (h < 24) return h + ' hr ago';
      return Math.floor(h / 24) + ' days ago';
    },
    clamp: function (n, lo, hi) { return Math.max(lo, Math.min(hi, n)); },
    debounce: function (fn, ms) {
      var t;
      return function () { var args = arguments, self = this; clearTimeout(t); t = setTimeout(function () { fn.apply(self, args); }, ms); };
    },
    todayKey: function () {
      var d = new Date();
      return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
    },
    levelColor: function (l) { return ({ N5: 'success', N4: 'info', N3: 'warning', N2: 'danger', N1: 'danger' })[l] || 'muted'; }
  };

  OM.go = function (path, replace) {
    if (!path) path = '/home';
    if (location.hash === '#' + path) { OM.render(); return; }
    if (!replace && OM.state.route && OM.state.route !== path) OM.state.stack.push(OM.state.route);
    if (replace) location.replace('#' + path); else location.hash = path;
  };

  window.addEventListener('hashchange', function () {
    OM.state.route = (location.hash || '#/home').slice(1);
    window.scrollTo(0, 0);
    OM.render();
  });

  OM.handleBack = function () {
    if (OM.state.sheetOpen && OM.closeSheet) { OM.closeSheet(); return true; }
    if (OM.state.stack.length) {
      var prev = OM.state.stack.pop();
      OM.go(prev, true);
      return true;
    }
    return false;
  };

  // Real progress helpers — every value here comes from the local store.
  OM.progress = {
    get: function (type, id) { return OM.store.get('progress', type + ':' + id, null); },
    set: function (type, id, status, score) {
      OM.store.set('progress', type + ':' + id,
        { key: type + ':' + id, type: type, id: id, status: status || 'studied', score: score, updatedAt: Date.now() });
    },
    isDone: function (type, id) {
      var p = OM.progress.get(type, id);
      return !!p && (p.status === 'mastered' || p.status === 'completed');
    },
    count: function (type) {
      return OM.store.all('progress').filter(function (p) {
        return p && p.status && (!type || String(p.key || '').indexOf(type + ':') === 0);
      }).length;
    },
    masteredKana: function () {
      return OM.store.all('progress').filter(function (p) {
        return p && p.status === 'mastered' && /^kana:/.test(p.key || '');
      }).length;
    }
  };

  OM.bookmarks = {
    has: function (type, id) { return !!OM.store.get('bookmarks', type + ':' + id, null); },
    toggle: function (type, id, data) {
      var key = type + ':' + id;
      if (OM.bookmarks.has(type, id)) { OM.store.del('bookmarks', key); return false; }
      OM.store.set('bookmarks', key, { key: key, type: type, id: id, data: data || {}, at: Date.now() });
      return true;
    },
    all: function (type) {
      return OM.store.all('bookmarks').filter(function (b) { return !type || b.type === type; });
    }
  };

  OM.stats = {
    addQuiz: function (correct, total, type, id) {
      OM.store.set('quiz', Date.now() + ':' + Math.floor(Math.random() * 1000),
        { correct: correct, total: total, type: type, id: id, at: Date.now() });
      OM.stats.activity({ quizzes: 1 });
      if (correct < total) {
        OM.store.set('mistakes', (type || '') + ':' + id, {
          key: (type || '') + ':' + id, type: type, id: id, count: (OM.store.get('mistakes', (type || '') + ':' + id, { count: 0 }).count || 0) + 1, at: Date.now()
        });
      }
    },
    activity: function (delta) {
      var k = OM.util.todayKey();
      var a = OM.store.get('activity', k, { key: k, minutes: 0, lessons: 0, words: 0, quizzes: 0 });
      Object.keys(delta || {}).forEach(function (key) { a[key] = (a[key] || 0) + delta[key]; });
      OM.store.set('activity', k, a);
    },
    quizHistory: function () { return OM.store.all('quiz'); },
    accuracy: function () {
      var h = OM.stats.quizHistory();
      var c = 0, t = 0;
      h.forEach(function (r) { c += r.correct || 0; t += r.total || 0; });
      return t ? Math.round((c / t) * 100) : null;
    },
    streak: function () {
      var n = 0, d = new Date();
      for (var i = 0; i < 400; i++) {
        var k = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
        var a = OM.store.get('activity', k, null);
        if (!a || !(a.minutes > 0 || a.quizzes > 0 || a.lessons > 0)) {
          if (i === 0) { d.setDate(d.getDate() - 1); continue; }
          break;
        }
        n++;
        d.setDate(d.getDate() - 1);
      }
      return n;
    },
    totals: function () {
      var lessons = 0, words = 0, kana = 0, kanji = 0;
      OM.store.all('progress').forEach(function (p) {
        if (!p || !p.key) return;
        if (p.status !== 'mastered' && p.status !== 'completed' && p.status !== 'learned') return;
        if (/^lesson:/.test(p.key)) lessons++;
        if (/^vocab:/.test(p.key)) words++;
        if (/^kana:/.test(p.key)) kana++;
        if (/^kanji:/.test(p.key)) kanji++;
      });
      var minutes = 0;
      OM.store.all('activity').forEach(function (a) { minutes += a.minutes || 0; });
      return { lessons: lessons, words: words, kana: kana, kanji: kanji, minutes: minutes,
        accuracy: OM.stats.accuracy(), streak: OM.stats.streak(),
        reviewDue: OM.store.all('mistakes').length };
    }
  };
})(window.OM);
