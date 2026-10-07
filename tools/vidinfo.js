const { chromium } = require('playwright-core'); const path = require('path'); const fs = require('fs');
(async () => {
  const b = await chromium.launch({ channel: 'chrome', args: ['--allow-file-access-from-files', '--autoplay-policy=no-user-gesture-required'] });
  const p = await b.newPage({ viewport: { width: 400, height: 400 } });
  await p.goto('file:///' + path.resolve('tools/crop.html').split(path.sep).join('/'));
  for (const f of process.argv.slice(2)) {
    const r = await p.evaluate(async (u) => { const v = document.createElement('video'); v.muted = true; v.src = u; document.body.append(v);
      await new Promise((ok, ko) => { v.onloadedmetadata = ok; v.onerror = () => ko(new Error('err ' + (v.error && v.error.code))); });
      const out = { w: v.videoWidth, h: v.videoHeight, d: v.duration, frames: [] };
      for (const t of [0.15, 0.4, 0.7]) { v.currentTime = v.duration * t; await new Promise(ok => v.onseeked = ok);
        const c = document.createElement('canvas'); c.width = v.videoWidth / 4; c.height = v.videoHeight / 4; c.getContext('2d').drawImage(v, 0, 0, c.width, c.height); out.frames.push(c.toDataURL('image/jpeg', .7)); }
      v.remove(); return out; }, 'file:///' + f).catch(e => ({ err: e.message }));
    console.log(f, r.w, r.h, r.d, r.err || '');
    (r.frames || []).forEach((d, i) => fs.writeFileSync(`research/sheets/${path.basename(f)}-${i}.jpg`, Buffer.from(d.split(',')[1], 'base64')));
  }
  await b.close();
})();
