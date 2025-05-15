self.console = {
  log: (...args) => postMessage({ type: 'log', data: args }),
  warn: (...args) => postMessage({ type: 'warn', data: args }),
  error: (...args) => postMessage({ type: 'error', data: args }),
};


self.onmessage = (event) => {
  try {
    const code = event.data;
    const func = new Function(code);
    func();
    postMessage({ type: 'done' });
  } catch (error) {
    self.console.error(error.message);
    postMessage({ type: 'done' });
  }
};