// Exports Matrixify-ready CSVs for the theme's metafields (namespace « gianato ») + a data-quality report.
// node tools/export-migration.js  → migration/products-metafields.csv, migration/collections-metafields.csv, migration/rapport-donnees.md
const fs = require('fs'), path = require('path'), vm = require('vm');
const C = require('../prototype/data/catalog.json');
const ctx = { window: {} }; vm.runInNewContext(fs.readFileSync(path.join(__dirname, '../prototype/data/site.js'), 'utf8'), ctx);
const S = ctx.window.GIANATO_SITE;
const OUT = path.join(__dirname, '..', 'migration'); fs.mkdirSync(OUT, { recursive: true });
const q = v => { const s = v == null ? '' : String(v); return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s; };
const csv = (head, rows) => [head, ...rows].map(r => r.map(q).join(',')).join('\n') + '\n';
const STYLE = { Mocassin: 'Mocassin', Bottine: 'Bottine', Basket: 'Basket cuir', Boucles: 'Soulier à boucles', Richelieu: 'Richelieu', Derby: 'Derby', Maroquinerie: 'Mallette' };

const head = ['Handle', 'Command',
  'Metafield: gianato.model [single_line_text_field]', 'Metafield: gianato.colorway [single_line_text_field]',
  'Metafield: gianato.color_family [single_line_text_field]', 'Metafield: gianato.swatch [color]',
  'Metafield: gianato.style [single_line_text_field]', 'Metafield: gianato.siblings [list.product_reference]',
  'Metafield: gianato.material [single_line_text_field]', 'Metafield: gianato.construction [single_line_text_field]',
  'Metafield: gianato.lining [single_line_text_field]', 'Metafield: gianato.sole [single_line_text_field]',
  'Metafield: gianato.dimensions [single_line_text_field]'];
const rows = C.products.map(p => [p.h, 'UPDATE', p.model, p.cw, p.family, p.swatch, STYLE[p.style] || '', p.siblings.join('\n'),
  p.facts.material || '', p.facts.construction || '', p.facts.lining || '', p.facts.sole || '', p.facts.dimensions || '']);
fs.writeFileSync(path.join(OUT, 'products-metafields.csv'), csv(head, rows));

const chead = ['Handle', 'Command', 'Metafield: gianato.intro [multi_line_text_field]'];
fs.writeFileSync(path.join(OUT, 'collections-metafields.csv'), csv(chead, C.collections.map(c => [c.h, 'UPDATE', c.intro])));

// Data-quality report
const P = C.products; const n = k => P.filter(k).length;
const noFacts = P.filter(p => !p.facts.material && !p.facts.construction && !p.isAcc).map(p => p.title);
const dupTitles = Object.entries(P.reduce((m, p) => ((m[p.title] = (m[p.title] || 0) + 1), m), {})).filter(([, k]) => k > 1).map(([t]) => t);
const handleMismatch = P.filter(p => { const h = p.h.replace(/-\d+$/, ''); return !h.split('-').some(w => p.title.toLowerCase().includes(w)); }).map(p => `${p.h} → ${p.title}`);
const report = `# Rapport données catalogue — GIANATO

Source : exports publics gianato.ma (${C.generated}). ${P.length} produits, ${new Set(P.map(p => p.model)).size} modèles (familles de couleurs).

| Indicateur | Valeur |
|---|---|
| Produits avec prix barré (compare_at) | ${n(p => p.compare)} / ${P.length} |
| Produits épuisés | ${n(p => !p.available)} |
| Matière identifiée dans la description | ${n(p => p.facts.material)} |
| « Cousu Blake » mentionné | ${n(p => p.facts.construction)} |
| Doublure mentionnée | ${n(p => p.facts.lining)} |
| Semelle mentionnée | ${n(p => p.facts.sole)} |
| Modèles à plusieurs couleurs | ${new Set(P.filter(p => p.siblings.length > 1).map(p => p.model)).size} |

## À corriger dans l'administration Shopify
- **Prix barrés permanents** : ${n(p => p.compare)} produits sur ${P.length} affichent un prix comparé. Le thème les affiche avec retenue, mais le Brand Book recommande de supprimer les prix comparés hors périodes de soldes.
- **Titres en double** : ${dupTitles.length ? dupTitles.join(', ') : 'aucun'}.
- **Handles incohérents avec le titre** (à conserver pour le SEO, mais à surveiller) : ${handleMismatch.slice(0, 15).join(' ; ')}${handleMismatch.length > 15 ? ' …' : ''}.
- **Fiches sans matière ni construction** (${noFacts.length}) — compléter les métachamps gianato.material / construction : ${noFacts.slice(0, 30).join(', ')}${noFacts.length > 30 ? ' …' : ''}.
- **Option de variante** : plusieurs nommages coexistent (« Pointure », « Choisir la pointure : », « Taille »). Harmoniser en « Pointure » pour un filtre unique.
- **Vendor** : « LOZANO », « Lozano », « Richilio », « GIANATO » — harmoniser si le fournisseur est utilisé en filtre.
- **Couleurs** : les noms de coloris (Cocoa, Gold, Marino…) sont conservés ; la famille de couleur française (gianato.color_family) alimente le filtre « Couleur ».
`;
fs.writeFileSync(path.join(OUT, 'rapport-donnees.md'), report);
console.log('products', rows.length, '| collections', C.collections.length, '| report ok');
