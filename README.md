# dio.la

> Dani Guardiola's blog - [dio.la](https://dio.la/)
>
> [@daniguardio_la](https://twitter.com/daniguardio_la) on Twitter

Welcome to my blog's source code!

## Features

- Minimalistic and clean design.
- Article highlights and filterable topics.
- Rich article content, including interactive TypeScript code snippets.
- About page with details about me :)

## Tech

- Coded in [TypeScript](https://www.typescriptlang.org/).
- Built on Solid 2 and [TanStack Start](https://tanstack.com/start/latest).
- Styled with [Tailwind CSS 4](https://tailwindcss.com/) and plain CSS through its Vite plugin.
- Content authored using [MDX](https://mdxjs.com/) v3.
- Code highlighting (including interactive TypeScript blocks) powered by [Shiki 4](https://shiki.style/) with its official Rehype and Twoslash integrations.
- Hosted on [Cloudflare Workers](https://workers.cloudflare.com/) through the Cloudflare Vite plugin.

## Solid 2 compatibility

Solid and its compiler/runtime packages are pinned to `2.0.0-rc.13`; TanStack
Start and Router use their Solid 2 release candidate, `2.0.0-rc.8`. These are
prerelease versions. The Bun patch for TanStack Start applies the
[upstream server-function URL rename](https://github.com/TanStack/router/pull/8467)
required by Solid RC 13. See the [patch removal TODO](patches/README.md) for
release tracking, removal steps, and required verification.

The local MDX provider supplies Solid 2 dynamic components for native HTML tags.
MDX 3, existing Shiki/Twoslash styles, Giscus, and article assets remain supported.
Resume display options use route search state and component context, avoiding
shared server state across requests.

## Rendering and loading

Articles and the about page use TanStack Start's built-in prerendering and are
served as Cloudflare static assets. The home page and resume retain SSR because
their query parameters affect the initial content. Article paths are generated
from the same filtered metadata as each production/drafts build. Production gets
Start's sitemap; drafts remain noindex and do not publish a sitemap.

Comments use Start's experimental viewport hydration boundary, including code
splitting, with a 400px margin. Newsletter controls and navigation hydrate normally.
Cloudflare drops trailing slashes to preserve existing URLs and Giscus discussion
mapping. Internal links use typed Router paths, params and search directly.

Run `bun run analyze:build` after either build to validate prerendered output and
inspect JavaScript gzip sizes and large media. See
[framework optimization notes](docs/framework-optimizations.md) for evidence and
remaining opportunities.

## Styles

`src/root.css` imports Tailwind and owns custom utilities and variants.
Global styles use normal imports and a stable `HeadContent`. The logo uses
client navigation. Article data comes from its route loader with acyclic neighbor
summaries, and comments effects return only cleanup functions or void. See [navigation investigation](docs/navigation-investigation.md).
`src/theme.css` defines fonts, breakpoints, animation, and the existing palette.
Theme-aware text uses `text-accent-invert`; backgrounds and outlines use the
fixed `accent` color. Dark mode follows the `.dark` class, and the resume keeps
its `print` and `not-print` variants.

MDX styling uses `@reference` to share the root theme and utilities without
emitting another Tailwind bundle. Styles and font faces are plain CSS; Sass,
Autoprefixer, the old PostCSS config, and JavaScript Tailwind plugins are removed.
Highlight stacks use flex gaps so inline dates retain their spacing in v4.

## Code highlighting

MDX stays on v3. The shared pipeline in `src/lib/mdx-options.ts` renders math
with KaTeX before syntax highlighting. Relative Markdown media uses the maintained
`rehype-mdx-import-media` plugin. `src/lib/rehype-code.ts` runs the official Shiki Rehype plugin
before raw HTML processing so fence metadata reaches Twoslash. Highlighting and
type analysis run at build time; the browser receives rendered code and hover
text, not a TypeScript compiler or Shiki runtime.

The classic Twoslash renderer preserves the existing hover, query, error and
completion UI. Article fences keep `twoslash`, `{1, 3-4}`, `@include`, named include
sections and cut markers. Hidden includes are scoped to each document. Playground
links include the full source, including code hidden by cuts. The obsolete legacy
wrapper and its newline patch are removed.

`bun test` covers the actual MDX plugin pipeline, media imports, math, tables,
includes, queries, highlighted rows and playground links. See the
[dependency review](docs/dependency-review.md) for upgrades and intentional
TypeScript, Lexical and KaTeX version holds.

## Principles

- Fully accessible - try keyboard navigation (tab) or a screen reader!
- Responsive to all screen sizes.
- Lightweight, performant and optimized - near-perfect [Lighthouse](https://developer.chrome.com/docs/lighthouse/) score.
- Search engine and social media friendly.

## Cloudflare deployment

Use Bun 1.4.2 and `bun install --frozen-lockfile`. `bun run check` runs Oxlint
(with Solid rules), Oxfmt, and TypeScript. `bun run format` formats sources
without rewriting embedded Twoslash examples.

| Domain                                           | Cloudflare service          |
| ------------------------------------------------ | --------------------------- |
| dio.la                                           | Worker: dio-la-start        |
| drafts.dio.la                                    | Worker: dio-la-drafts-start |
| rpc-anywhere.dio.la                              | Pages: dio-rpc-anywhere     |
| ariakit-solid.dio.la                             | Pages: dio-ariakit-solid    |
| www, pgp, h, u, h-utils, install-xr under dio.la | Worker: dio-redirects       |

Production and drafts share this branch. Run `bun run deploy:cloudflare` or
`bun run deploy:cloudflare:drafts` to build and deploy their Workers.
For local checks, build first, then run `bun run preview:cloudflare` or
`bun run preview:cloudflare:drafts`. Deployment uses the generated `dist/server/wrangler.json`, including the bundled
server and client assets. Git pushes do not trigger deployments. Build and deploy
one environment at a time: both builds share `dist` and generated article data.
Custom domains are committed in Wrangler config; default `workers.dev` routes
and version preview URLs are disabled.

Draft builds set `IS_DRAFTS=true` and `VITE_IS_DRAFTS=true`. They retain the
unpublished articles, draft banner, separate analytics ID, and noindex metadata.
RSS excludes unpublished articles. Article metadata and lazy MDX imports are
generated from `src/content/article`; production builds exclude draft modules.
The article loader preloads each MDX module before rendering. JSX declarations
in MDX must use components so rendering happens inside the Solid owner.

`bun run deploy:cloudflare:redirects` deploys the shortcut Worker. It preserves
redirect status codes, paths, and query strings. `pgp` redirects to `/pgp.txt`;
`h` and `u` link to their GitHub repositories or raw files. The two installer
shortcuts accept only the root path. Unrecognized hosts or paths return 404.

See [the static sites deployment notes](cloudflare/sites/README.md) for the
RPC demo and legacy Ariakit playground, including source revisions and the
playground repairs. Their verified deployment artifacts are committed here. Default Pages URLs and
preview URLs redirect to custom domains. The obsolete blog and drafts Pages
projects were deleted after Worker verification.

## DNS migration

Porkbun delegates dio.la to `amit.ns.cloudflare.com` and
`rihana.ns.cloudflare.com`. Cloudflare is authoritative, and web domains have
active HTTPS certificates. Mail, aliases, service verification, and home network
records were preserved. `tempo.dio.la` retains its existing Cloudflare Sites target.

The obsolete home ACME record and wildcard Vercel routing were removed. The
retired Kapture project and the six migrated Vercel projects were deleted after
Cloudflare verification. The old Vercel DNS zone was also removed; Cloudflare
is the only DNS provider and there is no Vercel hosting fallback. The Pi4 runs
`cloudflare-ddns.timer` every five minutes to update `home` and `pi4` if the
public IPv4 changes. See [DDNS setup](cloudflare/ddns/README.md).

## Next upgrade stages

Dependency and MDX upgrades are complete within the compatibility limits above.
The wider project review remains, prioritizing demonstrated improvements over
replacing working libraries.
