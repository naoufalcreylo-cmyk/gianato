const { chromium } = require('playwright-core');
(async () => {
  const b = await chromium.launch({ channel: 'chrome' });
  const ctx = await b.newContext({ viewport: { width: 375, height: 900 }, hasTouch: true, isMobile: true });
  const p = await ctx.newPage(); await p.goto(process.argv[2], { waitUntil: 'networkidle' });
  console.log(await p.evaluate(() => { const vw = document.documentElement.clientWidth; const r = [vw, document.documentElement.scrollWidth];
    document.querySelectorAll('body *').forEach(el => { if (getComputedStyle(el).position === 'fixed' || el.closest('.layer,.mega,.rail,.gallery,.craft-grid,.plp-sub')) return; const rc = el.getBoundingClientRect(); if (rc.right > vw + .5) r.push(el.tagName + '.' + el.className + ' ' + Math.round(rc.right)); });
    return r.slice(0, 14); }));
  await b.close();
})();
