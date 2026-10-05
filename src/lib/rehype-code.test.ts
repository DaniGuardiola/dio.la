import { expect, test } from "bun:test";

import { compile } from "@mdx-js/mdx";
import lzString from "lz-string";

import { mdxOptions } from "./mdx-options";

test("MDX preserves Twoslash metadata, hidden include sections, queries and playground links", async () => {
  const source = [
    "```twoslash include shared",
    "const answer = 42;",
    "// - first",
    "const hiddenLater = true;",
    "```",
    "",
    "```ts twoslash {1}",
    "// @include: shared-first",
    "// ---cut---",
    "const result = answer;",
    "//    ^?",
    "```"
  ].join("\n");
  const output = String(await compile(source, mdxOptions));
  expect(output).toContain("twoslash lsp");
  expect(output).toContain('class="line highlight"');
  expect(output).toContain('lsp="const result: 42"');
  expect(output).toContain('class="popover"');
  expect(output).toContain("https://www.typescriptlang.org/play?#code/");
  expect(output).toContain('>{"Open in playground"}</_components.a>');
  expect(output).not.toContain('>{"Try"}</_components.a>');
  const compressed = output.match(/play\?#code\/([^"]+)/)?.[1];
  expect(compressed).toBeDefined();
  expect(lzString.decompressFromEncodedURIComponent(compressed!)).toContain("const answer = 42;");
  expect(output).not.toContain("hiddenLater");
  expect(output).not.toContain("---cut---");
  expect(output).not.toContain("language-twoslash");
});

test("multiline hover types survive raw HTML processing", async () => {
  const output = String(
    await compile(
      ["```ts twoslash", "const record = { name: 'Dani', count: 1 };", "```"].join("\n"),
      mdxOptions
    )
  );
  expect(output).toContain("const record: {");
  expect(output).toContain("\n    name: string;");
  expect(output).not.toContain("--LINEBREAK--");
});
