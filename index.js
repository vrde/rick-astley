function sleep(attempt, attemps, { sleepTime = 1000 } = {}) {
  return new Promise(resolve => setTimeout(() => resolve(), sleepTime));
}

async function rick(f, options = {}) {
  const { attempts = 3, sleepFunc = sleep } = options;
  for (let attempt = 0; attempt < attempts; attempt++) {
    try {
      const v = await f();
      return v;
    } catch (e) {
      if (attempt + 1 === attempts) {
        console.log(e);
        throw e;
      }
      await sleepFunc(attempt, attempts, options);
    }
  }
}

module.exports = {
  rick,
  sleep
};
