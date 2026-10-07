// Crude PDF text extractor (Flate streams, Tj/TJ operators): node tools/pdftext.js file.pdf
const fs = require('fs'), zlib = require('zlib');
const buf = fs.readFileSync(process.argv[2]); const s = buf.toString('latin1');
const out = []; const re = /stream\r?\n/g; let m;
while ((m = re.exec(s))) {
  const st = m.index + m[0].length; const en = s.indexOf('endstream', st); let d = buf.slice(st, en);
  try { d = zlib.inflateSync(d); } catch (e) { continue; }
  const t = d.toString('latin1'); if (!/T[Jj]/.test(t)) continue;
  const parts = []; const r2 = /\[(.*?)\]\s*TJ|\(((?:\\.|[^\\)])*)\)\s*Tj|(T\*|Td|TD|ET)/g; let k;
  while ((k = r2.exec(t))) {
    if (k[3]) { parts.push('\n'); continue; }
    if (k[1] !== undefined) { const ss = []; k[1].replace(/\(((?:\\.|[^\\)])*)\)|(-?\d+\.?\d*)/g, (a, b, c) => { if (b !== undefined) ss.push(b); else if (+c < -200) ss.push(' '); }); parts.push(ss.join('')); }
    else parts.push(k[2]);
  }
  out.push(parts.join('').replace(/\\(\d{3})/g, (a, o) => String.fromCharCode(parseInt(o, 8))).replace(/\\(.)/g, '$1').replace(/\n\s*\n+/g, '\n'));
}
console.log(out.join('\n=====\n'));
