(function () {
  var root = document.documentElement;
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function build(name) {
    if (document.querySelector('.ptx')) return;
    var pt = document.createElement('div');
    pt.className = 'ptx'; pt.setAttribute('aria-hidden', 'true');
    pt.innerHTML = '<i></i><div class="ptx-logo"> <img src="/assets/images/drav-main-logo.webp" alt=""> </div>';
    root.appendChild(pt);
    return pt;
  }
  window.dravPT = build;
  var n = null;
  try { n = sessionStorage.getItem('dravNav'); } catch (e) {}
  if (n && !reduce) {
    root.className += ' pt-in';
    var pt = build(n);
    pt.querySelector('i').addEventListener('animationend', function () {
      if (pt.parentNode) pt.parentNode.removeChild(pt);
      root.className = root.className.replace(/\s*pt-in/, '');
    });
  }
})();
