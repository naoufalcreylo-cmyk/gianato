// node tools/probe.js <url> <js-expression> [width]
const { chromium } = require('playwright-core');
(async () => {
  const [url, expr, w = '1440'] = process.argv.slice(2);
  const b = await chromium.launch({ channel: 'chrome' });
  const p = await b.newPage({ viewport: { width: +w, height: 900 } });
  const logs = []; p.on('console', m => logs.push(m.type() + ': ' + m.text().slice(0, 200))); p.on('pageerror', e => logs.push('ERR ' + e.message));
  p.on('requestfailed', r => logs.push('FAIL ' + r.url().slice(0, 140) + ' ' + r.failure()?.errorText));
  p.on('response', r => { if (r.status() >= 400) logs.push(r.status() + ' ' + r.url().slice(0, 140)); });
  await p.goto(url, { waitUntil: 'networkidle' }); await p.waitForTimeout(800);
  console.log(JSON.stringify(await p.evaluate(expr), null, 1)); console.log(logs.join('\n'));
  await b.close();
})();
