// node tools/sweep.js — horizontal overflow + JS errors for every template at every target width
const { chromium } = require('playwright-core');
const U = 'http://localhost:4180/';
const pages = ['', 'collection.html?c=mocassin', 'collection.html?q=derby', 'product.html?p=monte-cristo-cocoa', 'product.html?p=mallette-gianapro', 'maison.html', 'service.html'];
const widths = [375, 390, 430, 768, 1024, 1280, 1440, 1920];
(async () => {
  const b = await chromium.launch({ channel: 'chrome' });
  let bad = 0;
  for (const w of widths) {
    const ctx = await b.newContext({ viewport: { width: w, height: 900 }, hasTouch: w < 1024, isMobile: w < 768 });
    for (const p of pages) {
      const page = await ctx.newPage(); const errs = [];
      page.on('pageerror', e => errs.push(e.message));
      await page.goto(U + p, { waitUntil: 'networkidle' });
      const r = await page.evaluate(() => {
        const vw = document.documentElement.clientWidth; const off = [];
        document.querySelectorAll('body *').forEach(el => {
          const rc = el.getBoundingClientRect(); if (!rc.width) return;
          if (el.closest('.hero, .rail, .gallery, .craft-grid, .plp-sub, .search__panel, .drawer__panel, .mega, .layer, .announce, .lightbox, .size-table, [style*="overflow"]')) return;
          if (rc.right > vw + 1 || rc.left < -1) off.push(`${el.tagName.toLowerCase()}.${[...el.classList].join('.')} ${Math.round(rc.left)}→${Math.round(rc.right)}`);
        });
        return { scroll: document.documentElement.scrollWidth - vw, off: off.slice(0, 4) };
      });
      const flag = r.scroll > 0 || r.off.length || errs.length;
      if (flag) bad++;
      console.log(`${flag ? '✗' : '✓'} ${w}px /${p} overflow=${r.scroll}${r.off.length ? ' ' + r.off.join(' | ') : ''}${errs.length ? ' ERR ' + errs.join(';') : ''}`);
      await page.close();
    }
    await ctx.close();
  }
  console.log(bad ? `\n${bad} problème(s)` : '\nAucun débordement, aucune erreur.');
  await b.close();
})();
