/* eslint-disable @typescript-eslint/no-explicit-any */
import { nodeTypes } from "@mdx-js/mdx";
import mdx from "@mdx-js/rollup";
import rehypeExternalLinks from "rehype-external-links";
import rehypeKatex from "rehype-katex";
import rehypeRaw from "rehype-raw";
import rehypeSlug from "rehype-slug";
import remarkFrontmatter from "remark-frontmatter";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import remarkMdxImages from "remark-mdx-images";
import remarkShikiTwoslash from "remark-shiki-twoslash";
import devtools from "solid-devtools/vite";
import solid from "solid-start/vite";
// @ts-expect-error No types.
import node from "solid-start-node";
import vercel from "solid-start-vercel";
import { defineConfig } from "vite";

const isVercel = process.env.VERCEL === "1";

export default defineConfig({
  plugins: [
    // @ts-expect-error Dep issues.
    {
      ...mdx({
        jsx: true,
        jsxImportSource: "solid-js",
        providerImportSource: "solid-mdx",
        elementAttributeNameCase: "html",
        stylePropertyNameCase: "css",
        remarkPlugins: [
          [
            (remarkShikiTwoslash as any).default,
            { theme: "dark-plus", addTryButton: true },
          ],
          remarkGfm,
          remarkFrontmatter,
          remarkMdxImages,
          remarkMath,
        ],
        rehypePlugins: [
          [rehypeRaw, { passThrough: nodeTypes }],
          rehypeSlug,
          [rehypeExternalLinks, { target: "_blank", rel: ["noreferrer"] }],
          rehypeKatex,
        ],
      }),
      enforce: "pre",
    },
    devtools({
      autoname: true,
      locator: {
        targetIDE: "vscode",
        componentLocation: true,
        jsxLocation: true,
      },
    }),
    solid({
      extensions: [".mdx"],
      adapter: isVercel ? vercel({ edge: true }) : node(),
    }),
  ],
});
