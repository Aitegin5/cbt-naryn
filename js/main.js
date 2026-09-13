/* ============================================================
   CBT NARYN — interactions & animations (Noovo-style timeline)
   ============================================================ */

document.addEventListener('DOMContentLoaded', function () {


  // ---------- Hero mask-line reveal ----------
  var maskLines = document.querySelectorAll('.hero-title .mask-line, .hero-sub .mask-line');
  maskLines.forEach(function (line, i) {
    setTimeout(function () {
      var inner = line.querySelector('.line-inner');
      if (inner) inner.classList.add('revealed');
    }, 320 + i * 170);
  });
  var uLine = document.getElementById('u-local');
  if (uLine) setTimeout(function () { uLine.classList.add('lined'); }, 1300);
  var heroCta = document.getElementById('hero-cta');
  if (heroCta) setTimeout(function () { heroCta.classList.add('show'); }, 1150);

  // ---------- 1. Reveal on scroll ----------
  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        } else {
          entry.target.classList.remove('visible');
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('visible'); });
  }

  
  // ---------- Header: hide on scroll down, show on scroll up ----------
  var hdr = document.getElementById('header');
  var lastY = window.scrollY || 0;
  window.addEventListener('scroll', function () {
    var y = window.scrollY || 0;
    if (y > lastY && y > 200) hdr.classList.add('hide');
    else if (y < lastY) hdr.classList.remove('hide');
    lastY = y;
  }, { passive: true });


  // ---------- Mega menus: open on click, close on outside click ----------
  var hdrItems = document.querySelectorAll('.hdr-item');
  var hdrDim = document.querySelector('.hdr-dim');
  function closeMegaMenus() {
    hdrItems.forEach(function (it) {
      it.classList.remove('open');
      var l = it.querySelector('.hdr-link');
      if (l) l.setAttribute('aria-expanded', 'false');
    });
    if (hdrDim) hdrDim.classList.remove('on');
  }
  hdrItems.forEach(function (item) {
    var link = item.querySelector('.hdr-link');
    if (!link) return;
    link.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      var willOpen = !item.classList.contains('open');
      closeMegaMenus();
      if (willOpen) {
        item.classList.add('open');
        link.setAttribute('aria-expanded', 'true');
        if (hdrDim) hdrDim.classList.add('on');
      }
    });
  });
  document.addEventListener('click', function (e) {
    var inside = false;
    hdrItems.forEach(function (it) { if (it.contains(e.target)) inside = true; });
    if (!inside) closeMegaMenus();
  });
  if (hdrDim) {
    hdrDim.addEventListener('click', closeMegaMenus);
  }


  // ---------- Hero slider: авто-прокрутка + точки ----------
  var heroSlides = document.getElementById('hero-slides');
  var heroDots = document.getElementById('hero-dots');
  if (heroSlides && heroDots) {
    var total = heroSlides.children.length;
    var idx = 0;
    var timer = null;
    function go(i) {
      idx = (i + total) % total;
      heroSlides.style.transform = 'translateX(-' + (idx * 100) + '%)';
      var btns = heroDots.querySelectorAll('button');
      for (var k = 0; k < btns.length; k++) btns[k].classList.toggle('active', k === idx);
      restart();
    }
    function restart() {
      if (timer) clearInterval(timer);
      timer = setInterval(function () { go(idx + 1); }, 5500);
    }
    heroDots.querySelectorAll('button').forEach(function (btn, i) {
      btn.addEventListener('click', function () { go(i); });
    });
    heroDots.querySelectorAll('button')[0].classList.add('active');
    restart();
  }

// ---------- 8. FAQ accordion ----------
  document.querySelectorAll('.acc-q').forEach(function (q) {
    q.addEventListener('click', function () {
      var item = q.parentElement;
      var answer = q.nextElementSibling;
      var isOpen = item.classList.contains('open');

      document.querySelectorAll('.acc-item.open').forEach(function (o) {
        o.classList.remove('open');
        o.querySelector('.acc-a').style.maxHeight = null;
      });

      if (!isOpen) {
        item.classList.add('open');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });

  // ---------- 9. Newsletter (demo submit) ----------
  var nl = document.getElementById('nl-form');
  if (nl) {
    nl.addEventListener('submit', function (e) {
      e.preventDefault();
      var btn = nl.querySelector('button');
      btn.textContent = 'Subscribed ✓';
      btn.disabled = true;
    });
  }

// ---------- 10. Smooth in-page anchors ----------
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var id = this.getAttribute('href');
      if (id.length > 1) {
        var target = document.querySelector(id);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  });

});