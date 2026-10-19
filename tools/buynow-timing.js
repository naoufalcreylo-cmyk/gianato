// node tools/buynow-timing.js <themeId> [runs=3] — time from « Acheter maintenant » click to the Shopify checkout page
const { chromium } = require('playwright-core');
const [id, runs = '3'] = process.argv.slice(2);
(async () => {
  const b = await chromium.launch({ channel: 'chrome' });
  const times = [];
  for (let i = 0; i < +runs; i++) {
    const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
    const p = await ctx.newPage();
    await p.goto(`https://gianato.ma/products/monte-cristo?preview_theme_id=${id}`, { waitUntil: 'networkidle', timeout: 90000 });
    await p.click('.sizes label:has(input:not(:disabled))');
    const t0 = Date.now();
    let leftAt = 0; p.on('framenavigated', f => { if (f === p.mainFrame() && !leftAt) leftAt = Date.now() - t0; });
    const btnState = p.waitForFunction(() => document.querySelector('[data-buy-now]')?.getAttribute('aria-busy') === 'true', null, { timeout: 3000 }).then(() => Date.now() - t0).catch(() => null);
    await p.click('[data-buy-now]');
    await p.waitForURL(/checkouts\//, { timeout: 30000 });
    await p.waitForLoadState('domcontentloaded');
    const total = Date.now() - t0; const fb = await btnState;
    times.push(total);
    console.log(`essai ${i + 1}: retour visuel ${fb == null ? 'aucun' : fb + ' ms'} · quitte la fiche ${leftAt} ms · page de paiement affichée ${total} ms`);
    await ctx.close();
  }
  console.log('moyenne', Math.round(times.reduce((a, t) => a + t, 0) / times.length), 'ms');
  await b.close();
})();
