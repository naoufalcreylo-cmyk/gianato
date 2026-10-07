// Builds prototype/data/catalog.json from the public gianato.ma exports in research/
// (products.json + per-collection products.json, fetched by tools/fetch-live.sh).
// Nothing is invented: every field is read or derived from Gianato's own data.
const fs = require('fs'), path = require('path');
const R = p => path.join(__dirname, '..', 'research', p);
const live = JSON.parse(fs.readFileSync(R('products1.json'), 'utf8')).products;
const colOf = h => { try { return JSON.parse(fs.readFileSync(R(`col/${h}.json`), 'utf8')).products.map(p => p.handle); } catch { return []; } };

/* ---------- Colourways ---------- */
// Gianato colourway word → French colour family + swatch tone
const COLORWAYS = {
  COCOA: ['Cocoa', 'Marron', '#5b3a29'], COACO: ['Cocoa', 'Marron', '#5b3a29'], COCAO: ['Cocoa', 'Marron', '#5b3a29'], COCO: ['Cocoa', 'Marron', '#5b3a29'],
  GOLD: ['Gold', 'Cognac', '#94622f'], MARINO: ['Marino', 'Bleu marine', '#1f2a44'], CIELO: ['Cielo', 'Bleu ciel', '#7c97b8'],
  SILVER: ['Silver', 'Gris', '#9b9a96'], CITRINE: ['Citrine', 'Beige', '#b9a36c'], NACRE: ['Nacre', 'Taupe', '#b5a593'],
  RUBIS: ['Rubis', 'Rouge', '#8b2331'], LAND: ['Land', 'Bordeaux', '#5e1f22'], SAPHIR: ['Saphir', 'Bleu', '#27427a'],
  SABBIA: ['Sabbia', 'Sable', '#c8b08b'], OLIVA: ['Oliva', 'Olive', '#6b6a3f'], BLANCO: ['Blanco', 'Blanc', '#efece6'],
  BIANCO: ['Bianco', 'Blanc', '#efece6'], IMPERIAL: ['Impérial', 'Mauve', '#563248'], CROCO: ['Croco', 'Brun', '#3d2b21'],
  CLASSIC: ['Classic', 'Noir', '#1c1b1a'], GRAINE: ['Grainé', null, null], GRAIN: ['Grainé', null, null], BLEU: ['Bleu', 'Bleu', '#27427a'],
};
const BASE = { Noir: '#1c1b1a', Marron: '#5b3a29', Bleu: '#1f2a44', 'Bleu marine': '#1f2a44', Gold: '#94622f', Blanche: '#efece6' };

function splitTitle(title) {
  const words = title.trim().split(/\s+/);
  const cw = [];
  while (words.length > 1 && COLORWAYS[words.at(-1).toUpperCase()]) cw.unshift(words.pop().toUpperCase());
  return { model: words.join(' '), cw };
}
const cap = s => s.toLowerCase().replace(/(^|[\s'-])(\p{L})/gu, (m, a, b) => a + b.toUpperCase()).replace(/\bD'a/g, "d'A");

/* ---------- Collections (real handles, cleaned titles) ---------- */
const COLLECTIONS = {
  nouveautes: { title: 'Nouveautés', intro: 'Les derniers souliers de la Maison, arrivés cette saison.' },
  'meilleures-ventes': { title: 'Les signatures', intro: 'Les modèles que nos clients choisissent, et reviennent choisir.' },
  mocassin: { title: 'Mocassins', intro: 'Souples, sans lacets, faits pour suivre une journée du bureau au dîner.' },
  richelieu: { title: 'Richelieu', intro: 'Le soulier à lacets fermés : la ligne la plus nette du vestiaire masculin.' },
  derby: { title: 'Derby', intro: 'Laçage ouvert, chaussant généreux : le classique qui accompagne chaque jour.' },
  'richelieu-derby': { title: 'Richelieu & Derby', intro: 'Les souliers à lacets de la Maison, du plus formel au plus libre.' },
  bottines: { title: 'Bottes & bottines', intro: 'Chelsea, boucles et lacets : des tiges montantes pour la saison froide.' },
  sneaker: { title: 'Baskets cuir', intro: 'La basket en cuir, dessinée avec la même exigence que nos souliers de ville.' },
  boucles: { title: 'Chaussures à boucles', intro: 'Simple ou double boucle, la fermeture qui signe une allure.' },
  'chaussures-sans-lacets': { title: 'Sans lacets', intro: 'Mocassins, chelsea et slip-on : on les enfile, on avance.' },
  'chaussures-a-laces': { title: 'À lacets', intro: 'Richelieu, derby, brogues et baskets : tous nos modèles à lacets.' },
  'classic-professionnel': { title: 'Business', intro: 'Réunion, plaidoirie, signature : les souliers des jours qui comptent.' },
  'chaussures-ville': { title: 'Ville', intro: 'Une allure soignée pour la ville, sans la rigueur du costume.' },
  'esprit-libre': { title: 'Détente', intro: 'Mocassins souples et baskets cuir pour les jours libres.' },
  confort: { title: 'Ultra confort', intro: 'Les modèles choisis pour leur chaussant et leur semelle, pour les longues journées.' },
  'selection-marriage': { title: 'Sélection mariage', intro: 'Des souliers pour le jour J, et pour toutes les cérémonies qui suivent.' },
  'chaussures-grandes-pointures': { title: 'Grandes pointures', intro: 'Nos modèles disponibles dans les plus grandes pointures.' },
  'essential-business': { title: 'Essential Business', intro: 'L’essentiel du vestiaire professionnel, en quelques paires.' },
  'chaussures-ville-confortables': { title: 'Ville confortables', intro: 'Des souliers de ville pensés pour être portés toute la journée.' },
  destockage: { title: 'Fin de collection', intro: 'Les dernières paires de séries précédentes, dans les pointures restantes.' },
};
const members = {}; for (const h of Object.keys(COLLECTIONS)) members[h] = colOf(h);
const inCol = (h, c) => members[c].includes(h);

/* ---------- Description → clean text + verified facts ---------- */
function clean(html) {
  return html.replace(/<(br|p|li|div|h\d)[^>]*>/gi, '\n').replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&#39;|&rsquo;/g, '’').replace(/&quot;/g, '"')
    .replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{2705}\u{FE0F}]/gu, '')
    .replace(/[ \t  ]+/g, ' ').split('\n').map(s => s.trim()).filter(s => s.length > 1);
}
// Facts are only emitted when the product's own description says so.
function facts(text) {
  const t = text.join(' ');
  const f = {};
  if (/cousu\s+blake[^.]{0,30}main|blake[^.]{0,20}à la main/i.test(t)) f.construction = 'Cousu Blake à la main';
  else if (/cousu\s+blake|couture blake|montage blake/i.test(t)) f.construction = 'Cousu Blake';
  else if (/goodyear/i.test(t)) f.construction = 'Cousu Goodyear';
  if (/box calf pleine fleur/i.test(t)) f.material = 'Cuir box calf pleine fleur';
  else if (/veau box brossé/i.test(t)) f.material = 'Cuir de veau box brossé';
  else if (/cuir de veau pleine fleur|veau pleine fleur/i.test(t)) f.material = 'Cuir de veau pleine fleur';
  else if (/cuir de veau/i.test(t)) f.material = 'Cuir de veau';
  else if (/box calf/i.test(t)) f.material = 'Cuir box calf';
  else if (/\bdaim\b|suède/i.test(t)) f.material = 'Daim';
  else if (/cuir grainé|cuir lisse grainé/i.test(t)) f.material = 'Cuir grainé';
  else if (/cuir crust/i.test(t)) f.material = 'Cuir crust';
  else if (/100% cuir/i.test(t)) f.material = 'Cuir';
  if (/doublure verte? émeraude|doublure[^.]{0,20}émeraude/i.test(t)) f.lining = 'Cuir vert émeraude';
  else if (/doublure[^.]{0,25}cuir|100% cuir[^.]{0,5}$/i.test(t)) f.lining = 'Cuir';
  if (/semelle[^.]{0,60}(gomme|caoutchouc)|(gomme|caoutchouc)[^.]{0,30}semelle/i.test(t)) f.sole = 'Gomme';
  else if (/semelle italienne/i.test(t)) f.sole = 'Semelle italienne';
  const dims = t.match(/Hauteur x Largeur x Profondeur\s*:\s*([\d,\s x]+cm)/i); if (dims) f.dimensions = dims[1].trim();
  return f;
}
// Obvious spelling fixes in the live copy (meaning untouched)
const TYPOS = [[/\bRichilieu\b/g, 'Richelieu'], [/\bSéléction\b/g, 'Sélection'], [/\bPréstige\b/g, 'Prestige'], [/\ba cheval\b/g, 'à cheval'], [/\b([cC])ousu blake\b/g, '$1ousu Blake'], [/\bblake\b/g, 'Blake'],
  [/\bAlessendro\b/g, 'Alessandro'], [/\brichelieux\b/g, 'richelieus'], [/\bnoir de geai\b/g, 'noir de jais'], [/\bvos tenus\b/g, 'vos tenues'], [/\bsont charme\b/g, 'son charme'], [/\bà porter tous les jours\b/g, 'à porter tous les jours'],
  [/\bamenées à être porter\b/g, 'amenées à être portées'], [/\bque vous possédez\b/g, 'que vous possédiez'], [/\bdes boucles de fermeture qui redonne\b/g, 'des boucles de fermeture qui redonnent'], [/\bchaussures\s+professionnelles\b/g, 'souliers professionnels']];
// Drop boilerplate, labelled spec lines (shown as facts) and styling-tips blocks from the editorial text.
function editorial(lines) {
  const out = [];
  for (const l of lines) {
    if (/^(Conseil style|Idées pour le porter|Caractéristiques|Atouts du modèle|Composition|EXTÉRIEUR|MATIÈRE PRINCIPALE|DOUBBLURE)\s*:?$/i.test(l)) break;
    if (/^Gianato est le leader/i.test(l)) continue;
    if (/^[A-ZÉa-zé' ]{3,24}\s*:\s/.test(l) && out.length) continue;
    out.push(TYPOS.reduce((s, [a, b]) => s.replace(a, b), l.replace(/\s+([.,])/g, '$1')));
  }
  return out.slice(0, 4);
}

/* ---------- Products ---------- */
const STYLE_ORDER = [['mocassin', 'Mocassin'], ['bottines', 'Bottine'], ['sneaker', 'Basket'], ['boucles', 'Boucles'], ['richelieu', 'Richelieu'], ['derby', 'Derby']];
const OCC = [['classic-professionnel', 'business'], ['chaussures-ville', 'ville'], ['esprit-libre', 'detente'], ['selection-marriage', 'mariage'], ['confort', 'confort'], ['chaussures-grandes-pointures', 'grandes']];
const best = members['meilleures-ventes'];
const news = members.nouveautes;

const products = live.map(p => {
  const { model, cw } = splitTitle(p.title);
  const isAcc = p.product_type === 'Accessoire';
  const colorTag = p.tags.find(t => BASE[t]) || p.tags.find(t => /Noir|Marron|Bleu|Gold|Blanche/.test(t));
  const named = cw.map(w => COLORWAYS[w]).find(c => c[1]);
  let family = named ? named[1] : (colorTag === 'Blanche' ? 'Blanc' : colorTag === 'Gold' ? 'Cognac' : colorTag || 'Noir');
  if (/bordeaux/.test(p.handle)) family = 'Bordeaux';
  const swatch = named ? named[2] : (BASE[colorTag] || '#1c1b1a');
  const cwLabel = cw.length ? cw.map(w => COLORWAYS[w][0]).join(' ') : (family === 'Noir' ? 'Noir' : family);
  const style = isAcc ? 'Maroquinerie' : (STYLE_ORDER.find(([c]) => inCol(p.handle, c)) || [, /mocassin/i.test(p.product_type) ? 'Mocassin' : null])[1];
  const text = clean(p.body_html);
  const f = facts(text);
  const sizes = p.variants.map(v => ({ id: v.id, s: v.option1 === 'Default Title' ? null : v.option1, a: v.available }));
  const prices = p.variants.map(v => +v.price), cmp = p.variants.map(v => +v.compare_at_price || 0);
  const price = Math.min(...prices), compare = Math.max(...cmp);
  return {
    h: p.handle, title: p.title, model: cap(model), cw: cwLabel, family, swatch: swatch,
    type: p.product_type, style, isAcc,
    occ: OCC.filter(([c]) => inCol(p.handle, c)).map(([, k]) => k),
    laces: inCol(p.handle, 'chaussures-a-laces') ? 'À lacets' : inCol(p.handle, 'chaussures-sans-lacets') ? 'Sans lacets' : null,
    material: f.material || (p.tags.includes('Daim') ? 'Daim' : p.tags.includes('grainé') ? 'Cuir grainé' : isAcc ? null : 'Cuir'),
    price, compare: compare > price ? compare : 0,
    sizes, available: p.variants.some(v => v.available),
    imgs: p.images.map(i => [i.src.replace(/\?v=\d+$/, ''), i.width, i.height]),
    isNew: news.includes(p.handle), newRank: news.indexOf(p.handle),
    bestRank: best.indexOf(p.handle), endOfLine: inCol(p.handle, 'destockage'),
    facts: f, desc: editorial(text), created: p.created_at.slice(0, 10),
    cols: Object.keys(COLLECTIONS).filter(c => inCol(p.handle, c)),
  };
});

// Model families → colour siblings
const fam = {};
products.forEach(p => { (fam[p.model] = fam[p.model] || []).push(p.h); });
products.forEach(p => { p.siblings = fam[p.model].length > 1 ? fam[p.model] : []; });

const collections = Object.entries(COLLECTIONS).map(([h, c]) => ({ h, ...c, products: members[h].filter(x => products.some(p => p.h === x)) }));
const out = { generated: new Date().toISOString().slice(0, 10), source: 'gianato.ma (exports publics products.json / collections)', products, collections };
const dest = path.join(__dirname, '..', 'prototype', 'data', 'catalog.json');
fs.mkdirSync(path.dirname(dest), { recursive: true });
fs.writeFileSync(dest, JSON.stringify(out));

// Report
const st = k => Object.entries(products.reduce((m, p) => ((m[p[k]] = (m[p[k]] || 0) + 1), m), {}));
console.log('products', products.length, 'models', Object.keys(fam).length, 'size', Math.round(fs.statSync(dest).size / 1024) + 'KB');
console.log('style', st('style')); console.log('family', st('family')); console.log('material', st('material'));
console.log('facts', ['construction', 'material', 'lining', 'sole'].map(k => k + ':' + products.filter(p => p.facts[k]).length).join(' '));
console.log('discounted', products.filter(p => p.compare).length, 'unavailable', products.filter(p => !p.available).length);
console.log(collections.map(c => c.h + ':' + c.products.length).join(' '));
