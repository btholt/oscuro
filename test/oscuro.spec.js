const oscuro = require("../");

test("reads one file", async () => {
  const ans = await oscuro(["./test/test1.json"]);
  expect(ans).toMatchSnapshot();
});

test("reads two files, both exist, returns first extant one", async () => {
  const ans = await oscuro(["./test/test1.json", "./test/test2.json"]);
  expect(ans).toMatchSnapshot();
});

test("reads two files, first exists, returns first extant one", async () => {
  const ans = await oscuro(["./test/test1.json", "./test/doesntExist.json"]);
  expect(ans).toMatchSnapshot();
});

test("reads two files, none exist, returns default", async () => {
  const ans = await oscuro(
    ["./test/doesntExist.json", "./test/alsoDoesntExist.json"],
    {
      defaultResponse: { success: true }
    }
  );
  expect(ans).toMatchSnapshot();
});

test("reads two files, second exists, returns first extant one", async () => {
  const ans = await oscuro(["./test/doesntExist.json", "./test/test1.json"]);
  expect(ans).toMatchSnapshot();
});

test("reads yaml", async () => {
  const ans = await oscuro(["./test/yamltest.yaml", "./test/test1.json"]);
  expect(ans).toMatchSnapshot();
});

test("reads js", async () => {
  const ans = await oscuro(["./test/jstest.js", "./test/test1.json"]);
  expect(ans).toMatchSnapshot();
});

test("handles js files not found", async () => {
  const ans = await oscuro(["./test/not-real.js", "./test/test1.json"]);
  expect(ans).toMatchSnapshot();
});

test("handles js paths", async () => {
  const ans = await oscuro([
    { path: "./test/jstest.js", key: "other" },
    "./test/test1.json"
  ]);
  expect(ans).toMatchSnapshot();
});

test("returns undefined when no default is given and no paths are found", async () => {
  const ans = await oscuro(["./not-real.json", "./also-not-real.json"]);
  expect(ans).toBeUndefined();
});

test("reads html", async () => {
  const ans = await oscuro(["./test/htmltest.html", "./also-not-real.json"]);
  expect(ans).toMatchSnapshot();
});

test("handles objects", async () => {
  const ans = await oscuro([
    { path: "./test/test1.json" },
    "./also-not-real.json"
  ]);
  expect(ans).toMatchSnapshot();
});

test("will read json as text", async () => {
  const ans = await oscuro([
    { path: "./test/test1.json", type: "text" },
    "./also-not-real.json"
  ]);
  expect(ans).toMatchSnapshot();
});

test("will read a dot file as json", async () => {
  const ans = await oscuro([{ path: "./test/.testdotfile", type: "json" }]);
  expect(ans).toMatchSnapshot();
});

test("will give you back only a key within the file", async () => {
  const ans = await oscuro([
    { path: "./test/test1.json", type: "json", key: "thing.cool.neat" }
  ]);
  expect(ans).toMatchSnapshot();
});

test("reads one file, returns path", async () => {
  const ans = await oscuro(["./test/test1.json"], { returnPathOnly: true });
  expect(ans).toBe("./test/test1.json");
});

test("reads two files, both exist, returns first extant one, returns path", async () => {
  const ans = await oscuro(["./test/test1.json", "./test/test2.json"], {
    returnPathOnly: true
  });
  expect(ans).toBe("./test/test1.json");
});

test("reads two files, second exists, returns first extant one, returns path", async () => {
  const ans = await oscuro(["./test/doesntExist.json", "./test/test1.json"], {
    returnPathOnly: true
  });
  expect(ans).toBe("./test/test1.json");
});

test("handles paths and keys when key exists", async () => {
  const pathObj = { path: "./test/test1.json", key: "thing.cool" };
  const ans = await oscuro([pathObj], {
    returnPathOnly: true
  });
  expect(ans).toBe(pathObj);
});

test("handles paths and keys when path exists but key doesn't", async () => {
  const pathObj = { path: "./test/test1.json", key: "not.real" };
  const ans = await oscuro([pathObj], {
    returnPathOnly: true
  });
  expect(ans).toBeUndefined();
});
