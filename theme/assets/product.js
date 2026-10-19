/* GIANATO — product page: variant picker (options → variant id, price, URL, WhatsApp text), size hint,
   mobile swipe counter, zoom lightbox, sticky purchase column, mobile buy bar, recently viewed. */
(() => {
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const root = $('[data-product]'); if (!root) return;
  const G = window.Gianato;
  const form = $('[data-product-form]');
  const hint = $('[data-size-hint]');

  const money = cents => {
    const fmt = G.moneyFormat || '{{amount}} DH';
    return fmt.replace(/\{\{\s*(\w+)\s*\}\}/, (m, k) => {
      const n = cents / 100; const whole = Number.isInteger(n);
      const v = k.includes('no_decimals') || whole ? Math.round(n) : n.toFixed(2);
      return k.includes('comma') ? String(v).replace('.', ',') : Number(v).toLocaleString('fr-FR').replace(/\s/g, ' ');
    }).replace(/<[^>]+>/g, '');
  };

  /* Variant picker */
  const picker = $('[data-variant-picker]');
  if (picker) {
    const variants = JSON.parse($('[data-variants]', picker).textContent);
    picker.addEventListener('change', () => {
      const chosen = $$('fieldset', picker).map(f => $('input:checked', f)?.value);
      $$('fieldset', picker).forEach((f, i) => { const o = $('[data-option-value]', f); if (o) o.textContent = chosen[i] || ''; });
      if (chosen.some(v => v == null)) return;
      const v = variants.find(x => x.options.every((o, i) => o === chosen[i]));
      if (!v) return;
      $('[data-variant-input]', form).value = v.id;
      const btn = $('[data-add-main]', form); btn.disabled = !v.available; btn.textContent = v.available ? G.strings.addToCart : G.strings.soldOut;
      const price = $('[data-price] .price'); if (price) price.textContent = money(v.price);
      const bb = $('[data-buybar-price]'); if (bb) bb.textContent = money(v.price);
      history.replaceState(null, '', `${root.dataset.url}?variant=${v.id}`);
      if (hint) { hint.classList.remove('is-error'); hint.textContent = G.strings.sizeChosen; }
      $('[data-form-error]').hidden = true;
    });
    // Require a size before adding (cart.js listens to the same submit and checks defaultPrevented)
    form.addEventListener('submit', e => {
      if ($('[data-variant-input]', form).value) return;
      e.preventDefault(); e.stopImmediatePropagation();
      if (hint) { hint.textContent = G.strings.chooseSize; hint.classList.add('is-error'); }
      // Make the refusal obvious: bring the sizes into view and flag them
      const grid = $('.sizes', form);
      if (grid) {
        grid.scrollIntoView({ behavior: 'smooth', block: 'center' });
        grid.classList.remove('is-error'); void grid.offsetWidth; grid.classList.add('is-error');
        setTimeout(() => grid.classList.remove('is-error'), 2400);
      }
      try { navigator.vibrate?.(60); } catch { /* not supported */ }
      setTimeout(() => $('.sizes input:not(:disabled)', form)?.focus({ preventScroll: true }), 450);
    }, true);
  }

  /* Gallery: mobile counter + dots */
  const g = $('[data-gallery]'); const dots = $$('.gallery__dots span');
  g?.addEventListener('scroll', () => {
    const i = Math.round(g.scrollLeft / g.clientWidth);
    dots.forEach((d, k) => d.classList.toggle('is-active', k === i));
    const c = $('[data-gallery-count]'); if (c) c.textContent = `${i + 1} / ${dots.length}`;
  }, { passive: true });

  /* Lightbox */
  const lb = $('#lightbox'); const items = $$('.gallery__item[data-full]').filter(f => !f.querySelector('video, iframe'));
  if (lb && items.length) {
    const stage = $('[data-lb-stage]', lb); const im = $('[data-lb-img]', lb);
    let idx = 0, opener;
    const show = i => { idx = (i + items.length) % items.length; stage.classList.remove('is-zoomed'); im.src = items[idx].dataset.full; im.alt = $('img', items[idx])?.alt || ''; $('[data-lb-count]', lb).textContent = `${idx + 1} / ${items.length}`; };
    const open = i => { opener = document.activeElement; show(i); lb.classList.add('is-open'); lb.setAttribute('aria-hidden', 'false'); document.documentElement.classList.add('is-locked'); $('[data-lb-close]', lb).focus(); };
    const close = () => { lb.classList.remove('is-open'); lb.setAttribute('aria-hidden', 'true'); document.documentElement.classList.remove('is-locked'); opener?.focus(); };
    items.forEach((f, k) => {
      f.addEventListener('click', () => open(k));
      f.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(k); } });
    });
    const origin = e => { const r = im.getBoundingClientRect(); im.style.setProperty('--ox', `${((e.clientX - r.left) / r.width) * 100}%`); im.style.setProperty('--oy', `${((e.clientY - r.top) / r.height) * 100}%`); };
    lb.addEventListener('click', e => {
      const t = e.target;
      if (t.closest('[data-lb-close]')) return close();
      if (t.closest('[data-lb]')) return show(idx + +t.closest('[data-lb]').dataset.lb);
      if (t === im) { origin(e); stage.classList.toggle('is-zoomed'); }
    });
    stage.addEventListener('mousemove', e => { if (stage.classList.contains('is-zoomed')) origin(e); });
    document.addEventListener('keydown', e => {
      if (!lb.classList.contains('is-open')) return;
      if (e.key === 'Escape') close(); if (e.key === 'ArrowRight') show(idx + 1); if (e.key === 'ArrowLeft') show(idx - 1);
      if (e.key === 'Tab') { const f = $$('button', lb); const i = f.indexOf(document.activeElement); if (e.shiftKey && i <= 0) { e.preventDefault(); f.at(-1).focus(); } else if (!e.shiftKey && i === f.length - 1) { e.preventDefault(); f[0].focus(); } }
    });
    let x0 = null;
    stage.addEventListener('touchstart', e => { x0 = e.touches[0].clientX; }, { passive: true });
    stage.addEventListener('touchend', e => { if (x0 == null || stage.classList.contains('is-zoomed')) return; const dx = e.changedTouches[0].clientX - x0; if (Math.abs(dx) > 40) show(idx + (dx < 0 ? 1 : -1)); x0 = null; });
  }

  /* Purchase column: sticks by its top while it fits, otherwise by its bottom edge */
  const col = $('.pdp__buy');
  const pin = () => { col.style.top = `${Math.min(96, innerHeight - col.offsetHeight - 24)}px`; };
  pin(); addEventListener('resize', pin); col.addEventListener('toggle', pin, true);

  /* Mobile buy bar */
  const bar = $('[data-buybar]');
  if (bar) {
    document.body.classList.add('has-buybar');
    new IntersectionObserver(([en]) => {
      const on = !en.isIntersecting && en.boundingClientRect.top < 0;
      bar.classList.toggle('is-on', on); bar.setAttribute('aria-hidden', String(!on)); $('button', bar).tabIndex = on ? 0 : -1;
    }).observe($('.pdp__actions'));
    $('[data-buybar-add]', bar).addEventListener('click', () => { form.scrollIntoView({ behavior: 'smooth', block: 'center' }); form.requestSubmit(); });
  }

  /* Recently viewed (handles in localStorage, rendered by sections/recently-viewed.liquid) */
  try {
    const h = JSON.parse($('[data-recent-handle]').textContent);
    const list = JSON.parse(localStorage.getItem('gianato.recent.v1') || '[]').filter(x => x !== h);
    localStorage.setItem('gianato.recent.v1', JSON.stringify([h, ...list].slice(0, 12)));
  } catch { /* storage unavailable */ }
})();
