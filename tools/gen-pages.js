// Generates the prototype's secondary HTML entry points (same head as index.html): node tools/gen-pages.js
const fs = require('fs'), path = require('path');
const out = path.join(__dirname, '..', 'prototype');
const pages = [
  { file: 'collection.html', page: 'collection', title: 'Collection — GIANATO', desc: 'Souliers GIANATO : mocassins, richelieu, derby, bottines et baskets en cuir. Livraison offerte au Maroc.', css: ['templates'], js: ['collection'] },
  { file: 'product.html', page: 'product', title: 'GIANATO — Maison de souliers', desc: 'Souliers en cuir GIANATO. Livraison offerte au Maroc, échange sous 30 jours, paiement à la livraison.', css: ['templates', 'sections'], js: ['product'] },
  { file: 'maison.html', page: 'maison', title: 'La Maison — GIANATO', desc: 'L’histoire de GIANATO, le savoir-faire de l’atelier Lozano et les conseils d’entretien de la Maison.', css: ['sections'], js: ['pages'] },
  { file: 'service.html', page: 'service', title: 'Service client — GIANATO', desc: 'Livraison, échanges, paiement, garantie et guide des pointures GIANATO.', css: ['sections', 'templates'], js: ['pages'] },
];
for (const p of pages) {
  const html = `<!doctype html>
<html lang="fr" class="no-js">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  <title>${p.title}</title>
  <meta name="description" content="${p.desc}">
  <meta name="theme-color" content="#f6f3ee">
  <link rel="icon" type="image/png" href="assets/img/favicon.png">
  <link rel="preload" href="assets/fonts/Newsreader.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="preload" href="assets/fonts/Belleza.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="preconnect" href="https://cdn.shopify.com" crossorigin>
  <link rel="stylesheet" href="assets/css/base.css">
  <link rel="stylesheet" href="assets/css/components.css">
${p.css.map(c => `  <link rel="stylesheet" href="assets/css/${c}.css">`).join('\n')}
  <script>document.documentElement.classList.remove('no-js')</script>
</head>
<body data-page="${p.page}">
  <main id="main" tabindex="-1"></main>
  <script src="data/site.js"></script>
  <script src="assets/js/core.js"></script>
  <script src="assets/js/icons.js"></script>
  <script src="assets/js/card.js"></script>
  <script src="assets/js/layout.js"></script>
${p.js.map(j => `  <script src="assets/js/${j}.js"></script>`).join('\n')}
</body>
</html>
`;
  fs.writeFileSync(path.join(out, p.file), html);
  console.log(p.file);
}
