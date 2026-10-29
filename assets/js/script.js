(function () {
  var b = document.querySelector('.menu-btn'), n = document.querySelector('.nav');
  if (!b || !n) return;
  b.addEventListener('click', function () {
    var o = n.classList.toggle('open');
    b.setAttribute('aria-expanded', o ? 'true' : 'false');
  });
})();

(function () {
  var root = document.documentElement;
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;


  /* ---- page transitions: staggered panels + destination name ---- */
  try { sessionStorage.removeItem('dravNav'); } catch (er) {}
  if (!reduce) {
    var NAMES = { 'index.html': 'Home', 'work.html': 'Work', 'services.html': 'Services', 'about.html': 'About', 'contact.html': 'Contact' };
    document.addEventListener('click', function (e) {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      var a = e.target && e.target.closest ? e.target.closest('a[href]') : null;
      if (!a) return;
      var href = a.getAttribute('href');
      if (!href || a.target === '_blank' || /^(https?:|mailto:|tel:|#)/i.test(href) || !/\.html($|[?#])/.test(href)) return;
      var file = href.split(/[?#]/)[0].split('/').pop();
      if (file === location.pathname.split('/').pop()) return;
      e.preventDefault();
      var name = NAMES[file] || 'DRAV';
      try { sessionStorage.setItem('dravNav', name); } catch (er) {}
      if (window.dravPT) window.dravPT(name);
      root.classList.add('pt-out');
      setTimeout(function () { window.location.href = href; }, 540);
    });
    window.addEventListener('pageshow', function (ev) { if (ev.persisted) root.classList.remove('pt-out'); });
  }

    /* ---- custom cursor (mouse and trackpad only) ---- */
  if (window.matchMedia && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    var dot = document.createElement('div'), ring = document.createElement('div');
    dot.className = 'cursor-dot'; ring.className = 'cursor-ring';
    dot.setAttribute('aria-hidden', 'true'); ring.setAttribute('aria-hidden', 'true');
    document.body.appendChild(ring); document.body.appendChild(dot);
    root.classList.add('has-cursor');
    var mx = -100, my = -100, rx = -100, ry = -100, started = false;
    var HOT = 'a, button, summary, label, [role="button"], input[type="range"], input[type="checkbox"], input[type="radio"]';
    var TXT = 'input[type="text"], input[type="email"], input[type="url"], textarea, select';
    document.addEventListener('pointermove', function (e) {
      mx = e.clientX; my = e.clientY;
      if (!started) { rx = mx; ry = my; started = true; }
      dot.style.transform = 'translate3d(' + mx + 'px,' + my + 'px,0)';
      dot.classList.add('on'); ring.classList.add('on');
      var t = e.target && e.target.closest ? e.target : null;
      ring.classList.toggle('hot', !!(t && t.closest(HOT)));
      ring.classList.toggle('txt', !!(t && t.closest(TXT)));
    }, { passive: true });
    document.addEventListener('pointerdown', function () { ring.classList.add('down'); });
    document.addEventListener('pointerup', function () { ring.classList.remove('down'); });
    root.addEventListener('pointerleave', function () { dot.classList.remove('on'); ring.classList.remove('on'); });
    (function loop() {
      rx += (mx - rx) * (reduce ? 1 : 0.18); ry += (my - ry) * (reduce ? 1 : 0.18);
      ring.style.transform = 'translate3d(' + rx.toFixed(1) + 'px,' + ry.toFixed(1) + 'px,0)';
      requestAnimationFrame(loop);
    })();
  }

  /* ---- navbar: hides on scroll down, returns on scroll up ---- */
  (function () {
    var nav = document.querySelector('.nav'); if (!nav) return;
    var ph = null, last = window.scrollY, tk = false;
    function unstick() {
      nav.classList.remove('show', 'stuck', 'open');
      if (ph) { ph.parentNode.insertBefore(nav, ph); ph.parentNode.removeChild(ph); ph = null; }
    }
    function upd() {
      tk = false;
      var y = window.scrollY, d = y - last;
      if (y <= 10) { unstick(); last = y; return; }
      if (Math.abs(d) < 5) return;
      if (d < 0 && y > 160) {
        if (!nav.classList.contains('stuck')) {
          ph = document.createElement('div'); ph.style.height = nav.offsetHeight + 'px'; ph.setAttribute('aria-hidden', 'true');
          nav.parentNode.insertBefore(ph, nav);
          document.body.appendChild(nav);
          nav.classList.add('stuck'); void nav.offsetWidth;
        }
        nav.classList.add('show');
      } else if (d > 0 && nav.classList.contains('show')) {
        nav.classList.remove('show'); nav.classList.remove('open');
        var b = nav.querySelector('.menu-btn'); if (b) b.setAttribute('aria-expanded', 'false');
      }
      last = y;
    }
    window.addEventListener('scroll', function () { if (!tk) { tk = true; requestAnimationFrame(upd); } }, { passive: true });
  })();

  /* ---- back to top button: appears after the third section ---- */
  (function () {
    var bands = document.querySelectorAll('.band');
    if (bands.length < 4) return;
    var btn = document.createElement('button');
    btn.type = 'button'; btn.className = 'to-top'; btn.setAttribute('aria-label', 'Back to top');
    btn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 19V5M5 12l7-7 7 7"/></svg>';
    document.body.appendChild(btn);
    var t2 = false;
    function chk() {
      t2 = false;
      var show = bands[3].getBoundingClientRect().top <= window.innerHeight * 0.5;
      btn.classList.toggle('on', show);
    }
    window.addEventListener('scroll', function () { if (!t2) { t2 = true; requestAnimationFrame(chk); } }, { passive: true });
    window.addEventListener('resize', chk);
    btn.addEventListener('click', function () {
      var r = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      window.scrollTo({ top: 0, behavior: r ? 'auto' : 'smooth' });
    });
    chk();
  })();

  if (reduce) return;

  /* ---- smooth wheel scrolling (mouse and trackpad only; touch stays native) ---- */
  if (window.matchMedia && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    root.classList.add('has-smooth');
    var cur = window.scrollY, target = cur, raf = 0;
    var maxY = function () { return Math.max(0, root.scrollHeight - window.innerHeight); };
    var run = function () {
      cur += (target - cur) * 0.12;
      if (Math.abs(target - cur) < 0.5) { cur = target; window.scrollTo(0, cur); raf = 0; return; }
      window.scrollTo(0, cur); raf = requestAnimationFrame(run);
    };
    var go = function (y) { target = Math.min(Math.max(y, 0), maxY()); if (!raf) { cur = window.scrollY; raf = requestAnimationFrame(run); } };
    window.addEventListener('wheel', function (e) {
      if (e.ctrlKey || e.defaultPrevented || Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;
      if (e.target && e.target.closest && e.target.closest('textarea, select')) return;
      e.preventDefault();
      var d = e.deltaMode === 1 ? e.deltaY * 34 : e.deltaMode === 2 ? e.deltaY * window.innerHeight : e.deltaY;
      if (!raf) { target = window.scrollY; }
      go(target + d);
    }, { passive: false });
    window.addEventListener('scroll', function () { if (!raf) { cur = target = window.scrollY; } }, { passive: true });
    document.addEventListener('click', function (e) {
      var a = e.target && e.target.closest ? e.target.closest('a[href^="#"]') : null;
      if (!a || a.getAttribute('href').length < 2) return;
      var el = document.getElementById(a.getAttribute('href').slice(1));
      if (!el) return;
      e.preventDefault();
      go(el.getBoundingClientRect().top + window.scrollY - 20);
    });
  }

  /* ---- scroll progress bar ---- */
  var bar = document.createElement('div');
  bar.className = 'scroll-bar'; bar.setAttribute('aria-hidden', 'true');
  document.body.appendChild(bar);
  var tick = false;
  function prog() {
    var h = root.scrollHeight - window.innerHeight;
    bar.style.transform = 'scaleX(' + (h > 0 ? Math.min(window.scrollY / h, 1) : 0) + ')';
    tick = false;
  }
  window.addEventListener('scroll', function () { if (!tick) { tick = true; requestAnimationFrame(prog); } }, { passive: true });
  prog();

  /* ---- reveal on scroll (only things below the first screen) ---- */
  if (!('IntersectionObserver' in window)) return;
  var SEL = '.section-head, .head-row > .more, .pr-top, .project, .service, .svc-row, .sx, .ac-wrap, .stage, .jn, .person, .model, .case .preview, .case-copy, .case-stats > div, .pg-controls, .pg-stage, .about-copy, .ide, .dmd-head > *, .reveal, .compare .pane, .responsive-row, .principle, .contact-copy, .contact-art, .faq details, .touch > div, .story > *, .toolkit > *, .facts > div, .brief, .form > *';
  var seen = new Set();
  var io = new IntersectionObserver(function (es) {
    es.forEach(function (e) {
      if (!e.isIntersecting) return;
      e.target.classList.add('in'); io.unobserve(e.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
  var groups = new Map();
  document.querySelectorAll(SEL).forEach(function (el) {
    if (seen.has(el)) return; seen.add(el);
    if (el.getBoundingClientRect().top < window.innerHeight * 0.92) return;
    if (el.closest('.hero')) return;
    var par = el.parentElement, i = groups.get(par) || 0; groups.set(par, i + 1);
    el.style.animationDelay = (Math.min(i, 5) * 90) + 'ms';
    el.classList.add('rv');
    io.observe(el);
  });

  /* ---- count-up stats ---- */
  var stats = document.getElementById('caseStats');
  if (stats) {
    var done = false;
    new IntersectionObserver(function (es, o) {
      es.forEach(function (e) {
        if (!e.isIntersecting || done) return;
        done = true; o.disconnect();
        stats.querySelectorAll('[data-count]').forEach(function (el) {
          var end = parseFloat(el.getAttribute('data-count')), dec = parseInt(el.getAttribute('data-dec') || '0', 10);
          var suf = el.getAttribute('data-suffix') || '', t0 = null;
          function step(t) {
            if (t0 === null) t0 = t;
            var p = Math.min((t - t0) / 1300, 1), v = end * (1 - Math.pow(1 - p, 3));
            el.textContent = (dec ? v.toFixed(dec) : Math.round(v)) + suf;
            if (p < 1) requestAnimationFrame(step);
          }
          requestAnimationFrame(step);
        });
      });
    }, { threshold: 0.4 }).observe(stats);
  }
})();
