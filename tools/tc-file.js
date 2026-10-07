// Theme-check a scratch copy of the theme with one file replaced: node tools/tc-file.js <relpath> <replacement-file>
const fs = require('fs'), path = require('path'), os = require('os');
const { themeCheckRun } = require('@shopify/theme-check-node');
(async () => {
  const [rel, repl] = process.argv.slice(2);
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'tc-'));
  fs.cpSync(path.join(__dirname, '..', 'theme'), tmp, { recursive: true });
  fs.copyFileSync(repl, path.join(tmp, rel));
  const { offenses } = await themeCheckRun(tmp, undefined, () => {});
  console.log(offenses.filter(o => o.uri.includes(rel)).map(o => `${o.check} ${(o.start?.line ?? 0) + 1} ${o.message}`).join('\n') || 'clean');
})();
