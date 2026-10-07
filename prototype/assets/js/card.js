/* GIANATO — product card (mirrors theme/snippets/product-card.liquid) */
(() => {
  const { esc, money, img, icon } = window.G;
  const G = window.G;

  G.priceHtml = (p, { off = false } = {}) =>
    `<span class="price">${money(p.price)}</span>` +
    (p.compare ? `<s class="price price--compare"><span class="visually-hidden">Prix initial : </span>${money(p.compare)}</s>` : '') +
    (off && p.compare ? `<span class="price-off">−${G.off(p)} %</span>` : '');

  G.swatchesHtml = (p, max = 5) => {
    const sib = G.siblings(p);
    if (sib.length < 2) return '';
    const shown = sib.slice(0, max);
    return `<div class="card__swatches" aria-label="${sib.length} couleurs">` +
      shown.map(s => `<a class="swatch${s.h === p.h ? ' is-current' : ''}" style="--sw:${s.swatch}" href="${G.url(s)}" title="${esc(s.cw)}" aria-label="${esc(p.model)}, ${esc(s.cw)}"${s.h === p.h ? ' aria-current="true"' : ''}></a>`).join('') +
      (sib.length > max ? `<span class="more">+${sib.length - max}</span>` : '') + '</div>';
  };

  G.flag = p => {
    if (!p.available) return '<span class="card__flag card__flag--muted">Épuisé</span>';
    if (p.isNew && !p.endOfLine) return '<span class="card__flag">Nouveau</span>';
    if (G.lowStock(p)) return '<span class="card__flag card__flag--muted">Dernières pointures</span>';
    return '';
  };

  G.card = (p, { list = '', sizes = '(min-width: 1280px) 22vw, (min-width: 1024px) 30vw, 48vw', eager = false, index = 0 } = {}) => {
    const [main, alt] = p.imgs;
    const avail = p.sizes.filter(s => s.s);
    const label = [p.cw, G.styleLabel(p)].filter(Boolean).join(' — ');
    const ga = esc(JSON.stringify(G.item(p, { index, item_list_name: list })));
    return `<article class="card" data-ga='${ga}' data-handle="${p.h}">
      <div class="card__media">
        ${G.flag(p)}
        ${main ? img(main[0], { sizes, alt: `${p.model} ${p.cw}`, cls: `card__main${G.isPhoto(main[0]) ? ' is-photo' : ''}`, eager, max: 1200, w: 720 }) : ''}
        ${alt ? img(alt[0], { sizes, alt: '', cls: `card__alt${G.isPhoto(alt[0]) ? ' is-photo' : ''}`, max: 1200, w: 720 }) : ''}
        ${p.available && avail.length > 1 ? `<div class="card__quick" role="group" aria-label="Ajout rapide, ${esc(p.model)}">
          <span class="card__quick-label">Ajout rapide · Pointure</span>
          ${avail.map(s => `<button type="button" data-quick-add="${s.id}" data-h="${p.h}"${s.a ? '' : ' disabled'} aria-label="Ajouter la pointure ${s.s} au panier">${s.s}</button>`).join('')}
        </div>` : ''}
      </div>
      <div class="card__body">
        <h3 class="card__title"><a href="${G.url(p)}">${esc(p.model)}</a></h3>
        <p class="card__meta">${esc(label)}</p>
        <p class="card__price">${G.priceHtml(p)}</p>
        ${G.swatchesHtml(p)}
      </div>
    </article>`;
  };
})();
