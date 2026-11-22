/* Lazy, cached content access. Only the dataset being viewed is parsed. */
(function (OM) {
  'use strict';
  var FILES = {
    kana: 'kana.json', vocabulary: 'vocabulary.json', kanji: 'kanji.json',
    grammar: 'grammar.json', lessons: 'lessons.json', jlpt: 'jlpt.json',
    listening: 'listening.json', speaking: 'speaking.json',
    creators: 'creators.json', scholarships: 'scholarships.json', feeds: 'feeds.json'
  };

  function array(value) {
    if (Array.isArray(value)) return value;
    return value ? [value] : [];
  }

  function unique(values) {
    return values.filter(function (v, i) { return v && values.indexOf(v) === i; });
  }

  /* Research passes used two equivalent creator schemas; normalise both. */
  function creator(c) {
    var categories = unique(array(c.categories).concat(array(c.tags), array(c.subjects), array(c.jlpt)));
    return Object.assign({}, c, {
      teachingLanguages: unique(array(c.teachingLanguages || c.language)),
      levels: unique(array(c.levels)),
      subjects: array(c.subjects),
      jlpt: array(c.jlpt),
      categories: categories,
      playlists: Array.isArray(c.playlists) ? c.playlists :
        (c.playlistUrl ? [{ title: 'Verified playlist', url: c.playlistUrl }] : []),
      verifiedOn: c.verifiedOn || c.verifiedAt || null,
      evidence: Array.isArray(c.evidence) ? c.evidence : array(c.evidenceUrl),
      featured: !!c.featured
    });
  }

  OM.data = {
    get: function (name) {
      if (OM.state.cache[name]) return OM.state.cache[name];
      var file = FILES[name];
      if (!file) return [];
      var raw = OM.bridge.asset('content/' + file);
      if (!raw) { OM.state.cache[name] = []; return []; }
      try {
        var parsed = JSON.parse(raw);
        OM.state.cache[name] = Array.isArray(parsed) ? parsed : [];
        if (name === 'creators') OM.state.cache[name] = OM.state.cache[name].map(creator);
      } catch (e) {
        OM.state.cache[name] = [];
      }
      return OM.state.cache[name];
    },
    find: function (name, id) {
      var list = OM.data.get(name);
      for (var i = 0; i < list.length; i++) {
        if (list[i].id === id || list[i].channelUrl === id || list[i].sourceUrl === id) return list[i];
      }
      return null;
    },
    clear: function () { OM.state.cache = {}; }
  };
})(window.OM);
