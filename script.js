/* KUTADRI CONTECH — interactions */
(function () {
  'use strict';

  /* ---- mobile nav ---- */
  var toggle = document.getElementById('navToggle');
  var menu = document.getElementById('navMenu');
  if (toggle && menu) {
    toggle.addEventListener('click', function () {
      var open = menu.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    });
    menu.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        menu.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---- sticky nav shadow ---- */
  var nav = document.getElementById('nav');
  if (nav) {
    var onScroll = function () {
      nav.classList.toggle('scrolled', window.scrollY > 8);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ---- reveal on scroll ---- */
  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && reveals.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('in'); });
  }

  /* ---- project filter (projects page) ---- */
  var filterBar = document.getElementById('filters');
  if (filterBar) {
    var cards = document.querySelectorAll('[data-cat]');
    var groups = document.querySelectorAll('[data-group]');
    filterBar.addEventListener('click', function (e) {
      var btn = e.target.closest('.filter');
      if (!btn) return;
      filterBar.querySelectorAll('.filter').forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');
      var cat = btn.getAttribute('data-filter');
      cards.forEach(function (c) {
        var show = cat === 'all' || c.getAttribute('data-cat') === cat;
        c.classList.toggle('is-hidden', !show);
      });
      // hide a group label if it has no visible cards
      groups.forEach(function (g) {
        var visible = g.parentElement.querySelectorAll('[data-cat]:not(.is-hidden)');
        // find cards that belong after this label until next label — simpler: count within its grid
      });
      // update visible counts per group grid
      document.querySelectorAll('[data-groupgrid]').forEach(function (grid) {
        var vis = grid.querySelectorAll('[data-cat]:not(.is-hidden)').length;
        var label = document.querySelector('[data-group="' + grid.getAttribute('data-groupgrid') + '"]');
        if (label) label.classList.toggle('is-hidden', vis === 0);
      });
    });
  }

  /* ---- contact form -> mailto (static, no backend) ---- */
  var form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var get = function (id) { var el = document.getElementById(id); return el ? el.value.trim() : ''; };
      var name = get('cf-name'), phone = get('cf-phone'), email = get('cf-email'),
          type = get('cf-type'), location = get('cf-location'), msg = get('cf-msg');
      var subject = 'Project enquiry' + (type ? ' — ' + type : '') + (name ? ' (' + name + ')' : '');
      var bodyLines = [
        'Name: ' + name,
        'Phone: ' + phone,
        'Email: ' + email,
        'Project type: ' + type,
        'Location: ' + location,
        '',
        'Details:',
        msg
      ];
      var href = 'mailto:kutadricontech@gmail.com'
        + '?subject=' + encodeURIComponent(subject)
        + '&body=' + encodeURIComponent(bodyLines.join('\n'));
      var ok = document.getElementById('formOk');
      if (ok) ok.classList.add('show');
      window.location.href = href;
    });
  }

  /* ---- footer year ---- */
  var y = document.getElementById('yr');
  if (y) y.textContent = new Date().getFullYear();
})();

// ── GALLERY LIGHTBOX ─────────────────────────────────────────────────────────
(function(){
  var grid = document.getElementById('galGrid');
  if(!grid) return;

  var photos  = JSON.parse(grid.dataset.photos || '[]');
  var lb      = document.getElementById('lightbox');
  var lbImg   = document.getElementById('lbImg');
  var lbCnt   = document.getElementById('lbCounter');
  var lbClose = document.getElementById('lbClose');
  var lbPrev  = document.getElementById('lbPrev');
  var lbNext  = document.getElementById('lbNext');
  var current = 0;

  function open(idx){
    current = ((idx % photos.length) + photos.length) % photos.length;
    lbImg.src = photos[current];
    lbImg.alt = 'Photo ' + (current+1);
    lbCnt.textContent = (current+1) + ' / ' + photos.length;
    lb.classList.add('open');
    document.body.style.overflow = 'hidden';
    lbClose.focus();
  }
  function close(){
    lb.classList.remove('open');
    document.body.style.overflow = '';
  }
  function prev(){ open(current - 1); }
  function next(){ open(current + 1); }

  // open on thumb click
  grid.querySelectorAll('.gal-item').forEach(function(btn){
    btn.addEventListener('click', function(){ open(+this.dataset.idx); });
  });

  lbClose.addEventListener('click', close);
  lbPrev.addEventListener('click',  prev);
  lbNext.addEventListener('click',  next);

  // close on backdrop click
  lb.addEventListener('click', function(e){ if(e.target===lb) close(); });

  // keyboard nav
  document.addEventListener('keydown', function(e){
    if(!lb.classList.contains('open')) return;
    if(e.key==='ArrowLeft'  || e.key==='ArrowUp')   { e.preventDefault(); prev(); }
    if(e.key==='ArrowRight' || e.key==='ArrowDown')  { e.preventDefault(); next(); }
    if(e.key==='Escape')                              { close(); }
  });

  // touch swipe
  var tx=0;
  lb.addEventListener('touchstart',function(e){tx=e.touches[0].clientX;},{passive:true});
  lb.addEventListener('touchend',  function(e){
    var dx=e.changedTouches[0].clientX - tx;
    if(Math.abs(dx)>50){ dx<0 ? next() : prev(); }
  },{passive:true});
})();
