import { expect, test } from "bun:test";

import { compile, nodeTypes } from "@mdx-js/mdx";
import lzString from "lz-string";
import rehypeRaw from "rehype-raw";

import { rehypeCode } from "./rehype-code";

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
  const output = String(
    await compile(source, {
      jsx: true,
      rehypePlugins: [rehypeCode, [rehypeRaw, { passThrough: nodeTypes }]]
    })
  );
  expect(output).toContain("twoslash lsp");
  expect(output).toContain('className="line highlight"');
  expect(output).toContain('lsp="const result: 42"');
  expect(output).toContain('className="popover"');
  expect(output).toContain("https://www.typescriptlang.org/play?#code/");
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
      {
        jsx: true,
        rehypePlugins: [rehypeCode, [rehypeRaw, { passThrough: nodeTypes }]]
      }
    )
  );
  expect(output).toContain("const record: {");
  expect(output).toContain("\n    name: string;");
  expect(output).not.toContain("--LINEBREAK--");
});
