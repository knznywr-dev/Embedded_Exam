const fs = require('fs');
const path = require('path');

function walk(dir) {
  return fs
    .readdirSync(dir, { withFileTypes: true })
    .flatMap((entry) =>
      entry.isDirectory() ? walk(path.join(dir, entry.name)) : [path.join(dir, entry.name)],
    );
}

const files = walk('src').filter((file) => /\.(tsx|ts)$/.test(file) && !file.endsWith('.test.ts'));
const css =
  walk('src/styles')
    .filter((file) => file.endsWith('.css'))
    .map((file) => fs.readFileSync(file, 'utf8'))
    .join('\n') + fs.readFileSync('src/styles.css', 'utf8');

const classes = new Set();
for (const file of files) {
  const source = fs.readFileSync(file, 'utf8');
  for (const match of source.matchAll(/className=(?:"([^"]*)"|\{`([^`]*)`\}|\{'([^']*)'\})/g)) {
    const value = match[1] || match[2] || match[3] || '';
    for (const token of value.split(/\s+/)) {
      if (/^[a-zA-Z][a-zA-Z0-9_-]*$/.test(token)) classes.add(token);
    }
  }
}

const missing = [...classes]
  .filter((className) => {
    const escaped = className.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return !new RegExp(`\\.${escaped}(?:[^a-zA-Z0-9_-]|$)`).test(css);
  })
  .sort();

console.log(`classes: ${classes.size}, missing: ${missing.length}`);
console.log(missing.join('\n'));
