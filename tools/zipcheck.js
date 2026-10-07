// node tools/zipcheck.js <file.zip> — lists entry count and flags backslash paths (Shopify rejects them)
const z = require('fs').readFileSync(process.argv[2]);
const sig = Buffer.from([0x50, 0x4b, 0x01, 0x02]);
let i = 0; const names = [];
while ((i = z.indexOf(sig, i)) >= 0) { const len = z.readUInt16LE(i + 28); names.push(z.slice(i + 46, i + 46 + len).toString()); i += 46; }
const bad = names.filter(n => n.includes(String.fromCharCode(92)));
console.log('entries', names.length, '| backslash paths', bad.length, '| sample', names.filter(n => n.includes('/')).slice(0, 3).join(' , ') || bad.slice(0, 3).join(' , '));
