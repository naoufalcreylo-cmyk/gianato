/* GIANATO — editorial pages: La Maison (maison.html) and Service client (service.html).
   Content sources: gianato.ma homepage (Héritage, La Maison Gianato, Directement de l'Atelier),
   /pages/cordonnerie (L'Atelier Lozano), /pages/conseils-dexperts, /pages/guide-des-tailles,
   /blogs/garantie/* (livraison, paiement-securise, retour-et-echange, garantie), /pages/contact. */
(() => {
  const G = window.G; const S = G.site;
  const { $, $$, esc, icon, img } = G;

  const CARE = [
    ['L’embauchoir, toujours', 'En bois, à la bonne pointure, glissé dès que vous vous déchaussez : il absorbe l’humidité, limite les plis de marche et garde la forme du soulier.'],
    ['L’alternance', 'Le cuir a besoin de repos : évitez de porter la même paire deux jours de suite. Entre deux ports, elle reste sur son embauchoir.'],
    ['Un cirage régulier', 'Tous les 4 à 5 ports, une fine couche de cirage à la cire d’abeille, appliquée en mouvements circulaires, puis lustrée à la brosse en crin. Une crème nourrissante toutes les deux semaines.'],
    ['Les semelles', 'Une semelle en cuir se nourrit comme la tige. Un patin en caoutchouc la protège, mais jamais sur un soulier neuf : portez-le une dizaine de jours avant.'],
    ['Le glaçage', 'Cirage et eau, par petites touches circulaires, sur le bout et le contrefort. Léger sur le cuir noir, plus prononcé sur les autres teintes.'],
    ['Le nettoyage', 'Un lait nettoyant incolore retire les impuretés, les traces de pluie et l’excès de cirage. Le cuir retrouve son éclat d’origine.'],
  ];

  function maison() {
    const craft = S.craft.items;
    return `
      <section class="page-hero on-media">
        <div class="media">${img('cdn:https://cdn.shopify.com/s/files/1/0241/5532/4468/products/DSC09596.jpg', { sizes: '100vw', alt: 'Une paire de Monte Cristo noirs posée sur une marche en pierre', eager: true, max: 2000, w: 1600 })}</div>
        <div class="page-hero__content"><div class="container"><p class="eyebrow">La Maison GIANATO</p><h1 class="display">Deux maisons familiales,<br><em>un même métier.</em></h1></div></div>
      </section>

      <section class="section section--xl"><div class="container chapter">
        <div class="chapter__media reveal"><div class="media">${img('cdn:https://cdn.shopify.com/s/files/1/0241/5532/4468/products/DSC09865.jpg', { sizes: '(min-width:1024px) 48vw, 100vw', alt: 'Monte Cristo cocoa tenus à la main', max: 1600 })}</div></div>
        <div class="chapter__text reveal"><span class="chapter__no">01</span><p class="eyebrow">Notre histoire</p><h2>Une rencontre italo-marocaine</h2>
          <div class="prose"><p>GIANATO est le fruit de la fusion de deux marques familiales : Lozano, chausseur italien, et Richilio, maison marocaine.</p>
          <p>De cette rencontre est née une Maison de souliers pour homme, en perpétuel mouvement : chaque nouveau modèle, chaque détail de fabrication est pensé pour accompagner le pied de l’homme, du bureau aux jours libres.</p>
          <p>Richelieu, derby, mocassin, bottine : plus qu’une chaussure, un compagnon de marche.</p></div>
          <p class="source">Source : gianato.ma — « La Maison Gianato », « Héritage ».</p></div>
      </div></section>

      <section class="section section--stone" id="atelier"><div class="container chapter chapter--flip">
        <div class="chapter__media reveal"><div class="media">${img('img:life-flatlay', { sizes: '(min-width:1024px) 48vw, 100vw', alt: 'Souliers GIANATO en cuir noir, cognac et marine posés sur un parquet', max: 960 })}</div></div>
        <div class="chapter__text reveal"><span class="chapter__no">02</span><p class="eyebrow">L’atelier Lozano</p><h2>San Clemente, depuis 1895</h2>
          <div class="prose"><p>L’histoire de Lozano commence en 1895, dans un atelier de fabrication de chaussures à San Clemente, dans la province de Rimini, l’un des districts d’excellence de la chaussure italienne.</p>
          <p>Son savoir-faire repose notamment sur la technique traditionnelle « un sacchetto », dite méthode bolognaise : une construction qui réunit la tige, la doublure et la semelle.</p>
          <p>L’atelier Lozano : San Clemente, Italie — Casablanca, Maroc.</p></div>
          <p class="source">Source : gianato.ma — page « L’Atelier Lozano ».</p></div>
      </div></section>

      <section class="section section--xl"><div class="container chapter">
        <div class="chapter__media reveal"><div class="media">${img('img:craft-hand', { sizes: '(min-width:1024px) 48vw, 100vw', alt: 'Une bottine chelsea en cuir grainé tenue à la main', max: 1080 })}</div></div>
        <div class="chapter__text reveal"><span class="chapter__no">03</span><p class="eyebrow">De l’atelier à votre porte</p><h2>Sans intermédiaire</h2>
          <div class="prose"><p>Le modèle GIANATO va directement de l’atelier au client : pas d’intermédiaire entre ceux qui pensent la paire et ceux qui la portent.</p>
          <p>Et parce qu’une paire se vit longtemps, la Maison reste présente après l’achat : échange de pointure, garantie d’un an contre les défauts de fabrication, conseil par téléphone ou WhatsApp.</p></div>
          <a class="link" style="margin-top:2rem" href="service.html">Nos services ${icon('arrow')}</a></div>
      </div></section>

      <section class="section section--xl section--dark on-dark" id="savoir-faire"><div class="container">
        <div class="section-head reveal"><div><p class="eyebrow">Savoir-faire</p><h2>Regarder de plus près</h2><p>${esc(S.craft.text)}</p></div></div>
        <div class="craft-grid" tabindex="0" role="region" aria-label="Savoir-faire, quatre détails">${craft.map((it, i) => `<article class="craft-item${it.lining ? ' craft-item--lining' : ''} reveal" style="--d:${i * 90}ms"><div class="media">${img(it.img, { sizes: '(min-width:1024px) 23vw, 72vw', alt: '', max: 960, w: 720 })}</div><h3><span>0${i + 1}</span>${esc(it.title)}</h3><p>${esc(it.text)}</p></article>`).join('')}</div>
      </div></section>

      <section class="section section--xl" id="entretien"><div class="container">
        <div class="section-head reveal"><div><p class="eyebrow">Entretien</p><h2>Faire durer ses souliers</h2><p>Le cuir est une matière vivante : il se patine et s’embellit, à condition d’en prendre soin. Les conseils de la Maison.</p></div></div>
        <ol class="rules" role="list">${CARE.map(([t, d]) => `<li class="reveal"><h3>${esc(t)}</h3><p>${esc(d)}</p></li>`).join('')}</ol>
        <p class="source" style="margin-top:2.5rem">Source : gianato.ma — « Conseils d’experts ».</p>
      </div></section>

      <section class="section section--alt"><div class="container center reveal">
        <p class="eyebrow eyebrow--plain">${esc(S.shop.signature)}</p>
        <h2 style="margin:1.25rem auto 2rem;max-width:40rem">Trouvez la paire qui vous accompagnera longtemps.</h2>
        <a class="btn" href="collection.html?c=meilleures-ventes">Découvrir les souliers</a>
      </div></section>`;
  }

  const BLOCKS = [
    ['livraison', 'Livraison', `<p>Livraison standard <strong>offerte partout au Maroc</strong>, en 2 à 5 jours ouvrés (hors dimanches et jours fériés). Livraison express partout au Maroc en 24 à 72 h.</p>
      <p>Dès l’expédition, vous recevez un e-mail ou un SMS avec, le cas échéant, le numéro de suivi de votre colis.</p>
      <p>En période de soldes, de ventes privées ou de jours fériés, les délais de traitement peuvent être plus longs.</p>`],
    ['echanges', 'Échanges & retours', `<p><strong>Échange offert sous 30 jours.</strong> Si la pointure ne convient pas, prévenez-nous : nous organisons la collecte gratuite depuis votre domicile ou votre bureau.</p>
      <ul><li>L’article doit être retourné non porté, avec l’ensemble de ses étiquettes et sa boîte d’origine, protégée par un emballage carton.</li>
      <li>Essayez vos souliers sur une surface propre (tapis, moquette) pour préserver leur état d’origine.</li>
      <li>Pour un remboursement, celui-ci est effectué sur la base du prix facturé ; les frais de retour sont à la charge du client. Si l’intégralité de la commande est retournée, les frais de livraison initiaux sont remboursés.</li></ul>
      <p>Pour demander un échange ou un retour : <a class="text-link" href="https://wa.me/${S.shop.whatsapp}" target="_blank" rel="noopener">${esc(S.shop.afterSales)}</a> (téléphone ou WhatsApp).</p>`],
    ['paiement', 'Paiement', `<p><strong>En espèces à la livraison</strong> : choisissez « Paiement à la livraison » lors de la commande, et réglez en dirhams à la réception.</p>
      <p><strong>Par carte bancaire</strong> (Visa, Mastercard, CMI) : le paiement s’effectue sur la plateforme sécurisée du Centre Monétique Interbancaire. GIANATO n’a jamais accès à vos coordonnées bancaires, chiffrées (SSL) et protégées par 3D Secure.</p>`],
    ['garantie', 'Garantie', `<p>Chaque paire GIANATO est <strong>garantie un an</strong> contre les vices de fabrication, à compter de la date d’achat, dans le cadre d’une utilisation normale.</p>
      <p>Une paire présentant un défaut de fabrication constaté par notre service après-vente est réparée gratuitement ou, à défaut, remplacée. La facture d’achat est nécessaire. Sont exclus : l’usure, le vieillissement et les dommages liés à une utilisation inadaptée.</p>`],
    ['pointures', 'Guide des pointures', `<p>Sur gianato.ma, les pointures sont toujours indiquées en pointure française.</p><div style="overflow-x:auto;margin-top:1.5rem">${'{{SIZE}}'}</div>
      <ul style="margin-top:1.5rem">${S.sizeAdvice.map(a => `<li>${esc(a)}</li>`).join('')}</ul>`],
    ['suivi', 'Suivre ma commande', `<p>Suivez votre colis grâce au numéro reçu par e-mail ou SMS, ou contactez le service suivi au <a class="text-link" href="tel:+212675576435">${esc(S.shop.afterSales)}</a>, par téléphone ou WhatsApp.</p>`],
    ['contact', 'Nous contacter', `<p>Une question sur un modèle, une pointure, une commande ? Nous répondons généralement sous 48 heures.</p>
      <ul><li>Service client : <a class="text-link" href="tel:${S.shop.phoneHref}">${esc(S.shop.phone)}</a></li>
      <li>Service après-vente et WhatsApp : <a class="text-link" href="https://wa.me/${S.shop.whatsapp}" target="_blank" rel="noopener">${esc(S.shop.afterSales)}</a></li>
      <li>E-mail : <a class="text-link" href="mailto:${S.shop.email}">${esc(S.shop.email)}</a></li>
      <li>${esc(S.shop.hours)}</li></ul>`],
  ];
  function service() {
    return `
      <div class="container page-head"><nav aria-label="Fil d’Ariane"><ol class="crumbs" role="list"><li><a href="index.html">Accueil</a></li><li aria-current="page">Service client</li></ol></nav>
        <p class="eyebrow" style="margin-top:3rem">Service client</p><h1>À votre service,<br><em>avant comme après.</em></h1>
        <p class="lede">Livraison, échanges, paiement et garantie : tout ce qui accompagne une paire GIANATO, de la commande aux années qui suivent.</p></div>
      <div class="container"><div class="services" style="margin-bottom:var(--section)">${S.services.map(s => `<div class="service">${icon(s.icon)}<h2 class="label" style="margin-top:1.25rem;color:var(--heading)"><a href="#${s.id}">${esc(s.title)}</a></h2><p>${esc(s.text)}</p></div>`).join('')}</div></div>
      <div class="container service-layout" style="padding-bottom:var(--section)">
        <aside><nav class="service-nav" aria-label="Rubriques">${BLOCKS.map(([id, t]) => `<a href="#${id}">${t}</a>`).join('')}</nav></aside>
        <div>${BLOCKS.map(([id, t, html]) => `<section class="service-block" id="${id}" aria-labelledby="${id}-t"><h2 id="${id}-t">${t}</h2><div class="prose">${html.replace('{{SIZE}}', G.sizeTable())}</div></section>`).join('')}</div>
      </div>`;
  }

  G.ready.then(() => {
    const page = document.body.dataset.page;
    if (page === 'maison') document.body.classList.add('has-hero');
    $('#main').innerHTML = page === 'maison' ? maison() : service();
    G.mount();
    if (page === 'service') {
      const links = $$('.service-nav a');
      const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) links.forEach(a => a.classList.toggle('is-active', a.hash === `#${e.target.id}`)); }), { rootMargin: '-30% 0px -60% 0px' });
      $$('.service-block').forEach(b => io.observe(b));
    }
  });
})();
