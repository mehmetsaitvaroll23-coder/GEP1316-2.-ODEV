(function () {
  'use strict';
  var root = document.documentElement;

  // 1) Karanlık mod (tercih localStorage'da saklanır)
  var themeBtn = document.getElementById('theme-btn');
  function setTheme(t) {
    root.setAttribute('data-theme', t);
    if (themeBtn) {
      themeBtn.setAttribute('aria-pressed', String(t === 'dark'));
    }
  }
  var saved = null;
  try { saved = localStorage.getItem('tema'); } catch (e) {}
  setTheme(saved || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'));
  if (themeBtn) themeBtn.addEventListener('click', function () {
    var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    setTheme(next);
    try { localStorage.setItem('tema', next); } catch (e) {}
  });

  // 2) Mobil menü
  var menuBtn = document.getElementById('menu-btn');
  var nav = document.getElementById('ana-menu');
  if (menuBtn && nav) {
    function setMenu(open) {
      menuBtn.setAttribute('aria-expanded', String(open));
      nav.classList.toggle('closed', !open);
    }
    if (window.matchMedia('(max-width: 48rem)').matches) setMenu(false);
    menuBtn.addEventListener('click', function () {
      setMenu(menuBtn.getAttribute('aria-expanded') !== 'true');
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') setMenu(false);
    });
  }

  // 3) Proje filtreleme + arama
  var list = document.getElementById('proje-listesi');
  if (list) {
    var cards = Array.prototype.slice.call(list.children);
    var search = document.getElementById('ara');
    var out = document.getElementById('sonuc');
    var buttons = document.querySelectorAll('[data-filter]');
    var cat = 'hepsi';
    function apply() {
      var q = search.value.trim().toLowerCase();
      var n = 0;
      cards.forEach(function (c) {
        var show = (cat === 'hepsi' || c.dataset.cat === cat) &&
                   c.textContent.toLowerCase().indexOf(q) !== -1;
        c.hidden = !show;
        if (show) n++;
      });
      out.textContent = n + ' proje gösteriliyor.';
    }
    buttons.forEach(function (b) {
      b.addEventListener('click', function () {
        cat = b.dataset.filter;
        buttons.forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); });
        apply();
      });
    });
    search.addEventListener('input', apply);
    apply();
  }

  // 4) Form doğrulama + geri bildirim mesajı
  var form = document.getElementById('iletisim-formu');
  if (form) {
    var rules = {
      ad: function (v) { return v.trim().length >= 2 ? '' : 'Adınızı en az 2 karakterle yazın.'; },
      eposta: function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) ? '' : 'Geçerli bir e-posta yazın (örn. ad@site.com).'; },
      mesaj: function (v) { return v.trim().length >= 10 ? '' : 'Mesajınız en az 10 karakter olmalı.'; }
    };
    function check(id) {
      var el = document.getElementById(id);
      var msg = rules[id](el.value);
      document.getElementById(id + '-hata').textContent = msg;
      el.setAttribute('aria-invalid', msg ? 'true' : 'false');
      return !msg;
    }
    Object.keys(rules).forEach(function (id) {
      document.getElementById(id).addEventListener('blur', function () { check(id); });
    });
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var fb = document.getElementById('feedback');
      var bad = Object.keys(rules).filter(function (id) { return !check(id); });
      if (bad.length) {
        fb.hidden = true;
        document.getElementById(bad[0]).focus();
        return;
      }
      fb.textContent = 'Teşekkürler! Mesajınız doğrulandı. (Bu demo formda veri gönderilmez.)';
      fb.hidden = false;
      form.reset();
    });
  }

  // Alt bilgideki yıl
  var y = document.getElementById('yil');
  if (y) y.textContent = new Date().getFullYear();
})();
