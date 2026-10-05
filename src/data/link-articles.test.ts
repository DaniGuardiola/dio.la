import { expect, test } from "bun:test";

import { type ArticleMetadata } from "./articles";
import { linkArticles } from "./link-articles";

test("article loader metadata has serializable neighbor summaries without circular links", () => {
  const articles: ArticleMetadata[] = [
    {
      id: "the-everything-bagel-of-components",
      title: "Newest",
      date: "2024/7/10",
      description: "First",
      readingMinutes: 1
    },
    {
      id: "the-open-closed-component-part-1",
      title: "Middle",
      date: "2024/6/13",
      description: "Second",
      readingMinutes: 1
    },
    {
      id: "try-return-finally",
      title: "Oldest",
      date: "2023/11/28",
      description: "Third",
      readingMinutes: 1
    }
  ];
  const linked = linkArticles(articles);
  for (const article of linked) {
    expect(() => JSON.stringify(article)).not.toThrow();
    for (const neighbor of [article.next, article.prev]) {
      if (neighbor) {
        expect(neighbor.next).toBeUndefined();
        expect(neighbor.prev).toBeUndefined();
      }
    }
  }
  expect(linked[0]!.next).toBeUndefined();
  expect(linked[2]!.prev).toBeUndefined();
  expect(linked[1]!.next?.id).toBe(articles[0]!.id);
  expect(linked[1]!.prev?.id).toBe(articles[2]!.id);
  expect(linked[1]!.next?.title).toBe("Newest");
  expect(linked[1]!.prev?.description).toBe("Third");
});
