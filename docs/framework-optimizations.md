# Framework optimizations — 2026-10-05

Previously, the custom generation script compiled article metadata, an MDX import
map and RSS. Shiki/Twoslash ran during compilation, but complete page HTML still
required SSR for each request. There was no page prerender configuration.

## Built-in prerendering

Start now prerenders the about page and every article selected for the current
build. Dynamic article paths come from generated JSON, not a separate content
crawler. Explicit pages and disabled link crawling prevent accidental generation
of query variants or external destinations. Production has seven articles plus
about; drafts include their additional articles. Build errors fail prerendering.

The home page and resume retain SSR, preserving topic filters and resume options
in the initial HTML. There is no static home page which could override those
query-dependent responses. Unknown URLs continue to reach Start's 404 handling.

Start generates the public sitemap. Draft builds omit it and keep noindex.
Cloudflare's `drop-trailing-slash` asset handling preserves the existing article
paths: an automatic trailing slash would change Giscus's pathname discussion key.

## Deferred comments and typed routing

Start's experimental `Hydrate` boundary waits until comments are within 400px of
the viewport. The compiler emits a separate comments chunk. Initial article HTML
and navigation remain immediately available; the newsletter form hydrates normally.
Client-side navigation renders the boundary normally, as documented by Start.

The old `A`, search and navigation migration wrappers are removed. Internal links
use registered Router types with explicit article params and topic search/hash.
External anchors remain ordinary HTML links. MDX native anchors retain their
existing behavior through the native MDX component map.

## Comments bugs caught during verification

- `baseUrl: "."` caused Vite's TypeScript-path resolution to load the repository's
  `giscus.json` for `import("giscus")`. The manifest explicitly named `giscus.json`
  and emitted an empty chunk. Removing `baseUrl`, while keeping `~/*`, resolves
  `node_modules/giscus/dist/giscus.mjs` and emits the actual web component.
- The ref now uses a callback appropriate to Solid 2. Old assignment syntax did
  not pass the ref through to the compiled component.
- Lit maps camelCase properties to lowercase attribute names. `repo-id`,
  `category-id`, etc. did not configure the widget; `repoid`, `categoryid`,
  `inputposition`, `reactionsenabled` and `emitmetadata` do. Validation checks the
  iframe URL's IDs and settings, rather than only the presence of a widget tag.

## Measurement

`bun run analyze:build` checks generated pages, sitemap separation and correct
Giscus module resolution, then reports the largest JavaScript and media assets.
Sizes are build artifacts, not real-user performance measurements. Prerendering
removes per-request rendering work but does not eliminate article hydration code.

The bagel article is approximately 159 kB of JavaScript (23 kB gzip). The largest
GIF is approximately 4.74 MB, with another around 1 MB. Large MP4s are around
2.20 MB and 1.69 MB. Optimizing those media assets is a separate useful next step;
they are not loaded on every page. No measured real-user speedup is claimed here.

References:

- [Start prerendering](https://tanstack.com/start/latest/docs/framework/solid/guide/static-prerendering)
- [Start deferred hydration](https://tanstack.com/start/latest/docs/framework/solid/guide/deferred-hydration)
- [Cloudflare HTML handling](https://developers.cloudflare.com/workers/static-assets/routing/advanced/html-handling/)

## Validation

Oxlint, Oxfmt and TypeScript passed; the three metadata/MDX regression tests passed.
Both production and drafts built with their own prerendered output, and the build
audit confirmed 8/21 pages respectively, with a sitemap only for production.
Local asset responses had an ETag; query-dependent SSR responses did not.

Live production and drafts were checked for preserved canonical paths, initial
zero comments widgets, viewport-triggered widget creation, actual shadow-DOM
iframe URLs with the correct repo/category IDs, top input position, noindex on
drafts, and styled article-to-home/back navigation. Local topic filter/clear and
resume option controls retained their existing query behavior.

The generated production sitemap was inspected in the build output and deployed
with the assets. Direct live XML opening was blocked by the verification browser;
the separate terminal HTTP check received 403, including for article URLs that
worked in the browser. A live sitemap response was therefore not independently
verified in this environment.
