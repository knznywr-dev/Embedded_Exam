const fs = require('fs');
const css =
  fs.readFileSync('src/styles/lab.css', 'utf8') +
  fs.readFileSync('src/styles/labs-advanced.css', 'utf8') +
  fs.readFileSync('src/styles/content.css', 'utf8');
const names = [
  'timing-demo',
  'resolution-demo',
  'loop-demo',
  'fan-demo',
  'demo-caveat',
  'demo-foot',
  'demo-tabs',
  'flow-top',
  'flow-diagram',
  'flow-code',
  'smartled-demo',
  'temp-demo',
  'debug-demo',
  'debug-complete',
];
for (const name of names) {
  const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const count = (css.match(new RegExp(`\\.${escaped}(?![a-zA-Z0-9_-])`, 'g')) || []).length;
  console.log(name.padEnd(18), count);
}
