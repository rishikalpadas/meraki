/* ============================================================
   MERAKI EVENTZ — Shared Scripts
============================================================ */
(function () {
  'use strict';

  /* ---------- Header scroll state ---------- */
  const header = document.querySelector('.site-header');
  const toTop = document.querySelector('.to-top');
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    if (header) header.classList.toggle('scrolled', y > 40);
    if (toTop) toTop.classList.toggle('show', y > 500);
  }, { passive: true });
  if (toTop) toTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  /* ---------- Mobile nav ---------- */
  const burger = document.querySelector('.hamburger');
  if (burger) burger.addEventListener('click', () => document.body.classList.toggle('nav-open'));
  document.querySelectorAll('.has-drop > a').forEach(a => {
    a.addEventListener('click', (e) => {
      if (window.innerWidth <= 1024) {
        e.preventDefault();
        a.parentElement.classList.toggle('open');
      }
    });
  });

  /* ---------- Quote modal ---------- */
  const overlay = document.getElementById('quoteModal');
  function openModal(e) {
    if (e) e.preventDefault();
    if (!overlay) return;
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeModal() {
    if (!overlay) return;
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  }
  document.querySelectorAll('[data-open-quote]').forEach(el => el.addEventListener('click', openModal));
  if (overlay) {
    overlay.addEventListener('click', (e) => { if (e.target === overlay) closeModal(); });
    const x = overlay.querySelector('.modal-close');
    if (x) x.addEventListener('click', closeModal);
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });
  }

  /* ---------- Scroll reveal ---------- */
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(en => {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('in'));
  }

  /* ---------- Animated counters ---------- */
  const counters = document.querySelectorAll('[data-count]');
  if (counters.length && 'IntersectionObserver' in window) {
    const cio = new IntersectionObserver((entries) => {
      entries.forEach(en => {
        if (!en.isIntersecting) return;
        cio.unobserve(en.target);
        const el = en.target;
        const target = parseFloat(el.dataset.count);
        const suffix = el.dataset.suffix || '';
        const dur = 1600;
        const t0 = performance.now();
        (function tick(t) {
          const p = Math.min((t - t0) / dur, 1);
          const eased = 1 - Math.pow(1 - p, 3);
          el.textContent = Math.round(target * eased) + suffix;
          if (p < 1) requestAnimationFrame(tick);
        })(t0);
      });
    }, { threshold: 0.5 });
    counters.forEach(el => cio.observe(el));
  }

  /* ---------- Portfolio / work filters ---------- */
  document.querySelectorAll('[data-filter-group]').forEach(group => {
    const buttons = group.querySelectorAll('.filter-btn');
    const targetSel = group.dataset.filterGroup;
    const items = document.querySelectorAll(targetSel + ' [data-cat]');
    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        buttons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const f = btn.dataset.filter;
        items.forEach(it => {
          const cats = it.dataset.cat.split(' ');
          const show = f === 'all' || cats.includes(f);
          it.style.display = show ? '' : 'none';
        });
      });
    });
  });

  /* ---------- Horizontal sliders (arrow nav) ---------- */
  document.querySelectorAll('[data-slider]').forEach(wrap => {
    const track = wrap.querySelector('.h-scroll');
    const prev = wrap.querySelector('[data-prev]');
    const next = wrap.querySelector('[data-next]');
    if (!track) return;
    const step = () => track.firstElementChild ? track.firstElementChild.getBoundingClientRect().width + 18 : 300;
    if (prev) prev.addEventListener('click', () => track.scrollBy({ left: -step(), behavior: 'smooth' }));
    if (next) next.addEventListener('click', () => track.scrollBy({ left: step(), behavior: 'smooth' }));
  });

  /* ---------- Testimonial dots (visual only on desktop grid) ---------- */
  document.querySelectorAll('.dots span').forEach((d, i, all) => {
    d.addEventListener('click', () => {
      all.forEach(s => s.classList.remove('active'));
      d.classList.add('active');
    });
  });

  /* ---------- Forms (demo handler) ---------- */
  document.querySelectorAll('form[data-demo]').forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = form.querySelector('button[type="submit"]');
      const original = btn.innerHTML;
      btn.innerHTML = 'Sending…';
      btn.disabled = true;
      setTimeout(() => {
        btn.innerHTML = '✓ &nbsp;Message Sent';
        setTimeout(() => {
          btn.innerHTML = original;
          btn.disabled = false;
          form.reset();
          closeModal();
        }, 1800);
      }, 900);
    });
  });

  /* ---------- Upload box label ---------- */
  document.querySelectorAll('.upload-box input[type=file]').forEach(inp => {
    inp.addEventListener('change', () => {
      const b = inp.closest('.upload-box').querySelector('b');
      if (inp.files.length) b.textContent = inp.files[0].name;
    });
  });

  /* ---------- Load more (portfolio / blogs demo) ---------- */
  document.querySelectorAll('[data-load-more]').forEach(btn => {
    btn.addEventListener('click', () => {
      btn.innerHTML = 'No more items to load';
      btn.disabled = true;
      btn.style.opacity = .5;
    });
  });
})();
