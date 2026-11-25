const fs = require('fs');
const path = require('path');
const BASE = 'http://127.0.0.1:9222';
const OUT = 'C:\\Users\\MSI\\AppData\\Local\\Temp\\opencode\\reviewer-shots';

async function connect() {
  const response = await fetch(`${BASE}/json/list`);
  const targets = await response.json();
  const target = targets.find((item) => item.type === 'page');
  const socket = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((resolve, reject) => {
    socket.addEventListener('open', resolve, { once: true });
    socket.addEventListener('error', reject, { once: true });
  });
  let nextId = 0;
  const pending = new Map();
  socket.addEventListener('message', (event) => {
    const message = JSON.parse(event.data);
    if (message.id && pending.has(message.id)) {
      const { resolve } = pending.get(message.id);
      pending.delete(message.id);
      resolve(message.result);
    }
  });
  const send = (method, params = {}) =>
    new Promise((resolve) => {
      const id = (nextId += 1);
      pending.set(id, { resolve });
      socket.send(JSON.stringify({ id, method, params }));
    });
  return { socket, send };
}

const wait = (ms = 500) => new Promise((resolve) => setTimeout(resolve, ms));

async function main() {
  const { socket, send } = await connect();
  await send('Runtime.enable');
  await send('Page.enable');
  const evaluate = async (expression) => {
    const result = await send('Runtime.evaluate', {
      expression,
      awaitPromise: true,
      returnByValue: true,
    });
    return result.result.value;
  };
  const shot = async (name) => {
    const result = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(OUT, `${name}.png`), Buffer.from(result.data, 'base64'));
  };

  await send('Emulation.setDeviceMetricsOverride', {
    width: 1440,
    height: 900,
    deviceScaleFactor: 1,
    mobile: false,
  });
  await send('Page.navigate', { url: 'http://localhost:4173/#/quiz' });
  await wait(1000);
  await evaluate(
    `[...document.querySelectorAll('button')].find(b => b.textContent.includes('Start quiz')).click()`,
  );
  await wait(600);
  await shot('desktop2-quiz-running');
  await evaluate(`document.querySelector('.choice').click()`);
  await wait(250);
  await shot('desktop2-quiz-answered');

  await send('Page.navigate', { url: 'http://localhost:4173/#/lab#lab-smartled' });
  await wait(1200);
  await shot('desktop2-lab-smartled');
  console.log(
    'smartled visible:',
    await evaluate(
      `JSON.stringify({ top: Math.round(document.querySelector('#lab-smartled')?.getBoundingClientRect().top ?? -1), state: document.querySelector('.smartled-state-label')?.textContent })`,
    ),
  );

  await send('Page.navigate', { url: 'http://localhost:4173/#/lab#lab-temperature' });
  await wait(1200);
  await shot('desktop2-lab-temperature');
  console.log(
    'temperature visible:',
    await evaluate(
      `JSON.stringify({ top: Math.round(document.querySelector('#lab-temperature')?.getBoundingClientRect().top ?? -1), status: document.querySelector('.temp-status')?.textContent })`,
    ),
  );

  socket.close();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
