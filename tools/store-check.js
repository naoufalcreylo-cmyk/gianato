// node tools/store-check.js <previewThemeId> [width] — renders key pages of the live store with an unpublished theme
// and reports Liquid errors, JS errors, failed requests; saves screenshots to qa/store-*.png
const { chromium } = require('playwright-core');
const [id, w = '1440'] = process.argv.slice(2);
const BASE = 'https://gianato.ma';
const pages = ['/', '/collections/mocassin', '/products/monte-cristo', '/search?q=monte&type=product', '/cart', '/pages/la-maison', '/collections/derby?filter.v.availability=1'];
(async () => {
  const b = await chromium.launch({ channel: 'chrome' });
  const ctx = await b.newContext({ viewport: { width: +w, height: 900 }, isMobile: +w < 768, hasTouch: +w < 1024 });
  const p0 = await ctx.newPage();
  await p0.goto(`${BASE}/?preview_theme_id=${id}`, { waitUntil: 'domcontentloaded', timeout: 60000 }); // sets the preview cookie
  for (const [i, path] of pages.entries()) {
    const page = await ctx.newPage(); const errs = [];
    page.on('pageerror', e => errs.push('JS ' + e.message.slice(0, 160)));
    page.on('response', r => { if (r.status() >= 400 && /gianato\.ma|cdn\/shop/.test(r.url())) errs.push(r.status() + ' ' + r.url().slice(0, 110)); });
    const res = await page.goto(BASE + path + (path.includes('?') ? '&' : '?') + `preview_theme_id=${id}`, { waitUntil: 'networkidle', timeout: 90000 }).catch(e => ({ status: () => 'ERR ' + e.message.slice(0, 80) }));
    await page.waitForTimeout(1200);
    const r = await page.evaluate(() => ({
      theme: window.Shopify?.theme?.name, liquid: (document.body.innerText.match(/Liquid (syntax )?error[^\n]{0,140}/gi) || []).slice(0, 3),
      h1: document.querySelector('h1')?.innerText.slice(0, 60), header: !!document.querySelector('[data-header]'), cards: document.querySelectorAll('.card').length,
      overflow: document.documentElement.scrollWidth - innerWidth,
    }));
    await page.screenshot({ path: `qa/store-${w}-${i}.png` });
    console.log(`${res.status()} ${path} | thème: ${r.theme} | h1: ${r.h1} | header: ${r.header} | cartes: ${r.cards} | overflow: ${r.overflow}${r.liquid.length ? ' | LIQUID: ' + r.liquid.join(' / ') : ''}${errs.length ? ' | ' + [...new Set(errs)].slice(0, 4).join(' ; ') : ''}`);
    await page.close();
  }
  await b.close();
})();
