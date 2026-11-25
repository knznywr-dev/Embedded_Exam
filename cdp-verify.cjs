const fs = require('fs');
const path = require('path');
const BASE = 'http://127.0.0.1:9222';
const OUT = 'C:\\Users\\MSI\\AppData\\Local\\Temp\\opencode\\reviewer-shots';

async function connect() {
  let target;
  for (let attempt = 0; attempt < 40; attempt += 1) {
    try {
      const response = await fetch(`${BASE}/json/list`);
      const targets = await response.json();
      target = targets.find((item) => item.type === 'page');
      if (target) break;
    } catch {}
    await new Promise((resolve) => setTimeout(resolve, 250));
  }
  const socket = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((resolve, reject) => {
    socket.addEventListener('open', resolve, { once: true });
    socket.addEventListener('error', reject, { once: true });
  });
  let nextId = 0;
  const pending = new Map();
  const events = [];
  socket.addEventListener('message', (event) => {
    const message = JSON.parse(event.data);
    if (message.id && pending.has(message.id)) {
      const { resolve, reject } = pending.get(message.id);
      pending.delete(message.id);
      if (message.error) reject(new Error(message.error.message));
      else resolve(message.result);
    } else if (message.method) events.push(message);
  });
  const send = (method, params = {}) =>
    new Promise((resolve, reject) => {
      const id = (nextId += 1);
      pending.set(id, { resolve, reject });
      socket.send(JSON.stringify({ id, method, params }));
    });
  return { socket, send, events };
}

const wait = (ms = 500) => new Promise((resolve) => setTimeout(resolve, ms));

async function main() {
  const { socket, send, events } = await connect();
  await send('Runtime.enable');
  await send('Page.enable');
  await send('Log.enable');

  const evaluate = async (expression) => {
    const result = await send('Runtime.evaluate', {
      expression,
      awaitPromise: true,
      returnByValue: true,
    });
    if (result.exceptionDetails) throw new Error(result.exceptionDetails.text);
    return result.result.value;
  };
  const shot = async (name) => {
    const result = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(OUT, `${name}.png`), Buffer.from(result.data, 'base64'));
  };

  await send('Emulation.setDeviceMetricsOverride', {
    width: 390,
    height: 844,
    deviceScaleFactor: 2,
    mobile: true,
  });
  await send('Page.navigate', { url: 'http://localhost:4173/#/' });
  await wait(1000);
  await evaluate(`localStorage.clear()`);
  await send('Page.reload');
  await wait(1300);
  await shot('mobile2-dashboard');

  console.log(
    'bottom nav:',
    await evaluate(
      `JSON.stringify({ count: document.querySelectorAll('.mobile-bottom-nav a').length, labels: [...document.querySelectorAll('.mobile-bottom-nav a')].map(a=>a.textContent.trim()), visible: getComputedStyle(document.querySelector('.mobile-bottom-nav')).display })`,
    ),
  );

  await evaluate(`document.querySelector('.mobile-menu-button').click()`);
  await wait(450);
  await shot('mobile2-drawer');
  console.log(
    'drawer:',
    await evaluate(
      `JSON.stringify({ open: !!document.querySelector('.drawer'), links: document.querySelectorAll('.drawer .nav-link').length, closeFocused: document.activeElement?.getAttribute('aria-label') })`,
    ),
  );
  await evaluate(`document.querySelector('.drawer .icon-button').click()`);
  await wait(250);

  await evaluate(
    `[...document.querySelectorAll('.mobile-bottom-nav a')].find(a => a.textContent.includes('Quiz')).click()`,
  );
  await wait(900);
  console.log(
    'bottom nav quiz:',
    await evaluate(
      `JSON.stringify({ hash: location.hash, h1: document.querySelector('h1')?.textContent.trim(), active: document.querySelector('.mobile-bottom-nav a.is-active')?.textContent.trim() })`,
    ),
  );
  await shot('mobile2-quiz');

  await evaluate(
    `[...document.querySelectorAll('.mobile-bottom-nav a')].find(a => a.textContent.includes('Lab')).click()`,
  );
  await wait(900);
  await shot('mobile2-lab');

  // Desktop flashcard stats + search clear-on-choose.
  await send('Emulation.setDeviceMetricsOverride', {
    width: 1440,
    height: 900,
    deviceScaleFactor: 1,
    mobile: false,
  });
  await send('Page.navigate', { url: 'http://localhost:4173/#/flashcards' });
  await wait(1000);
  await shot('desktop2-flashcards');
  console.log(
    'flashcard stat boxes:',
    await evaluate(
      `JSON.stringify([...document.querySelectorAll('.flashcard-stat')].map(el => ({ label: el.querySelector('span')?.textContent, width: Math.round(el.getBoundingClientRect().width), top: Math.round(el.getBoundingClientRect().top) })))`,
    ),
  );

  await evaluate(
    `(() => { const input = document.querySelector('#global-search-input'); const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set; input.focus(); setter.call(input, 'delay'); input.dispatchEvent(new Event('input', { bubbles: true })); })()`,
  );
  await wait(400);
  const resultCount = await evaluate(`document.querySelectorAll('.search-result').length`);
  await evaluate(`document.querySelector('.search-result')?.click()`);
  await wait(600);
  console.log(
    'search after choose:',
    await evaluate(
      `JSON.stringify({ results: ${resultCount}, hash: location.hash, value: document.querySelector('#global-search-input')?.value, open: !!document.querySelector('.search-results') })`,
    ),
  );

  const errors = events
    .filter(
      (event) =>
        event.method === 'Runtime.exceptionThrown' ||
        (event.method === 'Log.entryAdded' && event.params.entry.level === 'error'),
    )
    .map((event) => (event.params?.entry?.text || event.method).slice(0, 160));
  console.log('errors:', errors);
  socket.close();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
