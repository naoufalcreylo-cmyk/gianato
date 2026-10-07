/* GIANATO — homepage (mirrors theme/templates/index.json sections) */
(() => {
  const G = window.G; const S = G.site;
  const { esc, icon, img, money } = G;
  // One product per model, in collection order (avoids seven colourways of the same shoe in a row)
  const distinct = (list, n) => { const seen = new Set(); return list.filter(p => p.available && !seen.has(p.model) && seen.add(p.model)).slice(0, n); };
  const packshot = p => (p.imgs.find(i => !G.isPhoto(i[0])) || p.imgs[0])[0];

  const hero = () => { const h = S.hero; return `
    <section class="hero on-media" aria-label="GIANATO">
      <div class="hero__media">
        <div class="media"><picture><source media="(max-width: 767px)" srcset="${G.src(h.mobile)}"><img src="${G.src(h.images[0])}" alt="Bottines en cuir noir portées sur un sol en mosaïque" fetchpriority="high" decoding="async"></picture></div>
        <div class="media hero__desk">${img(h.images[1], { sizes: '50vw', alt: 'Mocassins Monte Cristo cognac, doublure en cuir vert émeraude', max: 2000, w: 1200 })}</div>
      </div>
      <div class="hero__content">
        <div class="container hero__inner">
          <div class="hero__text"><p class="eyebrow">${esc(h.eyebrow)}</p><h1 class="display">${h.title}</h1></div>
          <div class="hero__side"><p>${esc(h.text)}</p>
            <div class="hero__actions"><a class="btn btn--light" href="${h.cta[1]}">${esc(h.cta[0])}</a><a class="link" href="${h.cta2[1]}">${esc(h.cta2[0])}</a></div>
            <p class="hero__caption">Sur la photo : <a href="product.html?p=monte-cristo-gold">Monte Cristo Gold</a>, doublure cuir vert émeraude.</p></div>
        </div>
      </div>
      <span class="hero__scroll" aria-hidden="true"></span>
    </section>`; };

  const newIn = () => { const s = S.newIn; const ps = distinct(G.colProducts(s.collection), s.limit); return `
    <section class="section" aria-labelledby="new-title">
      <div class="container" data-rail>
        <div class="section-head rail-head reveal">
          <div><p class="eyebrow">${esc(s.eyebrow)}</p><h2 id="new-title">${esc(s.title)}</h2><p>${esc(s.text)}</p></div>
          <div class="rail-head__aside"><a class="link" href="${G.curl(s.collection)}">Découvrir la collection ${icon('arrow')}</a>
            <div class="rail-nav"><button type="button" data-rail-prev aria-label="Précédent">${icon('arrow-left')}</button><button type="button" data-rail-next aria-label="Suivant">${icon('arrow')}</button></div></div>
        </div>
        <div class="rail" data-list="Nouveautés — accueil">${ps.map((p, i) => G.card(p, { list: 'Nouveautés — accueil', index: i, sizes: '(min-width:1024px) 23vw, (min-width:600px) 42vw, 64vw' })).join('')}</div>
        <div class="rail-progress" aria-hidden="true"><span></span></div>
      </div>
    </section>`; };

  const essentials = () => { const s = S.categories; return `
    <section class="section section--tight-top" aria-labelledby="ess-title">
      <div class="container mosaic">
        <div class="mosaic__intro reveal"><p class="eyebrow">${esc(s.eyebrow)}</p><h2 id="ess-title">${esc(s.title)}</h2><p>Mocassins souples, souliers à lacets, bottines et baskets en cuir : cinq façons d’être bien chaussé.</p></div>
        ${s.tiles.map((t, i) => { const c = G.collection(t.c); const ref = i === 0 ? 'cdn:https://cdn.shopify.com/s/files/1/0241/5532/4468/products/CLD04947.jpg' : t.img; return `
        <article class="tile tile--${i + 1} reveal" style="--d:${(i % 3) * 90}ms">
          <div class="media zoom-on-hover">${img(ref, { sizes: i === 0 ? '(min-width:1024px) 55vw, 100vw' : '(min-width:1024px) 30vw, 50vw', alt: '', max: 1600, w: i === 0 ? 1200 : 720 })}</div>
          <div class="tile__cap"><h3><a href="${G.curl(t.c)}">${esc(t.title)}</a></h3><span>${c.products.length} modèles</span></div>
        </article>`; }).join('')}
      </div>
    </section>`; };

  const campaign = () => { const s = S.campaign; const mc = G.product('monte-cristo'); const sib = G.siblings(mc); return `
    <section class="section section--alt" aria-labelledby="camp-title">
      <div class="container campaign">
        <div class="campaign__main reveal"><div class="media zoom-on-hover">${img(s.images[0], { sizes: '(min-width:1024px) 56vw, 100vw', alt: 'Monte Cristo noir : intérieur en cuir vert émeraude', w: 1200, max: 1600 })}</div></div>
        <div class="campaign__text reveal" style="--d:120ms">
          <p class="eyebrow"><span class="lining-mark" aria-hidden="true"></span>${esc(s.eyebrow)}</p>
          <h2 id="camp-title">${s.title}</h2>
          <p>${esc(s.text)}</p>
          <div class="campaign__inset"><div class="media">${img(s.images[1], { sizes: '18vw', alt: 'Paire de Monte Cristo noirs posée sur une marche en pierre', max: 960, w: 720 })}</div></div>
          <div class="campaign__buy">
            <a class="btn" href="${s.cta[1]}">${esc(s.cta[0])}</a>
            <div><div class="campaign__swatches" aria-label="${sib.length} couleurs">${sib.map(p => `<a class="swatch" style="--sw:${p.swatch}" href="${G.url(p)}" aria-label="Monte Cristo ${esc(p.cw)}" title="${esc(p.cw)}"></a>`).join('')}</div>
              <p class="price" style="margin-top:.6rem">${money(mc.price)}</p></div>
          </div>
        </div>
      </div>
    </section>`; };

  const signatures = () => { const s = S.signatures; const ps = s.models.map(G.product).filter(Boolean); return `
    <section class="section signatures" aria-labelledby="sig-title">
      <div class="container" data-rail>
        <div class="section-head rail-head reveal">
          <div><p class="eyebrow">${esc(s.eyebrow)}</p><h2 id="sig-title">${esc(s.title)}</h2><p>${esc(s.text)}</p></div>
          <div class="rail-head__aside"><a class="link" href="${s.cta[1]}">${esc(s.cta[0])} ${icon('arrow')}</a>
            <div class="rail-nav"><button type="button" data-rail-prev aria-label="Précédent">${icon('arrow-left')}</button><button type="button" data-rail-next aria-label="Suivant">${icon('arrow')}</button></div></div>
        </div>
        <div class="rail" data-list="Signatures — accueil">${ps.map((p, i) => { const facts = [p.facts.construction, p.facts.material || p.material, p.facts.lining && `Doublure ${p.facts.lining.toLowerCase()}`].filter(Boolean); const sib = G.siblings(p); return `
          <article class="sig" data-ga='${esc(JSON.stringify(G.item(p, { index: i, item_list_name: 'Signatures — accueil' })))}'>
            <span class="sig__no">N° ${String(i + 1).padStart(2, '0')}</span>
            <div class="media">${img(packshot(p), { sizes: '(min-width:1024px) 40vw, 80vw', alt: `${p.model} ${p.cw}`, max: 1600, w: 1080 })}</div>
            <div class="sig__body">
              <h3><a href="${G.url(p)}">${esc(p.model)}</a></h3>
              <p class="sig__facts">${esc(facts.join(' · ') || G.styleLabel(p))}</p>
              <div class="sig__aside">${G.swatchesHtml(p, 6)}<span class="price">${money(p.price)}</span>${sib.length > 1 ? `<span class="label muted">${sib.length} couleurs</span>` : ''}</div>
            </div>
          </article>`; }).join('')}</div>
        <div class="rail-progress" aria-hidden="true"><span></span></div>
      </div>
    </section>`; };

  const maison = () => { const s = S.maison; return `
    <section class="section section--stone" aria-labelledby="maison-title">
      <div class="container maison">
        <div class="maison__media reveal"><div class="media">${img(s.image, { sizes: '(min-width:1024px) 48vw, 100vw', alt: 'Une paire de Monte Cristo cocoa tenue à la main devant un mur de briques', w: 1200, max: 1600 })}</div></div>
        <div class="maison__text reveal" style="--d:120ms">
          <p class="eyebrow">${esc(s.eyebrow)}</p><h2 id="maison-title">${s.title}</h2>
          <div class="prose">${s.text.map(t => `<p>${esc(t)}</p>`).join('')}</div>
          <dl class="figures">${s.figures.map(([a, b]) => `<div><dt>${esc(a)}</dt><dd>${esc(b)}</dd></div>`).join('')}</dl>
          <a class="link" href="${s.cta[1]}">${esc(s.cta[0])} ${icon('arrow')}</a>
        </div>
      </div>
    </section>`; };

  const craft = () => { const s = S.craft; return `
    <section class="section section--xl section--dark on-dark" aria-labelledby="craft-title" id="savoir-faire">
      <div class="container">
        <div class="section-head reveal"><div><p class="eyebrow">${esc(s.eyebrow)}</p><h2 id="craft-title">${esc(s.title)}</h2><p>${esc(s.text)}</p></div>
          <a class="link" href="maison.html#savoir-faire">Le savoir-faire ${icon('arrow')}</a></div>
        <div class="craft-grid" tabindex="0" role="region" aria-label="Savoir-faire, quatre détails">${s.items.map((it, i) => `
          <article class="craft-item${it.lining ? ' craft-item--lining' : ''} reveal" style="--d:${i * 90}ms">
            <div class="media">${img(it.img, { sizes: '(min-width:1024px) 23vw, 72vw', alt: '', max: 960, w: 720 })}</div>
            <h3><span>0${i + 1}</span>${esc(it.title)}</h3><p>${esc(it.text)}</p>
          </article>`).join('')}</div>
      </div>
    </section>`; };

  const occasion = () => { const s = S.occasion;
    const ps = [...distinct(G.colProducts(s.collection), 3), ...distinct(G.colProducts(s.extra), 1)];
    return `
    <section class="section section--xl" aria-labelledby="occ-title">
      <div class="container edit">
        <div class="edit__media reveal"><div class="media">${img(s.image, { sizes: '(min-width:1024px) 40vw, 100vw', alt: 'Souliers à boucles cognac tenus à la portière d’une voiture ancienne', max: 960 })}</div></div>
        <div class="edit__main">
          <div class="section-head reveal"><div><p class="eyebrow">${esc(s.eyebrow)}</p><h2 id="occ-title">${esc(s.title)}</h2><p>${esc(s.text)}</p></div></div>
          <div class="edit__grid" data-list="Édition business — accueil">${ps.map((p, i) => G.card(p, { list: 'Édition business — accueil', index: i, sizes: '(min-width:1024px) 22vw, 48vw' })).join('')}</div>
          <nav class="edit__links" aria-label="Souliers par occasion">${s.links.map(([t, h]) => `<a class="link link--quiet" href="${G.curl(h)}">${esc(t)}</a>`).join('')}</nav>
        </div>
      </div>
    </section>`; };

  const voices = () => { const s = S.testimonials; return `
    <section class="section section--alt" aria-labelledby="voices-title">
      <div class="container voices">
        <div class="voices__head reveal"><p class="eyebrow">${esc(s.eyebrow)}</p><h2 id="voices-title" class="h3">${esc(s.title)}</h2></div>
        <div class="voices__list">${s.items.map((t, i) => `<figure class="voice${i ? ' voice--small' : ''} reveal"><blockquote>${esc(t.quote)}</blockquote><figcaption class="label">${esc(t.name)}</figcaption></figure>`).join('')}</div>
        <div class="press reveal"><span class="label muted">Ils en parlent</span>${s.press.map(([n, u]) => `<img src="${u}?height=64" alt="${esc(n)}" loading="lazy" height="26">`).join('')}</div>
      </div>
    </section>`; };

  const journal = () => { const s = S.journal; return `
    <section class="section" aria-labelledby="jr-title">
      <div class="container">
        <div class="section-head reveal"><div><p class="eyebrow">${esc(s.eyebrow)}</p><h2 id="jr-title">${esc(s.title)}</h2></div></div>
        <div class="journal">${s.items.map((it, i) => `
          <article class="story reveal" style="--d:${i * 90}ms">
            <div class="media zoom-on-hover">${img(it.img, { sizes: i ? '(min-width:1024px) 22vw, 48vw' : '(min-width:1024px) 48vw, 100vw', alt: '', max: 1200 })}</div>
            <p class="label muted story__kicker">${esc(it.kicker)}</p><h3><a href="${it.href}">${esc(it.title)}</a></h3>
          </article>`).join('')}</div>
      </div>
    </section>`; };

  const services = () => `
    <section class="section section--tight-top" aria-label="Nos services">
      <div class="container services">${S.services.map((s, i) => `
        <div class="service reveal" style="--d:${i * 70}ms">${icon(s.icon)}<h3><a href="service.html#${s.id}">${esc(s.title)}</a></h3><p>${esc(s.text)}</p></div>`).join('')}
      </div>
    </section>`;

  G.ready.then(() => {
    document.body.classList.add('has-hero');
    G.$('#main').innerHTML = hero() + newIn() + essentials() + campaign() + signatures() + maison() + craft() + occasion() + voices() + journal() + services();
    G.mount();
  });
})();
