import { cloudflare } from "@cloudflare/vite-plugin";
/* eslint-disable @typescript-eslint/no-explicit-any */
// import a11yEmoji from "@fec/remark-a11y-emoji";
import { nodeTypes } from "@mdx-js/mdx";
import mdx from "@mdx-js/rollup";
import solid from "@solidjs/vite-plugin";
import { tanstackStart } from "@tanstack/solid-start/plugin/vite";
import rehypeExternalLinks from "rehype-external-links";
import rehypeKatex from "rehype-katex";
import rehypeRaw from "rehype-raw";
import rehypeSlug from "rehype-slug";
import remarkFrontmatter from "remark-frontmatter";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import remarkMdxImages from "remark-mdx-images";
import remarkShikiTwoslash from "remark-shiki-twoslash";
import typescript, { type CompilerOptions } from "typescript";
import { defineConfig } from "vite";

export default defineConfig({
  resolve: { tsconfigPaths: true, alias: { "~": new URL("./src", import.meta.url).pathname } },
  plugins: [
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
          [
            (remarkShikiTwoslash as any).default,
            {
              theme: "dark-plus",
              addTryButton: true,
              defaultCompilerOptions: {
                target: typescript.ScriptTarget.ESNext,
                ignoreDeprecations: "6.0"
              } satisfies CompilerOptions
            }
          ],
          // a11yEmoji,
          remarkGfm,
          remarkFrontmatter,
          remarkMdxImages as any,
          remarkMath
        ],
        rehypePlugins: [
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
