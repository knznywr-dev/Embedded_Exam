const fs = require('fs');
const files = fs.readdirSync('src/features/lab').filter((f) => f.endsWith('.tsx'));
for (const file of files) {
  const source = fs.readFileSync(`src/features/lab/${file}`, 'utf8');
  const matches = [...source.matchAll(/className=\{?["'`]([^"'`]+)["'`]/g)]
    .map((match) => match[1])
    .filter((value) => /demo|flow/.test(value));
  console.log(file, JSON.stringify([...new Set(matches)]));
}
