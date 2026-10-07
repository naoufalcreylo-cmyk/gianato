// Brand book text via pdf.js: node tools/pdftext2.mjs file.pdf
import { getDocument } from 'pdfjs-dist/legacy/build/pdf.mjs';
import fs from 'fs';
const doc = await getDocument({ data: new Uint8Array(fs.readFileSync(process.argv[2])) }).promise;
for (let i = 1; i <= doc.numPages; i++) {
  const p = await doc.getPage(i); const tc = await p.getTextContent();
  console.log(`--- p${i}\n` + tc.items.map(t => t.str + (t.hasEOL ? '\n' : ' ')).join('').replace(/[ ]+/g, ' '));
}
