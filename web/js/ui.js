/* Shared UI atoms. All colours/spacing come from styles.css tokens. */
(function (OM) {
  'use strict';
  var u = OM.util;
  var ICONS = {
    home: '<svg viewBox="0 0 24 24"><path d="M3 11l9-8 9 8v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/></svg>',
    learn: '<svg viewBox="0 0 24 24"><path d="M4 4h7a3 3 0 0 1 3 3v13a3 3 0 0 0-3-3H4zM20 4h-3a3 3 0 0 0-3 3v13a3 3 0 0 1 3-3h3z"/></svg>',
    search: '<svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/></svg>',
    library: '<svg viewBox="0 0 24 24"><path d="M6 3h12v18l-6-4-6 4z"/></svg>',
    radar: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="4"/><path d="M12 3v9l6 6"/></svg>',
    more: '<svg viewBox="0 0 24 24"><circle cx="5" cy="12" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="19" cy="12" r="1.5"/></svg>',
    back: '<svg viewBox="0 0 24 24"><path d="M15 5l-7 7 7 7"/></svg>',
    bookmark: '<svg viewBox="0 0 24 24"><path d="M6 3h12v18l-6-4-6 4z"/></svg>',
    play: '<svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>',
    external: '<svg viewBox="0 0 24 24"><path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/></svg>',
    youtube: '<svg viewBox="0 0 24 24"><path d="M22 12s0-3.4-.4-5a2.6 2.6 0 0 0-1.8-1.8C18.2 4.8 12 4.8 12 4.8s-6.2 0-7.8.4A2.6 2.6 0 0 0 2.4 7C2 8.6 2 12 2 12s0 3.4.4 5a2.6 2.6 0 0 0 1.8 1.8c1.6.4 7.8.4 7.8.4s6.2 0 7.8-.4a2.6 2.6 0 0 0 1.8-1.8c.4-1.6.4-5 .4-5z"/><path d="M10 15l5-3-5-3z" class="fill"/></svg>',
    check: '<svg viewBox="0 0 24 24"><path d="M5 12l5 5L20 7"/></svg>',
    star: '<svg viewBox="0 0 24 24"><path d="M12 3l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 18l-5.9 3 1.2-6.5L2.5 9.9 9.1 9z"/></svg>'
  };

  OM.ui = {
    icon: function (name, cls) {
      return '<span class="icon ' + (cls || '') + '">' + (ICONS[name] || '') + '</span>';
    },
    header: function (title, subtitle, opts) {
      opts = opts || {};
      var back = opts.back === false ? '' :
        '<button class="icon-btn" data-action="back" aria-label="Go back">' + OM.ui.icon('back') + '</button>';
      return '<header class="page-head">' + back +
        '<div class="head-text"><div class="overline">' + u.esc(opts.overline || 'OMJAPAN') + '</div>' +
        '<h1>' + u.esc(title) + '</h1>' +
        (subtitle ? '<p>' + u.esc(subtitle) + '</p>' : '') + '</div>' +
        (opts.action || '') + '</header>';
    },
    nav: function (active) {
      var items = [
        ['/home', 'home', 'Home'], ['/learn', 'learn', 'Learn'], ['/search', 'search', 'Search'],
        ['/radar', 'radar', 'Radar'], ['/more', 'more', 'More']
      ];
      return '<nav class="bottom-nav" aria-label="Primary">' + items.map(function (it) {
        return '<button class="nav-item' + (active === it[0] ? ' active' : '') + '" data-go="' + it[0] + '" aria-label="' + it[2] + '">' +
          OM.ui.icon(it[1]) + '<span>' + it[2] + '</span></button>';
      }).join('') + '</nav>';
    },
    chip: function (label, opts) {
      opts = opts || {};
      var cls = 'chip' + (opts.active ? ' active' : '') + (opts.tone ? ' tone-' + opts.tone : '');
      if (opts.go) return '<button class="' + cls + '" data-go="' + u.esc(opts.go) + '">' + u.esc(label) + '</button>';
      if (opts.action) return '<button class="' + cls + '" data-action="' + u.esc(opts.action) + '"' +
        (opts.value ? ' data-value="' + u.esc(opts.value) + '"' : '') +
        (opts.scope ? ' data-scope="' + u.esc(opts.scope) + '"' : '') +
        (opts.id ? ' data-id="' + u.esc(opts.id) + '"' : '') + '>' + u.esc(label) + '</button>';
      return '<span class="' + cls + '">' + u.esc(label) + '</span>';
    },
    tag: function (label, tone) { return '<span class="tag' + (tone ? ' tone-' + tone : '') + '">' + u.esc(label) + '</span>'; },
    bookmark: function (type, id, data) {
      var on = OM.bookmarks.has(type, id);
      return '<button class="icon-btn bookmark' + (on ? ' on' : '') + '" data-action="bookmark"' +
        ' data-type="' + u.esc(type) + '" data-id="' + u.esc(id) + '"' +
        ' data-data="' + u.esc(JSON.stringify(data || {})) + '" aria-label="' + (on ? 'Remove bookmark' : 'Bookmark') + '">' +
        OM.ui.icon('bookmark') + '</button>';
    },
    speaker: function (text) {
      return '<button class="icon-btn speaker" data-action="speak" data-text="' + u.esc(text) + '" aria-label="Listen (text to speech)">' +
        OM.ui.icon('play') + '</button>';
    },
    external: function (label, url, primary) {
      return '<button class="btn ' + (primary ? 'btn-primary' : 'btn-ghost') + '" data-action="open" data-url="' + u.esc(url) + '">' +
        u.esc(label) + ' ' + OM.ui.icon('external') + '</button>';
    },
    status: function (s) {
      if (!s) return OM.ui.tag('Deadline unknown', 'muted');
      var tone = ({ OPEN: 'success', NEW: 'info', 'CLOSING SOON': 'warning', VERIFIED: 'info',
        UPCOMING: 'info', CLOSED: 'danger', 'DEADLINE UNKNOWN': 'muted' })[s] || 'muted';
      return OM.ui.tag(s, tone);
    },
    empty: function (title, text, actionHtml) {
      return '<div class="empty"><div class="empty-mark">' + OM.ui.icon('star') + '</div>' +
        '<h3>' + u.esc(title) + '</h3><p>' + u.esc(text) + '</p>' + (actionHtml || '') + '</div>';
    },
    skeleton: function (n) {
      n = n || 3;
      var out = '';
      for (var i = 0; i < n; i++) out += '<div class="skeleton-card"><span></span><span></span><span></span></div>';
      return out;
    },
    jp: function (jp, kana, romaji) {
      var s = OM.state.settings || {};
      var showKana = s.furigana !== false;
      var showRoma = s.romaji !== false;
      return '<div class="jp-line"><span class="jp-main">' + u.esc(jp) + '</span>' +
        (showKana && kana && kana !== jp ? '<span class="jp-kana">' + u.esc(kana) + '</span>' : '') +
        (showRoma && romaji ? '<span class="jp-roma">' + u.esc(romaji) + '</span>' : '') + '</div>';
    },
    showSheet: function (html, title) {
      var host = document.getElementById('sheet');
      host.innerHTML = '<div class="sheet-backdrop" data-action="close-sheet"></div>' +
        '<section class="sheet" role="dialog" aria-label="' + u.esc(title || 'Details') + '">' +
        '<div class="sheet-grip"></div>' + html + '</section>';
      host.classList.remove('hidden');
      document.body.classList.add('sheet-open');
      OM.state.sheetOpen = true;
    },
    closeSheet: function () {
      var host = document.getElementById('sheet');
      host.classList.add('hidden');
      host.innerHTML = '';
      document.body.classList.remove('sheet-open');
      OM.state.sheetOpen = false;
      OM.bridge.stopSpeech();
    },
    section: function (title, body, action) {
      return '<section class="section"><div class="section-head"><h2>' + u.esc(title) + '</h2>' +
        (action || '') + '</div>' + body + '</section>';
    }
  };
})(window.OM);
