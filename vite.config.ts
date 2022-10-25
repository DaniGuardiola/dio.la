import solid from "solid-start/vite";
import mdx from "@mdx-js/rollup";
import remarkShikiTwoslash from "remark-shiki-twoslash";
import remarkGfm from "remark-gfm";
import remarkFrontmatter from "remark-frontmatter";
import remarkMdxImages from "remark-mdx-images";
import { nodeTypes } from "@mdx-js/mdx";
import rehypeRaw from "rehype-raw";
import rehypeSlug from "rehype-slug";
import rehypeExternalLinks from "rehype-external-links";
import { defineConfig } from "vite";

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
        ],
        rehypePlugins: [
          [rehypeRaw, { passThrough: nodeTypes }],
          rehypeSlug,
          [rehypeExternalLinks, { target: "_blank", rel: ["noreferrer"] }],
        ],
      }),
      enforce: "pre",
    },
    solid({ extensions: [".mdx"] }),
  ],
});
