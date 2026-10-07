/* GIANATO — collection/search filtering through the Section Rendering API.
   Filter, sort and « load more » fetch the same URL with section_id and swap only the dynamic regions;
   the URL is kept in sync (shareable, back-button friendly). Without JS: plain links/forms. */
(() => {
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const REGIONS = ['[data-plp-count]', '[data-active-filters]', '[data-plp-grid]', '[data-facets-form]', '[data-plp-more]', '[data-filters-toggle] .count', '[data-filters] .drawer__foot'];
  const root = () => $('[data-plp]');
  const isSheet = () => matchMedia('(max-width: 1023px)').matches;

  async function load(url, { append = false, push = true } = {}) {
    const u = new URL(url, location.origin);
    u.searchParams.set('section_id', root().dataset.sectionId);
    const grid = $('[data-plp-grid]');
    grid.setAttribute('aria-busy', 'true'); if (!append) grid.style.opacity = '.45';
    try {
      const doc = new DOMParser().parseFromString(await (await fetch(u)).text(), 'text/html');
      if (append) {
        const before = grid.children.length;
        grid.append(...doc.querySelector('[data-plp-grid]').children);
        grid.children[before]?.querySelector('.card__title a')?.focus({ preventScroll: true });
        $('[data-plp-more]').replaceWith(doc.querySelector('[data-plp-more]'));
      } else {
        const focusName = document.activeElement?.name, focusVal = document.activeElement?.value;
        REGIONS.forEach(sel => { const a = $(sel), b = doc.querySelector(sel); if (a && b) a.replaceWith(b); });
        if (focusName) $$(`[name="${CSS.escape(focusName)}"]`).find(i => i.value === focusVal)?.focus();
      }
      u.searchParams.delete('section_id');
      if (push) history.replaceState(null, '', u.pathname + (u.search || ''));
      window.GianatoUI?.enhance(grid);
    } finally { grid.removeAttribute('aria-busy'); grid.style.opacity = ''; }
  }

  function formUrl() {
    const params = new URLSearchParams(new FormData($('[data-facets-form]')));
    for (const [k, v] of [...params]) if (v === '') params.delete(k);
    const sort = $('[data-sort]'); if (sort) params.set('sort_by', sort.value);
    return `${location.pathname}?${params}`;
  }

  document.addEventListener('change', e => {
    if (e.target.closest('[data-facets-form]')) {
      if (e.target.type === 'number') return;
      load(formUrl());
      window.dataLayer?.push({ event: 'filter_apply', filter_name: e.target.name, filter_value: e.target.value });
    }
    if (e.target.matches('[data-sort]')) load(formUrl());
  });
  let priceT;
  document.addEventListener('input', e => {
    if (e.target.closest('[data-facets-form]') && e.target.type === 'number') { clearTimeout(priceT); priceT = setTimeout(() => load(formUrl()), 700); }
  });
  document.addEventListener('submit', e => { if (e.target.matches('[data-facets-form]')) { e.preventDefault(); load(formUrl()); } });

  const closeSheet = () => {
    const f = $('[data-filters]'); f.classList.remove('is-open'); document.documentElement.classList.remove('is-locked');
    const t = $('[data-filters-toggle]'); t?.setAttribute('aria-expanded', 'false'); t?.focus();
  };
  document.addEventListener('click', e => {
    const t = e.target;
    const link = t.closest('[data-facet-link]'); if (link) { e.preventDefault(); load(link.href); return; }
    const more = t.closest('[data-load-more]'); if (more) { e.preventDefault(); load(more.href, { append: true, push: false }); return; }
    const toggle = t.closest('[data-filters-toggle]');
    if (toggle) {
      if (isSheet()) { $('[data-filters]').classList.add('is-open'); toggle.setAttribute('aria-expanded', 'true'); document.documentElement.classList.add('is-locked'); setTimeout(() => $('[data-filters] summary')?.focus(), 80); }
      else { const plp = $('.plp'); plp.classList.toggle('filters-collapsed'); toggle.setAttribute('aria-expanded', String(!plp.classList.contains('filters-collapsed'))); }
      return;
    }
    if (t.closest('[data-filters-close]')) return closeSheet();
    const d = t.closest('[data-density]');
    if (d) { $('.plp').dataset.density = d.dataset.density; $$('[data-density]').forEach(b => b.setAttribute('aria-pressed', String(b === d))); }
  });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && $('[data-filters].is-open')) closeSheet(); });
  document.addEventListener('DOMContentLoaded', () => { if (isSheet()) $('[data-filters-toggle]')?.setAttribute('aria-expanded', 'false'); });
  addEventListener('popstate', () => load(location.href, { push: false }));
})();
