/*
 * Browser-only development shim. In the APK the real OmBridge (Java) exists and
 * this file does nothing. It mirrors the same API with localStorage and XHR so
 * the UI can be exercised in a desktop/in-app browser during testing.
 */
(function () {
  if (window.OmBridge) return;
  var P = 'omdev:';
  function json(v) { try { return JSON.parse(v); } catch (e) { return null; } }
  function key(ns, k) { return P + ns + ':' + k; }
  function keys(ns) {
    var out = [], prefix = P + ns + ':';
    for (var i = 0; i < localStorage.length; i++) {
      var k = localStorage.key(i);
      if (k && k.indexOf(prefix) === 0) out.push(k);
    }
    return out;
  }

  window.OmBridge = {
    appInfo: function () {
      return JSON.stringify({ name: 'OMJAPAN', version: '1.0.1', versionCode: 2,
        package: 'com.omjapan.app', offlineCore: true, devShim: true });
    },
    readAsset: function (path) {
      if (!path || path.indexOf('..') >= 0) return '';
      try {
        var x = new XMLHttpRequest();
        x.open('GET', path, false);
        x.send();
        return x.status === 200 || x.status === 0 ? x.responseText : '';
      } catch (e) { return ''; }
    },
    storeGet: function (ns, k) {
      var v = localStorage.getItem(key(ns, k));
      return v === null ? 'null' : v;
    },
    storeSet: function (ns, k, v) {
      try { localStorage.setItem(key(ns, k), v); return 'true'; } catch (e) { return 'false'; }
    },
    storeDelete: function (ns, k) { localStorage.removeItem(key(ns, k)); return 'true'; },
    storeClear: function (ns) {
      keys(ns).forEach(function (k) { localStorage.removeItem(k); });
      return 'true';
    },
    storeAll: function (ns) {
      return JSON.stringify(keys(ns).map(function (k) { return json(localStorage.getItem(k)); })
        .filter(function (v) { return v !== null; }));
    },
    newsCache: function () { return '[]'; },
    feedState: function () { return '{}'; },
    db: function () { return JSON.stringify({ ok: false, error: 'dev shim' }); },
    openExternal: function (url) {
      try { window.open(url, '_blank', 'noopener'); } catch (e) { }
    },
    toast: function (msg) {
      var el = document.getElementById('toast');
      if (!el) return;
      el.textContent = msg;
      el.classList.add('show');
      setTimeout(function () { el.classList.remove('show'); }, 2000);
    },
    speak: function () { return false; },
    stopSpeech: function () {},
    refreshFeeds: function () {
      return JSON.stringify({ success: true, count: 0, errors: [], sources: [],
        note: 'No verified official feeds; bundled official directory remains cached.' });
    },
    requestNotifications: function () {},
    canUseNotifications: function () { return false; },
    scheduleReminder: function () {},
    cancelReminder: function () {},
    share: function (text) { window.prompt('Share this text', text); }
  };
})();
