// node tools/perf.js — LCP / CLS / transfer for key pages (mobile 390 with 4× CPU throttle + fast 4G, desktop 1440)
const { chromium } = require('playwright-core');
const U = 'http://localhost:4180/';
const pages = ['', 'collection.html?c=mocassin', 'product.html?p=monte-cristo-cocoa'];
(async () => {
  const b = await chromium.launch({ channel: 'chrome' });
  for (const [label, vp, mobile] of [['mobile', { width: 390, height: 844 }, true], ['desktop', { width: 1440, height: 900 }, false]]) {
    for (const p of pages) {
      const ctx = await b.newContext({ viewport: vp, isMobile: mobile, hasTouch: mobile, deviceScaleFactor: mobile ? 2 : 1 });
      const page = await ctx.newPage();
      const cdp = await ctx.newCDPSession(page);
      if (mobile) {
        await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });
        await cdp.send('Network.enable');
        await cdp.send('Network.emulateNetworkConditions', { offline: false, latency: 150, downloadThroughput: 1.6 * 1024 * 1024 / 8 * 4, uploadThroughput: 750 * 1024 / 8 });
      }
      await page.addInitScript(() => {
        window.__lcp = 0; window.__cls = 0;
        new PerformanceObserver(l => l.getEntries().forEach(e => { window.__lcp = e.startTime; window.__lcpEl = (e.element && (e.element.currentSrc || e.element.className || e.element.tagName)) || ''; })).observe({ type: 'largest-contentful-paint', buffered: true });
        new PerformanceObserver(l => l.getEntries().forEach(e => { if (!e.hadRecentInput) window.__cls += e.value; })).observe({ type: 'layout-shift', buffered: true });
      });
      await page.goto(U + p, { waitUntil: 'load' }); await page.waitForTimeout(2500);
      const r = await page.evaluate(() => ({ lcp: Math.round(window.__lcp), cls: +window.__cls.toFixed(3), el: String(window.__lcpEl).slice(-60), kb: Math.round(performance.getEntriesByType('resource').reduce((s, e) => s + (e.transferSize || 0), 0) / 1024) }));
      console.log(`${label.padEnd(7)} /${p.padEnd(36)} LCP ${String(r.lcp).padStart(5)} ms  CLS ${r.cls}  ${r.kb} KB  [${r.el}]`);
      await ctx.close();
    }
  }
  await b.close();
})();
