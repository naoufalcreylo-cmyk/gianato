/* GIANATO prototype — page shell: announcement, header + mega menu, mobile nav, search, cart drawer,
   size guide, footer; shared behaviours (layers, focus trap, reveal, lazy-image fade, rails, list tracking). */
(() => {
  const G = window.G; const S = G.site;
  const { $, $$, esc, icon, money, img } = G;

  /* =============== Markup =============== */
  const megaHtml = (key, m) => `
    <div class="mega" id="mega-${key}" data-mega="${key}" aria-hidden="true">
      <div class="container mega__inner">
        <div class="mega__cols">
          ${m.columns.map(c => `<div class="mega__col"><h3>${esc(c.title)}</h3><ul role="list">${c.links.map(([t, h]) => `<li><a href="${/\.html/.test(h) ? h : G.curl(h)}">${esc(t)}</a></li>`).join('')}</ul></div>`).join('')}
          <div class="mega__aside">
            ${m.all ? `<a class="link" href="${G.curl(m.all[1])}">${esc(m.all[0])} ${icon('arrow')}</a>` : '<span></span>'}
            ${m.quiet ? `<a class="mega__quiet" href="${G.curl(m.quiet[1])}">${esc(m.quiet[0])}</a>` : ''}
          </div>
        </div>
        <a class="mega__feature" href="${m.feature.href}">
          <div class="media">${img(m.feature.img, { sizes: '22vw', alt: '', max: 960, w: 720 })}</div>
          <div><p class="eyebrow eyebrow--plain">À découvrir</p><p class="h4" style="color:var(--heading);margin-top:.75rem">${esc(m.feature.title)}</p><p>${esc(m.feature.text)}</p><span class="link" style="margin-top:1.25rem">Découvrir ${icon('arrow')}</span></div>
        </a>
      </div>
    </div>`;

  const navItem = n => n.mega
    ? `<button class="nav-link" type="button" aria-expanded="false" aria-controls="mega-${n.mega}" data-mega-trigger="${n.mega}">${esc(n.title)}</button>`
    : `<a class="nav-link${n.sale ? ' nav-link--sale' : ''}" href="${n.href}">${esc(n.title)}</a>`;
  const header = () => `
    <a class="skip-link" href="#main">Aller au contenu</a>
    <div class="announce" role="region" aria-label="Informations de service">
      <div class="announce__track">${S.announcements.map((a, i) => `<a class="announce__item${i ? '' : ' is-active'}" href="${a.href}">${esc(a.text)}</a>`).join('')}</div>
    </div>
    <header class="header" data-header>
      <div class="container header__bar">
        <div class="header__start">
          <button class="icon-btn header__menu-btn" type="button" aria-label="Ouvrir le menu" aria-controls="mnav" aria-expanded="false" data-open-mnav>${icon('menu')}</button>
          <button class="icon-btn header__search-m" type="button" aria-label="Rechercher" data-open-search>${icon('search')}</button>
          <nav aria-label="Navigation principale">
            <ul class="header__nav" role="list">
              ${S.nav.filter(n => !n.end).map(n => `<li>${navItem(n)}</li>`).join('')}
            </ul>
          </nav>
        </div>
        <a class="header__logo" href="index.html" aria-label="GIANATO — Accueil">
          <img class="logo-espresso" src="assets/img/logo-espresso.png" alt="" width="1400" height="335">
          <img class="logo-ivory" src="assets/img/logo-ivory.png" alt="" width="1400" height="335">
        </a>
        <div class="header__tools">
          ${S.nav.filter(n => n.end).map(n => `<span class="header__end hide-m">${navItem(n)}</span>`).join('')}
          <button class="icon-btn hide-m" type="button" aria-label="Rechercher" data-open-search>${icon('search')}</button>
          <a class="icon-btn hide-m" href="${S.shop.url}/account" aria-label="Mon compte">${icon('user')}</a>
          <button class="icon-btn" type="button" aria-label="Panier" aria-controls="cart" data-open-cart>${icon('bag')}<span class="cart-count" data-cart-count></span></button>
        </div>
      </div>
      ${Object.entries(S.mega).map(([k, m]) => megaHtml(k, m)).join('')}
    </header>
    <div class="mega-scrim" data-mega-scrim></div>`;

  const mnav = () => `
    <div class="layer drawer drawer--left mnav" id="mnav" aria-hidden="true" data-layer>
      <div class="layer__scrim" data-close></div>
      <div class="drawer__panel" role="dialog" aria-modal="true" aria-label="Menu">
        <div class="drawer__head">
          <a class="mnav__logo" href="index.html" aria-label="GIANATO — Accueil"><img src="assets/img/logo-espresso.png" alt="" width="1400" height="335"></a>
          <button class="icon-btn" type="button" data-close aria-label="Fermer le menu">${icon('close')}</button>
        </div>
        <div class="drawer__body">
          <ul class="mnav__list" role="list">
            ${S.nav.map(n => n.mega ? `<li><details><summary>${esc(n.title)}${icon('plus')}</summary>
                <div class="mnav__sub">${S.mega[n.mega].columns.map(c => `<div><h3>${esc(c.title)}</h3><ul role="list">${c.links.map(([t, h]) => `<li><a href="${/\.html/.test(h) ? h : G.curl(h)}">${esc(t)}</a></li>`).join('')}</ul></div>`).join('')}
                ${S.mega[n.mega].quiet ? `<a class="muted" href="${G.curl(S.mega[n.mega].quiet[1])}" style="font-size:var(--fs-sm)">${esc(S.mega[n.mega].quiet[0])}</a>` : ''}</div>
              </details></li>` : `<li><a href="${n.href}"${n.sale ? ' class="is-sale"' : ''}>${esc(n.title)}</a></li>`).join('')}
          </ul>
          <div class="mnav__aux">
            <a href="${S.shop.url}/account">${icon('user')} Mon compte</a>
            <a href="service.html#pointures">${icon('ruler')} Guide des pointures</a>
            <a href="${G.wa('Bonjour, j’aimerais un conseil sur vos souliers.')}" target="_blank" rel="noopener">${icon('whatsapp')} Conseil sur WhatsApp</a>
            <a href="tel:${S.shop.phoneHref}">${icon('phone')} ${esc(S.shop.phone)}</a>
          </div>
        </div>
      </div>
    </div>`;

  const search = () => `
    <div class="layer search" id="search" aria-hidden="true" data-layer>
      <div class="layer__scrim" data-close></div>
      <div class="search__panel" role="dialog" aria-modal="true" aria-label="Recherche">
        <form class="container" action="collection.html" role="search" data-search-form>
          <div class="search__bar">
            ${icon('search')}
            <label class="visually-hidden" for="q">Rechercher un soulier, une couleur, une matière</label>
            <input class="search__input" id="q" name="q" type="search" placeholder="Mocassin, Monte Cristo, daim…" autocomplete="off" aria-controls="search-results" aria-describedby="search-status">
            <button class="icon-btn" type="button" data-close aria-label="Fermer la recherche">${icon('close')}</button>
          </div>
          <p class="visually-hidden" id="search-status" aria-live="polite"></p>
          <div id="search-results" class="search__body"></div>
        </form>
      </div>
    </div>`;

  const cartShell = () => `
    <div class="layer drawer" id="cart" aria-hidden="true" data-layer>
      <div class="layer__scrim" data-close></div>
      <div class="drawer__panel" role="dialog" aria-modal="true" aria-labelledby="cart-title">
        <div class="drawer__head"><h2 class="drawer__title" id="cart-title">Votre panier<sup data-cart-sup></sup></h2>
          <button class="icon-btn" type="button" data-close aria-label="Fermer le panier">${icon('close')}</button></div>
        <div class="drawer__body" data-cart-body></div>
        <div class="drawer__foot" data-cart-foot></div>
      </div>
    </div>`;

  G.sizeTable = () => `<table class="size-table"><caption class="visually-hidden">Correspondance des pointures</caption>
    <tr><th scope="row">FR</th>${S.sizes.map(s => `<td>${s[0]}</td>`).join('')}</tr>
    <tr><th scope="row">UK</th>${S.sizes.map(s => `<td>${s[1]}</td>`).join('')}</tr></table>`;
  const sizeGuide = () => `
    <div class="layer drawer" id="sizes" aria-hidden="true" data-layer>
      <div class="layer__scrim" data-close></div>
      <div class="drawer__panel" role="dialog" aria-modal="true" aria-labelledby="sizes-title">
        <div class="drawer__head"><h2 class="drawer__title" id="sizes-title">Guide des pointures</h2>
          <button class="icon-btn" type="button" data-close aria-label="Fermer le guide">${icon('close')}</button></div>
        <div class="drawer__body">
          <div style="overflow-x:auto">${G.sizeTable()}</div>
          <ul class="stack" role="list" style="--stack:1.1rem;margin-top:2rem">${S.sizeAdvice.map(a => `<li class="prose" style="font-size:var(--fs-md)">${esc(a)}</li>`).join('')}</ul>
          <hr class="stitch" style="margin:2rem 0">
          <p style="font-size:var(--fs-md)">Un doute entre deux pointures ? Nos conseillers vous répondent.</p>
          <a class="link" style="margin-top:1rem" href="${G.wa('Bonjour, j’hésite sur ma pointure.')}" target="_blank" rel="noopener">Conseil sur WhatsApp ${icon('arrow')}</a>
        </div>
      </div>
    </div>`;

  const footer = () => `
    <footer class="footer on-dark">
      <div class="container">
        <div class="footer__news">
          <div><h2>${esc(S.newsletter.title)}</h2><p>${esc(S.newsletter.text)}</p></div>
          <form class="footer__form" data-newsletter novalidate>
            <div class="field"><input id="nl-email" type="email" name="email" placeholder=" " autocomplete="email" required><label for="nl-email">Votre adresse e-mail</label></div>
            <button class="btn btn--light" type="submit">S’inscrire</button>
          </form>
          <p class="footer__form-note" data-newsletter-note aria-live="polite">Vos données restent chez GIANATO. Désinscription en un clic.</p>
        </div>
        <div class="footer__main">
          <div class="footer__brand">
            <img src="assets/img/logo-ivory.png" alt="GIANATO" width="1400" height="335" loading="lazy">
            <p>Maison de souliers. ${esc(S.shop.signature)}</p>
            <div class="footer__contact">
              <a href="tel:${S.shop.phoneHref}">${esc(S.shop.phone)}</a>
              <a href="mailto:${S.shop.email}">${esc(S.shop.email)}</a>
              <span>${esc(S.shop.hours)}</span>
            </div>
          </div>
          ${S.footer.map(c => `<nav class="footer__col" aria-label="${esc(c.title)}"><h2>${esc(c.title)}</h2><ul role="list">${c.links.map(([t, h]) => `<li><a href="${h}">${esc(t)}</a></li>`).join('')}</ul></nav>`).join('')}
          <div class="footer__social"><h2 class="label" style="color:var(--ivory);margin-bottom:1rem">Suivre la Maison</h2>
            <ul role="list"><li><a class="icon-btn" href="${S.shop.instagram}" target="_blank" rel="noopener" aria-label="Instagram">${icon('instagram')}</a></li>
            <li><a class="icon-btn" href="${S.shop.facebook}" target="_blank" rel="noopener" aria-label="Facebook">${icon('facebook')}</a></li>
            <li><a class="icon-btn" href="${G.wa('Bonjour GIANATO,')}" target="_blank" rel="noopener" aria-label="WhatsApp">${icon('whatsapp')}</a></li></ul>
          </div>
        </div>
        <div class="footer__bottom">
          <span>© ${new Date().getFullYear()} GIANATO — Maison de souliers, Maroc</span>
          <ul role="list">${S.legal.map(([t, h]) => `<li><a href="${h}">${esc(t)}</a></li>`).join('')}</ul>
          <div class="footer__pay" aria-label="Moyens de paiement"><span>CMI</span><span>Visa</span><span>Mastercard</span><span>Espèces à la livraison</span></div>
        </div>
      </div>
    </footer>
    <aside aria-label="Conseil"><a class="help-fab is-hidden" href="${G.wa('Bonjour, j’aimerais un conseil.')}" target="_blank" rel="noopener" aria-label="Conseil sur WhatsApp" data-help-fab>${icon('whatsapp')}<span>Un conseil ?</span></a></aside>
    <div class="toast" role="status" aria-live="polite" data-toast></div>`;

  /* =============== Layers =============== */
  let lastFocus = null;
  const focusables = el => $$('a[href],button:not([disabled]),input:not([disabled]),select,textarea,summary,[tabindex]:not([tabindex="-1"])', el).filter(x => x.offsetParent !== null);
  G.openLayer = (el, focusSel) => {
    if (!el) return;
    closeMega();
    lastFocus = document.activeElement;
    el.classList.add('is-open'); el.setAttribute('aria-hidden', 'false');
    document.documentElement.classList.add('is-locked');
    $$(`[aria-controls="${el.id}"]`).forEach(b => b.setAttribute('aria-expanded', 'true'));
    setTimeout(() => (focusSel ? $(focusSel, el) : focusables(el)[0])?.focus(), 60);
  };
  G.closeLayer = el => {
    if (!el || !el.classList.contains('is-open')) return;
    el.classList.remove('is-open'); el.setAttribute('aria-hidden', 'true');
    if (!$('[data-layer].is-open')) document.documentElement.classList.remove('is-locked');
    $$(`[aria-controls="${el.id}"]`).forEach(b => b.setAttribute('aria-expanded', 'false'));
    lastFocus?.focus?.();
  };
  document.addEventListener('keydown', e => {
    const open = $$('[data-layer].is-open').pop();
    if (e.key === 'Escape') { if (open) G.closeLayer(open); else closeMega(true); }
    if (e.key === 'Tab' && open) {
      const f = focusables(open); if (!f.length) return;
      const i = f.indexOf(document.activeElement);
      if (e.shiftKey && i <= 0) { e.preventDefault(); f.at(-1).focus(); }
      else if (!e.shiftKey && i === f.length - 1) { e.preventDefault(); f[0].focus(); }
    }
  });

  /* =============== Mega menu =============== */
  let megaTimer;
  function openMega(key) {
    clearTimeout(megaTimer);
    $$('[data-mega]').forEach(m => { const on = m.dataset.mega === key; m.classList.toggle('is-open', on); m.setAttribute('aria-hidden', String(!on)); });
    $$('[data-mega-trigger]').forEach(b => b.setAttribute('aria-expanded', String(b.dataset.megaTrigger === key)));
    $('[data-mega-scrim]').classList.add('is-on');
    syncHeader();
  }
  function closeMega(returnFocus) {
    const open = $('[data-mega].is-open'); if (!open) return;
    open.classList.remove('is-open'); open.setAttribute('aria-hidden', 'true');
    const trig = $(`[data-mega-trigger="${open.dataset.mega}"]`); trig?.setAttribute('aria-expanded', 'false');
    $('[data-mega-scrim]')?.classList.remove('is-on');
    if (returnFocus) trig?.focus();
    syncHeader();
  }
  G.closeMega = closeMega;

  /* =============== Header state =============== */
  let lastY = 0;
  function syncHeader() {
    const h = $('[data-header]'); if (!h) return;
    const y = scrollY; const hero = document.body.classList.contains('has-hero');
    const megaOpen = !!$('[data-mega].is-open');
    const announceH = $('.announce')?.offsetHeight || 0;
    h.classList.toggle('is-transparent', hero && y < 40 && !megaOpen && !h.matches(':hover'));
    h.classList.toggle('is-stuck', hero && y > announceH);
    const hide = y > 500 && y > lastY + 4 && !megaOpen && !$('[data-layer].is-open');
    if (y < lastY - 4 || y < 500) h.classList.remove('is-hidden'); else if (hide) h.classList.add('is-hidden');
    document.body.classList.toggle('header-hidden', h.classList.contains('is-hidden'));
    lastY = y;
    const fab = $('[data-help-fab]'); fab?.classList.toggle('is-hidden', y < 700);
  }

  /* =============== Search =============== */
  const norm = s => String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
  G.searchProducts = q => {
    const terms = norm(q).split(/\s+/).filter(Boolean);
    if (!terms.length) return [];
    const scored = G.data.products.map(p => {
      const hay = norm([p.title, p.model, p.cw, p.family, p.style, G.styleLabel(p), p.material, p.type, p.laces, ...p.occ].join(' '));
      let s = 0; for (const t of terms) { if (!hay.includes(t)) return null; s += norm(p.model).startsWith(t) ? 3 : 1; }
      return [p, s + (p.available ? 1 : 0) + (p.bestRank >= 0 ? (200 - p.bestRank) / 400 : 0)];
    }).filter(Boolean);
    return scored.sort((a, b) => b[1] - a[1]).map(x => x[0]);
  };
  const mark = (txt, q) => { let out = esc(txt); norm(q).split(/\s+/).filter(t => t.length > 1).forEach(t => { const i = norm(out).indexOf(t); if (i >= 0) out = out.slice(0, i) + '<mark>' + out.slice(i, i + t.length) + '</mark>' + out.slice(i + t.length); }); return out; };
  function renderSearch(q) {
    const box = $('#search-results'); const status = $('#search-status');
    const prod = p => `<a class="search__product" href="${G.url(p)}"><div class="media">${img(p.imgs[0]?.[0], { sizes: '(min-width:1024px) 15vw, 45vw', alt: '', max: 720, w: 540, cls: G.isPhoto(p.imgs[0]?.[0] || '') ? '' : 'pack' })}</div>
      <p>${mark(p.model, q)} <span class="muted">— ${esc(p.cw)}</span><span class="price">${money(p.price)}</span></p></a>`;
    if (!q) {
      const pop = ['mocassin', 'richelieu-derby', 'bottines', 'sneaker', 'classic-professionnel', 'selection-marriage'].map(G.collection);
      box.innerHTML = `<div class="search__col"><h3>Recherches fréquentes</h3><ul class="search__terms" role="list">${pop.map(c => `<li><a href="${G.curl(c.h)}"><span>${esc(c.title)}</span><span>${c.products.length}</span></a></li>`).join('')}</ul></div>
        <div class="search__col"><h3>Les signatures</h3><div class="search__products">${S.signatures.models.map(G.product).filter(Boolean).map(prod).join('')}</div></div>`;
      status.textContent = ''; G.lazy(box); return;
    }
    const res = G.searchProducts(q);
    const cols = G.data.collections.filter(c => norm(c.title).includes(norm(q)) || norm(c.h).includes(norm(q))).slice(0, 6);
    status.textContent = res.length ? `${res.length} souliers trouvés` : 'Aucun résultat';
    if (!res.length && !cols.length) {
      box.innerHTML = `<div class="search__empty" style="grid-column:1/-1"><p class="h3">Aucun résultat pour « ${esc(q)} »</p>
        <p class="muted" style="margin:.75rem 0 1.5rem">Essayez un modèle (Monte Cristo, Loro…), un style (mocassin, derby) ou une couleur.</p>
        <a class="link" href="${G.wa(`Bonjour, je cherche : ${q}`)}" target="_blank" rel="noopener">Demander à un conseiller ${icon('arrow')}</a></div>`;
      return;
    }
    box.innerHTML = `<div class="search__col">${cols.length ? `<h3>Collections</h3><ul class="search__terms" role="list">${cols.map(c => `<li><a href="${G.curl(c.h)}"><span>${mark(c.title, q)}</span><span>${c.products.length}</span></a></li>`).join('')}</ul>` : `<h3>Collections</h3><p class="muted" style="font-size:var(--fs-md)">Aucune collection ne correspond.</p>`}</div>
      <div class="search__col"><h3>Souliers</h3><div class="search__products">${res.slice(0, 8).map(prod).join('')}</div>
      ${res.length > 8 ? `<div class="search__foot"><a class="btn btn--ghost" href="collection.html?q=${encodeURIComponent(q)}">Voir les ${res.length} résultats ${icon('arrow')}</a></div>` : ''}</div>`;
    G.lazy(box);
  }

  /* =============== Cart drawer =============== */
  function renderCart() {
    const lines = G.cart.lines().filter(l => G.product(l.h));
    const n = lines.reduce((s, l) => s + l.q, 0);
    $$('[data-cart-count]').forEach(el => { const before = el.textContent; el.textContent = n || ''; if (before !== el.textContent && n) { el.classList.remove('bump'); void el.offsetWidth; el.classList.add('bump'); } });
    const sup = $('[data-cart-sup]'); if (sup) sup.textContent = n ? `(${n})` : '';
    const body = $('[data-cart-body]'), foot = $('[data-cart-foot]'); if (!body) return;
    if (!lines.length) {
      body.innerHTML = `<div class="empty-state"><p class="h3">Votre panier est vide.</p><p>Commencez par les modèles que nos clients préfèrent.</p>
        <div class="empty-state__links">${[['Nouveautés', 'nouveautes'], ['Mocassins', 'mocassin'], ['Richelieu & Derby', 'richelieu-derby'], ['Bottines', 'bottines']].map(([t, h]) => `<a class="link" href="${G.curl(h)}">${t}</a>`).join('')}</div></div>`;
      foot.innerHTML = `<button class="btn btn--ghost btn--block" type="button" data-close>Continuer mes achats</button>`;
      return;
    }
    body.innerHTML = `<ul role="list">${lines.map(l => {
      const p = G.product(l.h); const v = p.sizes.find(s => s.id === l.id);
      return `<li class="cart-line" data-id="${l.id}">
        <a class="media" href="${G.url(p)}" tabindex="-1" aria-hidden="true">${img(p.imgs[0]?.[0], { sizes: '104px', alt: '', max: 360, w: 360 })}</a>
        <div>
          <div class="cart-line__top"><div><a class="cart-line__name" href="${G.url(p)}">${esc(p.model)}</a>
            <p class="cart-line__meta">${esc(p.cw)}${v?.s ? ` · Pointure ${v.s}` : ''}</p></div>
            <div class="cart-line__price"><span class="price">${money(p.price * l.q)}</span>${p.compare ? `<s class="price price--compare">${money(p.compare * l.q)}</s>` : ''}</div></div>
          <div class="cart-line__bottom">
            <div class="qty"><button type="button" data-qty="-1" aria-label="Retirer une paire de ${esc(p.model)}">${icon('minus')}</button>
              <input type="number" min="0" max="20" value="${l.q}" aria-label="Quantité, ${esc(p.model)}" data-qty-input>
              <button type="button" data-qty="1" aria-label="Ajouter une paire de ${esc(p.model)}">${icon('plus')}</button></div>
            <button class="cart-line__remove" type="button" data-remove>Retirer</button>
          </div>
        </div></li>`; }).join('')}</ul>${cartSuggestions(lines)}`;
    foot.innerHTML = `
      <div class="cart-sum"><span>Sous-total</span><span class="price">${money(G.cart.total())}</span></div>
      <p class="cart-note">Livraison offerte partout au Maroc. Paiement à la livraison ou par carte.</p>
      <div class="cart-actions">
        <a class="btn btn--lg btn--block" href="${G.cart.checkoutUrl()}" data-checkout>Finaliser ma commande</a>
        <button class="btn btn--ghost btn--block" type="button" data-close>Continuer mes achats</button>
      </div>
      <ul class="cart-assure" role="list"><li>${icon('exchange')} Échange offert sous 30 jours</li><li>${icon('lock')} Paiement sécurisé CMI · 3D Secure</li></ul>`;
    G.lazy(body);
  }
  // Two relevant suggestions: same occasion, different model, available; business shoes → a mallette
  function cartSuggestions(lines) {
    const first = G.product(lines[0].h); const inCart = new Set(lines.map(l => G.product(l.h).model));
    let pool = [];
    if (first.occ.includes('business') && !inCart.has('Mallette Gianapro')) pool.push(...G.colProducts('essential-business').slice(0, 1));
    pool.push(...G.colProducts(first.occ.includes('business') ? 'classic-professionnel' : first.occ[0] || 'meilleures-ventes'));
    const seen = new Set(); const picks = pool.filter(p => p.available && !inCart.has(p.model) && !seen.has(p.model) && seen.add(p.model)).slice(0, 2);
    if (!picks.length) return '';
    return `<div class="cart-upsell"><h3>Pour compléter</h3><div class="cart-upsell__list">${picks.map(p => `<div class="cart-upsell__item"><div class="media">${img(p.imgs[0]?.[0], { sizes: '200px', alt: '', max: 540, w: 360 })}</div><p><a href="${G.url(p)}">${esc(p.model)}</a><br><span class="muted">${money(p.price)}</span></p></div>`).join('')}</div></div>`;
  }
  G.addToCart = (p, id, q = 1, list = 'product_page') => {
    G.cart.add(p.h, id, q);
    const v = p.sizes.find(s => s.id === id);
    G.track('add_to_cart', { value: p.price * q, items: [G.item(p, { item_id: String(id), item_variant: `${p.cw}${v?.s ? ' / ' + v.s : ''}`, quantity: q, item_list_name: list })] });
    G.openLayer($('#cart'), '.cart-line__name');
  };
  G.toast = msg => { const t = $('[data-toast]'); t.textContent = msg; t.classList.add('is-on'); clearTimeout(t._t); t._t = setTimeout(() => t.classList.remove('is-on'), 2600); };

  /* =============== Shared behaviours =============== */
  G.lazy = (root = document) => $$('img', root).forEach(im => {
    const done = () => { im.classList.add('is-loaded'); if (im.classList.contains('card__alt')) im.closest('.card__media')?.classList.add('has-alt'); };
    if (im.complete && im.naturalWidth) done(); else im.addEventListener('load', done, { once: true });
  });
  const io = 'IntersectionObserver' in window ? new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } }), { rootMargin: '0px 0px -8% 0px' }) : null;
  G.reveal = (root = document) => $$('.reveal:not(.is-in)', root).forEach(el => (io ? io.observe(el) : el.classList.add('is-in')));
  const seenLists = new WeakSet();
  const listIo = 'IntersectionObserver' in window ? new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting || seenLists.has(e.target)) return; seenLists.add(e.target); listIo.unobserve(e.target);
    const items = $$('[data-ga]', e.target).map(el => { try { return JSON.parse(el.dataset.ga); } catch { return null; } }).filter(Boolean);
    if (items.length) G.track('view_item_list', { item_list_name: e.target.dataset.list, items });
  }), { threshold: .2 }) : null;
  G.observeLists = (root = document) => $$('[data-list]', root).forEach(l => listIo?.observe(l));
  G.rails = (root = document) => $$('[data-rail]', root).forEach(wrap => {
    const rail = $('.rail', wrap); const prev = $('[data-rail-prev]', wrap), next = $('[data-rail-next]', wrap); const bar = $('.rail-progress span', wrap);
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
  G.enhance = root => { G.lazy(root); G.reveal(root); G.observeLists(root); G.rails(root); };

  /* =============== Boot =============== */
  G.mount = () => {
    const main = $('#main');
    main.insertAdjacentHTML('beforebegin', header() + mnav() + search() + cartShell() + sizeGuide());
    main.insertAdjacentHTML('afterend', footer());
    if (document.body.dataset.page === 'product') $('[data-help-fab]')?.parentElement.remove(); // the PDP has its own WhatsApp action
    // Announcement rotation (mobile shows one at a time)
    const items = $$('.announce__item'); let ai = 0;
    if (items.length > 1 && !matchMedia('(prefers-reduced-motion: reduce)').matches) setInterval(() => { items[ai].classList.remove('is-active'); ai = (ai + 1) % items.length; items[ai].classList.add('is-active'); }, 4500);
    // Mega: hover intent (desktop) + click/keyboard
    const head = $('[data-header]');
    $$('[data-mega-trigger]').forEach(b => {
      b.addEventListener('click', () => (b.getAttribute('aria-expanded') === 'true' ? closeMega() : openMega(b.dataset.megaTrigger)));
      b.addEventListener('mouseenter', () => { if (matchMedia('(hover: hover) and (min-width: 1180px)').matches) { clearTimeout(megaTimer); megaTimer = setTimeout(() => openMega(b.dataset.megaTrigger), 90); } });
    });
    $$('.header__nav a.nav-link').forEach(a => a.addEventListener('mouseenter', () => { clearTimeout(megaTimer); megaTimer = setTimeout(closeMega, 120); }));
    head.addEventListener('mouseleave', () => { clearTimeout(megaTimer); megaTimer = setTimeout(closeMega, 180); syncHeader(); });
    head.addEventListener('mouseenter', () => { clearTimeout(megaTimer); syncHeader(); });
    $('[data-mega-scrim]').addEventListener('click', () => closeMega());
    head.addEventListener('focusout', e => { if (!head.contains(e.relatedTarget)) closeMega(); });
    addEventListener('scroll', syncHeader, { passive: true }); syncHeader();
    // Highlight current section in nav
    const c = G.param('c'); if (c) $$('.header__nav a.nav-link').forEach(a => { if (a.getAttribute('href') === G.curl(c)) a.setAttribute('aria-current', 'page'); });

    // Global clicks
    document.addEventListener('click', e => {
      const t = e.target;
      if (t.closest('[data-open-mnav]')) return G.openLayer($('#mnav'));
      if (t.closest('[data-open-search]')) { G.openLayer($('#search'), '#q'); renderSearch($('#q').value.trim()); return; }
      if (t.closest('[data-open-cart]')) { G.openLayer($('#cart')); const ls = G.cart.lines(); if (ls.length) G.track('view_cart', { value: G.cart.total(), items: ls.map(l => G.item(G.product(l.h), { item_id: String(l.id), quantity: l.q })) }); return; }
      if (t.closest('[data-open-sizes]')) { e.preventDefault(); return G.openLayer($('#sizes')); }
      if (t.closest('[data-close]')) { return G.closeLayer(t.closest('[data-layer]')); }
      const qa = t.closest('[data-quick-add]');
      if (qa) { const p = G.product(qa.dataset.h); return G.addToCart(p, +qa.dataset.quickAdd, 1, qa.closest('[data-list]')?.dataset.list || 'quick_add'); }
      const line = t.closest('.cart-line');
      if (line) { const id = +line.dataset.id; const cur = +$('[data-qty-input]', line).value;
        const st = t.closest('[data-qty]'); if (st) G.cart.set(id, Math.max(0, cur + +st.dataset.qty));
        if (t.closest('[data-remove]')) G.cart.set(id, 0); }
      if (t.closest('[data-checkout]')) G.track('begin_checkout', { value: G.cart.total(), items: G.cart.lines().map(l => G.item(G.product(l.h), { item_id: String(l.id), quantity: l.q })) });
      const card = t.closest('a[href*="product.html"]')?.closest('[data-ga]');
      if (card) { try { G.track('select_item', { item_list_name: card.closest('[data-list]')?.dataset.list, items: [JSON.parse(card.dataset.ga)] }); } catch { /* */ } }
    });
    document.addEventListener('change', e => { const inp = e.target.closest('[data-qty-input]'); if (inp) G.cart.set(+inp.closest('.cart-line').dataset.id, Math.max(0, Math.min(20, +inp.value || 0))); });
    document.addEventListener('cart:change', renderCart);
    addEventListener('storage', e => { if (e.key === 'gianato.cart.v1') renderCart(); });
    // Search input
    let st; $('#q').addEventListener('input', e => { clearTimeout(st); st = setTimeout(() => { renderSearch(e.target.value.trim()); if (e.target.value.trim().length > 2) window.dataLayer.push({ event: 'search', search_term: e.target.value.trim() }); }, 120); });
    $('[data-search-form]').addEventListener('submit', e => { if (!$('#q').value.trim()) e.preventDefault(); });
    // Newsletter (prototype: confirmation only; theme: Shopify customer form)
    $('[data-newsletter]').addEventListener('submit', e => {
      e.preventDefault(); const inp = $('#nl-email'); const note = $('[data-newsletter-note]');
      if (!inp.checkValidity()) { note.textContent = 'Merci de saisir une adresse e-mail valide.'; inp.focus(); return; }
      note.textContent = 'Merci. Bienvenue parmi les amis de la Maison.'; inp.value = ''; window.dataLayer.push({ event: 'sign_up', method: 'newsletter' });
    });
    renderCart(); G.enhance(document);
  };
})();
