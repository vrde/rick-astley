const assert = require("assert");
const { rick } = require("../");

async function assertThrows(f, spec) {
  let error;
  try {
    await f();
  } catch (e) {
    error = e;
    if (spec !== undefined) {
      for (let key in spec) {
        assert.equal(e[key], spec[key]);
      }
    }
  }
  if (!error) {
    assert.fail();
  }
}

describe("rick-astley", () => {
  it("does his thing", async () => {
    assert.equal(await rick(() => 1), 1);

    const fails = times => () => {
      if (times-- > 0) {
        const e = new Error(`${times + 1} attempt(s) left`);
        e.type = "fail";
        throw e;
      }
      return "done";
    };
    assert.equal(await rick(fails(2), { sleepTime: 0 }), "done");

    await assertThrows(async () => await rick(fails(3), { sleepTime: 0 }), {
      type: "fail"
    });
  });
});
