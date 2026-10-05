import { expect, test } from "bun:test";

test("client lifecycle cleanup and queued theme persistence follow Solid 2 semantics", async () => {
  const child = Bun.spawn(
    [
      process.execPath,
      "--conditions=browser",
      new URL("./client-lifecycle.fixture.ts", import.meta.url).pathname
    ],
    {
      stdout: "pipe",
      stderr: "pipe"
    }
  );
  const [exitCode, stderr] = await Promise.all([child.exited, new Response(child.stderr).text()]);
  expect(stderr).toBe("");
  expect(exitCode).toBe(0);
});
