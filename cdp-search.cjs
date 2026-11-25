const BASE = 'http://127.0.0.1:9222';

async function main() {
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
  const evaluate = async (expression) => {
    const result = await send('Runtime.evaluate', {
      expression,
      awaitPromise: true,
      returnByValue: true,
    });
    return result.result.value;
  };

  await send('Page.navigate', { url: 'http://localhost:4173/#/notes' });
  await new Promise((resolve) => setTimeout(resolve, 900));
  for (const query of ['delay', '30.0', 'INPUT_PULLUP', 'D10']) {
    await evaluate(
      `(() => { const input = document.querySelector('#global-search-input'); const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set; input.focus(); setter.call(input, ${JSON.stringify(query)}); input.dispatchEvent(new Event('input', { bubbles: true })); })()`,
    );
    await new Promise((resolve) => setTimeout(resolve, 350));
    const titles = await evaluate(
      `[...document.querySelectorAll('.search-result')].slice(0,6).map(el => el.querySelector('strong')?.textContent + ' [' + el.querySelector('.search-type')?.textContent + ']')`,
    );
    console.log(query, titles);
    await evaluate(
      `document.querySelector('.search-clear').click()`,
    );
    await new Promise((resolve) => setTimeout(resolve, 200));
  }
  socket.close();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
