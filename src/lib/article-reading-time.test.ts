import { expect, test } from "bun:test";

import matter from "gray-matter";

import { getArticleReadingMinutes } from "./article-reading-time";

const words = (count: number) => Array(count).fill("word").join(" ");

test("reading time counts prose, inline code, math and visible fenced code", () => {
  expect(getArticleReadingMinutes("")).toBe(1);
  expect(getArticleReadingMinutes(`${words(250)}\n\n\`${words(250)}\``)).toBe(2);
  expect(getArticleReadingMinutes(`${words(250)}\n\n\`\`\`text\n${words(250)}\n\`\`\``)).toBe(2);
  expect(getArticleReadingMinutes(`${words(250)}\n\n$${words(250)}$`)).toBe(2);
});

test("imports, expressions, link destinations and component attributes do not inflate reading time", () => {
  const content = `import Example from "${words(1000)}";\n\nexport const hidden = "${words(1000)}";\n\n${words(250)}\n\n[link](https://example.com/${"word/".repeat(1000)})\n\n<Example title="${words(1000)}">Visible text</Example>\n\n{hidden}`;
  expect(getArticleReadingMinutes(content)).toBe(1);
});

test("Twoslash includes, cut regions and control annotations do not count", () => {
  const content = `${words(250)}\n\n\`\`\`twoslash include setup\n${words(1000)}\n\`\`\`\n\n\`\`\`ts twoslash\n// @include: setup\n${words(1000)}\n// ---cut---\n${words(250)}\n// ^?\n// ---cut-after---\n${words(1000)}\n\`\`\``;
  expect(getArticleReadingMinutes(content)).toBe(2);
});

test("real article reading time is available before rendering", async () => {
  const source = await Bun.file(
    new URL("../content/article/the-everything-bagel-of-components/index.mdx", import.meta.url)
  ).text();
  const minutes = getArticleReadingMinutes(matter(source).content);
  expect(minutes).toBeGreaterThan(1);
  expect(minutes).toBeLessThan(28);
});

test("visible Twoslash includes count, while cut included setup stays hidden", () => {
  const setup = `\`\`\`twoslash include setup\n${words(250)}\n// - first\n${words(250)}\n\`\`\``;
  expect(
    getArticleReadingMinutes(`${setup}\n\n\`\`\`ts twoslash\n// @include: setup\n\`\`\``)
  ).toBe(2);
  expect(
    getArticleReadingMinutes(`${setup}\n\n\`\`\`ts twoslash\n// @include: setup-first\n\`\`\``)
  ).toBe(1);
  expect(
    getArticleReadingMinutes(
      `${setup}\n\n\`\`\`ts twoslash\n// @include: setup\n// ---cut---\n${words(250)}\n\`\`\``
    )
  ).toBe(1);
});
