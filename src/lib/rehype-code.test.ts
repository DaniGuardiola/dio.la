import { expect, test } from "bun:test";

import { compile } from "@mdx-js/mdx";
import lzString from "lz-string";

import { mdxOptions } from "./mdx-options";

// Rich tooltips split types into highlighted JSX tokens instead of attributes.
function renderedText(output: string) {
  return [...output.matchAll(/\{("(?:[^"\\]|\\.)*")\}/g)]
    .map((match) => JSON.parse(match[1]) as string)
    .join("");
}

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
  expect(renderedText(output)).toContain("const result: 42");
  expect(output).toContain('class="twoslash-meta-line twoslash-query-line"');
  expect(output).toContain('class="twoslash-popup-code"');
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
  expect(renderedText(output)).toContain("const record: {");
  expect(renderedText(output)).toContain("\n    name: string;");
  expect(output).toContain('class="twoslash-popup-container"');
  expect(output).not.toContain("data-lsp");
  expect(output).not.toContain("--LINEBREAK--");
});

test("code annotations hide directives and mark diffs, focused lines and words", async () => {
  const output = String(
    await compile(
      [
        "```ts",
        "// [!code word:count]",
        "const count = 1; // [!code --]",
        "const count = 2; // [!code ++]",
        "console.log(count); // [!code focus]",
        "console.log('done'); // [!code highlight]",
        "```"
      ].join("\n"),
      mdxOptions
    )
  );
  expect(output).toContain("diff remove");
  expect(output).toContain("diff add");
  expect(output).toContain("has-focused");
  expect(output).toContain("line focused");
  expect(output).toContain("highlighted-word");
  expect(output).toContain("line highlighted");
  expect(output).not.toContain("[!code");
});

test("matching bracket colors apply globally and compose with Twoslash", async () => {
  const source = "const values = { count: [1, 2] };";
  const plain = String(await compile(`\`\`\`ts\n${source}\n\`\`\``, mdxOptions));
  const colored = String(await compile(`\`\`\`ts twoslash\n${source}\n\`\`\``, mdxOptions));
  expect(plain).toContain("#FFD700");
  expect(colored).toContain("#FFD700");
  expect(colored).toContain("twoslash-popup-code");
  expect(renderedText(colored)).toContain("const values");
});

test("rich Twoslash keeps documentation, errors, custom tags and completions", async () => {
  const output = String(
    await compile(
      [
        "```ts twoslash",
        "// @errors: 2322 2339",
        "/** Number of examples. */",
        "const count: number = 1;",
        "count;",
        "const invalid: number = 'wrong';",
        "// @log: Example message",
        "console.lo;",
        "//        ^|",
        "```"
      ].join("\n"),
      mdxOptions
    )
  );
  expect(output).toContain("twoslash-popup-docs");
  // Native popovers are hidden until JS opens them: never put that dependency
  // in the server markup, which must remain usable with scripts disabled.
  expect(output).not.toContain('popover="manual"');
  expect(output).toContain('role="tooltip"');
  expect(renderedText(output)).toContain("Number of examples.");
  expect(output).toContain("twoslash-error-line");
  expect(renderedText(output)).toContain("Type 'string' is not assignable to type 'number'.");
  expect(output).toContain("twoslash-tag-log-line");
  expect(renderedText(output)).toContain("Example message");
  expect(output).toContain("twoslash-completion-list");
});

test("rich hover docs render Markdown and multiline JSDoc links without raw syntax", async () => {
  const output = String(
    await compile(
      [
        "```ts twoslash",
        "/** A **bold** description with {@link Number} and `inline code`. */",
        "const value = 42;",
        "value;",
        "```"
      ].join("\n"),
      mdxOptions
    )
  );
  expect(output).toContain("_components.strong");
  expect(output).toContain("twoslash-popup-docs");
  expect(renderedText(output)).toContain("bold");
  expect(renderedText(output)).toContain("Number");
  expect(output).not.toContain("{@link");
});
