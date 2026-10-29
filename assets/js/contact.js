(function () {
  var f = document.getElementById('briefForm');
  var out = document.getElementById('briefOut');
  var st = document.getElementById('briefStatus');
  var mail = document.getElementById('briefMail');
  var TO = 'hello@dravstudio.com';

  function val(id) { var el = document.getElementById(id); return el ? el.value.trim() : ''; }
  function dash(v) { return v ? v : '—'; }
  function checked(name) {
    return Array.prototype.map.call(f.querySelectorAll('input[name="' + name + '"]:checked'), function (i) { return i.value; });
  }
  function one(name) { var r = f.querySelector('input[name="' + name + '"]:checked'); return r ? r.value : ''; }

  function build() {
    var needs = checked('needs');
    var lines = [
      'PROJECT BRIEF FOR DRAV STUDIO',
      '',
      'Name:      ' + dash(val('name')),
      'Email:     ' + dash(val('email')),
      'Company:   ' + dash(val('company')),
      'Website:   ' + dash(val('site')),
      '',
      'Needs:     ' + (needs.length ? needs.join(', ') : '—'),
      'Budget:    ' + dash(one('budget')),
      'Launch:    ' + dash(val('timeline')),
      '',
      'About the project:',
      dash(val('message'))
    ];
    return lines.join('\n');
  }

  function render() {
    var t = build();
    out.textContent = t;
    var n = val('name');
    mail.href = 'mailto:' + TO + '?subject=' + encodeURIComponent('Project brief' + (n ? ' from ' + n : '')) + '&body=' + encodeURIComponent(t);
  }

  function selectBrief() {
    var r = document.createRange();
    r.selectNodeContents(out);
    var s = window.getSelection();
    s.removeAllRanges();
    s.addRange(r);
  }

  f.addEventListener('input', render);
  f.addEventListener('change', render);
  f.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!f.checkValidity()) { f.reportValidity(); return; }
    var t = build();
    var done = function () { st.textContent = 'Brief copied. Paste it into an email to ' + TO + '.'; };
    var fail = function () { selectBrief(); st.textContent = 'Copying was blocked. The brief is selected: press Ctrl+C or Cmd+C, then email it to ' + TO + '.'; };
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(t).then(done, fail);
      } else { fail(); }
    } catch (err) { fail(); }
  });
  render();
})();
