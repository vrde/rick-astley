const assert = require("assert");

class MockError extends Error {}

function sleep(ms) {
  return new Promise(resolve => setTimeout(() => resolve(), ms));
}

async function assertThrows(f, errorType) {
  let error;
  try {
    await f;
  } catch (e) {
    error = e;
    assert(error instanceof errorType, `${error} doesn't match ${errorType}`);
  }
  if (!error) {
    assert.fail(`Function doesn't throw ${errorType.name}`);
  }
}

// Doesn't need to be async, keeping it for "clarity".
const simpleFail = async attempt => {
  const e = new MockError(`${attempt} attempt(s) left`);
  throw e;
};

const timeoutFail = sleepTime => async attempt => {
  await sleep(sleepTime);
};

const fails = (times, failFunc = simpleFail) => async () => {
  if (times > 0) {
    times--;
    await failFunc(times);
  }
  return "done";
};

module.exports = {
  MockError,
  assertThrows,
  simpleFail,
  timeoutFail,
  fails
};
