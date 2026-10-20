// node tools/sale-visual.js — renders tools/sale-visual.html to PNG (2x) + webp for the theme / prototype
const { chromium } = require('playwright-core'); const path = require('path'); const fs = require('fs');
(async () => {
  const b = await chromium.launch({ channel: 'chrome', args: ['--allow-file-access-from-files'] });
  const p = await b.newPage({ viewport: { width: 1600, height: 1200 }, deviceScaleFactor: 1 });
  await p.goto('file:///' + path.resolve(__dirname, 'sale-visual.html').split(path.sep).join('/'));
  await p.evaluate(() => window.ready); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(600);
  await p.screenshot({ path: 'research/sale/sale-visual.png', clip: { x: 0, y: 0, width: 1600, height: 1200 } });
  // webp export through canvas
  const data = await p.evaluate(async () => {
    const r = await fetch(location.href.replace('tools/sale-visual.html', 'research/sale/sale-visual.png')); const blob = await r.blob();
    const bmp = await createImageBitmap(blob); const c = document.createElement('canvas'); c.width = bmp.width; c.height = bmp.height;
    c.getContext('2d').drawImage(bmp, 0, 0); return c.toDataURL('image/webp', 0.86);
  });
  for (const out of ['prototype/assets/img/sale-autumn.webp', 'theme/assets/editorial-sale-autumn.webp']) fs.writeFileSync(out, Buffer.from(data.split(',')[1], 'base64'));
  console.log('ok', Math.round(fs.statSync('theme/assets/editorial-sale-autumn.webp').size / 1024) + ' KB');
  await b.close();
})();
