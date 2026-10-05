import { cloudflare } from "@cloudflare/vite-plugin";
import mdx from "@mdx-js/rollup";
import solid from "@solidjs/vite-plugin";
import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/solid-start/plugin/vite";
import { defineConfig } from "vite";

import { mdxOptions } from "./src/lib/mdx-options.ts";

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
      ...mdx(mdxOptions),
      enforce: "pre"
    },
    solid({ ssr: true, extensions: [".mdx"] })
  ]
});
import { readFileSync } from "node:fs";
