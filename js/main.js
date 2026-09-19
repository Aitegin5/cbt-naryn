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



  // ---------- Мобильное меню (бургер -> полноэкранная панель) ----------
  var hdrBurger = document.getElementById('hdr-burger');
  var hdrLinksWrap = document.querySelector('.hdr-links');
  if (hdrBurger && hdrLinksWrap && !document.getElementById('hdr-mobile')) {
    var mobile = document.createElement('div');
    mobile.className = 'hdr-mobile';
    mobile.id = 'hdr-mobile';
    mobile.setAttribute('aria-hidden', 'true');

    function closeMobile() {
      document.body.classList.remove('nav-open');
      mobile.setAttribute('aria-hidden', 'true');
      hdrBurger.setAttribute('aria-label', 'Open menu');
    }
    function openMobile() {
      document.body.classList.add('nav-open');
      mobile.setAttribute('aria-hidden', 'false');
      hdrBurger.setAttribute('aria-label', 'Close menu');
    }

    var head = document.createElement('div');
    head.className = 'hdr-mobile-head';
    var logo = document.createElement('a');
    logo.className = 'hdr-logo';
    logo.href = 'index.html';
    logo.innerHTML = 'cbt naryn<small>community based tourism</small>';
    var closeBtn = document.createElement('button');
    closeBtn.type = 'button';
    closeBtn.className = 'hdr-mobile-close';
    closeBtn.setAttribute('aria-label', 'Close menu');
    closeBtn.innerHTML = '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>';
    head.appendChild(logo);
    head.appendChild(closeBtn);

    var list = document.createElement('div');
    list.className = 'hdr-mobile-list';

    hdrLinksWrap.querySelectorAll('.hdr-item').forEach(function (item) {
      var btn = item.querySelector('.hdr-link');
      if (!btn) return;
      var drop = item.querySelector('.hdr-drop');
      var wrap = document.createElement('div');
      wrap.className = 'm-item';
      if (drop) {
        var link = document.createElement('button');
        link.type = 'button';
        link.className = 'm-link';
        link.setAttribute('aria-expanded', 'false');
        link.innerHTML = '<span>' + btn.textContent + '</span><svg class="m-chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg>';
        var sub = document.createElement('div');
        sub.className = 'm-sub';
        drop.querySelectorAll('a[href]').forEach(function (a) {
          var h4 = a.querySelector('h4');
          var pEl = a.querySelector('p');
          var t = h4 ? h4.textContent : a.textContent;
          var row = document.createElement('a');
          row.className = 'm-row';
          row.href = a.getAttribute('href');
          row.innerHTML = '<span class="m-row-t">' + t + '</span>' + (pEl ? '<span class="m-row-s">' + pEl.textContent + '</span>' : '');
          row.addEventListener('click', closeMobile);
          sub.appendChild(row);
        });
        wrap.appendChild(link);
        wrap.appendChild(sub);
        link.addEventListener('click', function () {
          var isOpen = wrap.classList.toggle('open');
          link.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        });
      }
      list.appendChild(wrap);
    });

    var cta = document.createElement('div');
    cta.className = 'hdr-mobile-cta';
    var plan = document.querySelector('.hdr-btn-amber');
    var wa = document.querySelector('.hdr-btn-soft');
    if (plan) {
      var a1 = document.createElement('a');
      a1.className = 'm-cta amber';
      a1.href = plan.getAttribute('href');
      a1.textContent = 'Plan a Trip';
      a1.addEventListener('click', closeMobile);
      cta.appendChild(a1);
    }
    if (wa) {
      var a2 = document.createElement('a');
      a2.className = 'm-cta soft';
      a2.href = wa.getAttribute('href');
      a2.target = '_blank';
      a2.rel = 'noopener';
      a2.textContent = 'Book via WhatsApp';
      a2.addEventListener('click', closeMobile);
      cta.appendChild(a2);
    }

    mobile.appendChild(head);
    mobile.appendChild(list);
    mobile.appendChild(cta);
    document.body.appendChild(mobile);

    hdrBurger.addEventListener('click', function () {
      if (document.body.classList.contains('nav-open')) closeMobile();
      else openMobile();
    });
    closeBtn.addEventListener('click', closeMobile);
    var dimM = document.querySelector('.hdr-dim');
    if (dimM) dimM.addEventListener('click', closeMobile);
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeMobile();
    });
  }

});