(function () {
  var r = document.getElementById('rvRange'), c = document.getElementById('rvCode'), h = document.getElementById('rvHandle');
  if (r && c && h) {
    var set = function () { c.style.clipPath = 'inset(0 0 0 ' + r.value + '%)'; h.style.left = r.value + '%'; };
    r.addEventListener('input', set);
    set();
  }
  /* brand playground */
  var palEl = document.getElementById('pgPal');
  if (palEl) {
    var PAL = [
      { n: 'Studio', bg: '#F7F6F2', fg: '#15162B', ac: '#7357FF', ac2: '#D5FF64', card: '#FFFFFF' },
      { n: 'Midnight', bg: '#0A0A0B', fg: '#FFFFFF', ac: '#D5FF64', ac2: '#7357FF', card: '#151518' },
      { n: 'Coral', bg: '#FFD8D2', fg: '#15162B', ac: '#FF6B5B', ac2: '#15162B', card: '#FFFFFF' },
      { n: 'Forest', bg: '#E9EFE4', fg: '#14281D', ac: '#2F6B4F', ac2: '#E6C86E', card: '#FFFFFF' }
    ];
    var FONTS = [
      { n: 'Grotesk', f: "'Bricolage Grotesque', 'Helvetica Neue', Arial, sans-serif" },
      { n: 'Humanist', f: "'Instrument Sans', system-ui, sans-serif" },
      { n: 'Mono', f: "'JetBrains Mono', ui-monospace, monospace" },
      { n: 'Serif', f: "Georgia, 'Times New Roman', serif" }
    ];
    var st = { p: 0, f: 0, r: 14 };
    var $ = function (id) { return document.getElementById(id); };
    function ink(hex) {
      var h = hex.replace('#', ''), r = parseInt(h.substr(0, 2), 16), g = parseInt(h.substr(2, 2), 16), b = parseInt(h.substr(4, 2), 16);
      return (0.299 * r + 0.587 * g + 0.114 * b) > 150 ? '#15162B' : '#FFFFFF';
    }
    PAL.forEach(function (p, i) {
      var b = document.createElement('button');
      b.type = 'button';
      b.innerHTML = '<span class="sw"><i style="background:' + p.bg + '"></i><i style="background:' + p.ac + '"></i><i style="background:' + p.ac2 + '"></i><i style="background:' + p.fg + '"></i></span><span>' + p.n + '</span>';
      b.addEventListener('click', function () { st.p = i; paint(); });
      palEl.appendChild(b);
    });
    var fontEl = $('pgFonts');
    FONTS.forEach(function (f, i) {
      var b = document.createElement('button');
      b.type = 'button'; b.textContent = f.n; b.style.fontFamily = f.f;
      b.addEventListener('click', function () { st.f = i; paint(); });
      fontEl.appendChild(b);
    });
    $('pgRad').addEventListener('input', function (e) { st.r = parseInt(e.target.value, 10); paint(); });
    function paint() {
      var p = PAL[st.p], f = FONTS[st.f], r = st.r, br = r >= 30 ? 999 : Math.round(r * 1.4);
      var m = $('pgm');
      m.style.background = p.bg; m.style.color = p.fg; m.style.fontFamily = f.f; m.style.borderRadius = Math.max(6, r + 8) + 'px';
      $('pgLogoR').setAttribute('fill', p.ac); $('pgLogoR').setAttribute('rx', Math.round(r * 0.85));
      $('pgLogoC').setAttribute('fill', p.ac2);
      var b1 = $('pgB1'), b2 = $('pgB2');
      b1.style.background = p.ac; b1.style.color = ink(p.ac); b1.style.borderRadius = br + 'px';
      b2.style.background = 'transparent'; b2.style.color = p.fg; b2.style.border = '2px solid ' + p.fg; b2.style.borderRadius = br + 'px';
      var cs = [[p.ac, ink(p.ac)], [p.ac2, ink(p.ac2)], [p.card, p.fg]];
      ['pgC1', 'pgC2', 'pgC3'].forEach(function (id, k) {
        var c = $(id); c.style.background = cs[k][0]; c.style.color = cs[k][1]; c.style.borderRadius = r + 'px';
        c.style.border = k === 2 ? '1px solid rgba(128,128,128,0.35)' : '0';
      });
      var kids = palEl.children, fk = fontEl.children, i;
      for (i = 0; i < kids.length; i++) kids[i].setAttribute('aria-pressed', i === st.p ? 'true' : 'false');
      for (i = 0; i < fk.length; i++) fk[i].setAttribute('aria-pressed', i === st.f ? 'true' : 'false');
      $('pgCode').innerHTML = '<b>.brand</b> {\n  background: ' + p.bg + ';\n  color: ' + p.fg + ';\n  font-family: ' + f.n + ';\n  border-radius: ' + r + 'px;\n}\n<b>.btn</b> { background: ' + p.ac + '; border-radius: ' + br + 'px; }';
    }
    paint();
  }

})();

/* ---- hero graphic: layers follow the cursor (mouse and trackpad only) ---- */
(function () {
  var art = document.getElementById('heroArt');
  if (!art || !window.matchMedia) return;
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  var glow = document.createElement('div');
  glow.className = 'hero-glow'; glow.setAttribute('aria-hidden', 'true');
  art.insertBefore(glow, art.firstChild);
  art.classList.add('fx');
  var defs = [['.win', 16, 7], ['.phone', 30, 11], ['.codecard', 22, 6], ['.badge', 46, 0]];
  var layers = [];
  defs.forEach(function (d) {
    var el = art.querySelector(d[0]);
    if (el) layers.push({ el: el, depth: d[1], rot: d[2] });
  });
  var tx = 0, ty = 0, cx = 0, cy = 0, gx = 0, gy = 0, raf = 0, hot = false;
  function clamp(v) { return Math.max(-1.2, Math.min(1.2, v)); }
  function frame() {
    cx += (tx - cx) * 0.1; cy += (ty - cy) * 0.1;
    layers.forEach(function (l) {
      l.el.style.transform = 'perspective(900px) translate3d(' + (cx * l.depth).toFixed(2) + 'px,' + (cy * l.depth).toFixed(2) + 'px,0) rotateY(' + (cx * l.rot).toFixed(2) + 'deg) rotateX(' + (-cy * l.rot).toFixed(2) + 'deg)';
    });
    glow.style.transform = 'translate3d(' + gx.toFixed(1) + 'px,' + gy.toFixed(1) + 'px,0)';
    if (Math.abs(tx - cx) > 0.002 || Math.abs(ty - cy) > 0.002) raf = requestAnimationFrame(frame); else raf = 0;
  }
  function kick() { if (!raf) raf = requestAnimationFrame(frame); }
  var host = art.closest('.hero') || art;
  host.addEventListener('pointermove', function (e) {
    var r = art.getBoundingClientRect();
    tx = clamp(((e.clientX - r.left) / r.width) * 2 - 1);
    ty = clamp(((e.clientY - r.top) / r.height) * 2 - 1);
    gx = e.clientX - r.left - 160; gy = e.clientY - r.top - 160;
    if (!hot) { hot = true; art.classList.add('hot'); }
    kick();
  }, { passive: true });
  host.addEventListener('pointerleave', function () {
    tx = 0; ty = 0; hot = false; art.classList.remove('hot'); kick();
  });
})();
