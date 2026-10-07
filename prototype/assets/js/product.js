/* GIANATO — product page (mirrors theme/sections/main-product.liquid + assets/product.js) */
(() => {
  const G = window.G; const S = G.site;
  const { $, $$, esc, icon, img, money } = G;
  const STYLE_COL = { Mocassin: 'mocassin', Bottine: 'bottines', Basket: 'sneaker', Boucles: 'boucles', Richelieu: 'richelieu', Derby: 'derby', Maroquinerie: 'essential-business' };
  const RECENT = 'gianato.recent.v1';

  const distinctModels = (list, n, exclude) => { const seen = new Set([exclude]); return list.filter(p => p.available && !seen.has(p.model) && seen.add(p.model)).slice(0, n); };
  function recommendations(p) {
    // Same style first, then same occasion; one colourway per model; never the current model
    const sameStyle = G.data.products.filter(x => x.style === p.style);
    const sameOcc = G.data.products.filter(x => x.occ.some(o => p.occ.includes(o)));
    const rank = x => (x.bestRank < 0 ? 999 : x.bestRank);
    return distinctModels([...sameStyle.sort((a, b) => rank(a) - rank(b)), ...sameOcc.sort((a, b) => rank(a) - rank(b))], 8, p.model);
  }

  const gallery = p => {
    const items = p.imgs.map(([u], i) => `
      <figure class="gallery__item${G.isPhoto(u) ? ' is-photo' : ''}" data-index="${i}" data-full="${G.src(u, 2000)}">
        ${img(u, { sizes: '(min-width:1024px) 56vw, 100vw', alt: `${p.model} ${p.cw}${i ? ` — vue ${i + 1}` : ''}`, eager: i === 0, max: 2000, w: 1200 })}
      </figure>`).join('');
    return `<div class="gallery" data-gallery aria-label="Galerie, ${p.imgs.length} photos">${items}</div>
      <span class="gallery__count" aria-hidden="true" data-gallery-count>1 / ${p.imgs.length}</span>
      <div class="gallery__dots" aria-hidden="true">${p.imgs.map((_, i) => `<span${i ? '' : ' class="is-active"'}></span>`).join('')}</div>`;
  };

  const specs = p => {
    const rows = [['Matière', p.facts.material || (p.material !== 'Cuir' ? p.material : null)], ['Construction', p.facts.construction], ['Doublure', p.facts.lining], ['Semelle', p.facts.sole], ['Dimensions', p.facts.dimensions], ['Style', G.styleLabel(p)], ['Fermeture', p.laces], ['Couleur', `${p.cw}${p.family && p.family !== p.cw ? ` (${p.family.toLowerCase()})` : ''}`]].filter(r => r[1]);
    return `<dl class="specs">${rows.map(([k, v]) => `<dt>${k}</dt><dd>${esc(v)}</dd>`).join('')}</dl>`;
  };

  // First descriptive paragraph (skips short taglines), trimmed to ~250 characters
  const lede = p => { const d = p.desc.find(x => x.length > 70); return d ? (d.length > 260 ? d.slice(0, d.lastIndexOf(' ', 250)) + '…' : d) : ''; };
  const buy = p => {
    const sib = G.siblings(p); const sized = p.sizes.some(s => s.s);
    const avail = p.sizes.filter(s => s.a);
    const stock = !p.available ? ['stock stock--out', 'Épuisé'] : G.lowStock(p) ? ['stock stock--low', 'Dernières pointures disponibles'] : ['stock', 'Disponible'];
    const waText = `Bonjour, je souhaite commander :\n• ${p.title}\nPointure : à préciser\nPrix : ${G.money(p.price)}\n${S.shop.url}/products/${p.h}`;
    return `
      <p class="pdp__kicker label"><span>${esc(G.styleLabel(p) || p.type)}</span>${p.facts.construction ? `<span>${esc(p.facts.construction)}</span>` : ''}</p>
      <h1 class="pdp__title">${esc(p.model)}</h1>
      <p class="pdp__cw">${esc(p.cw)}</p>
      <div class="pdp__price" data-price>${G.priceHtml(p, { off: true })}</div>
      ${lede(p) ? `<p class="pdp__lede">${esc(lede(p))}</p>` : ''}
      ${sib.length > 1 ? `<div class="pdp__block">
        <div class="pdp__block-head"><p class="label">Couleur<strong>${esc(p.cw)}</strong></p><span class="label muted">${sib.length} couleurs</span></div>
        <div class="pdp-swatches">${sib.map(s => `<a class="pdp-swatch" href="${G.url(s)}"${s.h === p.h ? ' aria-current="true"' : ''} aria-label="${esc(s.model)} ${esc(s.cw)}${s.available ? '' : ' (épuisé)'}" title="${esc(s.cw)}">${img(s.imgs[0]?.[0], { sizes: '56px', alt: '', max: 360, w: 180 })}<span class="swatch" style="--sw:${s.swatch}"></span></a>`).join('')}</div>
      </div>` : ''}
      <form class="pdp__form" data-product-form novalidate>
        ${sized ? `<fieldset class="pdp__block" style="border:0;margin-top:2rem;padding:0">
          <div class="pdp__block-head"><legend class="label" style="float:left;padding:0">Pointure<strong data-size-label></strong></legend><button class="link link--quiet" type="button" data-open-sizes style="font-size:var(--fs-xs)">${icon('ruler')} Guide des pointures</button></div>
          <div class="sizes">${p.sizes.map(s => `<label><input type="radio" name="id" value="${s.id}" data-size="${esc(s.s)}"${s.a ? '' : ' disabled'} aria-label="Pointure ${esc(s.s)}${s.a ? '' : ', épuisée'}"><span>${esc(s.s)}</span></label>`).join('')}</div>
          <p class="size-hint" data-size-hint>${avail.length ? 'Première paire chez nous ? Choisissez votre pointure habituelle.' : ''}</p>
        </fieldset>` : `<input type="hidden" name="id" value="${p.sizes[0].id}">`}
        <p class="${stock[0]}" style="margin-top:1.5rem">${stock[1]}</p>
        <div class="pdp__actions">
          <button class="btn btn--lg btn--block" type="submit" data-add${p.available ? '' : ' disabled'}>${p.available ? 'Ajouter au panier' : 'Épuisé'}</button>
          <a class="btn btn--ghost btn--block" href="${G.wa(waText)}" target="_blank" rel="noopener" data-wa>${icon('whatsapp')} Commander sur WhatsApp</a>
        </div>
      </form>
      ${p.facts.lining && /émeraude/.test(p.facts.lining) ? '<p class="pdp__lining">Doublure en cuir vert émeraude. Le détail que vous seul connaissez.</p>' : ''}
      <ul class="pdp__assure" role="list">
        <li>${icon('truck')}<div><strong>Livraison offerte</strong><span>Partout au Maroc, en 2 à 5 jours ouvrés.</span></div></li>
        <li>${icon('exchange')}<div><strong>Échange sous 30 jours</strong><span>Collecte à domicile ou au bureau si la pointure ne convient pas.</span></div></li>
        <li>${icon('lock')}<div><strong>Paiement à la livraison ou par carte</strong><span>Espèces à réception, ou carte bancaire via CMI.</span></div></li>
        <li>${icon('phone')}<div><strong>Un conseil ?</strong><span><a class="text-link" href="tel:${S.shop.phoneHref}">${esc(S.shop.phone)}</a> · ${esc(S.shop.hours.toLowerCase())}</span></div></li>
      </ul>
      <div class="accordion">
        <details open><summary>Détails${icon('plus')}</summary><div class="accordion__content">${p.desc.map(d => `<p>${esc(d)}</p>`).join('') || `<p>${esc(p.title)}</p>`}</div></details>
        <details><summary>Matières & fabrication${icon('plus')}</summary><div class="accordion__content">${specs(p)}</div></details>
        <details><summary>Livraison & retours${icon('plus')}</summary><div class="accordion__content">
          <p>Livraison standard offerte partout au Maroc, en 2 à 5 jours ouvrés. Livraison express en 24 à 72 h.</p>
          <p>Échange offert sous 30 jours : l’article doit être retourné non porté, avec ses étiquettes et sa boîte d’origine.</p>
          <p><a class="text-link" href="service.html#echanges">Conditions d’échange et de retour</a></p></div></details>
        <details><summary>Entretien${icon('plus')}</summary><div class="accordion__content">
          <p>Glissez un embauchoir en bois dès que vous quittez vos souliers : il absorbe l’humidité et garde la forme.</p>
          <p>Alternez vos paires : un soulier en cuir a besoin d’une journée de repos pour sécher.</p>
          <p><a class="text-link" href="maison.html#entretien">Tous les conseils d’entretien</a></p></div></details>
        ${sized ? `<details><summary>Guide des pointures${icon('plus')}</summary><div class="accordion__content"><div style="overflow-x:auto">${G.sizeTable()}</div><p>${esc(S.sizeAdvice[0])}</p></div></details>` : ''}
      </div>`;
  };

  const story = p => {
    const photo = [...p.imgs].reverse().find(i => G.isPhoto(i[0]));
    if (!photo || Object.keys(p.facts).length < 2) return '';
    return `<section class="section section--alt" aria-labelledby="story-title"><div class="container pdp-story">
      <div class="pdp-story__media reveal"><div class="media">${img(photo[0], { sizes: '(min-width:1024px) 48vw, 100vw', alt: `${p.model} ${p.cw}, photographie éditoriale`, max: 1600 })}</div></div>
      <div class="pdp-story__text reveal"><p class="eyebrow">Regarder de plus près</p><h2 id="story-title" class="h2">${esc(p.model)}</h2>
        <p>${esc(p.desc[1] || p.desc[0] || '')}</p>${specs(p)}</div></div></section>`;
  };

  const rail = (title, list, listName, eyebrow) => !list.length ? '' : `
    <section class="section" aria-labelledby="${listName}-t"><div class="container" data-rail>
      <div class="section-head rail-head"><div>${eyebrow ? `<p class="eyebrow">${esc(eyebrow)}</p>` : ''}<h2 id="${listName}-t" class="h3">${esc(title)}</h2></div>
        <div class="rail-nav"><button type="button" data-rail-prev aria-label="Précédent">${icon('arrow-left')}</button><button type="button" data-rail-next aria-label="Suivant">${icon('arrow')}</button></div></div>
      <div class="rail" data-list="${esc(title)}">${list.map((x, i) => G.card(x, { list: title, index: i, sizes: '(min-width:1024px) 23vw, 64vw' })).join('')}</div>
      <div class="rail-progress" aria-hidden="true"><span></span></div></div></section>`;

  const lightbox = () => `<div class="lightbox" id="lightbox" role="dialog" aria-modal="true" aria-label="Zoom" aria-hidden="true">
    <div class="lightbox__top"><span data-lb-count></span><button class="icon-btn" type="button" data-lb-close aria-label="Fermer le zoom">${icon('close')}</button></div>
    <div class="lightbox__stage" data-lb-stage><img data-lb-img alt=""></div>
    <div class="lightbox__nav"><button type="button" data-lb="-1" aria-label="Photo précédente">${icon('arrow-left')}</button><button type="button" data-lb="1" aria-label="Photo suivante">${icon('arrow')}</button></div></div>`;

  const jsonLd = p => {
    const col = STYLE_COL[p.style];
    return `<script type="application/ld+json">${JSON.stringify({
      '@context': 'https://schema.org', '@type': 'Product', name: p.title, brand: { '@type': 'Brand', name: 'GIANATO' }, color: p.cw, material: p.facts.material || p.material,
      image: p.imgs.slice(0, 4).map(i => i[0]), description: p.desc.join(' ').slice(0, 500), sku: String(p.sizes[0]?.id), url: `${S.shop.url}/products/${p.h}`,
      offers: p.sizes.map(s => ({ '@type': 'Offer', sku: String(s.id), name: s.s ? `${p.title} — ${s.s}` : p.title, price: p.price.toFixed(2), priceCurrency: 'MAD', availability: `https://schema.org/${s.a ? 'InStock' : 'OutOfStock'}`, url: `${S.shop.url}/products/${p.h}?variant=${s.id}`, itemCondition: 'https://schema.org/NewCondition' })),
    })}</script><script type="application/ld+json">${JSON.stringify({ '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Accueil', item: `${S.shop.url}/` }, ...(col ? [{ '@type': 'ListItem', position: 2, name: G.collection(col).title, item: `${S.shop.url}/collections/${col}` }] : []), { '@type': 'ListItem', position: col ? 3 : 2, name: p.model, item: `${S.shop.url}/products/${p.h}` }] })}</script>`;
  };

  G.ready.then(() => {
    const p = G.product(G.param('p')) || G.product('monte-cristo');
    const col = STYLE_COL[p.style];
    document.title = `${p.model} ${p.cw !== 'Noir' ? p.cw + ' ' : ''}— ${G.styleLabel(p) || 'Soulier'} en cuir | GIANATO`;
    // recently viewed
    let recent = []; try { recent = JSON.parse(localStorage.getItem(RECENT)) || []; } catch { /* */ }
    const recentList = recent.filter(h => h !== p.h).map(G.product).filter(Boolean).slice(0, 8);
    try { localStorage.setItem(RECENT, JSON.stringify([p.h, ...recent.filter(h => h !== p.h)].slice(0, 12))); } catch { /* */ }
    const complete = p.occ.includes('business') && !p.isAcc ? distinctModels(G.colProducts('essential-business'), 2) : [];

    $('#main').innerHTML = `
      <div class="container pdp-top"><nav aria-label="Fil d’Ariane"><ol class="crumbs" role="list"><li><a href="index.html">Accueil</a></li>${col ? `<li><a href="${G.curl(col)}">${esc(G.collection(col).title)}</a></li>` : ''}<li aria-current="page">${esc(p.model)} ${esc(p.cw)}</li></ol></nav></div>
      <div class="container pdp" data-product>
        <div class="pdp__gallery">${gallery(p)}</div>
        <div class="pdp__buy">${buy(p)}</div>
      </div>
      ${story(p)}
      ${complete.length ? rail('Complétez votre style', complete, 'complete', 'Maroquinerie') : ''}
      ${rail('Vous aimerez aussi', recommendations(p), 'reco', 'Dans le même esprit')}
      ${recentList.length ? rail('Récemment consultés', recentList, 'recent') : ''}
      <div class="buybar" data-buybar aria-hidden="true"><div class="buybar__info"><p>${esc(p.model)} — ${esc(p.cw)}</p><span class="price">${money(p.price)}</span></div>
        <button class="btn" type="button" data-buybar-add tabindex="-1"${p.available ? '' : ' disabled'}>${p.available ? 'Ajouter au panier' : 'Épuisé'}</button></div>
      ${lightbox()}${jsonLd(p)}`;
    G.mount();
    G.track('view_item', { value: p.price, items: [G.item(p)] });

    /* Size selection */
    const form = $('[data-product-form]'); const hint = $('[data-size-hint]');
    form.addEventListener('change', e => {
      const r = e.target.closest('input[name="id"]'); if (!r) return;
      $('[data-size-label]').textContent = r.dataset.size; hint.classList.remove('is-error');
      hint.textContent = 'Livraison offerte. Échange sous 30 jours si la pointure ne convient pas.';
      const wa = $('[data-wa]'); const u = new URL(wa.href); u.searchParams.set('text', u.searchParams.get('text').replace(/Pointure : .*/, `Pointure : ${r.dataset.size}`)); wa.href = u.toString();
    });
    form.addEventListener('submit', e => {
      e.preventDefault();
      const r = $('input[name="id"]:checked', form) || $('input[type="hidden"][name="id"]', form);
      if (!r) { hint.textContent = 'Choisissez votre pointure pour ajouter cette paire au panier.'; hint.classList.add('is-error'); $('.sizes input:not(:disabled)', form)?.focus(); return; }
      G.addToCart(p, +r.value, 1, 'product_page');
    });

    /* Gallery: mobile counter/dots, lightbox zoom */
    const g = $('[data-gallery]'); const dots = $$('.gallery__dots span');
    g.addEventListener('scroll', () => { const i = Math.round(g.scrollLeft / g.clientWidth); dots.forEach((d, k) => d.classList.toggle('is-active', k === i)); $('[data-gallery-count]').textContent = `${i + 1} / ${dots.length}`; }, { passive: true });
    const lb = $('#lightbox'); const items = $$('.gallery__item'); const stage = $('[data-lb-stage]'); const im = $('[data-lb-img]');
    let idx = 0, opener;
    const show = i => { idx = (i + items.length) % items.length; stage.classList.remove('is-zoomed'); im.src = items[idx].dataset.full; im.alt = $('img', items[idx]).alt; $('[data-lb-count]').textContent = `${idx + 1} / ${items.length}`; };
    const open = i => { opener = document.activeElement; show(i); lb.classList.add('is-open'); lb.setAttribute('aria-hidden', 'false'); document.documentElement.classList.add('is-locked'); $('[data-lb-close]').focus(); };
    const close = () => { lb.classList.remove('is-open'); lb.setAttribute('aria-hidden', 'true'); document.documentElement.classList.remove('is-locked'); opener?.focus(); };
    items.forEach(f => { f.tabIndex = 0; f.setAttribute('role', 'button'); f.setAttribute('aria-label', `Agrandir la photo ${+f.dataset.index + 1}`);
      f.addEventListener('click', () => open(+f.dataset.index)); f.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(+f.dataset.index); } }); });
    const origin = e => { const r = im.getBoundingClientRect(); im.style.setProperty('--ox', `${((e.clientX - r.left) / r.width) * 100}%`); im.style.setProperty('--oy', `${((e.clientY - r.top) / r.height) * 100}%`); };
    lb.addEventListener('click', e => { const t = e.target;
      if (t.closest('[data-lb-close]')) return close();
      if (t.closest('[data-lb]')) return show(idx + +t.closest('[data-lb]').dataset.lb);
      if (t === im) { origin(e); stage.classList.toggle('is-zoomed'); } });
    stage.addEventListener('mousemove', e => { if (stage.classList.contains('is-zoomed')) origin(e); });
    document.addEventListener('keydown', e => { if (!lb.classList.contains('is-open')) return;
      if (e.key === 'Escape') close(); if (e.key === 'ArrowRight') show(idx + 1); if (e.key === 'ArrowLeft') show(idx - 1);
      if (e.key === 'Tab') { const f = $$('button', lb); const i = f.indexOf(document.activeElement); if (e.shiftKey && i <= 0) { e.preventDefault(); f.at(-1).focus(); } else if (!e.shiftKey && i === f.length - 1) { e.preventDefault(); f[0].focus(); } } });
    let x0 = null;
    stage.addEventListener('touchstart', e => { x0 = e.touches[0].clientX; }, { passive: true });
    stage.addEventListener('touchend', e => { if (x0 == null || stage.classList.contains('is-zoomed')) return; const dx = e.changedTouches[0].clientX - x0; if (Math.abs(dx) > 40) show(idx + (dx < 0 ? 1 : -1)); x0 = null; });

    /* Buy column: sticks by its top while it fits, otherwise by its bottom edge (accordions stay reachable) */
    const buyCol = $('.pdp__buy'); const pin = () => { buyCol.style.top = `${Math.min(96, innerHeight - buyCol.offsetHeight - 24)}px`; };
    pin(); addEventListener('resize', pin); buyCol.addEventListener('toggle', pin, true);

    /* Sticky buy bar (mobile): appears once the form scrolls away */
    const bar = $('[data-buybar]'); document.body.classList.add('has-buybar');
    new IntersectionObserver(([en]) => { const on = !en.isIntersecting && en.boundingClientRect.top < 0; bar.classList.toggle('is-on', on); bar.setAttribute('aria-hidden', String(!on)); $('button', bar).tabIndex = on ? 0 : -1; }).observe($('.pdp__actions'));
    $('[data-buybar-add]').addEventListener('click', () => { form.scrollIntoView({ behavior: 'smooth', block: 'center' }); form.requestSubmit(); });
  });
})();
