import { nodeTypes, type CompileOptions } from "@mdx-js/mdx";
import rehypeExternalLinks from "rehype-external-links";
import rehypeKatex from "rehype-katex";
import rehypeMdxImportMedia from "rehype-mdx-import-media";
import rehypeRaw from "rehype-raw";
import rehypeSlug from "rehype-slug";
import remarkFrontmatter from "remark-frontmatter";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";

import { rehypeCode } from "./rehype-code.ts";

// Shared by the Vite build and compiler regression tests.
export const mdxOptions: CompileOptions = {
  jsx: true,
  jsxImportSource: "@solidjs/web",
  providerImportSource: "~/utils/mdx",
  elementAttributeNameCase: "html",
  stylePropertyNameCase: "css",
  remarkPlugins: [remarkGfm, remarkFrontmatter, remarkMath],
  rehypePlugins: [
    // Render math before Shiki can consume display-math code blocks as plain text.
    rehypeKatex,
    rehypeCode,
    [rehypeRaw, { passThrough: nodeTypes }],
    rehypeSlug,
    [rehypeExternalLinks, { target: "_blank", rel: ["noreferrer"] }],
    // Run last: the media plugin converts HTML elements into MDX JSX nodes.
    [rehypeMdxImportMedia, { elementAttributeNameCase: "html" }]
  ]
};
