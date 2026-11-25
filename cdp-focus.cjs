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

const wait = (ms = 400) => new Promise((resolve) => setTimeout(resolve, ms));

async function main() {
  const { socket, send, events } = await connect();
  await send('Runtime.enable');
  await send('Page.enable');
  await send('Log.enable');

  const goto = async (route) => {
    await send('Page.navigate', { url: `http://localhost:4173/#${route}` });
    await wait(1000);
  };
  const evalValue = (expression) => evaluate(send, expression);
  const clickIncludes = (text, selector = 'button') =>
    evalValue(
      `(() => { const el = [...document.querySelectorAll(${JSON.stringify(selector)})].find((e) => e.textContent.trim().includes(${JSON.stringify(text)})); if (!el) return 'NOT FOUND'; el.click(); return el.textContent.trim(); })()`,
    );

  await goto('/quiz');
  await clickIncludes('Start quiz');
  await wait(500);
  await evalValue(`document.querySelector('.choice').click()`);
  await wait(250);
  await clickIncludes('Finish quiz');
  await wait(300);
  console.log('CONFIRM:', await evalValue(`document.querySelector('.quiz-finish-prompt')?.textContent`));
  console.log('CONFIRM BUTTONS:', await evalValue(`[...document.querySelectorAll('.quiz-finish-prompt button')].map(e=>e.textContent.trim())`));
  await clickIncludes('Finish anyway');
  await wait(900);
  console.log('AFTER FINISH MAIN:', await evalValue(`document.querySelector('main').innerText.slice(0, 900)`));
  console.log('RESULT CARDS:', await evalValue(`[...document.querySelectorAll('h2')].map(e=>e.textContent.trim())`));
  console.log('QUIZ STORAGE:', await evalValue(`localStorage.getItem('embedded-reviewer:v1:quiz')?.slice(0, 300)`));
  console.log('ERRORS:', events.filter((event) => event.method === 'Runtime.exceptionThrown').map((event) => event.method));

  await goto('/notes?module=m4b');
  console.log('NOTES BUTTONS:', await evalValue(`[...document.querySelectorAll('button')].map(e=>e.textContent.trim())`));
  await goto('/notes');
  console.log('NOTES ALL BUTTONS:', await evalValue(`[...document.querySelectorAll('button')].slice(0, 25).map(e=>e.textContent.trim())`));

  socket.close();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
