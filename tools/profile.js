// Profile the Shopify product export
const parse = require('./csv.js');
const rows = parse(require('fs').readFileSync('C:/Users/HP/Downloads/all_products_gianato.ma.csv', 'utf8'));
console.log('rows', rows.length); const by = {};
rows.forEach(r => { (by[r.Handle] = by[r.Handle] || []).push(r); });
const hs = Object.keys(by); console.log('products', hs.length);
const cnt = (o, k) => { o[k] = (o[k] || 0) + 1; };
const st = {}, ty = {}, o1 = {}, o2 = {}, o3 = {}, tags = {}, vend = {};
hs.forEach(h => { const f = by[h][0]; cnt(st, f.Status + '/' + f.Published); cnt(ty, f.Type); cnt(o1, f['Option1 Name']); cnt(o2, f['Option2 Name']); cnt(o3, f['Option3 Name']); cnt(vend, f.Vendor); f.Tags.split(',').map(s => s.trim()).filter(Boolean).forEach(t => cnt(tags, t)); });
console.log({ st, ty, o1, o2, o3, vend });
console.log(Object.entries(tags).sort((a, b) => b[1] - a[1]).slice(0, 120).map(x => x.join(':')).join(' | '));
const act = hs.filter(h => by[h][0].Status == 'active');
console.log('active', act.length);
act.slice(0, 40).forEach(h => { const v = by[h]; console.log(h, '|', v[0].Title, '|', v[0].Type, '|', v.filter(x => x['Variant Price']).map(x => [x['Option1 Value'], x['Option2 Value']].join('/') + ':' + x['Variant Price'] + '/' + x['Variant Compare At Price'] + ' q' + x['Variant Inventory Qty']).slice(0, 3).join(' ; '), '| imgs', v.filter(x => x['Image Src']).length); });
