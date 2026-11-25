const BASE = 'http://127.0.0.1:9222';

async function getPageTarget() {
  for (let attempt = 0; attempt < 40; attempt += 1) {
    try {
      const response = await fetch(`${BASE}/json/list`);
      const targets = await response.json();
      const page = targets.find((target) => target.type === 'page');
      if (page) return page;
    } catch {
      // Chrome is still starting.
    }
    await new Promise((resolve) => setTimeout(resolve, 250));
  }
  throw new Error('Could not find a Chrome page target');
}

async function connect() {
  const target = await getPageTarget();
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
    } else if (message.method) {
      events.push(message);
    }
  });

  const send = (method, params = {}) =>
    new Promise((resolve, reject) => {
      const id = (nextId += 1);
      pending.set(id, { resolve, reject });
      socket.send(JSON.stringify({ id, method, params }));
    });

  return { socket, send, events };
}

async function evaluate(send, expression) {
  const result = await send('Runtime.evaluate', {
    expression,
    awaitPromise: true,
    returnByValue: true,
  });
  if (result.exceptionDetails) {
    throw new Error(result.exceptionDetails.text || 'Evaluation failed');
  }
  return result.result.value;
}

async function goto(send, url) {
  await send('Page.navigate', { url });
  await new Promise((resolve) => setTimeout(resolve, 900));
}

async function main() {
  const { socket, send, events } = await connect();
  await send('Runtime.enable');
  await send('Page.enable');
  await send('Log.enable');

  const base = 'http://localhost:4173/';
  const results = [];

  async function check(name, fn) {
    try {
      const value = await fn();
      results.push({ name, ok: true, value });
    } catch (error) {
      results.push({ name, ok: false, value: error.message });
    }
  }

  async function pageInfo() {
    return evaluate(
      send,
      `JSON.stringify({
        h1: document.querySelector('h1')?.textContent?.trim() ?? null,
        h2: [...document.querySelectorAll('h2')].slice(0,3).map((el) => el.textContent.trim()),
        buttons: [...document.querySelectorAll('button, a.btn')].map((el) => el.textContent.trim()).filter(Boolean).slice(0, 45),
        body: document.body.innerText.slice(0, 180)
      })`,
    );
  }

  await goto(send, `${base}#/quiz`);
  await check('quiz setup info', async () => JSON.parse(await pageInfo()));

  const pageErrors = events
    .filter(
      (event) =>
        event.method === 'Runtime.exceptionThrown' ||
        (event.method === 'Log.entryAdded' && event.params.entry.level === 'error') ||
        (event.method === 'Runtime.consoleAPICalled' && event.params.type === 'error'),
    )
    .map((event) => event.method);

  console.log(JSON.stringify(results, null, 2));
  console.log('errors:', pageErrors);
  socket.close();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
