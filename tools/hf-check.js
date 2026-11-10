const { chromium } = require('playwright-core');
(async () => {
  const b = await chromium.launch({ channel: 'chrome' });
  for (const w of [1440, 390]) {
    const p = await b.newPage({ viewport: { width: w, height: 900 } });
    const errs = []; p.on('pageerror', e => errs.push(e.message));
    await p.goto('https://gianato.ma/?_t=' + Date.now(), { waitUntil: 'domcontentloaded' });
    await p.waitForTimeout(2500);
    const r = await p.evaluate(() => {
      const sb = document.querySelector('.sale-banner');
      return {
        header: [...document.querySelectorAll('.header__end .nav-link')].map(a => a.textContent.trim() + ' → ' + a.getAttribute('href')),
        mobile: [...document.querySelectorAll('a.is-sale')].map(a => a.textContent.trim() + ' → ' + a.getAttribute('href')),
        banner: sb && { eyebrow: sb.querySelector('.eyebrow')?.textContent, title: sb.querySelector('h2')?.textContent.trim(), rate: sb.querySelector('.sale-banner__rate')?.textContent, cta: sb.querySelector('.btn')?.textContent + ' → ' + sb.querySelector('.btn')?.getAttribute('href'), img: !!sb.querySelector('img')?.complete },
        soldesLeft: document.body.innerHTML.includes('Soldes d’automne'),
      };
    });
    console.log(w, JSON.stringify(r, null, 1), 'errors', errs.length);
    if (w === 1440) await p.locator('.sale-banner').screenshot({ path: 'qa/live-hf-banner.png' });
    await p.close();
  }
  const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
  const resp = await p.goto('https://gianato.ma/collections/happy-friday', { waitUntil: 'domcontentloaded' });
  console.log('collection', resp.status(), await p.title());
  const data = await p.evaluate(async () => {
    const out = []; let page = 1;
    while (page < 6) {
      const r = await fetch('/collections/happy-friday/products.json?limit=250&page=' + page); if (!r.ok) return { err: r.status, out };
      const j = await r.json(); if (!j.products.length) break; out.push(...j.products); page++;
    }
    return { out };
  });
  if (data.err) console.log('json', data.err);
  const rr = data.out.map(x => { let best = 0; for (const v of x.variants) { const c = +v.compare_at_price, pr = +v.price; if (c > pr && v.available) best = Math.max(best, Math.round((1 - pr / c) * 100)); } return [best, x.handle]; }).sort((a, c) => c[0] - a[0]);
  console.log('products', rr.length, 'top', rr.slice(0, 6).map(r => r.join(' ')).join(' | '));
  console.log('dist', JSON.stringify(rr.reduce((a, r) => (a[r[0]] = (a[r[0]] || 0) + 1, a), {})));
  await b.close();
})();
