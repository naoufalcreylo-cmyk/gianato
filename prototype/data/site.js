/* GIANATO — single content source for the prototype (and tools/gen-templates.js for the Shopify theme).
   Every factual statement is sourced from gianato.ma (pages, garantie blog, homepage, product descriptions)
   or the client's Brand Book 2026. Sources are noted inline. Nothing here is invented. */
window.GIANATO_SITE = {
  shop: {
    name: 'GIANATO',
    url: 'https://gianato.ma',
    email: 'contact@gianato.ma',                      // homepage footer
    phone: '+212 6 75 07 53 70', phoneHref: '+212675075370',   // homepage, brand book stationery
    afterSales: '+212 6 75 57 64 35', whatsapp: '212675576435', // garantie blog: SAV / WhatsApp
    hours: 'Du lundi au samedi, 9 h – 12 h et 14 h – 18 h', // page « L'Atelier Lozano »
    instagram: 'https://www.instagram.com/gianato.maroc/', facebook: 'https://www.facebook.com/Gianatomaroc',
    signature: 'L’assurance, cousue main.',           // brand book p.40
  },

  /* Announcement bar — operational facts only (homepage reassurance bar + garantie blog) */
  announcements: [
    { text: 'Livraison offerte partout au Maroc', href: 'service.html#livraison' },
    { text: 'Échange offert sous 30 jours', href: 'service.html#echanges' },
    { text: 'Paiement à la livraison ou par carte', href: 'service.html#paiement' },
  ],

  /* Navigation — every link is a live gianato.ma collection handle (URLs preserved) */
  nav: [
    { title: 'Souliers', mega: 'souliers' },
    { title: 'Nouveautés', href: 'collection.html?c=nouveautes' },
    { title: 'Occasions', mega: 'occasions' },
    { title: 'Maroquinerie', href: 'collection.html?c=essential-business' },
    { title: 'La Maison', mega: 'maison', end: true },   // right side of the header, beside the tools
  ],
  mega: {
    souliers: {
      columns: [
        { title: 'Les styles', links: [
          ['Mocassins', 'mocassin'], ['Richelieu', 'richelieu'], ['Derby', 'derby'], ['Bottes & bottines', 'bottines'],
          ['Baskets cuir', 'sneaker'], ['Chaussures à boucles', 'boucles'] ] },
        { title: 'Les collections', links: [
          ['Nouveautés', 'nouveautes'], ['Les signatures', 'meilleures-ventes'], ['Richelieu & Derby', 'richelieu-derby'],
          ['Sans lacets', 'chaussures-sans-lacets'], ['À lacets', 'chaussures-a-laces'], ['Grandes pointures', 'chaussures-grandes-pointures'] ] },
      ],
      all: ['Tous les souliers', 'meilleures-ventes'],
      quiet: ['Fin de collection', 'destockage'],     // kept, but discreet (brand book p.35)
      feature: { img: 'img:life-rocks', title: 'La nouvelle collection', text: 'Loro, en sept cuirs.', href: 'collection.html?c=nouveautes' },
    },
    occasions: {
      columns: [
        { title: 'Par occasion', links: [
          ['Business', 'classic-professionnel'], ['Ville', 'chaussures-ville'], ['Détente', 'esprit-libre'],
          ['Sélection mariage', 'selection-marriage'], ['Ultra confort', 'confort'] ] },
        { title: 'Pour le bureau', links: [
          ['Ville confortables', 'chaussures-ville-confortables'], ['Essential Business', 'essential-business'] ] },
      ],
      feature: { img: 'img:life-car', title: 'Le business contemporain', text: 'Souliers et mallettes pour les jours qui comptent.', href: 'collection.html?c=classic-professionnel' },
    },
    maison: {
      columns: [
        { title: 'La Maison', links: [
          ['Notre histoire', 'maison.html'], ['Le savoir-faire', 'maison.html#savoir-faire'], ['L’entretien', 'maison.html#entretien'] ] },
        { title: 'Services', links: [
          ['Guide des pointures', 'service.html#pointures'], ['Livraison', 'service.html#livraison'], ['Échanges & retours', 'service.html#echanges'],
          ['Paiement', 'service.html#paiement'], ['Garantie', 'service.html#garantie'], ['Nous contacter', 'service.html#contact'] ] },
      ],
      feature: { img: 'cdn:https://cdn.shopify.com/s/files/1/0241/5532/4468/products/DSC09608.jpg', title: 'Le vert à l’intérieur', text: 'La doublure émeraude du Monte Cristo.', href: 'product.html?p=monte-cristo' },
    },
  },

  /* Home */
  hero: {
    eyebrow: 'Maison de souliers',
    title: 'L’assurance,<br><em>cousue main.</em>',     // brand signature
    text: 'Richelieu, derby, mocassins et bottines en cuir, pensés pour accompagner chaque journée.',
    cta: ['Découvrir la collection', 'collection.html?c=nouveautes'],
    cta2: ['La Maison', 'maison.html'],
    images: ['img:hero-mosaic', 'cdn:https://cdn.shopify.com/s/files/1/0241/5532/4468/products/CLD04728.jpg'],
    mobile: 'img:hero-mosaic-m',
  },
  newIn: { eyebrow: 'Nouvelle collection', title: 'Les nouveautés', text: 'Le Loro arrive en sept cuirs : un mocassin souple sur semelle claire, pour les journées qui commencent au bureau et finissent ailleurs.', collection: 'nouveautes', limit: 6 },
  categories: {
    eyebrow: 'Les essentiels', title: 'Un soulier pour chaque allure',
    tiles: [
      { title: 'Mocassins', c: 'mocassin', img: 'img:life-rocks', size: 'xl' },
      { title: 'Richelieu & Derby', c: 'richelieu-derby', img: 'img:life-terrace', size: 'md' },
      { title: 'Bottes & bottines', c: 'bottines', img: 'img:life-boot', size: 'md' },
      { title: 'Baskets cuir', c: 'sneaker', img: 'img:life-sneakers', size: 'sm' },
      { title: 'Chaussures à boucles', c: 'boucles', img: 'img:life-car', size: 'sm' },
    ],
  },
  campaign: {
    eyebrow: 'Monte Cristo', title: 'Ce qui ne se voit pas<br><em>se ressent.</em>',
    // Monte Cristo product description: « cuir de veau box brossé … doublure verte émeraude … semelle en gomme … Cousu blake soigneusement à la main »
    text: 'Veau box brossé, cousu Blake à la main, doublé de cuir vert émeraude. Le mocassin de la Maison, en six couleurs.',
    cta: ['Découvrir le Monte Cristo', 'product.html?p=monte-cristo'],
    images: ['cdn:https://cdn.shopify.com/s/files/1/0241/5532/4468/products/DSC09608.jpg', 'cdn:https://cdn.shopify.com/s/files/1/0241/5532/4468/products/DSC09596.jpg'],
    model: 'Monte Cristo',
  },
  signatures: {
    eyebrow: 'Les signatures', title: 'Les modèles qui font la Maison',
    text: 'Quatre souliers que nos clients choisissent, et reviennent choisir.',
    models: ['monte-cristo', 'carlo-sombre-antique', 'alessio', 'antique-ritchie'],   // brand book p.33 + best-seller ranking
    cta: ['Toutes les signatures', 'collection.html?c=meilleures-ventes'],
  },
  maison: {
    eyebrow: 'La Maison GIANATO', title: 'Deux maisons familiales,<br><em>un même métier.</em>',
    // homepage « La Maison Gianato » + « Directement de l'Atelier »
    text: [
      'GIANATO est né de la rencontre de deux marques familiales : Lozano, chausseur italien, et Richilio, maison marocaine.',
      'De l’atelier à votre porte, sans intermédiaire : chaque paire est pensée à l’atelier, et la Maison reste à vos côtés bien après l’achat.',
    ],
    cta: ['Découvrir notre histoire', 'maison.html'],
    image: 'cdn:https://cdn.shopify.com/s/files/1/0241/5532/4468/products/DSC09865.jpg',
    figures: [['1 an', 'de garantie sur chaque paire'], ['30 jours', 'pour échanger votre pointure'], ['2 à 5 jours', 'de livraison au Maroc']],
  },
  craft: {
    eyebrow: 'Savoir-faire', title: 'Regarder de plus près',
    text: 'Ce qui fait une paire ne se lit pas sur l’étiquette. Ces détails, nous les nommons.',
    items: [
      { title: 'La matière', text: 'Veau box, box calf pleine fleur, cuir grainé ou daim : chaque fiche indique le cuir employé.', img: 'img:craft-grain' },
      { title: 'Le cousu Blake', text: 'Une couture qui relie la tige à la semelle. Quand elle est faite à la main, la fiche du modèle le précise.', img: 'cdn:https://cdn.shopify.com/s/files/1/0241/5532/4468/files/Artboard_76_6a15d3a8-b382-4632-a12d-32949a84fe19.png' },
      { title: 'La doublure', text: 'Le cuir vert émeraude du Monte Cristo. Personne ne le voit, sauf celui qui porte la paire.', img: 'cdn:https://cdn.shopify.com/s/files/1/0241/5532/4468/products/CLD04952.jpg', lining: true },
      { title: 'La semelle', text: 'Gomme sur la plupart de nos modèles, pour l’adhérence et le confort au quotidien.', img: 'img:craft-sole' },
    ],
  },
  occasion: {
    eyebrow: 'L’édition business', title: 'Le business contemporain',
    text: 'Réunion, plaidoirie, signature : les souliers et mallettes des jours qui comptent.',
    collection: 'classic-professionnel', extra: 'essential-business', image: 'img:life-car-2',
    links: [['Business', 'classic-professionnel'], ['Ville', 'chaussures-ville'], ['Mariage', 'selection-marriage'], ['Ultra confort', 'confort'], ['Détente', 'esprit-libre']],
  },
  testimonials: {
    eyebrow: 'Les amis de la Maison', title: 'Ils portent GIANATO',
    // verbatim from gianato.ma homepage « Découvrez ce que disent les amis de la Maison »
    items: [
      { quote: 'Je suis vraiment étonné de la qualité des chaussures que j’ai prises chez la Maison Gianato. C’est devenu ma marque de chaussures préférée. Je la recommande vivement, sans oublier leur service personnalisé assuré par Mme Ferdaous.', name: 'Driss Roukh' },
      { quote: 'C’est magnifique, merci pour la qualité du service.', name: 'Othmane Lamine' },
    ],
    press: [['L’Opinion', 'https://cdn.shopify.com/s/files/1/0241/5532/4468/files/LOpinion_Logo_full-2048x496_1a33ae99-58e6-4b2b-9ba5-f2a712a87dba.png'], ['La Vie éco', 'https://cdn.shopify.com/s/files/1/0241/5532/4468/files/LVE-LOGO-NEW-BON_5935eb02-6285-4bc6-a02c-fc2cd8adb3af.jpg']],
  },
  journal: {
    eyebrow: 'Le carnet', title: 'Conseils de la Maison',
    // Real editorial pages of gianato.ma (the « Journal » blog has no article yet)
    items: [
      { kicker: 'Entretien', title: 'Embauchoirs, alternance, cirage : faire durer ses souliers', href: 'maison.html#entretien', img: 'img:craft-hand', source: '/pages/conseils-dexperts' },
      { kicker: 'Pointure', title: 'Trouver la juste pointure, du premier coup', href: 'service.html#pointures', img: 'img:boots-pair', source: '/pages/guide-des-tailles' },
      { kicker: 'Atelier', title: 'L’atelier Lozano et la méthode « un sacchetto »', href: 'maison.html#atelier', img: 'img:life-flatlay', source: '/pages/cordonnerie' },
    ],
  },
  services: [
    { id: 'livraison', icon: 'truck', title: 'Livraison offerte', text: 'Partout au Maroc, en 2 à 5 jours ouvrés. Express en 24 à 72 h.' },
    { id: 'echanges', icon: 'exchange', title: 'Échange sous 30 jours', text: 'Pointure à revoir ? Nous organisons la collecte, à domicile ou au bureau.' },
    { id: 'paiement', icon: 'lock', title: 'Paiement sécurisé', text: 'En espèces à la livraison, ou par carte via CMI, avec 3D Secure.' },
    { id: 'garantie', icon: 'seal', title: 'Garantie 1 an', text: 'Chaque paire GIANATO est garantie contre les défauts de fabrication.' },
  ],
  newsletter: { title: 'Rejoignez les amis de la Maison', text: 'Nouveautés, accès anticipé aux fins de saison et conseils d’entretien. Une lettre, rarement.' },

  footer: [
    { title: 'La Maison', links: [['Notre histoire', 'maison.html'], ['Savoir-faire', 'maison.html#savoir-faire'], ['L’atelier', 'maison.html#atelier'], ['Entretien', 'maison.html#entretien']] },
    { title: 'Service client', links: [['Nous contacter', 'service.html#contact'], ['Livraison', 'service.html#livraison'], ['Échanges & retours', 'service.html#echanges'], ['Paiement', 'service.html#paiement'], ['Garantie', 'service.html#garantie'], ['Guide des pointures', 'service.html#pointures'], ['Suivre ma commande', 'service.html#suivi']] },
    { title: 'Nos souliers', links: [['Mocassins', 'collection.html?c=mocassin'], ['Richelieu', 'collection.html?c=richelieu'], ['Derby', 'collection.html?c=derby'], ['Bottes & bottines', 'collection.html?c=bottines'], ['Baskets cuir', 'collection.html?c=sneaker'], ['Maroquinerie', 'collection.html?c=essential-business'], ['Fin de collection', 'collection.html?c=destockage']] },
  ],
  legal: [['Conditions de vente', 'https://gianato.ma/pages/conditions-de-vente'], ['Politique de confidentialité', 'https://gianato.ma/pages/politique-de-confidentialite']],

  /* Collection page heroes (editorial image per key collection) */
  collectionImages: {
    mocassin: 'img:life-rocks', richelieu: 'img:life-terrace', derby: 'img:life-terrace', 'richelieu-derby': 'img:life-terrace', bottines: 'img:life-boot',
    sneaker: 'img:life-sneakers', boucles: 'img:life-car', 'classic-professionnel': 'img:life-car-2', 'chaussures-ville': 'img:life-brick',
    'esprit-libre': 'img:life-rocks-2', nouveautes: 'img:life-chair', 'meilleures-ventes': 'cdn:https://cdn.shopify.com/s/files/1/0241/5532/4468/products/DSC09596.jpg',
    'selection-marriage': 'cdn:https://cdn.shopify.com/s/files/1/0241/5532/4468/products/CLD04728.jpg', 'essential-business': 'img:life-car-2',
  },

  /* Size guide — gianato.ma /pages/guide-des-tailles (FR ↔ UK) */
  sizes: [[38, 4], [39, 5], [40, 6], [41, 7], [42, 8], [43, 9], [44, 10], [45, 11], [46, 12], [47, 13]],
  sizeAdvice: [
    'Première paire chez nous ? Optez pour votre pointure habituelle. Sur gianato.ma, les pointures sont toujours indiquées en pointure française.',
    'La pointure d’une chaussure de ville diffère de celle d’une chaussure de sport.',
    'Soulier un peu large ? Une semelle intérieure comble l’écart et ajoute du confort.',
    'Si la pointure ne convient pas, nous organisons une collecte gratuite depuis votre domicile ou votre bureau.',
  ],
};
