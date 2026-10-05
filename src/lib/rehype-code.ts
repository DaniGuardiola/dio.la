import { transformerColorizedBrackets } from "@shikijs/colorized-brackets";
import rehypeShiki from "@shikijs/rehype";
import {
  parseMetaHighlightString,
  transformerNotationDiff,
  transformerNotationFocus,
  transformerNotationHighlight,
  transformerNotationWordHighlight
} from "@shikijs/transformers";
import { rendererRich, transformerTwoslash } from "@shikijs/twoslash";
import type { Element, Root } from "hast";
import lzString from "lz-string";
import type { ShikiTransformer } from "shiki";
// TODO(twoslash-ts7): Retire the TypeScript 6 dependency once upstream supports TS7:
// https://github.com/twoslashes/twoslash/issues/93
// Then upgrade `typescript`, remove `@typescript/native`, simplify `typecheck`, and
// verify both article builds plus hover/query/include/playground regression tests.
// Today `bun run typecheck` uses TS7; this import supplies TS6's API for Twoslash.
// Migration details and the alternative native renderer: docs/dependency-review.md.
import ts from "typescript";
import { unified } from "unified";
import { visit } from "unist-util-visit";

import { collectCodeInclude, expandCodeIncludes } from "./code-includes";
import { renderTwoslashMarkdown, renderTwoslashMarkdownInline } from "./twoslash-markdown";

function element(
  tagName: string,
  properties: Element["properties"],
  children: Element["children"]
): Element {
  return { type: "element", tagName, properties, children };
}

// Keep existing article markup while using Shiki's typed HAST pipeline.
function articleCode(includes: Map<string, string>): ShikiTransformer {
  const playgroundCodes = new WeakMap<object, string>();
  return {
    name: "dio:article-code",
    preprocess(code) {
      playgroundCodes.set(this.meta, expandCodeIncludes(code, includes));
    },
    line(node, line) {
      // Keep Shiki's span lines: word annotations inspect span text recursively.
      // CSS makes only source lines block-level, preserving full-width highlights.
      const highlights = parseMetaHighlightString(this.options.meta?.__raw ?? "");
      if (highlights) this.addClassToHast(node, highlights.includes(line) ? "highlight" : "dim");
    },
    code(node) {
      // Block lines provide line breaks, including full-width highlighted rows.
      node.children = node.children.filter(
        (child) => child.type !== "text" || child.value !== "\n"
      );
    },
    pre(node) {
      // Background belongs to the site theme, not the syntax theme.
      delete node.properties.style;
      const code = node.children.find(
        (child): child is Element => child.type === "element" && child.tagName === "code"
      );
      if (!code) return;
      const children: Element["children"] = [code];
      if (this.meta.twoslash) {
        children.push(
          element(
            "a",
            {
              className: ["playground-link"],
              href: `https://www.typescriptlang.org/play?#code/${lzString.compressToEncodedURIComponent(playgroundCodes.get(this.meta) ?? "")}`,
              "aria-label": "Open code in TypeScript playground"
            },
            [{ type: "text", value: "Open in playground" }]
          )
        );
      }
      node.children = [
        element("div", { className: ["language-id"] }, [
          { type: "text", value: this.options.lang }
        ]),
        element("div", { className: ["code-container"] }, children)
      ];
    }
  };
}

export function rehypeCode() {
  return async (tree: Root) => {
    // Includes belong to one document. Never share names between concurrent MDX builds.
    const includes = new Map<string, string>();
    visit(tree, "element", (node, index, parent) => {
      if (node.tagName !== "pre" || !parent || index === undefined) return;
      const code = node.children[0];
      if (code?.type !== "element" || code.tagName !== "code") return;
      const meta = String((code.data as { meta?: string } | undefined)?.meta ?? "");
      const key = meta.match(/^include\s+(\S+)/)?.[1];
      if (
        !key ||
        !Array.isArray(code.properties.className) ||
        !code.properties.className.includes("language-twoslash")
      )
        return;
      const source = code.children
        .map((child) => (child.type === "text" ? child.value : ""))
        .join("");
      collectCodeInclude(includes, key, source);
      parent.children.splice(index, 1);
      return index;
    });
    const processor = unified().use(rehypeShiki, {
      theme: "dark-plus",
      fallbackLanguage: "text",
      transformers: [
        articleCode(includes),
        transformerNotationDiff(),
        transformerNotationFocus(),
        transformerNotationHighlight(),
        transformerNotationWordHighlight(),
        transformerColorizedBrackets(),
        transformerTwoslash({
          explicitTrigger: true,
          includesMap: includes,
          renderer: rendererRich({
            queryRendering: "line",
            renderMarkdown: renderTwoslashMarkdown,
            renderMarkdownInline: renderTwoslashMarkdownInline,
            hast: {
              hoverToken: { properties: { tabIndex: 0 } },
              hoverPopup: { properties: { popover: "manual", role: "tooltip" } }
            }
          }),
          twoslashOptions: {
            customTags: ["annotate", "log", "warn", "error"],
            compilerOptions: {
              target: ts.ScriptTarget.ESNext,
              jsx: ts.JsxEmit.ReactJSX,
              ignoreDeprecations: "6.0"
            }
          }
        })
      ]
    });
    await processor.run(tree);
  };
}
