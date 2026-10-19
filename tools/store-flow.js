// node tools/store-flow.js <themeId> — checks built-in menus, footer, Maison/Service fallbacks and « Acheter maintenant » on the live store preview
const { chromium } = require('playwright-core');
const id = process.argv[2]; const B = 'https://gianato.ma';
const q = p => `${B}${p}${p.includes('?') ? '&' : '?'}preview_theme_id=${id}`;
(async () => {
  const b = await chromium.launch({ channel: 'chrome' });
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage(); const errs = [];
  page.on('pageerror', e => errs.push(e.message.slice(0, 140)));
  await page.goto(q('/'), { waitUntil: 'networkidle', timeout: 90000 });
  const nav = await page.evaluate(() => ({
    left: [...document.querySelectorAll('.header__nav .nav-link')].map(a => a.innerText.trim()),
    right: [...document.querySelectorAll('.header__end .nav-link')].map(a => a.innerText.trim()),
    footer: [...document.querySelectorAll('.footer__col h2')].map(h => h.innerText.trim()),
    legal: [...document.querySelectorAll('.footer__bottom ul a')].map(a => a.innerText.trim()),
  }));
  console.log('Menu gauche :', nav.left.join(' · '), '| droite :', nav.right.join(' · '));
  console.log('Pied de page :', nav.footer.join(' · '), '| légal :', nav.legal.join(' · '));
  await page.hover('[data-mega-trigger="souliers"]'); await page.waitForTimeout(700);
  console.log('Méga-menu Souliers :', await page.evaluate(() => [...document.querySelectorAll('#mega-souliers .mega__col a')].map(a => a.innerText).join(', ')));
  await page.screenshot({ path: 'qa/store-mega.png' });
  // all built-in links resolve
  const links = await page.evaluate(() => [...new Set([...document.querySelectorAll('.mega a, .footer__col a, .footer__bottom ul a, .header__nav a')].map(a => a.getAttribute('href')))]);
  const bad = [];
  for (const l of links) { const r = await ctx.request.get(new URL(l, B).href + (l.includes('?') ? '&' : '?') + `preview_theme_id=${id}`, { maxRedirects: 5 }); if (r.status() >= 400) bad.push(`${r.status()} ${l}`); }
  console.log(`Liens vérifiés : ${links.length}, en erreur : ${bad.length ? bad.join(' ; ') : 'aucun'}`);
  for (const p of ['/pages/cordonnerie?view=maison', '/pages/contact?view=service']) {
    await page.goto(q(p), { waitUntil: 'networkidle' });
    console.log(p, '→', await page.evaluate(() => (document.querySelector('h1')?.innerText || '').replace(/\n/g, ' ') + ' | sections: ' + document.querySelectorAll('main section').length));
    await page.screenshot({ path: `qa/store-${p.includes('maison') ? 'maison' : 'service'}.png` });
  }
  // Buy now
  await page.goto(q('/products/monte-cristo'), { waitUntil: 'networkidle' });
  const label = await page.evaluate(() => document.querySelector('[data-buy-now]')?.innerText);
  console.log('Bouton :', label, '| WhatsApp présent :', await page.evaluate(() => !!document.querySelector('[data-wa-product]')));
  await page.click('[data-buy-now]'); await page.waitForTimeout(800);
  console.log('Sans pointure → message :', await page.evaluate(() => document.querySelector('[data-size-hint]')?.innerText));
  await page.click('.sizes label:has(input:not(:disabled))');
  await Promise.all([page.waitForURL(/checkout|checkouts/, { timeout: 30000 }).catch(() => {}), page.click('[data-buy-now]')]);
  await page.waitForTimeout(1500);
  console.log('Après « Acheter maintenant » →', page.url().replace(/\?.*/, '').slice(0, 90));
  await page.screenshot({ path: 'qa/store-checkout.png' });
  console.log('Erreurs JS :', errs.length ? errs.join(' ; ') : 'aucune');
  await b.close();
})();
