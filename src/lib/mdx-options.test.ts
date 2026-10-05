import { expect, test } from "bun:test";

import { compile } from "@mdx-js/mdx";

import { mdxOptions } from "./mdx-options";

test("the build pipeline imports local media while preserving public URLs and image metadata", async () => {
  const result = await compile(
    [
      '![invert || Local diagram](./diagram.png "Diagram title")',
      "![Same diagram](./diagram.png)",
      "![Public image](/open-graph/example.png)",
      "![Remote image](https://example.com/photo.png)",
      "",
      'import clip from "./clip.mp4";',
      '<video src={clip} controls playsinline aria-label="Video demo" />'
    ].join("\n\n"),
    mdxOptions
  );
  const output = String(result);
  expect(result.messages).toHaveLength(0);
  expect(output.match(/from "\.\/diagram\.png"/g)).toHaveLength(1);
  expect(output).toContain('alt="invert || Local diagram"');
  expect(output).toContain('title="Diagram title"');
  expect(output).toContain('src="/open-graph/example.png"');
  expect(output).toContain('src="https://example.com/photo.png"');
  expect(output).toContain('from "./clip.mp4"');
  expect(output).toContain('aria-label="Video demo"');
});

test("the build pipeline preserves math, GFM tables, heading IDs and safe external links", async () => {
  const result = await compile(
    [
      "---\ntitle: Pipeline test\n---",
      "# A heading",
      "Inline math: $x^2 + y^2$",
      "$$\n\\frac{1}{2}\n$$",
      "| Name | Value |\n| --- | --- |\n| Result | 42 |",
      "[External link](https://example.com/)"
    ].join("\n\n"),
    mdxOptions
  );
  const output = String(result);
  expect(result.messages).toHaveLength(0);
  expect(output).toContain('id="a-heading"');
  expect(output).toContain('class="katex"');
  expect(output).toContain('class="katex-display"');
  expect(output).toContain("_components.table");
  expect(output).toContain('target="_blank"');
  expect(output).toContain('rel="noreferrer"');
  expect(output).not.toContain("title: Pipeline test");
});
