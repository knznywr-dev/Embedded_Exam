const BASE = 'http://127.0.0.1:9222';

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

async function evaluate(send, expression) {
  const result = await send('Runtime.evaluate', {
    expression,
    awaitPromise: true,
    returnByValue: true,
  });
  if (result.exceptionDetails) throw new Error(result.exceptionDetails.text || 'Evaluation failed');
  return result.result.value;
}

const wait = (ms = 350) => new Promise((resolve) => setTimeout(resolve, ms));

async function main() {
  const { socket, send, events } = await connect();
  await send('Runtime.enable');
  await send('Page.enable');
  await send('Log.enable');

  const goto = async (route) => {
    await send('Page.navigate', { url: `http://localhost:4173/#${route}` });
    await wait(1000);
  };

  const snapshot = () =>
    evaluate(
      send,
      `JSON.stringify({
        h1: document.querySelector('h1')?.textContent?.trim(),
        h2: [...document.querySelectorAll('h2')].slice(0,4).map(e=>e.textContent.trim()),
        body: document.body.innerText.slice(0, 600),
        buttons: [...document.querySelectorAll('button')].map(e=>e.textContent.trim()).filter(Boolean).slice(0,30),
        inputs: [...document.querySelectorAll('input')].map(e=>({type:e.type,placeholder:e.placeholder,value:e.value}))
      }, null, 2)`,
    );

  await goto('/quiz');
  await evaluate(
    send,
    `[...document.querySelectorAll('button')].find(b=>b.textContent.includes('Start quiz')).click()`,
  );
  await wait(500);
  console.log('--- QUIZ START ---');
  console.log(await snapshot());

  await evaluate(
    send,
    `[...document.querySelectorAll('button')].find(b=>b.textContent.trim().startsWith('Check'))?.click()`,
  );
  await wait(400);
  console.log('--- AFTER CHECK ATTEMPT ---');
  console.log(await snapshot());

  // Select the first choice and inspect controls.
  await evaluate(send, `document.querySelector('.choice')?.click()`);
  await wait(250);
  console.log('--- AFTER CHOICE ---');
  console.log(await snapshot());

  await evaluate(
    send,
    `[...document.querySelectorAll('button')].find(b=>b.textContent.trim().startsWith('Check'))?.click()`,
  );
  await wait(500);
  console.log('--- AFTER CHECK ---');
  console.log(await snapshot());

  await goto('/flashcards');
  await evaluate(send, `document.querySelector('.flashcard')?.click()`);
  await wait(300);
  console.log('--- FLASHCARD FLIPPED ---');
  console.log(await snapshot());

  await goto('/lab');
  await evaluate(
    send,
    `[...document.querySelectorAll('button')].find(b=>b.textContent.includes('Mode Button'))?.click()`,
  );
  await wait(300);
  console.log('--- SMART LED AFTER MODE ---');
  console.log(
    await evaluate(
      send,
      `JSON.stringify({
        state: document.querySelector('.smartled-state-label')?.textContent,
        message: document.querySelector('.smartled-message')?.textContent,
        indicator: document.querySelector('.smartled-stage-copy h5')?.textContent
      })`,
    ),
  );

  const errors = events
    .filter(
      (event) =>
        event.method === 'Runtime.exceptionThrown' ||
        (event.method === 'Log.entryAdded' && event.params.entry.level === 'error') ||
        (event.method === 'Runtime.consoleAPICalled' && event.params.type === 'error'),
    )
    .map((event) => event.method);
  console.log('errors:', errors);
  socket.close();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
