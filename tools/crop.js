// Crop / resize images with Chrome canvas (no native deps).
// node tools/crop.js <jobs.json>   jobs: [{ src, out, x, y, w, h (fractions 0..1 of source), width (output px), q }]
// node tools/crop.js --info files...  → prints natural sizes
const { chromium } = require('playwright-core'); const fs = require('fs'); const path = require('path');
const url = f => 'file:///' + path.resolve(f).split(path.sep).join('/');
(async () => {
  const args = process.argv.slice(2);
  const b = await chromium.launch({ channel: 'chrome', args: ['--allow-file-access-from-files'] });
  const p = await b.newPage();
  await p.goto(url(path.join(__dirname, 'crop.html')));
  if (args[0] === '--info') {
    for (const f of args.slice(1)) console.log(f, await p.evaluate(async u => { const i = new Image(); i.src = u; await i.decode(); return i.naturalWidth + 'x' + i.naturalHeight; }, url(f)));
  } else {
    for (const j of JSON.parse(fs.readFileSync(args[0], 'utf8'))) {
      const data = await p.evaluate(async ({ u, j }) => {
        const i = new Image(); i.src = u; await i.decode();
        const sx = (j.x || 0) * i.naturalWidth, sy = (j.y || 0) * i.naturalHeight, sw = (j.w || 1) * i.naturalWidth, sh = (j.h || 1) * i.naturalHeight;
        const W = Math.min(j.width || sw, sw), H = Math.round(W * sh / sw);
        const c = document.createElement('canvas'); c.width = W; c.height = H;
        const ctx = c.getContext('2d'); ctx.imageSmoothingQuality = 'high'; ctx.drawImage(i, sx, sy, sw, sh, 0, 0, W, H);
        // tint: recolour every opaque pixel, keeping alpha (logo colour variants)
        if (j.tint) { ctx.globalCompositeOperation = 'source-in'; ctx.fillStyle = j.tint; ctx.fillRect(0, 0, W, H); }
        // pad: centre the crop on a square transparent canvas (favicon)
        if (j.square) { const s = document.createElement('canvas'); s.width = s.height = j.square; const k = j.square * 0.84 / Math.max(W, H);
          s.getContext('2d').drawImage(c, (j.square - W * k) / 2, (j.square - H * k) / 2, W * k, H * k); return s.toDataURL('image/png'); }
        return c.toDataURL(j.out.endsWith('.png') ? 'image/png' : j.out.endsWith('.webp') ? 'image/webp' : 'image/jpeg', j.q || 0.82);
      }, { u: url(j.src), j });
      fs.mkdirSync(path.dirname(j.out), { recursive: true });
      fs.writeFileSync(j.out, Buffer.from(data.split(',')[1], 'base64'));
      console.log(j.out, Math.round(fs.statSync(j.out).size / 1024) + 'KB');
    }
  }
  await b.close();
})();
