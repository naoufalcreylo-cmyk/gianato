// node tools/live-buy-matrix.js [chromium|webkit] — add-to-cart / buy-now on several product types, LIVE site (no order placed)
const pw = require('playwright-core');
const engine = process.argv[2] || 'chromium';
const cases = [
  ['urban', 'add'], ['edmond', 'add'], ['mallette-gianapro', 'add'], ['monte-cristo', 'buybar'], ['monte-cristo', 'buy'], ['loro-gold', 'nosize'],
];
(async () => {
  const b = engine === 'webkit' ? await pw.webkit.launch() : await pw.chromium.launch({ channel: 'chrome' });
  for (const [h, mode] of cases) {
    const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2,
      userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1' });
    const p = await ctx.newPage(); const errs = []; let added = 0;
    p.on('pageerror', e => { if (!/Visitor|Endpoint/.test(e.message)) errs.push(e.message.slice(0, 140)); });
    p.on('response', r => { if (/cart\/add/.test(r.url())) added = r.status(); });
    await p.goto(`https://gianato.ma/products/${h}?_cb=${Date.now()}`, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await p.waitForTimeout(3500);
    const hasSizes = await p.locator('.sizes label:has(input:not(:disabled))').count();
    if (mode !== 'nosize' && hasSizes) await p.locator('.sizes label:has(input:not(:disabled))').first().tap();
    await p.waitForTimeout(300);
    try {
      if (mode === 'buybar') { await p.evaluate(() => scrollTo(0, 2500)); await p.waitForTimeout(800); await p.locator('[data-buybar-add]').tap(); }
      else if (mode === 'buy') await p.locator('[data-buy-now]').tap();
      else await p.locator('[data-add-main]').tap();
    } catch (e) { errs.push('TAP ' + e.message.slice(0, 100)); }
    await p.waitForTimeout(4500);
    const r = await p.evaluate(() => ({ url: location.pathname.slice(0, 40), cart: document.querySelector('#cart')?.classList.contains('is-open'), hint: document.querySelector('[data-size-hint]')?.innerText?.slice(0, 60), formErr: document.querySelector('[data-form-error]:not([hidden])')?.innerText })).catch(() => ({ url: new URL(p.url()).pathname.slice(0, 40) }));
    const ok = mode === 'nosize' ? /pointure/i.test(r.hint || '') : (r.cart || /checkouts/.test(r.url));
    console.log(`${ok ? '✓' : '✗'} ${engine} ${h} [${mode}] tailles=${hasSizes} add.js=${added || '-'} → ${JSON.stringify(r)}${errs.length ? ' ERR ' + errs.join(' | ') : ''}`);
    await p.screenshot({ path: `qa/matrix-${engine}-${h}-${mode}.png` });
    await ctx.close();
  }
  await b.close();
})();
