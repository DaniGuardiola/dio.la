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
- Built on [Solid](https://www.solidjs.com/) and [SolidStart](https://start.solidjs.com/).
- Styled with [Tailwind CSS](https://tailwindcss.com/) and, in some cases, [SASS](https://sass-lang.com/).
- Content authored using [MDX](https://mdxjs.com/) v3.
- Code highlighting (including interactive TypeScript blocks) powered by [`shiki-twoslash`](https://shikijs.github.io/twoslash/).
- Hosted on [Cloudflare Pages](https://pages.cloudflare.com/) through the SolidStart Cloudflare Pages adapter.

## Principles

- Fully accessible - try keyboard navigation (tab) or a screen reader!
- Responsive to all screen sizes.
- Lightweight, performant and optimized - near-perfect [Lighthouse](https://developer.chrome.com/docs/lighthouse/) score.
- Search engine and social media friendly.

## Cloudflare deployment

Use Bun 1.4.2 and `bun install --frozen-lockfile`. `bun run check` runs Oxlint
(with Solid rules), Oxfmt, and TypeScript. `bun run format` formats sources
without rewriting embedded Twoslash examples.

| Domain                                           | Cloudflare service       |
| ------------------------------------------------ | ------------------------ |
| dio.la                                           | Pages: dio-la            |
| drafts.dio.la                                    | Pages: dio-la-drafts     |
| rpc-anywhere.dio.la                              | Pages: dio-rpc-anywhere  |
| ariakit-solid.dio.la                             | Pages: dio-ariakit-solid |
| www, pgp, h, u, h-utils, install-xr under dio.la | Worker: dio-redirects    |

Production and drafts share this branch. Run `bun run deploy:cloudflare` or
`bun run deploy:cloudflare:drafts` to build and deploy their production projects.
For local checks, build first, then run `bun run preview:cloudflare` or
`bun run preview:cloudflare:drafts`. Pages uses direct uploads; Git pushes do
not trigger deployments. Explicitly pass another branch to Wrangler for previews.

Draft builds set `IS_DRAFTS=true` and `VITE_IS_DRAFTS=true`. They retain the
unpublished articles, draft banner, separate analytics ID, and noindex metadata.
RSS excludes unpublished articles. The build stages a standard Wrangler config
in `.wrangler/drafts`, because Pages requires the canonical configuration filename.

`bun run deploy:cloudflare:redirects` deploys the shortcut Worker. It preserves
redirect status codes, paths, and query strings. `pgp` redirects to `/pgp.txt`;
`h` and `u` link to their GitHub repositories or raw files. The two installer
shortcuts accept only the root path. Unrecognized hosts or paths return 404.

See [the static sites deployment notes](cloudflare/sites/README.md) for the
RPC demo and legacy Ariakit playground, including source revisions and the
playground repairs. Their verified deployment artifacts are committed here.

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

The existing SolidStart 0.3 Pages adapter bridges the hosting migration.
TanStack Start/Solid compatibility, Tailwind 4, the MDX/highlighting pipeline,
and remaining dependency upgrades are the next stages.
