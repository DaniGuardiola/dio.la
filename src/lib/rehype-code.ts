import rehypeShiki from "@shikijs/rehype";
import { parseMetaHighlightString } from "@shikijs/transformers";
import { rendererClassic, transformerTwoslash } from "@shikijs/twoslash";
import type { Element, Root } from "hast";
import lzString from "lz-string";
import type { ShikiTransformer } from "shiki";
import ts from "typescript";
import { unified } from "unified";
import { visit } from "unist-util-visit";

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
      playgroundCodes.set(
        this.meta,
        code.replace(/\/\/\s*@include:\s*(\S+)/g, (_, key: string) => includes.get(key) ?? "")
      );
    },
    line(node, line) {
      node.tagName = "div";
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
      const lines: string[] = [];
      const source = code.children
        .map((child) => (child.type === "text" ? child.value : ""))
        .join("");
      for (const line of source.split("\n")) {
        const section = line.trim().match(/^\/\/ - (\S+)/)?.[1];
        if (section) includes.set(`${key}-${section}`, lines.join("\n"));
        else lines.push(line);
      }
      includes.set(key, lines.join("\n"));
      parent.children.splice(index, 1);
      return index;
    });
    const processor = unified().use(rehypeShiki, {
      theme: "dark-plus",
      fallbackLanguage: "text",
      transformers: [
        articleCode(includes),
        transformerTwoslash({
          explicitTrigger: true,
          includesMap: includes,
          renderer: rendererClassic(),
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
