import solid from "solid-start/vite";
import mdx from "@mdx-js/rollup";
import remarkShikiTwoslash from "remark-shiki-twoslash";
import remarkGfm from "remark-gfm";
import remarkFrontmatter from "remark-frontmatter";
import remarkMdxImages from "remark-mdx-images";
import remarkMath from "remark-math";
import { nodeTypes } from "@mdx-js/mdx";
import rehypeRaw from "rehype-raw";
import rehypeSlug from "rehype-slug";
import rehypeExternalLinks from "rehype-external-links";
import rehypeKatex from "rehype-katex";
// @ts-expect-error No types.
import vercel from "solid-start-vercel";
// @ts-expect-error No types.
import node from "solid-start-node";
import { defineConfig } from "vite";

const isVercel = process.env.VERCEL === "1";

export default defineConfig({
  plugins: [
    {
      ...mdx({
        jsx: true,
        jsxImportSource: "solid-js",
        providerImportSource: "solid-mdx",
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
    solid({
      extensions: [".mdx"],
      adapter: isVercel ? vercel({ edge: true }) : node(),
    }),
  ],
});
