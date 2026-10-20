/* GIANATO — global UI: header (transparent → solid, hide on scroll), mega menu (hover intent + keyboard),
   layers (drawers / overlays with focus trap), announcement rotation, reveal-on-scroll, image fade-in, rails.
   Exposes window.GianatoUI. Mirrors prototype/assets/js/layout.js behaviours. */
(() => {
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Layers ---------- */
  let lastFocus = null;
  const focusables = el => $$('a[href],button:not([disabled]),input:not([disabled]):not([type="hidden"]),select,textarea,summary,[tabindex]:not([tabindex="-1"])', el).filter(x => x.offsetParent !== null);
  function openLayer(el, focusSel) {
    if (!el) return;
    closeMega();
    lastFocus = document.activeElement;
    el.classList.add('is-open'); el.setAttribute('aria-hidden', 'false');
    document.documentElement.classList.add('is-locked');
    document.documentElement.dataset.layer = el.id;
    $$(`[aria-controls="${el.id}"]`).forEach(b => b.setAttribute('aria-expanded', 'true'));
    setTimeout(() => (focusSel ? $(focusSel, el) : focusables(el)[0])?.focus(), 60);
  }
  function closeLayer(el) {
    if (!el || !el.classList.contains('is-open')) return;
    el.classList.remove('is-open'); el.setAttribute('aria-hidden', 'true');
    if (!$('[data-layer].is-open')) document.documentElement.classList.remove('is-locked');
    const still = $$('[data-layer].is-open').pop(); if (still) document.documentElement.dataset.layer = still.id; else delete document.documentElement.dataset.layer;
    $$(`[aria-controls="${el.id}"]`).forEach(b => b.setAttribute('aria-expanded', 'false'));
    lastFocus?.focus?.();
  }
  document.addEventListener('keydown', e => {
    const open = $$('[data-layer].is-open').pop();
    if (e.key === 'Escape') { if (open) closeLayer(open); else closeMega(true); }
    if (e.key === 'Tab' && open) {
      const f = focusables(open); if (!f.length) return;
      const i = f.indexOf(document.activeElement);
      if (e.shiftKey && i <= 0) { e.preventDefault(); f.at(-1).focus(); }
      else if (!e.shiftKey && i === f.length - 1) { e.preventDefault(); f[0].focus(); }
    }
  });

  /* ---------- Mega menu ---------- */
  let megaTimer;
  function openMega(key) {
    clearTimeout(megaTimer);
    $$('[data-mega]').forEach(m => { const on = m.dataset.mega === key; m.classList.toggle('is-open', on); m.setAttribute('aria-hidden', String(!on)); });
    $$('[data-mega-trigger]').forEach(b => b.setAttribute('aria-expanded', String(b.dataset.megaTrigger === key)));
    $('[data-mega-scrim]')?.classList.add('is-on'); syncHeader();
  }
  function closeMega(returnFocus) {
    const open = $('[data-mega].is-open'); if (!open) return;
    open.classList.remove('is-open'); open.setAttribute('aria-hidden', 'true');
    const trig = $(`[data-mega-trigger="${open.dataset.mega}"]`); trig?.setAttribute('aria-expanded', 'false');
    $('[data-mega-scrim]')?.classList.remove('is-on');
    if (returnFocus) trig?.focus();
    syncHeader();
  }

  /* ---------- Header state ---------- */
  let lastY = 0;
  function syncHeader() {
    const h = $('[data-header]'); if (!h) return;
    const y = scrollY; const hero = document.body.classList.contains('has-hero');
    const megaOpen = !!$('[data-mega].is-open');
    const announceH = $('.announce')?.offsetHeight || 0;
    h.classList.toggle('is-transparent', hero && y < 40 && !megaOpen && !h.matches(':hover'));
    h.classList.toggle('is-stuck', hero && y > announceH);
    if (y < lastY - 4 || y < 500) h.classList.remove('is-hidden');
    else if (y > lastY + 4 && !megaOpen && !$('[data-layer].is-open')) h.classList.add('is-hidden');
    document.body.classList.toggle('header-hidden', h.classList.contains('is-hidden'));
    lastY = y;
    $('[data-help-fab]')?.classList.toggle('is-hidden', y < 700);
  }

  /* ---------- Enhancers ---------- */
  function lazy(root = document) {
    $$('img', root).forEach(im => {
      const done = () => { im.classList.add('is-loaded'); if (im.classList.contains('card__alt')) im.closest('.card__media')?.classList.add('has-alt'); };
      if (im.complete && im.naturalWidth) done(); else im.addEventListener('load', done, { once: true });
    });
  }
  const io = 'IntersectionObserver' in window ? new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } }), { rootMargin: '0px 0px -8% 0px' }) : null;
  const reveal = (root = document) => $$('.reveal:not(.is-in)', root).forEach(el => (io && !reduce ? io.observe(el) : el.classList.add('is-in')));
  function rails(root = document) {
    $$('[data-rail]', root).forEach(wrap => {
      if (wrap.dataset.railReady) return; wrap.dataset.railReady = '1';
      const rail = $('.rail', wrap); if (!rail) return;
      const prev = $('[data-rail-prev]', wrap), next = $('[data-rail-next]', wrap), bar = $('.rail-progress span', wrap);
      const step = () => (rail.firstElementChild?.getBoundingClientRect().width || 300) + parseFloat(getComputedStyle(rail).columnGap || 0);
      const sync = () => {
        const max = rail.scrollWidth - rail.clientWidth;
        if (prev) prev.disabled = rail.scrollLeft < 4; if (next) next.disabled = rail.scrollLeft > max - 4;
        if (bar) { const vis = rail.clientWidth / rail.scrollWidth; bar.style.setProperty('--p', `${vis * 100}%`); bar.style.setProperty('--x', `${max ? (rail.scrollLeft / max) * ((1 - vis) / vis) * 100 : 0}%`); }
      };
      prev?.addEventListener('click', () => rail.scrollBy({ left: -step(), behavior: 'smooth' }));
      next?.addEventListener('click', () => rail.scrollBy({ left: step(), behavior: 'smooth' }));
      rail.addEventListener('scroll', sync, { passive: true }); addEventListener('resize', sync); sync();
    });
  }
  function toast(msg) { const t = $('[data-toast]'); if (!t) return; t.textContent = msg; t.classList.add('is-on'); clearTimeout(t._t); t._t = setTimeout(() => t.classList.remove('is-on'), 2600); }
  const enhance = root => { lazy(root); reveal(root); rails(root); window.GianatoAnalytics?.observeLists(root); };
  window.GianatoUI = { openLayer, closeLayer, enhance, toast, lazy, closeMega };

  /* ---------- Boot ---------- */
  document.addEventListener('DOMContentLoaded', () => {
    // Announcement rotation (mobile shows one message at a time)
    const items = $$('.announce__item'); let ai = 0;
    if (items.length > 1 && !reduce) setInterval(() => { items[ai].classList.remove('is-active'); ai = (ai + 1) % items.length; items[ai].classList.add('is-active'); }, 4500);

    const head = $('[data-header]');
    if (head) {
      $$('[data-mega-trigger]').forEach(b => {
        b.addEventListener('click', () => (b.getAttribute('aria-expanded') === 'true' ? closeMega() : openMega(b.dataset.megaTrigger)));
        b.addEventListener('mouseenter', () => { if (matchMedia('(hover: hover) and (min-width: 1180px)').matches) { clearTimeout(megaTimer); megaTimer = setTimeout(() => openMega(b.dataset.megaTrigger), 90); } });
      });
      $$('.header__nav a.nav-link, .header__end a.nav-link').forEach(a => a.addEventListener('mouseenter', () => { clearTimeout(megaTimer); megaTimer = setTimeout(closeMega, 120); }));
      head.addEventListener('mouseleave', () => { clearTimeout(megaTimer); megaTimer = setTimeout(closeMega, 180); syncHeader(); });
      head.addEventListener('mouseenter', () => { clearTimeout(megaTimer); syncHeader(); });
      head.addEventListener('focusout', e => { if (!head.contains(e.relatedTarget)) closeMega(); });
      $('[data-mega-scrim]')?.addEventListener('click', () => closeMega());
      addEventListener('scroll', syncHeader, { passive: true }); syncHeader();
    }

    document.addEventListener('click', e => {
      const t = e.target;
      if (t.closest('[data-open-mnav]')) return openLayer($('#mnav'));
      if (t.closest('[data-open-search]')) { e.preventDefault(); return openLayer($('#search'), '#q'); }
      if (t.closest('[data-open-sizes]')) { e.preventDefault(); return openLayer($('#sizes')); }
      if (t.closest('[data-close]')) return closeLayer(t.closest('[data-layer]'));
    });
    enhance(document);
  });
})();
