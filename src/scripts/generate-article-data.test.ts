import { expect, test } from "bun:test";

import { generateRssItem, validateMetadata } from "./generate-article-data";

const frontmatter = { date: "2024/7/10", title: "Title", description: "Description" };

test("article metadata rejects empty, mistyped and invalid fields at the build boundary", () => {
  expect(() => validateMetadata(frontmatter, "example")).not.toThrow();
  for (const field of ["date", "title", "description"]) {
    for (const value of [undefined, null, "", "   ", 123]) {
      expect(() => validateMetadata({ ...frontmatter, [field]: value }, "example")).toThrow();
    }
  }
  for (const invalid of [
    { date: "not a date" },
    { topics: "react" },
    { topics: ["unknown"] },
    { topics: null },
    { draft: "false" },
    { imageUrl: 123 }
  ]) {
    expect(() => validateMetadata({ ...frontmatter, ...invalid }, "example")).toThrow();
  }
  expect(() =>
    validateMetadata(
      { ...frontmatter, topics: ["react"], draft: false, imageUrl: "/image.png" },
      "example"
    )
  ).not.toThrow();
});

test("RSS escapes XML text while retaining article URLs and publication dates", () => {
  const item = generateRssItem({
    ...frontmatter,
    id: "the-everything-bagel-of-components",
    title: 'A & B <components> "quoted"',
    description: "Code: a < b && b > c",
    readingMinutes: 1
  });
  expect(item).toContain('<title>A &amp; B &lt;components&gt; "quoted"</title>');
  expect(item).toContain("<description>Code: a &lt; b &amp;&amp; b &gt; c</description>");
  expect(item).toContain("<link>https://dio.la/article/the-everything-bagel-of-components</link>");
  expect(item).toContain("<pubDate>Wed, 10 Jul 2024 09:00:00 GMT</pubDate>");
});
