const { execFileSync } = require('child_process');
const chrome = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const routes = ['/', '/notes', '/lab', '/flashcards', '/quiz', '/formulas', '/progress'];
for (const route of routes) {
  const url = `http://localhost:4173/#${route}`;
  let dom = '';
  try {
    dom = execFileSync(
      chrome,
      [
        '--headless=new',
        '--disable-gpu',
        '--no-first-run',
        '--no-default-browser-check',
        '--user-data-dir=C:\\Users\\MSI\\AppData\\Local\\Temp\\opencode\\chrome-smoke',
        '--dump-dom',
        url,
      ],
      { encoding: 'utf8', timeout: 45000, stdio: ['ignore', 'pipe', 'ignore'] },
    );
  } catch (error) {
    console.log(route, 'FAILED', error.message.slice(0, 200));
    continue;
  }
  const h1 = dom.match(/<h1[^>]*>([\s\S]*?)<\/h1>/);
  const headings = [...dom.matchAll(/<h2[^>]*>([\s\S]*?)<\/h2>/g)]
    .slice(0, 3)
    .map((match) => match[1].replace(/<[^>]+>/g, '').trim());
  console.log(
    route.padEnd(12),
    h1 ? h1[1].replace(/<[^>]+>/g, '').trim() : 'NO H1',
    '|',
    headings.join(' / '),
    '| chars',
    dom.length,
  );
}
