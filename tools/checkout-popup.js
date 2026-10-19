// node tools/checkout-popup.js — what happens on « Finaliser ma commande »: popups / overlays / new tabs / navigation
const { chromium } = require('playwright-core');
const runs = [
  ['NOUVEAU THÈME', 'https://gianato.ma/products/monte-cristo?preview_theme_id=165061886211', true],
  ['THÈME ACTUEL', 'https://gianato.ma/products/monte-cristo', false],
];
(async () => {
  const b = await chromium.launch({ channel: 'chrome' });
  for (const [label, url, mine] of runs) {
    const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
    const p = await ctx.newPage(); const events = [];
    ctx.on('page', np => events.push('NOUVEL ONGLET ' + np.url()));
    p.on('framenavigated', f => { if (f === p.mainFrame()) events.push('nav → ' + f.url().replace(/\?.*/, '').slice(0, 80)); });
    p.on('request', r => { if (/instagram|insta|social|widget|popup/i.test(r.url())) events.push('req ' + r.url().slice(0, 110)); });
    await p.goto(url, { waitUntil: 'networkidle', timeout: 90000 });
    if (mine) {
      await p.click('.sizes label:has(input:not(:disabled))'); await p.click('[data-add-main]');
      await p.waitForSelector('#cart.is-open', { timeout: 15000 }); await p.waitForTimeout(800);
      await p.screenshot({ path: 'qa/checkout-before-new.png' });
      events.push('--- clic « Finaliser ma commande »');
      await p.click('[data-checkout]');
    } else {
      // old theme: add to cart via its form, then go to /cart and press checkout
      await p.evaluate(async () => { const id = document.querySelector('form[action*="/cart/add"] [name="id"]')?.value; await fetch('/cart/add.js', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ items: [{ id: +id, quantity: 1 }] }) }); });
      await p.goto('https://gianato.ma/cart', { waitUntil: 'networkidle' });
      await p.screenshot({ path: 'qa/checkout-before-old.png' });
      events.push('--- clic checkout');
      const btn = p.locator('[name="checkout"], a[href*="checkout"], button:has-text("Commander"), button:has-text("Checkout")').first();
      await btn.click({ timeout: 10000 }).catch(e => events.push('pas de bouton checkout: ' + e.message.slice(0, 60)));
    }
    await p.waitForTimeout(4000);
    const overlay = await p.evaluate(() => [...document.querySelectorAll('body *')].filter(el => { const s = getComputedStyle(el); const r = el.getBoundingClientRect(); return (s.position === 'fixed' || s.position === 'absolute') && +s.zIndex > 1000 && r.width > 200 && r.height > 150 && s.visibility !== 'hidden' && s.display !== 'none' && +s.opacity > 0; }).map(el => `${el.tagName.toLowerCase()}#${el.id}.${[...el.classList].slice(0, 2).join('.')} "${(el.innerText || '').trim().slice(0, 70).replace(/\s+/g, ' ')}"`).slice(0, 4));
    await p.screenshot({ path: `qa/checkout-after-${mine ? 'new' : 'old'}.png` });
    console.log(`\n== ${label}\n${events.join('\n')}\nURL finale : ${p.url().replace(/\?.*/, '').slice(0, 90)}\nCalques visibles : ${overlay.join(' || ') || 'aucun'}`);
    await ctx.close();
  }
  await b.close();
})();
