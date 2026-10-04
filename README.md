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

Cloudflare DNS has a copy of all 31 Vercel records, including mail, aliases,
verification records, home network addresses, and wildcard routing. Vercel ALIAS
records were converted to DNS-only CNAME records; Cloudflare flattens the apex.
The nameservers assigned to this zone are `amit.ns.cloudflare.com` and
`rihana.ns.cloudflare.com`. Until they are set at Porkbun, Vercel remains the
authoritative DNS provider. Hosting remains on Vercel until the Cloudflare
custom domain is verified and its DNS record is switched.

The `home` and `pi4` records were tagged `vercel-ddns`. Their copied IPs preserve
current access, but the updater must be reconfigured for Cloudflare before an
IP change. No updater was found in the Pi's system services or user crontab.
Keep the Vercel zone and deployments available until this is resolved and the
cutover has been verified.

The next migration stages are TanStack Start with Solid 2, Oxlint/Oxfmt,
Tailwind 4, and an upgrade of the content pipeline and remaining dependencies.
The Pages adapter is a bridge for the existing SolidStart 0.3 application;
TanStack Start's official Cloudflare integration targets Workers with the
Cloudflare Vite plugin.
