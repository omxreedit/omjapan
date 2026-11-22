'use strict';

/* Deterministic DOM shim: exercises the real browser modules without a GUI. */
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const ROOT = path.resolve(__dirname, '..');
const WEB = path.join(ROOT, 'web');
const SCRIPTS = [
  'config.js', 'dev-shim.js', 'core.js', 'data.js', 'ui.js',
  'home.js', 'learn.js', 'radar.js', 'community.js', 'app.js'
];

function classList() {
  const set = new Set();
  return {
    add: (...c) => c.forEach(x => set.add(x)),
    remove: (...c) => c.forEach(x => set.delete(x)),
    contains: c => set.has(c),
    toggle: (c, force) => {
      const on = force === undefined ? !set.has(c) : !!force;
      if (on) set.add(c); else set.delete(c);
      return on;
    }
  };
}

function element(id) {
  return { id, innerHTML: '', textContent: '', style: {}, classList: classList() };
}

class MemoryStorage {
  constructor(seed) {
    this.map = new Map(Object.entries(seed || {}));
  }
  get length() { return this.map.size; }
  key(i) { return Array.from(this.map.keys())[i] || null; }
  getItem(k) { return this.map.has(k) ? this.map.get(k) : null; }
  setItem(k, v) { this.map.set(k, String(v)); }
  removeItem(k) { this.map.delete(k); }
  clear() { this.map.clear(); }
}

function FakeXHR() {
  this.status = 0;
  this.responseText = '';
}
FakeXHR.prototype.open = function (_method, url) { this.url = url; };
FakeXHR.prototype.send = function () {
  const relative = this.url.startsWith('content/')
    ? path.join('data', this.url.slice('content/'.length))
    : this.url;
  try {
    this.responseText = fs.readFileSync(path.join(ROOT, relative), 'utf8');
    this.status = 200;
  } catch (e) {
    this.responseText = '';
    this.status = 404;
  }
};

function boot(seed) {
  const listeners = {};
  const elements = {
    splash: element('splash'), onboarding: element('onboarding'),
    app: element('app'), view: element('view'), navhost: element('navhost'),
    sheet: element('sheet'), toast: element('toast')
  };
  const document = {
    readyState: 'complete',
    title: '',
    body: element('body'),
    documentElement: { setAttribute() {} },
    getElementById: id => elements[id] || null,
    addEventListener(type, fn) { (listeners[type] = listeners[type] || []).push(fn); },
    execCommand() { return true; }
  };
  let currentHash = '#/home';
  const location = {
    get hash() { return currentHash; },
    set hash(v) { currentHash = v; fire('hashchange'); },
    replace(v) { currentHash = v; fire('hashchange'); }
  };

  function fire(type, event) {
    (listeners[type] || []).forEach(fn => fn(event));
  }

  const sandbox = {
    console,
    document,
    location,
    navigator: { onLine: true },
    localStorage: new MemoryStorage(seed),
    XMLHttpRequest: FakeXHR,
    setTimeout(fn) { fn(); return 0; },
    clearTimeout() {},
    setInterval() { return 0; },
    clearInterval() {},
    confirm() { return true; },
    prompt() { return ''; },
    scrollTo() {},
    addEventListener(type, fn) { (listeners[type] = listeners[type] || []).push(fn); },
    fire
  };
  sandbox.window = sandbox;
  sandbox.globalThis = sandbox;
  vm.createContext(sandbox);
  for (const name of SCRIPTS) {
    const file = path.join(WEB, 'js', name);
    vm.runInContext(fs.readFileSync(file, 'utf8'), sandbox, { filename: file });
  }
  return { sandbox, OM: sandbox.OM, elements, fire };
}

function node(attrs) {
  const el = {
    attrs,
    classList: classList(),
    getAttribute(k) { return Object.prototype.hasOwnProperty.call(attrs, k) ? attrs[k] : null; },
    hasAttribute(k) { return Object.prototype.hasOwnProperty.call(attrs, k); },
    closest(selector) {
      if (selector === '[data-action]' && attrs['data-action']) return el;
      if (selector === '[data-go]' && attrs['data-go']) return el;
      return null;
    }
  };
  return el;
}

function click(ctx, attrs) {
  const target = node(attrs);
  let prevented = false;
  ctx.fire('click', { target, preventDefault() { prevented = true; } });
  return prevented;
}

function type(ctx, attrs, value) {
  const target = node(attrs);
  target.value = value;
  ctx.fire('input', { target });
}

test('seven-step onboarding can be completed', () => {
  const ctx = boot();
  assert.equal((ctx.elements.onboarding.innerHTML.match(/<i class=/g) || []).length, 7);
  for (let step = 0; step < 7; step++) click(ctx, { 'data-action': 'onb-next' });
  assert.equal(ctx.elements.onboarding.classList.contains('hidden'), true);
  assert.match(ctx.elements.view.innerHTML, /daily actions/);
  assert.equal(ctx.OM.profile().onboarded, true);
});

test('fresh boot, onboarding and every route render without errors', () => {
  const ctx = boot();
  assert.equal(ctx.elements.onboarding.classList.contains('hidden'), false);
  assert.match(ctx.elements.onboarding.innerHTML, /Welcome to/);

  click(ctx, { 'data-go': '/learn' });
  assert.match(ctx.elements.view.innerHTML, /LEARNING PATHS/);
  click(ctx, { 'data-action': 'back' });
  assert.match(ctx.elements.view.innerHTML, /HIRAGANA PATH/);

  click(ctx, { 'data-action': 'onb-skip' });
  assert.equal(ctx.elements.onboarding.classList.contains('hidden'), true);
  assert.match(ctx.elements.view.innerHTML, /daily actions/);

  const OM = ctx.OM;
  const lessonId = OM.data.get('lessons')[0].id;
  const creatorId = OM.data.get('creators')[0].id;
  const opportunityId = OM.data.get('scholarships')[0].id;
  const routes = [
    ['/home', 'HIRAGANA PATH'], ['/learn', 'LEARNING PATHS'],
    ['/kana/hiragana', 'Hiragana'], ['/kana/katakana', 'Katakana'],
    ['/vocabulary', 'WORD LIBRARY'], ['/kanji', 'CHARACTER LIBRARY'],
    ['/writing', 'KANJI PRACTICE'], ['/grammar', 'GRAMMAR REFERENCE'],
    ['/listening', 'AUDIO DRILLS'], ['/speaking', 'SPEAKING PHRASES'],
    ['/jlpt', 'QUESTION BANK'], ['/lesson/' + lessonId, 'OBJECTIVE'],
    ['/review', 'Review'], ['/quiz', 'No active quiz'],
    ['/search', 'Type at least two characters'], ['/library', 'YOUR LIBRARY'],
    ['/analytics', 'Measured only from your own study activity'],
    ['/radar', 'Official directory cached'], ['/radar/timeline', 'Deadline timeline'],
    ['/radar/' + opportunityId, 'Your private tracker'],
    ['/creators', 'CREATOR DIRECTORY'], ['/creator/' + creatorId, 'VERIFIED CREATOR'],
    ['/more', 'Settings, library and information'], ['/settings', 'PREFERENCES'],
    ['/about', 'Made by om gohil'], ['/privacy', 'ON THIS DEVICE']
  ];
  for (const [route, needle] of routes) {
    OM.go(route, true);
    const html = ctx.elements.view.innerHTML;
    assert.doesNotMatch(html, /Something went wrong/, route + ' rendered an error screen');
    assert.ok(html.includes(needle), route + ' missing expected text: ' + needle);
  }
});

test('filters, search, bookmarks, tracking and settings persist locally', () => {
  const ctx = boot({ 'omdev:profile:me': JSON.stringify({ onboarded: true, displayName: 'Tester', dailyGoal: 10 }) });
  const OM = ctx.OM;

  OM.go('/vocabulary', true);
  click(ctx, { 'data-action': 'filter-level', 'data-scope': 'vocabulary', 'data-value': 'N4' });
  assert.equal(OM.state.filters.vocabulary.level, 'N4');

  OM.go('/radar', true);
  click(ctx, { 'data-action': 'radar-category', 'data-value': 'government' });
  assert.equal(OM.state.filters.radar.category, 'government');
  click(ctx, { 'data-action': 'radar-status', 'data-value': 'UPCOMING' });
  assert.equal(OM.state.filters.radar.status, 'UPCOMING');

  const op = OM.data.get('scholarships')[0];
  OM.go('/radar/' + op.id, true);
  click(ctx, { 'data-action': 'track-status', 'data-id': op.id, 'data-value': 'saved' });
  assert.equal(OM.store.get('opportunity', op.id).status, 'saved');
  click(ctx, { 'data-action': 'check-item', 'data-id': op.id, 'data-label': 'Read eligibility on official source' });
  assert.equal(OM.store.get('opportunity', op.id).checklist[0].done, true);

  const creator = OM.data.get('creators')[0];
  click(ctx, { 'data-action': 'bookmark', 'data-type': 'creator', 'data-id': creator.id, 'data-data': '{}' });
  assert.equal(OM.bookmarks.has('creator', creator.id), true);

  OM.go('/search', true);
  type(ctx, { 'data-action': 'global-q' }, 'scholarship');
  assert.match(ctx.elements.view.innerHTML, /Opportunities/);

  OM.go('/settings', true);
  const before = OM.state.settings.romaji;
  click(ctx, { 'data-action': 'toggle-romaji' });
  assert.equal(OM.state.settings.romaji, !before);
  assert.equal(OM.store.get('settings', 'prefs').romaji, !before);

  OM.state.radarError = null;
  OM.radarRefresh();
  assert.equal(OM.state.radarError, null);
});

test('data controls export, clear cache and erase local state', () => {
  const ctx = boot({ 'omdev:profile:me': JSON.stringify({ onboarded: true }) });
  const OM = ctx.OM;

  OM.go('/settings', true);
  click(ctx, { 'data-action': 'set-theme', 'data-value': 'contrast' });
  click(ctx, { 'data-action': 'set-accent', 'data-value': 'cyan' });
  assert.equal(OM.store.get('settings', 'prefs').theme, 'contrast');
  assert.equal(OM.store.get('settings', 'prefs').accent, 'cyan');

  click(ctx, { 'data-action': 'preload' });
  assert.ok(OM.data.get('vocabulary').length > 0);

  click(ctx, { 'data-action': 'export' });
  assert.match(ctx.elements.sheet.innerHTML, /BACKUP/);
  assert.match(ctx.elements.sheet.innerHTML, /OMJAPAN/);

  click(ctx, { 'data-action': 'clear-cache' });
  assert.equal(Object.keys(OM.state.cache).length, 0);

  const word = OM.data.get('vocabulary')[0];
  click(ctx, { 'data-action': 'bookmark', 'data-type': 'vocab', 'data-id': word.id, 'data-data': '{}' });
  assert.equal(OM.store.all('bookmarks').length, 1);
  click(ctx, { 'data-action': 'erase' });
  assert.equal(OM.store.all('bookmarks').length, 0);
  assert.equal(OM.store.all('settings').length, 0);
});

test('quizzes record real scores, mistakes and analytics', () => {
  const ctx = boot({ 'omdev:profile:me': JSON.stringify({ onboarded: true }) });
  const OM = ctx.OM;

  const word = OM.data.get('vocabulary')[0];
  click(ctx, { 'data-action': 'quiz-vocab', 'data-id': word.id });
  assert.ok(OM.state.quiz && OM.state.quiz.questions.length === 1);
  const correct = OM.state.quiz.questions[0].answer;
  click(ctx, { 'data-action': 'answer', 'data-index': String(correct) });
  click(ctx, { 'data-action': 'next-question' });
  assert.match(ctx.elements.view.innerHTML, /YOUR SCORE/);
  assert.equal(OM.store.all('quiz').length, 1);
  assert.equal(OM.stats.accuracy(), 100);

  const otherWord = OM.data.get('vocabulary')[1];
  OM.startQuiz('vocab', otherWord.id);
  const q = OM.state.quiz.questions[0];
  const wrong = (q.answer + 1) % q.options.length;
  click(ctx, { 'data-action': 'answer', 'data-index': String(wrong) });
  click(ctx, { 'data-action': 'next-question' });
  assert.ok(OM.store.all('mistakes').length >= 1);
  assert.equal(OM.store.all('quiz').length, 2);
});

test('bundled content and research data are internally consistent', () => {
  const read = name => JSON.parse(fs.readFileSync(path.join(ROOT, 'data', name + '.json'), 'utf8'));
  const counts = {
    kana: 92, vocabulary: 222, kanji: 114, grammar: 58,
    lessons: 16, jlpt: 58, listening: 12, speaking: 10,
    creators: 14, scholarships: 18
  };
  for (const [name, expected] of Object.entries(counts)) {
    assert.equal(read(name).length, expected, name + ' count');
  }

  for (const lesson of read('lessons')) {
    assert.ok(lesson.id && lesson.title && lesson.objective, 'lesson identity: ' + lesson.id);
    assert.ok(Array.isArray(lesson.sections) && lesson.sections.length, 'lesson sections: ' + lesson.id);
    assert.ok(Array.isArray(lesson.examples) && lesson.examples.length, 'lesson examples: ' + lesson.id);
    assert.ok(Array.isArray(lesson.practice) && lesson.practice.length, 'lesson practice: ' + lesson.id);
    lesson.practice.forEach(q => {
      assert.ok(q.q && Array.isArray(q.options) && q.options.length >= 2, 'question shape: ' + lesson.id);
      assert.ok(Number.isInteger(q.answer) && q.answer >= 0 && q.answer < q.options.length, 'answer index: ' + lesson.id);
      assert.ok(q.explanation, 'question explanation: ' + lesson.id);
    });
  }

  const creators = read('creators');
  creators.forEach(c => {
    const langs = c.teachingLanguages || (c.language ? [c.language] : []);
    const evidence = c.evidence || (c.evidenceUrl ? [c.evidenceUrl] : []);
    const playlists = c.playlists || (c.playlistUrl ? [{ url: c.playlistUrl }] : []);
    assert.match(c.channelUrl, /^https:\/\/www\.youtube\.com\//, c.id + ' channel');
    assert.ok((c.verifiedOn || c.verifiedAt) && evidence.length && langs.length, c.id + ' verification');
    playlists.forEach(p => assert.match(p.url, /^https:\/\/www\.youtube\.com\/playlist\?list=/, c.id + ' playlist'));
    assert.ok(!/subscriber/i.test(JSON.stringify(c)), c.id + ' has no subscriber claim');
  });

  const opportunities = read('scholarships');
  const allowedStatuses = [null, 'DEADLINE UNKNOWN', 'UPCOMING', 'CLOSED'];
  opportunities.forEach(o => {
    assert.match(o.sourceUrl, /^https:\/\//, o.id + ' source');
    assert.ok(o.evidence.length && o.verifiedOn, o.id + ' evidence');
    assert.ok(allowedStatuses.includes(o.status), o.id + ' status: ' + o.status);
    if (o.deadline) assert.match(o.deadline, /^\d{4}-\d{2}-\d{2}$/, o.id + ' deadline format');
    if (o.status === 'DEADLINE UNKNOWN') assert.equal(o.deadline, null, o.id + ' unknown deadline must be null');
  });
  assert.ok(opportunities.some(o => o.deadline), 'at least one explicit deadline');
  assert.ok(opportunities.some(o => o.deadline === null), 'at least one unknown deadline');

  read('feeds').forEach(feed => assert.equal(feed.works, false, 'unverified feed must be disabled: ' + feed.url));
});
