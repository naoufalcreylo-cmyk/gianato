// node tools/frames.js <video> <outPrefix> t1 t2 ... (seconds) → full-res JPEG frames
const { chromium } = require('playwright-core'); const path = require('path'); const fs = require('fs');
(async () => {
  const [f, pre, ...ts] = process.argv.slice(2);
  const b = await chromium.launch({ channel: 'chrome', args: ['--allow-file-access-from-files'] });
  const p = await b.newPage();
  await p.goto('file:///' + path.resolve(__dirname, 'crop.html').split(path.sep).join('/'));
  const frames = await p.evaluate(async ({ u, ts }) => { const v = document.createElement('video'); v.muted = true; v.src = u;
    await new Promise(ok => v.onloadeddata = ok); const out = [];
    for (const t of ts) { v.currentTime = +t; await new Promise(ok => v.onseeked = ok);
      const c = document.createElement('canvas'); c.width = v.videoWidth; c.height = v.videoHeight; c.getContext('2d').drawImage(v, 0, 0); out.push(c.toDataURL('image/jpeg', .9)); }
    return out; }, { u: 'file:///' + f, ts });
  frames.forEach((d, i) => { const o = `${pre}-${ts[i]}.jpg`; fs.writeFileSync(o, Buffer.from(d.split(',')[1], 'base64')); });
  console.log(frames.length, 'frames'); await b.close();
})();
