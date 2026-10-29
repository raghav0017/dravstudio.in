(function () {
  var chips = document.querySelectorAll('[data-filter]');
  var items = document.querySelectorAll('.wk-item');
  var count = document.getElementById('wkCount');
  function apply(f) {
    var n = 0;
    items.forEach(function (el) {
      var cats = el.getAttribute('data-cat').split(' ');
      var show = f === 'all' || cats.indexOf(f) > -1;
      el.hidden = !show;
      el.classList.remove('s7', 's5', 'lift');
      if (show) {
        var m = n % 4;
        el.classList.add(m === 0 || m === 3 ? 's7' : 's5');
        if (n % 2 === 1) el.classList.add('lift');
        n++;
      }
    });
    count.textContent = n + (n === 1 ? ' project' : ' projects');
    chips.forEach(function (c) { c.setAttribute('aria-pressed', c.getAttribute('data-filter') === f ? 'true' : 'false'); });
  }
  chips.forEach(function (c) { c.addEventListener('click', function () { apply(c.getAttribute('data-filter')); }); });
  apply('all');
})();
