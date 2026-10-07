/* GIANATO — collection & search results (mirrors theme/sections/main-collection.liquid + snippets/facets.liquid).
   ?c=<collection handle> | ?q=<search terms>; filters live in the URL (shareable, back-button friendly). */
(() => {
  const G = window.G; const S = G.site;
  const { $, $$, esc, icon, img, money } = G;
  const PAGE = 24;
  const STYLES = [['Tous les souliers', 'meilleures-ventes'], ['Mocassins', 'mocassin'], ['Richelieu', 'richelieu'], ['Derby', 'derby'], ['Bottes & bottines', 'bottines'], ['Baskets cuir', 'sneaker'], ['À boucles', 'boucles'], ['Maroquinerie', 'essential-business']];
  const OCC = { business: 'Business', ville: 'Ville', detente: 'Détente', mariage: 'Mariage', confort: 'Ultra confort', grandes: 'Grandes pointures' };
  const SORTS = [['pertinence', 'Pertinence'], ['nouveautes', 'Nouveautés'], ['prix-asc', 'Prix croissant'], ['prix-desc', 'Prix décroissant']];
  const FACETS = [
    // key, label, value getter (array), option ordering
    ['taille', 'Pointure', p => p.sizes.filter(s => s.a && s.s).map(s => s.s)],
    ['couleur', 'Couleur', p => [p.family]],
    ['style', 'Style', p => (p.style ? [G.styleLabel(p)] : [])],
    ['matiere', 'Matière', p => (p.material ? [p.material] : [])],
    ['occasion', 'Occasion', p => p.occ.map(o => OCC[o])],
    ['fermeture', 'Fermeture', p => (p.laces ? [p.laces] : [])],
  ];

  let base = [], state = {}, shown = PAGE, title = '', handle = G.param('c'), query = G.param('q');

  function readState() {
    const u = new URLSearchParams(location.search);
    state = { sort: u.get('tri') || 'pertinence', min: u.get('min') || '', max: u.get('max') || '', stock: u.get('stock') === '1' };
    FACETS.forEach(([k]) => { state[k] = u.getAll(k); });
  }
  function writeState() {
    const u = new URLSearchParams();
    if (handle) u.set('c', handle); if (query) u.set('q', query);
    FACETS.forEach(([k]) => state[k].forEach(v => u.append(k, v)));
    if (state.min) u.set('min', state.min); if (state.max) u.set('max', state.max);
    if (state.stock) u.set('stock', '1'); if (state.sort !== 'pertinence') u.set('tri', state.sort);
    history.replaceState(null, '', `${location.pathname}?${u}`);
  }
  const passes = (p, skip) => FACETS.every(([k, , get]) => k === skip || !state[k].length || get(p).some(v => state[k].includes(v)))
    && (skip === 'prix' || ((!state.min || p.price >= +state.min) && (!state.max || p.price <= +state.max)))
    && (!state.stock || p.available);
  function results() {
    const list = base.filter(p => passes(p));
    const s = state.sort;
    // « Pertinence »: collection order, interleaved by model — one colourway of each model first,
    // the others follow (and stay one click away through the swatches).
    const seen = {}; const order = new Map(base.map((p, i) => { const k = (seen[p.model] = (seen[p.model] ?? -1) + 1); return [p.h, k * 10000 + i]; }));
    return list.sort((a, b) =>
      (s === 'prix-asc' ? a.price - b.price : s === 'prix-desc' ? b.price - a.price : s === 'nouveautes' ? b.created.localeCompare(a.created) : 0)
      || (b.available - a.available) || (order.get(a.h) - order.get(b.h)));
  }
  const activeCount = () => FACETS.reduce((n, [k]) => n + state[k].length, 0) + (state.min || state.max ? 1 : 0) + (state.stock ? 1 : 0);

  /* ---------- Render ---------- */
  function facetsHtml() {
    const sizeOrder = (a, b) => parseFloat(a) - parseFloat(b);
    return FACETS.map(([k, label, get], fi) => {
      const counts = {}; base.filter(p => passes(p, k)).forEach(p => [...new Set(get(p))].forEach(v => { counts[v] = (counts[v] || 0) + 1; }));
      const all = [...new Set(base.flatMap(get))]; if (!all.length || (all.length < 2 && !state[k].length)) return '';
      all.sort(k === 'taille' ? sizeOrder : (a, b) => (counts[b] || 0) - (counts[a] || 0) || a.localeCompare(b));
      const open = fi < 3 || state[k].length ? ' open' : '';
      if (k === 'taille') return `<details class="filter"${open}><summary>${label}${icon('plus')}</summary><div class="filter__body"><div class="size-opts">${all.map(v => `<label><input type="checkbox" name="${k}" value="${esc(v)}"${state[k].includes(v) ? ' checked' : ''}${counts[v] ? '' : ' disabled'} aria-label="Pointure ${esc(v)}"><span>${esc(v)}</span></label>`).join('')}</div></div></details>`;
      return `<details class="filter"${open}><summary>${label}${icon('plus')}</summary><div class="filter__body">${all.map(v => {
        const sw = k === 'couleur' ? base.find(p => p.family === v)?.swatch : null;
        return `<label class="opt${counts[v] ? '' : ' is-empty'}"><input type="checkbox" name="${k}" value="${esc(v)}"${state[k].includes(v) ? ' checked' : ''}>${sw ? `<span class="swatch" style="--sw:${sw}" aria-hidden="true"></span>` : ''}${esc(v)}<span class="n">${counts[v] || 0}</span></label>`; }).join('')}</div></details>`;
    }).join('') + `
      <details class="filter"${state.min || state.max ? ' open' : ''}><summary>Prix${icon('plus')}</summary><div class="filter__body"><div class="price-range">
        <label class="visually-hidden" for="pmin">Prix minimum</label><input id="pmin" type="number" inputmode="numeric" name="min" placeholder="${Math.min(...base.map(p => p.price))}" value="${esc(state.min)}">
        <span>—</span><label class="visually-hidden" for="pmax">Prix maximum</label><input id="pmax" type="number" inputmode="numeric" name="max" placeholder="${Math.max(...base.map(p => p.price))}" value="${esc(state.max)}"><span>DH</span></div></div></details>
      <details class="filter" open><summary>Disponibilité${icon('plus')}</summary><div class="filter__body"><label class="opt"><input type="checkbox" name="stock" value="1"${state.stock ? ' checked' : ''}>Disponible uniquement<span class="n">${base.filter(p => p.available && passes(p, 'stock')).length}</span></label></div></details>`;
  }
  function chipsHtml() {
    const chips = FACETS.flatMap(([k, label]) => state[k].map(v => `<button class="chip" type="button" data-chip="${k}" data-v="${esc(v)}" aria-label="Retirer le filtre ${esc(label)} ${esc(v)}">${k === 'taille' ? 'Pointure ' : ''}${esc(v)}${icon('close')}</button>`));
    if (state.min || state.max) chips.push(`<button class="chip" type="button" data-chip="prix">${state.min || 0} – ${state.max || '∞'} DH${icon('close')}</button>`);
    if (state.stock) chips.push(`<button class="chip" type="button" data-chip="stock">Disponible${icon('close')}</button>`);
    if (chips.length > 1) chips.push('<button class="chip chip--clear" type="button" data-clear>Tout effacer</button>');
    return chips.join('');
  }
  function gridHtml(list) {
    if (!list.length) return `<div class="plp-empty"><p class="h3">Aucun soulier ne correspond à ces critères.</p><p>Retirez un filtre, ou demandez conseil à la Maison.</p>
      <div class="empty-state__links"><button class="link" type="button" data-clear>Effacer les filtres</button><a class="link" href="${G.wa('Bonjour, je cherche un modèle précis.')}" target="_blank" rel="noopener">Conseil sur WhatsApp</a></div></div>`;
    const insertRef = handle && S.collectionImages[handle];
    const cards = list.slice(0, shown).map((p, i) => G.card(p, { list: title, index: i, eager: i < 3, sizes: '(min-width:1280px) 24vw, (min-width:1024px) 30vw, 48vw' }));
    if (insertRef && list.length >= 12 && !activeCount() && shown >= 8) {
      const c = G.collection(handle);
      cards.splice(7, 0, `<aside class="plp-insert" aria-hidden="true"><div class="media">${img(handle === 'mocassin' ? 'cdn:https://cdn.shopify.com/s/files/1/0241/5532/4468/products/CLD04947.jpg' : insertRef, { sizes: '(min-width:1024px) 48vw, 100vw', alt: '', max: 1600 })}</div><div class="plp-insert__cap"><p>${esc(c.title)}</p></div></aside>`);
    }
    return cards.join('');
  }
  function render({ keepFocus } = {}) {
    const list = results();
    const n = list.length; const many = n > 1 ? 's' : '';
    $('[data-count]').textContent = `${n} modèle${many}`;
    $('[data-chips]').innerHTML = chipsHtml();
    const ft = $('[data-filters-toggle] [data-n]'); const ac = activeCount(); ft.textContent = ac ? ` (${ac})` : '';
    const focusKey = keepFocus && document.activeElement?.name, focusVal = document.activeElement?.value;
    $('[data-facets]').innerHTML = facetsHtml();
    if (focusKey) $$(`[data-facets] [name="${focusKey}"]`).find(i => i.value === focusVal)?.focus();
    const grid = $('[data-grid]'); grid.innerHTML = gridHtml(list); G.enhance(grid);
    $('[data-apply]').textContent = `Voir ${n} modèle${many}`;
    const more = $('[data-more]');
    more.hidden = n <= shown;
    $('[data-progress]').textContent = `${Math.min(shown, n)} sur ${n}`;
    $('.plp-more__bar span').style.width = `${Math.min(1, shown / Math.max(n, 1)) * 100}%`;
    writeState();
  }

  /* ---------- Page ---------- */
  G.ready.then(() => {
    readState();
    let c = null;
    if (query) { base = G.searchProducts(query); title = `Recherche « ${query} »`; }
    else { c = G.collection(handle) || G.collection((handle = 'meilleures-ventes')); base = G.colProducts(c.h); title = c.title; }
    const hero = !query && S.collectionImages[c.h];
    const isShoes = c && !['essential-business'].includes(c.h);
    document.title = `${title} — GIANATO`;
    G.track('view_item_list', { item_list_name: title, items: base.slice(0, 12).map((p, i) => G.item(p, { index: i, item_list_name: title })) });
    $('#main').innerHTML = `
      <div class="container">
        <header class="plp-head${hero ? '' : ' plp-head--plain'}">
          <div class="plp-head__text">
            <nav aria-label="Fil d’Ariane"><ol class="crumbs" role="list"><li><a href="index.html">Accueil</a></li>${query ? '<li aria-current="page">Recherche</li>' : `${isShoes ? `<li><a href="${G.curl('meilleures-ventes')}">Souliers</a></li>` : ''}<li aria-current="page">${esc(c.title)}</li>`}</ol></nav>
            <div>${query ? `<p class="eyebrow">Recherche</p><h1 style="margin-top:1rem">« ${esc(query)} »</h1>` : `<h1>${esc(c.title)}</h1><p>${esc(c.intro)}</p>`}
            ${isShoes || query ? `<nav class="plp-sub" aria-label="Styles">${STYLES.map(([t, h]) => `<a href="${G.curl(h)}"${h === handle && !query ? ' aria-current="page"' : ''}>${esc(t)}</a>`).join('')}</nav>` : ''}</div>
          </div>
          ${hero ? `<div class="plp-head__media"><div class="media">${img(hero, { sizes: '28vw', alt: '', eager: true, max: 1200 })}</div></div>` : ''}
        </header>
      </div>
      <div class="toolbar"><div class="container toolbar__inner">
        <div class="toolbar__start">
          <button class="ui" type="button" data-filters-toggle aria-expanded="true" aria-controls="filters">${icon('filter')}Filtres<span data-n></span></button>
          <span class="ui count hide-m" data-count aria-live="polite"></span>
        </div>
        <div class="toolbar__end">
          <label class="visually-hidden" for="sort">Trier par</label>
          <select class="select" id="sort" data-sort>${SORTS.map(([v, t]) => `<option value="${v}"${state.sort === v ? ' selected' : ''}>${t}</option>`).join('')}</select>
          <div class="density" role="group" aria-label="Affichage">
            <button type="button" data-density="2" aria-pressed="false" aria-label="2 par ligne"><svg viewBox="0 0 16 16"><rect x="1" y="1" width="6" height="14"/><rect x="9" y="1" width="6" height="14"/></svg></button>
            <button type="button" data-density="3" aria-pressed="true" aria-label="3 par ligne"><svg viewBox="0 0 16 16"><rect x="0" y="1" width="4" height="14"/><rect x="6" y="1" width="4" height="14"/><rect x="12" y="1" width="4" height="14"/></svg></button>
            <button type="button" data-density="4" aria-pressed="false" aria-label="4 par ligne"><svg viewBox="0 0 16 16"><rect x="0" y="1" width="3" height="14"/><rect x="4.3" y="1" width="3" height="14"/><rect x="8.6" y="1" width="3" height="14"/><rect x="13" y="1" width="3" height="14"/></svg></button>
          </div>
        </div>
      </div></div>
      <div class="container">
        <div class="chips" data-chips aria-label="Filtres actifs"></div>
        <div class="plp" data-density="3">
          <aside class="filters drawer drawer--sheet" id="filters" data-filters aria-label="Filtres">
            <div class="layer__scrim" data-filters-close></div>
            <div class="drawer__panel">
              <div class="drawer__head"><h2 class="drawer__title">Filtres</h2><button class="icon-btn" type="button" data-filters-close aria-label="Fermer les filtres">${icon('close')}</button></div>
              <form class="filters__body" data-facets onsubmit="return false"></form>
              <div class="drawer__foot"><button class="btn btn--ghost" type="button" data-clear>Effacer</button><button class="btn" type="button" data-filters-close data-apply></button></div>
            </div>
          </aside>
          <div>
            <h2 class="visually-hidden">Les modèles</h2>
            <div class="product-grid" data-grid data-list="${esc(title)}" aria-live="polite"></div>
            <div class="plp-more"><p class="label muted" data-progress></p><div class="plp-more__bar" aria-hidden="true"><span></span></div>
              <button class="btn btn--ghost" type="button" data-more>Voir plus de modèles</button></div>
          </div>
        </div>
      </div>
      ${!query && c ? `<script type="application/ld+json">${JSON.stringify({ '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Accueil', item: 'https://gianato.ma/' }, { '@type': 'ListItem', position: 2, name: c.title, item: `https://gianato.ma/collections/${c.h}` }] })}</script>` : ''}`;
    G.mount();
    render();

    const filters = $('[data-filters]'); const plp = $('.plp');
    const isSheet = () => matchMedia('(max-width: 1023px)').matches;
    const toggle = $('[data-filters-toggle]');
    if (isSheet()) toggle.setAttribute('aria-expanded', 'false');
    const closeSheet = () => { filters.classList.remove('is-open'); document.documentElement.classList.remove('is-locked'); toggle.setAttribute('aria-expanded', 'false'); toggle.focus(); };
    toggle.addEventListener('click', () => {
      if (isSheet()) { filters.classList.add('is-open'); document.documentElement.classList.add('is-locked'); toggle.setAttribute('aria-expanded', 'true'); setTimeout(() => $('summary', filters)?.focus(), 80); }
      else { plp.classList.toggle('filters-collapsed'); toggle.setAttribute('aria-expanded', String(!plp.classList.contains('filters-collapsed'))); }
    });
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && filters.classList.contains('is-open')) closeSheet(); });
    const onFacet = e => {
      const t = e.target; if (!t.name) return;
      if (t.name === 'min' || t.name === 'max') state[t.name] = t.value.replace(/\D/g, '');
      else if (t.name === 'stock') state.stock = t.checked;
      else state[t.name] = $$(`[data-facets] [name="${t.name}"]:checked`).map(i => i.value);
      shown = PAGE; render({ keepFocus: true });
      window.dataLayer.push({ event: 'filter_apply', filter_name: t.name, filter_value: t.value });
    };
    $('[data-facets]').addEventListener('change', onFacet);
    document.addEventListener('click', e => {
      const t = e.target;
      if (t.closest('[data-filters-close]')) return closeSheet();
      const chip = t.closest('[data-chip]');
      if (chip) { const k = chip.dataset.chip; if (k === 'prix') { state.min = state.max = ''; } else if (k === 'stock') state.stock = false; else state[k] = state[k].filter(v => v !== chip.dataset.v); render(); return; }
      if (t.closest('[data-clear]')) { FACETS.forEach(([k]) => { state[k] = []; }); state.min = state.max = ''; state.stock = false; render(); return; }
      if (t.closest('[data-more]')) {
        const before = shown; shown += PAGE; render();
        $$('[data-grid] .card')[before]?.querySelector('.card__title a')?.focus({ preventScroll: true });
      }
      const d = t.closest('[data-density]');
      if (d) { plp.dataset.density = d.dataset.density; $$('[data-density]').forEach(b => b.setAttribute('aria-pressed', String(b === d))); }
    });
    $('[data-sort]').addEventListener('change', e => { state.sort = e.target.value; render(); });
  });
})();
