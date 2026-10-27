/* Port St Johns LM website concept · Warm & Easy Blueprints */
(function () {
  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var store = {
    get: function (k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set: function (k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  };
  var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var root = document.documentElement;

  /* ---------- shared data ---------- */
  var NOTICES = [
    { d: '2026-11-02', type: 'tender', label: 'Tender closing', title: 'Redesign, hosting, support and maintenance of the municipal website (3 years)', meta: 'PSJLM-CORP-2026/27-07, closes at 11:00', href: 'tenders.html' },
    { d: '2026-10-21', type: 'notice', label: 'Council notice', title: 'Notice of an Ordinary Council Meeting', meta: 'Office of the Speaker', href: '#' },
    { d: '2026-10-06', type: 'vacancy', label: 'Vacancy', title: 'Internal advertisement for vacancy', meta: 'Corporate Services, municipal staff only', href: 'vacancies.html' },
    { d: '2026-09-11', type: 'news', label: 'News', title: 'Our Runners', meta: 'Media Room', href: '#news' },
    { d: '2026-08-31', type: 'news', label: 'Event', title: 'PSJ River Mountain Run', meta: 'Media Room', href: '#news' },
    { d: '2026-08-06', type: 'notice', label: 'Public notice', title: 'Public Notice', meta: 'Office of the Municipal Manager', href: '#' },
    { d: '2026-07-21', type: 'notice', label: 'Council notice', title: 'Council advert', meta: 'Office of the Speaker', href: '#' },
    { d: '2026-07-17', type: 'vacancy', label: 'Vacancy', title: 'External advertisement', meta: 'Corporate Services, open to the public', href: 'vacancies.html' },
    { d: '2026-06-29', type: 'tender', label: 'SCM notice', title: 'Notice of bidders', meta: 'Supply Chain Management', href: 'tenders.html' }
  ];
  var PAGES = [
    { t: 'Integrated Development Plan (IDP) 2026/27', c: 'Document', href: '#' },
    { t: 'Budget 2026/27', c: 'Document', href: '#' },
    { t: 'Annual report', c: 'Document', href: '#' },
    { t: 'By-laws', c: 'Document', href: '#' },
    { t: 'Open tenders', c: 'Procurement', href: 'tenders.html' },
    { t: 'Requests for quotation', c: 'Procurement', href: 'tenders.html' },
    { t: 'Bids register', c: 'Procurement', href: 'tenders.html' },
    { t: 'Open vacancies', c: 'Jobs', href: 'vacancies.html' },
    { t: 'Track my job application', c: 'Jobs', href: 'vacancies.html#track' },
    { t: 'Indigent support registration', c: 'Service', href: '#' },
    { t: 'Report a fault', c: 'Service', href: '#' },
    { t: 'Council meetings and minutes', c: 'Council', href: '#' },
    { t: 'The Mayor, Cllr Cebisa Sane Mazuza', c: 'Council', href: '#' },
    { t: 'History of Port St Johns', c: 'About', href: '#' },
    { t: 'Second Beach', c: 'Visit', href: '#visit' },
    { t: 'Contact the municipality', c: 'Contact', href: '#contact' }
  ];
  var MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }

  /* ---------- toast ---------- */
  var toastEl;
  function toast(msg) {
    if (!toastEl) { toastEl = document.createElement('div'); toastEl.className = 'toast'; toastEl.setAttribute('role', 'status'); document.body.appendChild(toastEl); }
    toastEl.textContent = msg; toastEl.classList.add('show');
    clearTimeout(toast.t); toast.t = setTimeout(function () { toastEl.classList.remove('show'); }, 3600);
  }
  window.psjToast = toast;

  /* ---------- Lite mode ---------- */
  var liteBtns = $$('[data-lite]');
  function setLite(on, announce) {
    root.classList.toggle('lite', on);
    liteBtns.forEach(function (b) { b.setAttribute('aria-pressed', on ? 'true' : 'false'); });
    store.set('psj-lite', on ? '1' : '0');
    if (announce) toast(on ? 'Lite mode on: photos and animation off to save data.' : 'Lite mode off.');
  }
  if (store.get('psj-lite') === '1') setLite(true, false);
  liteBtns.forEach(function (b) { b.addEventListener('click', function () { setLite(!root.classList.contains('lite'), true); }); });

  /* ---------- language ---------- */
  $$('[data-lang]').forEach(function (b) {
    b.addEventListener('click', function () {
      $$('[data-lang]').forEach(function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
      if (b.getAttribute('data-lang') === 'xh') toast('isiXhosa pages load from the municipality’s approved translations at launch.');
    });
  });

  /* ---------- header ---------- */
  var header = $('.site-header');
  var toTop = $('.to-top');
  function onScroll() {
    var y = window.scrollY;
    if (header) header.classList.toggle('scrolled', y > 40 || !document.body.classList.contains('home'));
    if (toTop) toTop.classList.toggle('show', y > 900);
  }
  window.addEventListener('scroll', onScroll, { passive: true }); onScroll();
  if (toTop) toTop.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' }); });

  /* mega menus */
  var items = $$('.nav-item');
  function closeAll(except) { items.forEach(function (i) { if (i !== except) { i.classList.remove('open'); var b = $('.nav-top', i); if (b && b.tagName === 'BUTTON') b.setAttribute('aria-expanded', 'false'); } }); }
  items.forEach(function (item) {
    var btn = $('button.nav-top', item); if (!btn) return;
    var t;
    btn.addEventListener('click', function () { var open = !item.classList.contains('open'); closeAll(item); item.classList.toggle('open', open); btn.setAttribute('aria-expanded', open); });
    item.addEventListener('mouseenter', function () { if (window.matchMedia('(hover:hover)').matches) { clearTimeout(t); closeAll(item); item.classList.add('open'); btn.setAttribute('aria-expanded', 'true'); } });
    item.addEventListener('mouseleave', function () { if (window.matchMedia('(hover:hover)').matches) { t = setTimeout(function () { item.classList.remove('open'); btn.setAttribute('aria-expanded', 'false'); }, 160); } });
  });
  document.addEventListener('click', function (e) { if (!e.target.closest('.nav-item')) closeAll(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') { closeAll(); closeMenu(); closeDrawer(); } });

  /* mobile menu */
  var mnav = $('.mnav');
  function openMenu() { if (!mnav) return; mnav.classList.add('open'); document.body.style.overflow = 'hidden'; var c = $('.mnav-close', mnav); if (c) c.focus(); }
  function closeMenu() { if (!mnav || !mnav.classList.contains('open')) return; mnav.classList.remove('open'); document.body.style.overflow = ''; var m = $('.menu-btn'); if (m) m.focus(); }
  $$('.menu-btn').forEach(function (b) { b.addEventListener('click', openMenu); });
  $$('.mnav-close').forEach(function (b) { b.addEventListener('click', closeMenu); });

  /* ---------- live weather (Open-Meteo, no key) ---------- */
  var wx = $('[data-weather]');
  if (wx && !root.classList.contains('lite') && window.fetch) {
    var codes = { 0: 'Clear', 1: 'Mostly clear', 2: 'Partly cloudy', 3: 'Overcast', 45: 'Fog', 48: 'Fog', 51: 'Light drizzle', 53: 'Drizzle', 55: 'Drizzle', 61: 'Light rain', 63: 'Rain', 65: 'Heavy rain', 80: 'Showers', 81: 'Showers', 82: 'Heavy showers', 95: 'Thunderstorms', 96: 'Thunderstorms', 99: 'Thunderstorms' };
    fetch('https://api.open-meteo.com/v1/forecast?latitude=-31.6229&longitude=29.5448&current=temperature_2m,weather_code,wind_speed_10m&timezone=Africa%2FJohannesburg')
      .then(function (r) { if (!r.ok) throw 0; return r.json(); })
      .then(function (j) {
        var c = j.current; if (!c) return;
        $('[data-wx-text]', wx).textContent = 'Port St Johns ' + Math.round(c.temperature_2m) + '°C, ' + (codes[c.weather_code] || 'now').toLowerCase() + ', wind ' + Math.round(c.wind_speed_10m) + ' km/h';
        wx.hidden = false;
      }).catch(function () {});
  }

  /* ---------- hero slideshow ---------- */
  var hero = $('.hero');
  if (hero) {
    var slides = $$('.slide', hero), bars = $$('.bars button', hero), cap = $('.slide-caption', hero), pauseBtn = $('.pause', hero);
    var i = 0, timer, DUR = 7000, paused = false;
    hero.style.setProperty('--dur', DUR + 'ms');
    function show(n) {
      slides[i].classList.remove('active'); bars[i].classList.remove('active');
      bars.forEach(function (b, k) { b.classList.toggle('done', k < n); b.setAttribute('aria-current', k === n ? 'true' : 'false'); });
      i = (n + slides.length) % slides.length;
      slides[i].classList.add('active'); void bars[i].offsetWidth; bars[i].classList.add('active');
      if (cap) cap.textContent = slides[i].getAttribute('data-caption');
      schedule();
    }
    function schedule() { clearTimeout(timer); if (!paused && !reduced && !root.classList.contains('lite')) timer = setTimeout(function () { show(i + 1 === slides.length ? 0 : i + 1); if (i === 0) bars.forEach(function (b) { b.classList.remove('done'); }); }, DUR); }
    bars.forEach(function (b, k) { b.addEventListener('click', function () { show(k); }); });
    if (pauseBtn) pauseBtn.addEventListener('click', function () {
      paused = !paused; hero.classList.toggle('paused', paused);
      pauseBtn.setAttribute('aria-label', paused ? 'Play slideshow' : 'Pause slideshow');
      pauseBtn.innerHTML = paused ? '<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M7 4l14 8-14 8z"/></svg>' : '<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M6 4h4v16H6zM14 4h4v16h-4z"/></svg>';
      schedule();
    });
    document.addEventListener('visibilitychange', function () { if (document.hidden) clearTimeout(timer); else schedule(); });
    bars[0].classList.add('active'); if (cap) cap.textContent = slides[0].getAttribute('data-caption');
    schedule();
  }

  /* ---------- ticker ---------- */
  var track = $('.ticker-track');
  if (track) {
    var html = NOTICES.slice(0, 6).map(function (n) { var d = new Date(n.d); return '<a href="' + n.href + '"><time datetime="' + n.d + '">' + d.getDate() + ' ' + MONTHS[d.getMonth()] + '</time>' + esc(n.title) + '</a>'; }).join('');
    track.innerHTML = html + html.replace(/<a /g, '<a tabindex="-1" aria-hidden="true" ');
  }

  /* ---------- notice board ---------- */
  var list = $('[data-notices]');
  if (list) {
    var tabs = $$('[data-filter]');
    var counts = { all: NOTICES.length };
    NOTICES.forEach(function (n) { counts[n.type] = (counts[n.type] || 0) + 1; });
    tabs.forEach(function (t) { var f = t.getAttribute('data-filter'); var s = $('.n', t); if (s) s.textContent = counts[f] || 0; });
    function render(f) {
      var rows = NOTICES.filter(function (n) { return f === 'all' || n.type === f; }).slice(0, 6);
      list.innerHTML = rows.map(function (n, k) {
        var d = new Date(n.d);
        return '<li class="notice in-anim" style="animation-delay:' + (k * 60) + 'ms"><div class="date"><b>' + ('0' + d.getDate()).slice(-2) + '</b><span>' + MONTHS[d.getMonth()] + '</span></div>' +
          '<div><span class="kind k-' + n.type + '">' + esc(n.label) + '</span><h3><a href="' + n.href + '">' + esc(n.title) + '</a></h3><p>' + esc(n.meta) + '</p></div>' +
          '<a class="dl" href="#" aria-label="Download PDF: ' + esc(n.title) + '"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" aria-hidden="true"><path d="M12 4v11M7 10l5 5 5-5M5 20h14"/></svg>PDF</a></li>';
      }).join('');
    }
    tabs.forEach(function (t) {
      t.addEventListener('click', function () { tabs.forEach(function (x) { x.setAttribute('aria-selected', x === t ? 'true' : 'false'); }); render(t.getAttribute('data-filter')); });
    });
    render('all');
  }

  /* ---------- countdowns ---------- */
  var cds = $$('[data-countdown]');
  if (cds.length) {
    var tick = function () {
      cds.forEach(function (el) {
        var end = new Date(el.getAttribute('data-countdown')).getTime(), diff = Math.max(0, end - Date.now());
        var d = Math.floor(diff / 864e5), h = Math.floor(diff % 864e5 / 36e5), m = Math.floor(diff % 36e5 / 6e4), s = Math.floor(diff % 6e4 / 1e3);
        var set = function (k, v) { var x = $('[data-' + k + ']', el); if (x) x.textContent = ('0' + v).slice(-2); };
        set('d', d); set('h', h); set('m', m); set('s', s);
        var txt = $('[data-left]', el); if (txt) txt.textContent = diff ? d + ' days left' : 'Closed';
      });
    };
    tick(); setInterval(tick, 1000);
  }
  $$('[data-days-left]').forEach(function (el) {
    var diff = new Date(el.getAttribute('data-days-left')).getTime() - Date.now();
    var d = Math.ceil(diff / 864e5);
    el.textContent = diff <= 0 ? 'Closed' : (d === 1 ? '1 day left' : d + ' days left');
    if (diff > 0 && d <= 7) el.classList.add('soon');
  });

  /* ---------- search suggestions ---------- */
  $$('[data-search]').forEach(function (form) {
    var input = $('input', form), box = $('.suggest', form), active = -1;
    var index = PAGES.concat(NOTICES.map(function (n) { return { t: n.title, c: n.label, href: n.href }; }));
    function draw() {
      var q = input.value.trim().toLowerCase();
      if (q.length < 2) { box.hidden = true; input.setAttribute('aria-expanded', 'false'); return; }
      var hits = index.filter(function (p) { return (p.t + ' ' + p.c).toLowerCase().indexOf(q) > -1; }).slice(0, 6);
      box.innerHTML = hits.length ? hits.map(function (h, k) { return '<li><a id="sg' + k + '" href="' + h.href + '"><span>' + esc(h.t) + '</span><small>' + esc(h.c) + '</small></a></li>'; }).join('')
        : '<li><a href="#"><span>No matches for “' + esc(input.value) + '”. Try “tender”, “IDP” or “job”.</span></a></li>';
      box.hidden = false; input.setAttribute('aria-expanded', 'true'); active = -1;
    }
    input.addEventListener('input', draw);
    input.addEventListener('keydown', function (e) {
      var links = $$('a', box); if (box.hidden || !links.length) return;
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault(); active = (active + (e.key === 'ArrowDown' ? 1 : -1) + links.length) % links.length;
        links.forEach(function (l, k) { l.classList.toggle('active', k === active); }); input.setAttribute('aria-activedescendant', links[active].id || '');
      } else if (e.key === 'Enter' && active > -1) { e.preventDefault(); links[active].click(); }
    });
    form.addEventListener('submit', function (e) { e.preventDefault(); var first = $('a', box); if (!box.hidden && first) first.click(); else draw(); });
    document.addEventListener('click', function (e) { if (!form.contains(e.target)) box.hidden = true; });
  });

  /* ---------- reveals and counters ---------- */
  var io = 'IntersectionObserver' in window ? new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (!en.isIntersecting) return;
      var el = en.target; el.classList.add('in'); io.unobserve(el);
      if (el.hasAttribute('data-count')) countUp(el);
    });
  }, { threshold: .18 }) : null;
  function countUp(el) {
    var to = +el.getAttribute('data-count'), t0 = null, dur = 1600;
    if (reduced || root.classList.contains('lite')) { el.textContent = to; return; }
    function step(ts) { if (!t0) t0 = ts; var p = Math.min(1, (ts - t0) / dur); el.textContent = Math.round(to * (1 - Math.pow(1 - p, 3))); if (p < 1) requestAnimationFrame(step); }
    requestAnimationFrame(step);
  }
  $$('.reveal, [data-count], .steps li').forEach(function (el) { if (io) io.observe(el); else { el.classList.add('in'); if (el.hasAttribute('data-count')) el.textContent = el.getAttribute('data-count'); } });
  /* clipped images report no visible area, so watch their container instead */
  var wipeIo = 'IntersectionObserver' in window ? new IntersectionObserver(function (entries) {
    entries.forEach(function (en) { if (en.isIntersecting) { $$('.wipe', en.target).forEach(function (w) { w.classList.add('in'); }); wipeIo.unobserve(en.target); } });
  }, { threshold: .15 }) : null;
  $$('.mosaic').forEach(function (m) { if (wipeIo) wipeIo.observe(m); else $$('.wipe', m).forEach(function (w) { w.classList.add('in'); }); });

  /* ---------- subscribe forms (concept) ---------- */
  $$('[data-subscribe]').forEach(function (f) {
    f.addEventListener('submit', function (e) {
      e.preventDefault(); var v = $('input', f).value.trim();
      toast(v ? 'Subscribed. New notices will go to ' + v + '.' : 'Enter a cellphone number or email address first.');
      if (v) f.reset();
    });
  });

  /* ---------- drawer (vacancies) ---------- */
  var drawer = $('.drawer');
  function closeDrawer() { if (drawer && drawer.classList.contains('open')) { drawer.classList.remove('open'); document.body.style.overflow = ''; if (drawer._from) drawer._from.focus(); } }
  window.psjCloseDrawer = closeDrawer;
  if (drawer) {
    $$('[data-apply]').forEach(function (b) {
      b.addEventListener('click', function (e) {
        e.preventDefault(); $('[data-drawer-title]', drawer).textContent = b.getAttribute('data-apply');
        drawer._from = b; drawer.classList.add('open'); document.body.style.overflow = 'hidden'; setStep(1);
        setTimeout(function () { $('.drawer-close', drawer).focus(); }, 50);
      });
    });
    $$('.drawer-close', drawer).forEach(function (b) { b.addEventListener('click', closeDrawer); });
    drawer.addEventListener('click', function (e) { if (e.target === drawer) closeDrawer(); });
    var stepEls = $$('[data-step]', drawer);
    var setStep = function (n) {
      stepEls.forEach(function (s) { s.hidden = +s.getAttribute('data-step') !== n; });
      $('.progress i', drawer).style.width = (n * 25) + '%';
      $('[data-step-label]', drawer).textContent = 'Step ' + n + ' of 4';
    };
    $$('[data-next]', drawer).forEach(function (b) { b.addEventListener('click', function () { setStep(+b.getAttribute('data-next')); }); });
  }

  /* ---------- tracker (vacancies) ---------- */
  var trackForm = $('[data-track]');
  if (trackForm) {
    trackForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var v = $('input', trackForm).value.trim(), steps = $$('.timeline li'), out = $('[data-track-out]');
      if (!v) { out.textContent = 'Enter the reference from your SMS, for example PSJ-APP-104233.'; return; }
      steps.forEach(function (s) { s.className = ''; });
      out.textContent = 'Showing a sample status for ' + v + '.';
      steps.forEach(function (s, k) { setTimeout(function () { s.className = k < 2 ? 'done' : (k === 2 ? 'now' : ''); }, reduced ? 0 : 280 * (k + 1)); });
    });
  }

  /* ---------- job filters (vacancies) ---------- */
  var jobs = $$('.job');
  var fForm = $('[data-job-filters]');
  if (fForm && jobs.length) {
    var apply = function () {
      var q = ($('#f-q').value || '').toLowerCase(), dept = $('#f-dept').value;
      var who = $$('input[name=who]:checked', fForm).map(function (x) { return x.value; });
      var kind = $$('input[name=kind]:checked', fForm).map(function (x) { return x.value; });
      var n = 0;
      jobs.forEach(function (j) {
        var ok = (!q || j.textContent.toLowerCase().indexOf(q) > -1) && (!dept || j.getAttribute('data-dept') === dept) && who.indexOf(j.getAttribute('data-who')) > -1 && kind.indexOf(j.getAttribute('data-kind')) > -1;
        j.hidden = !ok; if (ok) n++;
      });
      $('[data-count-out]').textContent = n === 1 ? 'Showing 1 open post' : 'Showing ' + n + ' open posts';
      $('.empty').hidden = n !== 0;
    };
    fForm.addEventListener('input', apply); fForm.addEventListener('change', apply);
    fForm.addEventListener('submit', function (e) { e.preventDefault(); });
    $$('[data-reset]').forEach(function (b) { b.addEventListener('click', function () { fForm.reset(); apply(); }); });
  }

  /* ---------- procurement tabs + search (tenders) ---------- */
  var ptabs = $$('[data-ptab]');
  if (ptabs.length) {
    var panels = $$('[data-ppanel]');
    ptabs.forEach(function (t) {
      t.addEventListener('click', function () {
        ptabs.forEach(function (x) { x.setAttribute('aria-selected', x === t ? 'true' : 'false'); });
        panels.forEach(function (p) { p.hidden = p.getAttribute('data-ppanel') !== t.getAttribute('data-ptab'); });
      });
    });
    var tq = $('#t-q');
    if (tq) tq.addEventListener('input', function () {
      var q = tq.value.toLowerCase();
      $$('[data-ppanel]:not([hidden]) tbody tr').forEach(function (r) { r.hidden = q && r.textContent.toLowerCase().indexOf(q) === -1; });
    });
  }
})();
