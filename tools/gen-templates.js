// Generates theme/templates/*.json from prototype/data/site.js (single content source): node tools/gen-templates.js
const fs = require('fs'), path = require('path'), vm = require('vm');
const ctx = { window: {} }; vm.runInNewContext(fs.readFileSync(path.join(__dirname, '../prototype/data/site.js'), 'utf8'), ctx);
const S = ctx.window.GIANATO_SITE;
const T = path.join(__dirname, '../theme/templates');
const write = (f, o) => { fs.mkdirSync(path.dirname(path.join(T, f)), { recursive: true }); fs.writeFileSync(path.join(T, f), JSON.stringify(o, null, 2) + '\n'); console.log(f); };
const blocks = (arr, type, fn) => ({ blocks: Object.fromEntries(arr.map((x, i) => [`${type}${i + 1}`, { type, settings: fn(x, i) }])), block_order: arr.map((_, i) => `${type}${i + 1}`) });
const asset = ref => (ref && ref.startsWith('img:') ? `editorial-${ref.slice(4)}.webp` : '');
const strip = s => s.replace(/<br>/g, ' ').replace(/<\/?em>/g, '');
const split = s => { const [a, b] = s.split('<br>'); return [a.replace(/<\/?em>/g, ''), (b || '').replace(/<\/?em>/g, '')]; };
const pageUrl = h => {
  const map = { 'maison.html': '/pages/la-maison', 'service.html': '/pages/service-client' };
  const [file, hash] = h.split('#');
  if (map[file]) return map[file] + (hash ? `#${hash}` : '');
  const c = h.match(/collection\.html\?c=(.+)/); if (c) return `shopify://collections/${c[1]}`;
  const p = h.match(/product\.html\?p=(.+)/); if (p) return `shopify://products/${p[1]}`;
  return h;
};

/* ---------- Home ---------- */
const [ht1, ht2] = split(S.hero.title);
const [ct1, ct2] = split(S.campaign.title);
const [mt1, mt2] = split(S.maison.title);
const tileImg = ['editorial-loafers-blue.webp', ...S.categories.tiles.slice(1).map(t => asset(t.img))];
// INDEX_IS_LIVE: since 2026-10-23 the homepage is edited on the live store (Theme Editor) — only regenerate with --index
if (process.argv.includes('--index')) write('index.json', {
  sections: {
    hero: { type: 'hero-diptych', settings: { eyebrow: S.hero.eyebrow, title: ht1, title_em: ht2, text: S.hero.text, cta_label: S.hero.cta[0], cta_url: pageUrl(S.hero.cta[1]), cta2_label: S.hero.cta2[0], cta2_url: pageUrl(S.hero.cta2[1]), caption_product: 'monte-cristo-gold', caption_text: 'doublure cuir vert émeraude' } },
    ...(S.sale ? { sale: { type: 'sale-banner', settings: { enabled: !!S.sale.enabled, eyebrow: S.sale.eyebrow, title: S.sale.title, rate: S.sale.rate, text: S.sale.text, collection: S.sale.cta[1].split('c=')[1], cta_label: S.sale.cta[0] } } } : {}),
    new_in: { type: 'featured-collection', settings: { eyebrow: S.newIn.eyebrow, title: S.newIn.title, text: S.newIn.text, collection: S.newIn.collection, limit: S.newIn.limit, distinct: true, cta_label: 'Découvrir la collection' } },
    essentials: { type: 'category-mosaic', settings: { eyebrow: S.categories.eyebrow, title: S.categories.title, text: 'Mocassins souples, souliers à lacets, bottines et baskets en cuir : cinq façons d’être bien chaussé.' },
      ...blocks(S.categories.tiles, 'tile', (t, i) => ({ collection: t.c, title: t.title, fallback: tileImg[i] })) },
    campaign: { type: 'editorial-campaign', settings: { eyebrow: S.campaign.eyebrow, title: ct1, title_em: ct2, text: S.campaign.text, product: 'monte-cristo', cta_label: S.campaign.cta[0], lining_mark: true } },
    signatures: { type: 'signatures', settings: { eyebrow: S.signatures.eyebrow, title: S.signatures.title, text: S.signatures.text, products: S.signatures.models, collection: 'meilleures-ventes', cta_label: S.signatures.cta[0] } },
    maison: { type: 'maison-story', settings: { tone: 'stone', eyebrow: S.maison.eyebrow, title: mt1, title_em: mt2, text: S.maison.text.map(t => `<p>${t}</p>`).join(''), cta_label: S.maison.cta[0], cta_url: pageUrl(S.maison.cta[1]) },
      ...blocks(S.maison.figures, 'figure', ([value, label]) => ({ value, label })) },
    craft: { type: 'craftsmanship', settings: { eyebrow: S.craft.eyebrow, title: S.craft.title, text: S.craft.text, link_label: 'Le savoir-faire', link_url: '/pages/la-maison#savoir-faire' },
      ...blocks(S.craft.items, 'detail', (it, i) => ({ title: it.title, text: it.text, lining: !!it.lining, fallback: ['editorial-craft-grain.webp', 'editorial-craft-blake.webp', 'editorial-craft-lining.webp', 'editorial-craft-sole.webp'][i] })) },
    occasion: { type: 'occasion-edit', settings: { eyebrow: S.occasion.eyebrow, title: S.occasion.title, text: S.occasion.text, collection: S.occasion.collection, extra_collection: S.occasion.extra, count: 3, links: 'occasions' } },
    voices: { type: 'testimonials', settings: { eyebrow: S.testimonials.eyebrow, title: S.testimonials.title },
      ...blocks(S.testimonials.items, 'quote', t => ({ quote: t.quote, name: t.name })) },
    journal: { type: 'journal', settings: { eyebrow: S.journal.eyebrow, title: S.journal.title, blog: 'comment-choisir-des-souliers-pour-homme-adaptes-a-son-style' },
      ...blocks(S.journal.items, 'story', it => ({ kicker: it.kicker, title: it.title, url: pageUrl(it.href), fallback: asset(it.img) })) },
    services: { type: 'service-promise', settings: { tight: true },
      ...blocks(S.services, 'service', s => ({ icon: s.icon, title: s.title, text: s.text, url: `/pages/service-client#${s.id}` })) },
  },
  order: ['hero', ...(S.sale ? ['sale'] : []), 'new_in', 'essentials', 'campaign', 'signatures', 'maison', 'craft', 'occasion', 'voices', 'journal', 'services'],
});

/* ---------- Commerce templates ---------- */
write('product.json', { sections: {
  main: { type: 'main-product', settings: { show_lede: true } },
  complete: { type: 'complete-style', settings: {} },
  reco: { type: 'product-recommendations', settings: { intent: 'related', limit: 8 } },
  recent: { type: 'recently-viewed', settings: {} },
}, order: ['main', 'complete', 'reco', 'recent'] });
write('collection.json', { sections: { main: { type: 'main-collection', settings: { per_page: 24, show_image: true, styles_menu: 'styles' } } }, order: ['main'] });
write('search.json', { sections: { main: { type: 'main-search', settings: {} } }, order: ['main'] });
write('cart.json', { sections: { main: { type: 'main-cart', settings: {} } }, order: ['main'] });
write('404.json', { sections: { main: { type: 'main-404', settings: {} } }, order: ['main'] });
write('list-collections.json', { sections: { main: { type: 'main-list-collections', settings: {} } }, order: ['main'] });
write('blog.json', { sections: { main: { type: 'main-blog', settings: {} } }, order: ['main'] });
write('article.json', { sections: { main: { type: 'main-article', settings: {} } }, order: ['main'] });
write('page.json', { sections: { main: { type: 'main-page', settings: {} } }, order: ['main'] });
write('password.json', { layout: 'password', sections: { main: { type: 'main-password', settings: {} } }, order: ['main'] });
for (const t of ['login', 'register', 'account', 'order', 'addresses', 'activate_account', 'reset_password'])
  write(`customers/${t}.json`, { sections: { main: { type: 'main-account', settings: {} } }, order: ['main'] });

/* ---------- Page « La Maison » (template suffix maison) ---------- */
write('page.maison.json', { sections: {
  hero: { type: 'page-hero', settings: { eyebrow: 'La Maison GIANATO', title: 'Deux maisons familiales,', title_em: 'un même métier.' } },
  story: { type: 'editorial-split', settings: { number: '01', eyebrow: 'Notre histoire', title: 'Une rencontre italo-marocaine', fallback: 'editorial-maison-hand.webp', image_alt: 'Monte Cristo cocoa tenus à la main', xl: true,
    text: '<p>GIANATO est le fruit de la fusion de deux marques familiales : Lozano, chausseur italien, et Richilio, maison marocaine.</p><p>De cette rencontre est née une Maison de souliers pour homme, en perpétuel mouvement : chaque nouveau modèle, chaque détail de fabrication est pensé pour accompagner le pied de l’homme, du bureau aux jours libres.</p><p>Richelieu, derby, mocassin, bottine : plus qu’une chaussure, un compagnon de marche.</p>',
    source: 'Source : gianato.ma — « La Maison Gianato », « Héritage ».' } },
  atelier: { type: 'editorial-split', settings: { anchor: 'atelier', tone: 'stone', xl: false, flip: true, number: '02', eyebrow: 'L’atelier Lozano', title: 'San Clemente, depuis 1895', fallback: 'editorial-life-flatlay.webp', image_alt: 'Souliers GIANATO en cuir noir, cognac et marine posés sur un parquet',
    text: '<p>L’histoire de Lozano commence en 1895, dans un atelier de fabrication de chaussures à San Clemente, dans la province de Rimini, l’un des districts d’excellence de la chaussure italienne.</p><p>Son savoir-faire repose notamment sur la technique traditionnelle « un sacchetto », dite méthode bolognaise : une construction qui réunit la tige, la doublure et la semelle.</p><p>L’atelier Lozano : San Clemente, Italie — Casablanca, Maroc.</p>',
    source: 'Source : gianato.ma — page « L’Atelier Lozano ».' } },
  direct: { type: 'editorial-split', settings: { number: '03', eyebrow: 'De l’atelier à votre porte', title: 'Sans intermédiaire', fallback: 'editorial-craft-hand.webp', image_alt: 'Une bottine chelsea en cuir grainé tenue à la main', xl: true,
    text: '<p>Le modèle GIANATO va directement de l’atelier au client : pas d’intermédiaire entre ceux qui pensent la paire et ceux qui la portent.</p><p>Et parce qu’une paire se vit longtemps, la Maison reste présente après l’achat : échange de pointure, garantie d’un an contre les défauts de fabrication, conseil par téléphone ou WhatsApp.</p>',
    cta_label: 'Nos services', cta_url: '/pages/service-client' } },
  craft: { type: 'craftsmanship', settings: { eyebrow: S.craft.eyebrow, title: S.craft.title, text: S.craft.text, link_label: '' },
    ...blocks(S.craft.items, 'detail', (it, i) => ({ title: it.title, text: it.text, lining: !!it.lining, fallback: ['editorial-craft-grain.webp', 'editorial-craft-blake.webp', 'editorial-craft-lining.webp', 'editorial-craft-sole.webp'][i] })) },
  care: { type: 'care-rules', settings: {} },
  cta: { type: 'cta-banner', settings: { cta_url: 'shopify://collections/meilleures-ventes' } },
}, order: ['hero', 'story', 'atelier', 'direct', 'craft', 'care', 'cta'] });

/* ---------- Page « Service client » (template suffix service) ---------- */
const sizeAdvice = `<ul>${S.sizeAdvice.map(a => `<li>${a}</li>`).join('')}</ul>`;
const topics = [
  ['livraison', 'Livraison', '<p>Livraison standard <strong>offerte partout au Maroc</strong>, en 2 à 5 jours ouvrés (hors dimanches et jours fériés). Livraison express partout au Maroc en 24 à 72 h.</p><p>Dès l’expédition, vous recevez un e-mail ou un SMS avec, le cas échéant, le numéro de suivi de votre colis.</p><p>En période de soldes, de ventes privées ou de jours fériés, les délais de traitement peuvent être plus longs.</p>'],
  ['echanges', 'Échanges & retours', `<p><strong>Échange offert sous 30 jours.</strong> Si la pointure ne convient pas, prévenez-nous : nous organisons la collecte gratuite depuis votre domicile ou votre bureau.</p><ul><li>L’article doit être retourné non porté, avec l’ensemble de ses étiquettes et sa boîte d’origine, protégée par un emballage carton.</li><li>Essayez vos souliers sur une surface propre (tapis, moquette) pour préserver leur état d’origine.</li><li>Pour un remboursement, celui-ci est effectué sur la base du prix facturé ; les frais de retour sont à la charge du client. Si l’intégralité de la commande est retournée, les frais de livraison initiaux sont remboursés.</li></ul><p>Pour demander un échange ou un retour : ${S.shop.afterSales} (téléphone ou WhatsApp).</p>`],
  ['paiement', 'Paiement', '<p><strong>En espèces à la livraison</strong> : choisissez « Paiement à la livraison » lors de la commande, et réglez en dirhams à la réception.</p><p><strong>Par carte bancaire</strong> (Visa, Mastercard, CMI) : le paiement s’effectue sur la plateforme sécurisée du Centre Monétique Interbancaire. GIANATO n’a jamais accès à vos coordonnées bancaires, chiffrées (SSL) et protégées par 3D Secure.</p>'],
  ['garantie', 'Garantie', '<p>Chaque paire GIANATO est <strong>garantie un an</strong> contre les vices de fabrication, à compter de la date d’achat, dans le cadre d’une utilisation normale.</p><p>Une paire présentant un défaut de fabrication constaté par notre service après-vente est réparée gratuitement ou, à défaut, remplacée. La facture d’achat est nécessaire. Sont exclus : l’usure, le vieillissement et les dommages liés à une utilisation inadaptée.</p>'],
  ['pointures', 'Guide des pointures', `<p>Sur gianato.ma, les pointures sont toujours indiquées en pointure française.</p>${sizeAdvice}`, true],
  ['suivi', 'Suivre ma commande', `<p>Suivez votre colis grâce au numéro reçu par e-mail ou SMS, ou contactez le service suivi au ${S.shop.afterSales}, par téléphone ou WhatsApp.</p>`],
  ['contact', 'Nous contacter', `<p>Une question sur un modèle, une pointure, une commande ? Nous répondons généralement sous 48 heures.</p><ul><li>Service client : ${S.shop.phone}</li><li>Service après-vente et WhatsApp : ${S.shop.afterSales}</li><li>E-mail : ${S.shop.email}</li><li>${S.shop.hours}</li></ul>`],
];
write('page.service.json', { sections: {
  services: { type: 'service-promise', settings: { tight: false }, ...blocks(S.services, 'service', s => ({ icon: s.icon, title: s.title, text: s.text, url: `/pages/service-client#${s.id}` })) },
  main: { type: 'service-page', settings: {}, ...blocks(topics, 'topic', ([anchor, title, text, size]) => ({ anchor, title, text, size_table: !!size })) },
}, order: ['main', 'services'] });
