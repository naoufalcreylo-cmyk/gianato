// node tools/live-search-debug.js — can a visitor type in the search overlay? (LIVE site)
const pw = require('playwright-core');
(async () => {
  for (const [engine, vp, mob] of [['webkit', { width: 390, height: 844 }, true], ['chromium', { width: 1440, height: 900 }, false]]) {
    const b = engine === 'webkit' ? await pw.webkit.launch() : await pw.chromium.launch({ channel: 'chrome' });
    const ctx = await b.newContext({ viewport: vp, isMobile: mob, hasTouch: mob });
    const p = await ctx.newPage(); const errs = [];
    p.on('pageerror', e => { if (!/Visitor|Endpoint|Blocked a frame/.test(e.message)) errs.push(e.message.slice(0, 120)); });
    await p.goto('https://gianato.ma/?_cb=' + Date.now(), { waitUntil: 'domcontentloaded', timeout: 60000 });
    await p.waitForTimeout(3500);
    const sel = mob ? '.header__search-m' : '.header__tools [data-open-search]';
    if (mob) await p.locator(sel).tap(); else await p.click(sel);
    await p.waitForTimeout(900);
    const r = await p.evaluate(() => {
      const q = document.querySelector('#q'); const rc = q.getBoundingClientRect();
      const top = document.elementFromPoint(rc.left + 40, rc.top + rc.height / 2);
      return { ouvert: document.querySelector('#search')?.classList.contains('is-open'), focus: document.activeElement === q, auPremierPlan: top === q ? 'CHAMP DE RECHERCHE' : `${top?.tagName}.${[...(top?.classList || [])].slice(0, 2).join('.')} (${top?.closest('.section-header') ? 'en-tête' : top?.closest('#search') ? 'recherche' : '?'})`, y: Math.round(rc.top) };
    });
    // try typing like a user: tap the field then type
    const q = p.locator('#q');
    try { if (mob) await q.tap({ timeout: 3000 }); else await q.click({ timeout: 3000 }); } catch (e) { r.clic = 'IMPOSSIBLE (' + e.message.split('\n')[0].slice(0, 90) + ')'; }
    await p.keyboard.type('monte', { delay: 40 }); await p.waitForTimeout(1500);
    r.texteSaisi = await p.evaluate(() => document.querySelector('#q').value);
    r.résultats = await p.evaluate(() => document.querySelectorAll('#search-results .search__product').length);
    console.log(engine, JSON.stringify(r), errs.length ? 'ERR ' + errs.join(' | ') : '');
    await p.screenshot({ path: `qa/live-search-${engine}.png` });
    await b.close();
  }
})();
