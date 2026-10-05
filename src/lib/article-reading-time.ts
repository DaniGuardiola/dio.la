import { createProcessor } from "@mdx-js/mdx";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import { removeTwoslashNotations } from "twoslash/fallback";
import { visit } from "unist-util-visit";

import { collectCodeInclude, expandCodeIncludes } from "./code-includes";

const parser = createProcessor({ remarkPlugins: [remarkGfm, remarkMath] });
const WORDS_PER_MINUTE = 250;

// Accept the MDX body after frontmatter removal. Count prose and visible code,
// excluding imports, expressions, URLs, hidden includes and generated tooltip docs.
export function getArticleReadingMinutes(content: string) {
  const tree = parser.parse(content);
  const parts: string[] = [];
  const includes = new Map<string, string>();
  visit(tree, "code", (node) => {
    const key = node.lang === "twoslash" ? node.meta?.match(/^include\s+(\S+)/)?.[1] : undefined;
    if (key) collectCodeInclude(includes, key, node.value);
  });
  visit(tree, (node) => {
    if (node.type === "code") {
      if (node.lang === "twoslash" && node.meta?.startsWith("include ")) return;
      parts.push(
        node.meta?.split(/\s+/).includes("twoslash")
          ? removeTwoslashNotations(expandCodeIncludes(node.value, includes), [
              "annotate",
              "log",
              "warn",
              "error"
            ])
          : node.value
      );
    } else if (
      node.type === "text" ||
      node.type === "inlineCode" ||
      node.type === "math" ||
      node.type === "inlineMath"
    ) {
      parts.push(node.value);
    }
  });
  const words = parts.join(" ").match(/\S+/g)?.length ?? 0;
  return Math.max(1, Math.floor(words / WORDS_PER_MINUTE));
}
