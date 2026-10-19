// node tools/live-buy-debug.js [handle] — diagnose « Ajouter au panier » / « Acheter maintenant » on the LIVE site (no order placed)
const { chromium } = require('playwright-core');
const handle = process.argv[2] || 'loro-gold';
(async () => {
  const b = await chromium.launch({ channel: 'chrome' });
  for (const [label, vp, mob] of [['MOBILE', { width: 390, height: 844 }, true], ['DESKTOP', { width: 1440, height: 900 }, false]]) {
    for (const btn of ['[data-add-main]', '[data-buy-now]']) {
      const ctx = await b.newContext({ viewport: vp, isMobile: mob, hasTouch: mob });
      const p = await ctx.newPage(); const log = [];
      p.on('pageerror', e => log.push('JSERR ' + e.message.slice(0, 160)));
      p.on('console', m => { if (m.type() === 'error' && !/Visitor|Endpoint|Failed to load resource/.test(m.text())) log.push('CONSOLE ' + m.text().slice(0, 140)); });
      p.on('request', r => { if (/cart\/add|\/cart\/\d|checkout/.test(r.url())) log.push(`REQ ${r.method()} ${r.url().replace('https://gianato.ma', '').slice(0, 80)}`); });
      p.on('response', r => { if (/cart\/add/.test(r.url())) log.push(`RES ${r.status()} ${r.url().replace('https://gianato.ma', '').slice(0, 60)}`); });
      p.on('framenavigated', f => { if (f === p.mainFrame()) log.push('NAV ' + f.url().replace(/\?.*/, '').slice(0, 80)); });
      await p.goto(`https://gianato.ma/products/${handle}?_cb=${Date.now()}`, { waitUntil: 'domcontentloaded', timeout: 60000 });
      await p.waitForTimeout(3500);
      log.length = 0;
      const state = await p.evaluate(() => ({
        theme: window.Shopify?.theme?.name,
        sizes: document.querySelectorAll('.sizes input:not(:disabled)').length,
        form: !!document.querySelector('[data-product-form]'),
        variantInput: document.querySelector('[data-variant-input]')?.value,
        hint: document.querySelector('[data-size-hint]')?.innerText,
      }));
      await p.click('.sizes label:has(input:not(:disabled))');
      await p.waitForTimeout(400);
      const afterSize = await p.evaluate(() => document.querySelector('[data-variant-input]')?.value);
      await p.click(btn).catch(e => log.push('CLICK FAIL ' + e.message.slice(0, 100)));
      await p.waitForTimeout(5000);
      const end = await p.evaluate(() => {
        const ov = [...document.querySelectorAll('body *')].filter(el => { const s = getComputedStyle(el); const r = el.getBoundingClientRect(); return (s.position === 'fixed') && +s.zIndex > 100 && r.width > 200 && r.height > 150 && s.display !== 'none' && s.visibility !== 'hidden' && +s.opacity > 0.1; })
          .map(el => `${el.tagName.toLowerCase()}#${el.id}.${[...el.classList].slice(0, 2).join('.')}`).slice(0, 4);
        return { url: location.href.replace(/\?.*/, '').slice(0, 70), cartOpen: document.querySelector('#cart')?.classList.contains('is-open'), count: document.querySelector('[data-cart-count]')?.innerText, hint: document.querySelector('[data-size-hint]')?.innerText, err: document.querySelector('[data-form-error]:not([hidden])')?.innerText, btnText: document.querySelector('[data-buy-now]')?.innerText, overlays: ov };
      }).catch(() => ({ url: p.url().replace(/\?.*/, '') }));
      console.log(`\n== ${label} ${btn} | ${JSON.stringify(state)} | variante après pointure: ${afterSize}`);
      console.log(log.join('\n') || '(aucune requête / navigation)');
      console.log('FIN', JSON.stringify(end));
      await p.screenshot({ path: `qa/livebug-${label}-${btn.includes('buy') ? 'buy' : 'add'}.png` });
      await ctx.close();
    }
  }
  await b.close();
})();
