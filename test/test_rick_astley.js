const { MockError, assertThrows, fails, timeoutFail } = require("./utils");
const assert = require("assert");
const { default: rick, TimeoutError } = require("../lib");

// configure rick to not sleep between attempts, then pass through the other options
const r = (f, options) => rick(f, Object.assign({ sleepTime: 0 }, options));

describe("rick-astley", () => {
  it("returns the value of a non failing function", async () => {
    assert.equal(await r(() => 1), 1);
  });
  it("retries to call a failing function and return its value", async () => {
    const f = fails(2);
    assert.equal(await r(f), "done");
  });
  it("throws if max number of attempts has been reached", async () => {
    const f = fails(Infinity);
    await assertThrows(r(f), MockError);
  });
  it("throws if timeout has been reached", async () => {
    const f = fails(Infinity, timeoutFail(1000));
    await assertThrows(r(f, { timeout: 1 }), TimeoutError);
  });
});
