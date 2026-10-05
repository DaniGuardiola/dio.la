import { cloudflare } from "@cloudflare/vite-plugin";
/* eslint-disable @typescript-eslint/no-explicit-any */
// import a11yEmoji from "@fec/remark-a11y-emoji";
import { nodeTypes } from "@mdx-js/mdx";
import mdx from "@mdx-js/rollup";
import solid from "@solidjs/vite-plugin";
import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/solid-start/plugin/vite";
import rehypeExternalLinks from "rehype-external-links";
import rehypeKatex from "rehype-katex";
import rehypeRaw from "rehype-raw";
import rehypeSlug from "rehype-slug";
import remarkFrontmatter from "remark-frontmatter";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import remarkMdxImages from "remark-mdx-images";
import { defineConfig } from "vite";

import { rehypeCode } from "./src/lib/rehype-code.ts";

export default defineConfig({
  resolve: { tsconfigPaths: true, alias: { "~": new URL("./src", import.meta.url).pathname } },
  plugins: [
    tailwindcss(),
    cloudflare({
      configPath:
        process.env.VITE_IS_DRAFTS === "true" ? "wrangler.drafts.jsonc" : "wrangler.jsonc",
      viteEnvironment: { name: "ssr" }
    }),
    tanstackStart(),
    {
      ...mdx({
        jsx: true,
        jsxImportSource: "@solidjs/web",
        providerImportSource: "~/utils/mdx",
        elementAttributeNameCase: "html",
        stylePropertyNameCase: "css",
        remarkPlugins: [
          // a11yEmoji,
          remarkGfm,
          remarkFrontmatter,
          remarkMdxImages as any,
          remarkMath
        ],
        rehypePlugins: [
          rehypeCode,
          [rehypeRaw, { passThrough: nodeTypes }],
          rehypeSlug,
          [rehypeExternalLinks, { target: "_blank", rel: ["noreferrer"] }],
          rehypeKatex
        ]
      }),
      enforce: "pre"
    },
    solid({ ssr: true, extensions: [".mdx"] })
  ]
});
