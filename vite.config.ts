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

const drafts = process.env.VITE_IS_DRAFTS === "true";
const articlePaths: string[] = JSON.parse(
  readFileSync(new URL("./src/data/generated/article-paths.json", import.meta.url), "utf8")
);

export default defineConfig({
  resolve: { tsconfigPaths: true, alias: { "~": new URL("./src", import.meta.url).pathname } },
  plugins: [
    tailwindcss(),
    cloudflare({
      configPath:
        process.env.VITE_IS_DRAFTS === "true" ? "wrangler.drafts.jsonc" : "wrangler.jsonc",
      viteEnvironment: { name: "ssr" }
    }),
    tanstackStart({
      prerender: {
        enabled: true,
        autoStaticPathsDiscovery: false,
        crawlLinks: false,
        failOnError: true
      },
      pages: [
        // Search-dependent pages keep SSR so direct links preserve their initial content.
        { path: "/", prerender: { enabled: false } },
        { path: "/me", prerender: { enabled: false } },
        ...["/about", ...articlePaths].map((path) => ({ path }))
      ],
      sitemap: { enabled: !drafts, host: "https://dio.la" }
    }),
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
import { readFileSync } from "node:fs";
