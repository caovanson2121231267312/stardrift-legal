// privacy.html / support.html: pick the language (?lang=, else the game's saved choice, else the browser's),
// keep ?lang and ?embed on the links between the pages, and the "copy e-mail" button.
(function () {
  var q = new URLSearchParams(location.search), root = document.documentElement;
  var langs = ['vi', 'en', 'zh'];
  function pick() {
    var l = q.get('lang');
    if (langs.indexOf(l) >= 0) return l;
    try { l = localStorage.getItem('stardrift_lang'); if (langs.indexOf(l) >= 0) return l; } catch (e) { /* storage blocked */ }
    var nav = (navigator.languages && navigator.languages.length ? navigator.languages : [navigator.language || '']);
    for (var i = 0; i < nav.length; i++) {
      var t = String(nav[i]).toLowerCase();
      if (t.indexOf('vi') === 0) return 'vi';
      if (t.indexOf('zh') === 0) return 'zh';
      if (t.indexOf('en') === 0) return 'en';
    }
    return 'en';
  }
  var lang = pick();
  root.setAttribute('data-lang', lang);
  root.lang = lang === 'zh' ? 'zh-Hans' : lang;
  if (q.get('embed') === '1') root.classList.add('embed');
  var titles = { vi: root.getAttribute('data-title-vi'), en: root.getAttribute('data-title-en'), zh: root.getAttribute('data-title-zh') };
  if (titles[lang]) document.title = titles[lang] + ' · Stardrift';

  document.addEventListener('DOMContentLoaded', function () {
    // language switcher and cross-links keep the current mode
    document.querySelectorAll('a[data-keep]').forEach(function (a) {
      var u = new URL(a.getAttribute('href'), location.href);
      if (!u.searchParams.has('lang')) u.searchParams.set('lang', lang);
      if (root.classList.contains('embed')) u.searchParams.set('embed', '1');
      a.setAttribute('href', u.pathname.split('/').pop() + u.search);
    });
    document.querySelectorAll('nav.lang a').forEach(function (a) {
      if (new URL(a.href).searchParams.get('lang') === lang) a.classList.add('on');
    });
    document.querySelectorAll('[data-copy]').forEach(function (b) {
      b.addEventListener('click', function () {
        var text = b.getAttribute('data-copy'), done = b.getAttribute('data-done') || '✓';
        var ok = function () { var old = b.textContent; b.textContent = done; setTimeout(function () { b.textContent = old; }, 1800); };
        if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(ok, fallback); else fallback();
        function fallback() {
          var t = document.createElement('textarea'); t.value = text; document.body.appendChild(t); t.select();
          try { document.execCommand('copy'); ok(); } catch (e) { /* the address is on screen to copy by hand */ }
          t.remove();
        }
      });
    });
  });
})();
