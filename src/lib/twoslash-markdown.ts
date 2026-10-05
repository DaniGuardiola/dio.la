import type { ElementContent, Root } from "hast";
import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";

const markdown = unified().use(remarkParse).use(remarkGfm).use(remarkRehype);

// Same renderer hook used by Shiki's VitePress integration. Twoslash joins
// TypeScript documentation display parts with newlines, including inside links.
// https://github.com/shikijs/shiki/blob/main/packages/vitepress-twoslash/src/renderer-floating-vue.ts
export function renderTwoslashMarkdown(source: string) {
  const normalized = source.replace(/\{@link(?:code|plain)?\s+([^}]+)\}/g, (_, label: string) =>
    label.trim().replace(/\s*\n\s*/g, " ")
  );
  return (markdown.runSync(markdown.parse(normalized)) as Root).children.filter(
    (child): child is ElementContent => child.type !== "doctype"
  );
}

export function renderTwoslashMarkdownInline(source: string) {
  const children = renderTwoslashMarkdown(source);
  const paragraph = children[0];
  return children.length === 1 && paragraph?.type === "element" && paragraph.tagName === "p"
    ? paragraph.children
    : children;
}
