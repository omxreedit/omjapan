/* Japan Opportunity Radar: official sources only, cached offline, never guessed. */
(function (OM) {
  'use strict';
  var u = OM.util, ui = OM.ui;
  OM.pages = OM.pages || {};
  OM.state.filters = OM.state.filters || {};
  var SCOPE = 'radar';
  var CATS = ['all', 'scholarship', 'program', 'exam', 'other'];
  var STATUSES = ['all', 'VERIFIED', 'OPEN', 'DEADLINE UNKNOWN'];

  function f() {
    if (!OM.state.filters[SCOPE]) {
      OM.state.filters[SCOPE] = { category: 'all', status: 'all', q: '', sort: 'recommended' };
    }
    return OM.state.filters[SCOPE];
  }

  function normalizeStatic(s) {
    return {
      id: s.id || s.sourceUrl,
      title: s.title || s.program || 'Untitled opportunity',
      provider: s.provider || s.institution || s.sourceName || 'Official source',
      summary: s.summary || s.description || '',
      sourceUrl: s.sourceUrl || s.url || '',
      publishedDate: s.publishedAt || s.publishedDate || null,
      deadline: s.deadline || null,
      deadlineNote: s.deadlineNote || '',
      eligibility: s.eligibility || '',
      category: s.category || 'other',
      status: s.status || (s.deadline ? 'VERIFIED' : 'DEADLINE UNKNOWN'),
      verifiedOn: s.verifiedAt || s.verifiedOn || null,
      live: false,
      evidence: s.evidenceUrl ? [s.evidenceUrl] : (s.sourceUrl ? [s.sourceUrl] : [])
    };
  }

  function normalizeLive(n) {
    return {
      id: n.id,
      title: n.title || 'Official update',
      provider: n.institution || n.provider || n.sourceName || 'Official source',
      summary: n.summary || '',
      sourceUrl: n.sourceUrl || n.url || '',
      publishedDate: n.publishedDate || null,
      deadline: n.deadline || null,
      deadlineNote: n.deadlineNote || '',
      eligibility: n.countryEligibility || '',
      category: n.category || 'other',
      status: n.status || 'VERIFIED',
      verifiedOn: n.verifiedOn || null,
      live: true,
      evidence: n.evidence || []
    };
  }

  function allItems() {
    var live = OM.bridge.newsCache().map(normalizeLive);
    var statics = OM.data.get('scholarships').map(normalizeStatic);
    var seen = {}, out = [];
    statics.concat(live).forEach(function (o) {
      var key = o.id || o.sourceUrl;
      if (!key || seen[key]) return;
      seen[key] = true;
      out.push(o);
    });
    return out;
  }

  function findItem(id) {
    var list = allItems();
    for (var i = 0; i < list.length; i++) if (list[i].id === id) return list[i];
    return null;
  }

  function values(items, field) {
    return ['all'].concat(u.uniq(items.map(function (o) { return o[field]; }).filter(Boolean)));
  }

  function labelFor(value) {
    if (value === 'all') return 'All';
    if (value === 'DEADLINE UNKNOWN') return 'Unknown deadline';
    return String(value).replace(/^./, function (x) { return x.toUpperCase(); });
  }

  function latestVerified(items) {
    return items.reduce(function (best, o) {
      return o.verifiedOn && (!best || o.verifiedOn > best) ? o.verifiedOn : best;
    }, null) || '2026-11-22';
  }

  function filterItems(items) {
    var state = f();
    var q = state.q.toLowerCase();
    var out = items.filter(function (o) {
      if (state.category !== 'all' && o.category !== state.category) return false;
      if (state.status !== 'all' && o.status !== state.status) return false;
      if (q && (o.title + ' ' + o.provider + ' ' + o.summary).toLowerCase().indexOf(q) === -1) return false;
      return true;
    });
    if (state.sort === 'deadline') {
      out.sort(function (a, b) {
        if (!a.deadline) return 1;
        if (!b.deadline) return -1;
        return a.deadline.localeCompare(b.deadline);
      });
    } else if (state.sort === 'newest') {
      out.sort(function (a, b) { return String(b.publishedDate || '').localeCompare(String(a.publishedDate || '')); });
    } else {
      out.sort(function (a, b) {
        var ad = a.deadline ? 0 : 1, bd = b.deadline ? 0 : 1;
        if (ad !== bd) return ad - bd;
        if (ad === 0) return a.deadline.localeCompare(b.deadline);
        return String(b.publishedDate || '').localeCompare(String(a.publishedDate || ''));
      });
    }
    return out;
  }

  function statusLine(o) {
    var bits = [];
    bits.push(ui.status(o.status));
    if (o.publishedDate) bits.push(ui.tag('Published ' + u.fmtDate(o.publishedDate), 'muted'));
    if (o.deadline) {
      var d = u.daysUntil(o.deadline);
      bits.push(ui.tag('Deadline ' + u.fmtDate(o.deadline) + (d !== null && d >= 0 ? ' · ' + d + 'd' : ''),
        d !== null && d <= 14 ? 'warning' : 'info'));
    } else {
      bits.push(ui.tag('No published deadline', 'muted'));
    }
    return '<div class="news-meta">' + bits.join('') + '</div>';
  }

  function card(o) {
    var marked = OM.bookmarks.has('opportunity', o.id);
    var track = OM.store.get('opportunity', o.id, null);
    return '<article class="news-card"><div class="news-top"><div><h3>' + u.esc(o.title) + '</h3>' +
      '<p class="small muted" style="margin-top:4px">' + u.esc(o.provider) + '</p></div>' +
      '<button class="icon-btn' + (marked ? ' on' : '') + '" data-action="bookmark" data-type="opportunity" data-id="' +
      u.esc(o.id) + '" data-data="' + u.esc(JSON.stringify(o)) + '" aria-label="Bookmark">' + ui.icon('bookmark') + '</button></div>' +
      statusLine(o) +
      (o.summary ? '<p class="news-summary">' + u.esc(o.summary) + '</p>' : '') +
      (track && track.status ? '<div class="tag tone-info" style="margin-top:10px">Your tracker: ' + u.esc(track.status) + '</div>' : '') +
      '<div class="btn-row"><button class="btn btn-ghost" data-go="/radar/' + u.esc(o.id) + '">Details</button>' +
      '<button class="btn btn-ghost" data-action="open" data-url="' + u.esc(o.sourceUrl) + '">Official source</button></div></article>';
  }

  OM.pages.radar = function () {
    var state = OM.bridge.feedState();
    var items = allItems();
    var filtered = filterItems(items);
    var offline = navigator.onLine === false;
    var fail = OM.state.radarError;
    var feedList = OM.data.get('feeds');
    var liveFeeds = feedList.filter(function (x) { return x.works === true; }).length;
    var verified = latestVerified(items);
    var cats = values(items, 'category').slice(0, 12);
    var statuses = values(items, 'status');
    if (cats.indexOf(f().category) === -1) f().category = 'all';
    if (statuses.indexOf(f().status) === -1) f().status = 'all';
    var statusTitle = offline ? 'Offline' : (liveFeeds ? 'Live when available' : 'Official directory cached');
    var statusText = state.lastSuccess ? 'Last official feed refresh: ' + u.esc(u.ago(state.lastSuccess)) + '.' :
      'Official source pages last verified ' + u.esc(u.fmtDate(verified)) + '.';
    return ui.header('Opportunity Radar', 'Official Japan study and scholarship updates.',
      { overline: 'JAPAN OPPORTUNITY RADAR', action: '<button class="icon-btn" data-action="refresh-feeds" aria-label="Refresh official feeds">' + ui.icon('radar') + '</button>' }) +

      '<div class="hero-card"><div class="overline">STATUS</div><h2>' + statusTitle + '</h2>' +
      '<p>' + statusText + ' Cached items stay available without a connection.</p>' +
      '<button class="btn btn-primary" style="margin-top:16px" data-action="refresh-feeds">Refresh official sources</button></div>' +

      (!liveFeeds ? '<div class="notice" style="margin-bottom:16px">No official RSS/Atom endpoint could be verified on 22 Nov 2026. ' +
        'This radar uses the bundled directory of official pages instead; every card links to its source.</div>' : '') +
      (fail ? '<div class="notice" style="margin-bottom:16px">' + u.esc(fail) +
        ' <button class="link-btn" data-action="dismiss-radar-error">Dismiss</button></div>' : '') +

      ui.section('Filters',
        '<div class="chip-row">' + cats.map(function (c) {
          return ui.chip(labelFor(c), { active: f().category === c, action: 'radar-category', value: c });
        }).join('') + '</div>' +
        '<input class="search-input" type="search" data-action="radar-q" placeholder="Search opportunities" value="' + u.esc(f().q) + '" aria-label="Search opportunities">' +
        '<div class="chip-row" style="margin-top:12px">' + statuses.map(function (s) {
          return ui.chip(labelFor(s), { active: f().status === s, action: 'radar-status', value: s });
        }).join('') + '</div>' +
        '<div class="chip-row">' + [['recommended', 'Recommended'], ['deadline', 'Deadline'], ['newest', 'Newest']].map(function (p) {
          return ui.chip(p[1], { active: f().sort === p[0], action: 'radar-sort', value: p[0] });
        }).join('') + '</div>') +

      ui.section('Opportunities (' + filtered.length + ')',
        OM.state.radarLoading ? ui.skeleton(4) :
          (filtered.length ? filtered.map(card).join('') :
            ui.empty('No opportunities to show',
              'Refresh the official sources, clear a filter, or open one of the source sites below.',
              '<button class="btn btn-ghost" data-action="refresh-feeds">Refresh</button>')),
        '<button class="link-btn" data-go="/radar/timeline">Timeline</button>') +

      ui.section('Deadline timeline', timeline(items)) +
      ui.section('Official sources', OM.cfg.officialSources.map(function (s) {
        return '<button class="row" data-action="open" data-url="' + u.esc(s.url) + '">' +
          '<div class="avatar">' + ui.icon('radar') + '</div><div class="row-main"><b>' + u.esc(s.name) +
          '</b><span>' + u.esc(s.url.replace(/^https?:\/\//, '')) + '</span></div>' +
          '<div class="row-end">' + ui.icon('external') + '</div></button>';
      }).join('')) +
      '<p class="small muted" style="margin-top:20px">Publication dates are labelled separately from deadlines. ' +
      'A date is never inferred from a headline or a URL. Statuses describe source verification, not your application.</p>';
  };

  function timeline(items) {
    var withDeadline = items.filter(function (o) { return !!o.deadline; })
      .sort(function (a, b) { return a.deadline.localeCompare(b.deadline); });
    if (!withDeadline.length) {
      return ui.empty('No published deadlines cached', 'When an official source publishes a deadline, it will appear here.');
    }
    return withDeadline.slice(0, 8).map(function (o) {
      var d = u.daysUntil(o.deadline);
      return '<div class="timeline-item"><div><div class="timeline-dot"></div><div class="timeline-line"></div></div>' +
        '<div><div class="overline">' + u.esc(o.deadline) + (d !== null && d >= 0 ? ' · ' + d + ' DAYS' : '') + '</div>' +
        '<button class="link-btn" style="padding-left:0" data-go="/radar/' + u.esc(o.id) + '">' + u.esc(o.title) + '</button>' +
        '<p class="small muted">' + u.esc(o.provider) + '</p></div></div>';
    }).join('');
  }

  OM.pages.radarTimeline = function () {
    return ui.header('Deadline timeline', 'Only deadlines explicitly published by official sources.', { overline: 'RADAR' }) +
      timeline(allItems()) + '<button class="btn btn-ghost" style="margin-top:20px" data-go="/radar">Back to radar</button>';
  };

  /* ---------------- opportunity detail + private tracker ---------------- */
  OM.pages.radarDetail = function (id) {
    var o = findItem(id);
    if (!o) return ui.header('Opportunity not found', '', {}) +
      ui.empty('Not in the cache', 'This item is not available offline. Refresh the radar first.');
    var track = OM.store.get('opportunity', o.id, { status: 'not tracking', notes: '', checklist: [] });
    var statuses = ['not tracking', 'saved', 'preparing', 'applied', 'shortlisted', 'accepted', 'rejected'];
    var checklist = (track.checklist || []);
    return ui.header(o.title, o.provider, { overline: o.live ? 'LIVE OFFICIAL FEED' : 'VERIFIED DIRECTORY' }) +
      '<div class="card"><div class="news-top"><div>' + statusLine(o) + '</div>' +
      ui.bookmark('opportunity', o.id, o) + '</div>' +
      (o.summary ? '<p class="muted" style="margin-top:12px">' + u.esc(o.summary) + '</p>' : '') +
      (o.eligibility ? '<p class="small" style="margin-top:12px"><b>Eligibility (as published):</b> ' + u.esc(o.eligibility) + '</p>' : '') +
      '<div class="notice" style="margin-top:14px">' +
      (o.deadline ? 'Deadline: ' + u.esc(o.deadline) + (o.deadlineNote ? ' — ' + u.esc(o.deadlineNote) : '') :
        'No deadline has been published on the source checked. Do not assume one.') + '</div>' +
      '<div class="btn-row"><button class="btn btn-primary" data-action="open" data-url="' + u.esc(o.sourceUrl) + '">Open official source</button></div>' +
      '<p class="small muted" style="margin-top:12px">Source: ' + u.esc(o.provider) +
      (o.verifiedOn ? ' · verified ' + u.esc(o.verifiedOn) : '') + '</p></div>' +

      ui.section('Your private tracker',
        '<p class="small muted">This status is yours only. It does not claim anything about the opportunity.</p>' +
        '<div class="chip-row">' + statuses.map(function (s) {
          return ui.chip(s === 'not tracking' ? 'Not tracking' : s.replace(/^./, function (x) { return x.toUpperCase(); }),
            { active: (track.status || 'not tracking') === s, action: 'track-status', value: s, id: o.id });
        }).join('') + '</div>' +
        '<div class="field-label">Private notes</div>' +
        '<textarea class="textarea" data-action="track-notes" data-id="' + u.esc(o.id) + '" placeholder="Only stored on this device">' + u.esc(track.notes || '') + '</textarea>' +
        (o.deadline ? '<button class="btn btn-ghost" style="margin-top:12px" data-action="remind" data-id="' + u.esc(o.id) +
          '" data-title="' + u.esc(o.title) + '" data-due="' + u.esc(o.deadline) + '">' +
          (OM.bridge.canNotify() ? 'Set deadline reminder' : 'Enable notifications, then set reminder') + '</button>' : '')) +

      ui.section('Your checklist',
        checklist.map(function (c) {
          return '<div class="check-row"><button class="check-box' + (c.done ? ' done' : '') +
            '" data-action="check-item" data-id="' + u.esc(o.id) + '" data-label="' + u.esc(c.label) + '">' +
            (c.done ? ui.icon('check') : '') + '</button><span>' + u.esc(c.label) + '</span></div>';
        }).join('') +
        ['Read eligibility on official source', 'Check required documents', 'Prepare application', 'Submit before deadline'].map(function (label) {
          var c = checklist.filter(function (x) { return x.label === label; })[0];
          if (c) return '';
          return '<div class="check-row"><button class="check-box" data-action="check-item" data-id="' + u.esc(o.id) +
            '" data-label="' + u.esc(label) + '"></button><span>' + u.esc(label) + '</span></div>';
        }).join(''));
  };

  OM.radarRefresh = function () {
    OM.state.radarLoading = true;
    OM.render();
    setTimeout(function () {
      var result = OM.bridge.refreshFeeds();
      OM.state.radarLoading = false;
      OM.state.radarError = null;
      if (!result.success && result.errors && result.errors.length) {
        OM.state.radarError = 'Could not refresh every official source (' + result.errors.length +
          ' failed). Showing cached items. ' + (result.errors[0].error || '');
      } else if (result.count) {
        OM.bridge.toast('Updated ' + result.count + ' official items');
      } else {
        OM.bridge.toast('No verified official feeds. Showing the bundled official directory.');
      }
      OM.render();
    }, 60);
  };
})(window.OM);
