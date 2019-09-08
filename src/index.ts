export class TimeoutError extends Error {
  constructor() {
    super();
    Object.setPrototypeOf(this, TimeoutError.prototype);
  }
}

function _sleep(ms: number) {
  return new Promise(resolve => setTimeout(() => resolve(), ms));
}

export async function sleep(
  attempt: number,
  attemps: number,
  { sleepTime = 1000 } = {}
) {
  await _sleep(sleepTime);
}

async function throwTimeout(ms: number) {
  await _sleep(ms);
  throw new TimeoutError();
}

interface IOptions {
  attempts?: number;
  sleepFunc?: (
    attempt: number,
    attempts: number,
    options: IOptions
  ) => Promise<void>;
  sleepTime?: number;
  timeout?: number;
  errors?: Array<Function>;
}

export default async function rick(f: () => any, options: IOptions = {}) {
  const { attempts = 3, sleepFunc = sleep, timeout, errors } = options;
  let value;
  for (let attempt = 0; attempt < attempts; attempt++) {
    try {
      if (timeout) {
        value = await Promise.race([throwTimeout(timeout), f()]);
      } else {
        value = await f();
      }
    } catch (e) {
      if (errors && errors.filter(x => e instanceof x).length === 0) {
        throw e;
      }
      if (attempt + 1 === attempts) {
        throw e;
      }
      await sleepFunc(attempt, attempts, options);
    }
  }
  return value;
}
