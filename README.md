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
- Content authored using [MDX](https://mdxjs.com/) v2.
- Code highlighting (including interactive TypeScript blocks) powered by [`shiki-twoslash`](https://shikijs.github.io/twoslash/).
- Deployed on [Vercel](https://vercel.com/) with [Edge Functions](https://vercel.com/docs/concepts/functions/edge-functions) through the [`solid-start-vercel`](https://github.com/solidjs/solid-start/tree/main/packages/start-vercel) adapter.
- Open Graph images generated with [Satori](https://github.com/vercel/satori) on Vercel Edge Functions, through [`@vercel/og`](https://vercel.com/docs/concepts/functions/edge-functions/og-image-generation). **Note: not implemented yet (soon!).**

## Principles

- Fully accessible - try keyboard navigation (tab) or a screen reader!
- Responsive to all screen sizes.
- Lightweight, performant and optimized - near-perfect [Lighthouse](https://developer.chrome.com/docs/lighthouse/) score.
- Search engine and social media friendly.

## Cloudflare migration

The existing SolidStart site can also run on Cloudflare Pages. Install with
`bun install --frozen-lockfile`, then run `bun run build:cloudflare` and
`bun run preview:cloudflare` to check the Workers runtime locally.
`bun run deploy:cloudflare` builds and deploys to the `dio-la` Pages project.
Pass `--branch main` to Wrangler when promoting a verified build to production;
other branches create preview deployments. The project currently uses direct
uploads, so Git pushes do not deploy automatically.

Drafts have a separate Pages project at `https://dio-la-drafts.pages.dev`.
Run `bun run deploy:cloudflare:drafts` to build with unpublished articles and
deploy that project. `IS_DRAFTS=true` controls article generation and server
rendering; `VITE_IS_DRAFTS=true` preserves draft mode in the browser on Pages
preview URLs as well as `drafts.dio.la`. Draft pages retain their banner,
separate analytics ID, and `noindex` metadata. RSS still excludes drafts.
The drafts build is staged in `.wrangler/drafts` with a standard Wrangler config
filename, because Pages does not support alternate configuration filenames.
Run `bun run preview:cloudflare:drafts` after building to check it locally.
The existing `drafts.dio.la` domain remains on Vercel until both blog and drafts
custom domains are ready for cutover.

Cloudflare DNS initially received all 31 Vercel records, including mail, aliases,
verification records, home network addresses, and wildcard routing. Vercel ALIAS
records were converted to DNS-only CNAME records; Cloudflare flattens the apex.
The nameservers assigned to this zone are `amit.ns.cloudflare.com` and
`rihana.ns.cloudflare.com`. Porkbun shows these after a page reload, but its
save request reported a registry timeout. The `.la` registry still advertised
Vercel at the last verification; confirm delegation before treating the DNS
cutover as complete. Hosting remains on Vercel until the Cloudflare
custom domain is verified and its DNS record is switched.

The obsolete `_acme-challenge.home` TXT record was removed from both providers.
The retired `kap.dio.la` domain was detached from its Vercel project and now
returns 404; the project was retained. Other mail and verification records are
still in use and were preserved.

`pgp.dio.la` has a Cloudflare Single Redirect rule to `https://dio.la/pgp.txt`,
preserving the existing 308 status and query string behavior. Its explicit
proxied CNAME activates the rule after DNS delegation and certificates are
ready. Keep the Vercel redirect project until the Cloudflare response is verified.

`h.dio.la` and `u.dio.la` are GitHub shortcuts for `DaniGuardiola/home-network`
and `DaniGuardiola/utils`. Their non-root paths redirect to raw repository
files, and `h-utils` and `install-xr` are additional installer shortcuts.
These remain on Vercel pending a migration that preserves path behavior.
`rpc-anywhere.dio.la` will migrate separately; keep its existing routing and the
wildcard record. `ariakit-solid.dio.la` also still depends on the wildcard.

The `home` and `pi4` records were tagged `vercel-ddns`. Their copied IPs preserve
current access, but the updater must be reconfigured for Cloudflare before an
IP change. No updater was found in the Pi's system services or user crontab.
Keep the Vercel zone and deployments available until this is resolved and the
cutover has been verified.

Linting uses Oxlint, including Solid rules through its JavaScript plugin support.
Formatting and generated article data use Oxfmt. Run `bun run check` for lint,
format, and type checks, or `bun run format` to format sources. Formatting does
not rewrite embedded code examples, preserving Twoslash annotations. The
`no-unassigned-vars` rule is disabled for TSX because Solid assigns JSX refs
implicitly. Bun is pinned to 1.4.2 in `packageManager`.

The next migration stages are TanStack Start with Solid 2, Tailwind 4, and an
upgrade of the content pipeline and remaining dependencies.
The Pages adapter is a bridge for the existing SolidStart 0.3 application;
TanStack Start's official Cloudflare integration targets Workers with the
Cloudflare Vite plugin.
