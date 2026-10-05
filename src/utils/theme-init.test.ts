import { expect, test } from "bun:test";
import { runInNewContext } from "node:vm";

import { THEME_INIT_SCRIPT } from "./theme-init";

test("early theme bootstrap defaults safely and respects a saved light preference", () => {
  for (const [saved, expected] of [
    [undefined, "dark"],
    ["invalid", "dark"],
    ["dark", "dark"],
    ["light", "light"]
  ] as const) {
    const classes = new Set(["unrelated", "light", "dark"]);
    runInNewContext(THEME_INIT_SCRIPT, {
      localStorage: { theme: saved },
      document: {
        documentElement: {
          classList: {
            remove: (...names: string[]) => names.forEach((name) => classes.delete(name)),
            add: (name: string) => classes.add(name)
          }
        }
      }
    });
    expect([...classes]).toEqual(["unrelated", expected]);
  }
  let selected: string | undefined;
  runInNewContext(THEME_INIT_SCRIPT, {
    get localStorage() {
      throw new Error("Storage denied");
    },
    document: {
      documentElement: {
        classList: {
          remove() {},
          add(name: string) {
            selected = name;
          }
        }
      }
    }
  });
  expect(selected).toBe("dark");
});
