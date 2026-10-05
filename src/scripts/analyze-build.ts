import { gzipSync } from "node:zlib";

const directory = "dist/client";
const config = await Bun.file("dist/server/wrangler.json").json();
const paths: string[] = await Bun.file("src/data/generated/article-paths.json").json();
const pages = ["/about", ...paths];
for (const path of pages) {
  if (!(await Bun.file(`${directory}${path}/index.html`).exists())) {
    throw new Error(`Missing prerendered page: ${path}`);
  }
}
const drafts = config.vars.IS_DRAFTS === "true";
const sitemap = await Bun.file(`${directory}/sitemap.xml`).exists();
if (sitemap === drafts) throw new Error("Sitemap must exist only in the production build");
const manifest = await Bun.file(`${directory}/.vite/manifest.json`).json();
if (manifest["giscus.json"] || !manifest["node_modules/giscus/dist/giscus.mjs"]) {
  throw new Error("Giscus must resolve to the npm web component, not local giscus.json");
}
const files = [];
for (const name of await readdir(`${directory}/assets`)) {
  const path = `assets/${name}`;
  const file = Bun.file(`${directory}/${path}`);
  const javascript = path.endsWith(".js");
  files.push({
    path,
    bytes: file.size,
    gzipBytes: javascript ? gzipSync(await file.arrayBuffer()).byteLength : undefined
  });
}
const bySize = (a: { bytes: number }, b: { bytes: number }) => b.bytes - a.bytes;
console.log(
  JSON.stringify(
    {
      worker: config.name,
      prerenderedPages: pages.length,
      sitemap,
      largestJavaScript: files
        .filter(({ path }) => path.endsWith(".js"))
        .sort(bySize)
        .slice(0, 8),
      largestMedia: files
        .filter(({ path }) => /\.(gif|mp4|webm|png|jpe?g|webp)$/.test(path))
        .sort(bySize)
        .slice(0, 5)
    },
    null,
    2
  )
);
import { readdir } from "node:fs/promises";
