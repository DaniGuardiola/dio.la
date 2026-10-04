# Static sites

These independent demos use Cloudflare Pages direct uploads. The checked-in
`public.tar.gz` files preserve the verified assets without depending on Vercel.
From the blog repository root:

```sh
mkdir -p cloudflare/sites/rpc-anywhere/public
tar -xzf cloudflare/sites/rpc-anywhere/public.tar.gz -C cloudflare/sites/rpc-anywhere/public
bunx wrangler --cwd cloudflare/sites/rpc-anywhere pages deploy public --project-name dio-rpc-anywhere --branch main

mkdir -p cloudflare/sites/ariakit-solid/public
tar -xzf cloudflare/sites/ariakit-solid/public.tar.gz -C cloudflare/sites/ariakit-solid/public
bunx wrangler --cwd cloudflare/sites/ariakit-solid pages deploy public --project-name dio-ariakit-solid --branch main
```

## RPC Anywhere

Source: [DaniGuardiola/rpc-anywhere](https://github.com/DaniGuardiola/rpc-anywhere),
commit `7ec394656c63e92eff1cbb3976f46da6df526ff7`.
Run `bun install --ignore-scripts` and `bun run build-demo`. Copy the demo's
`index.html`, `iframe.html`, `parent.js`, `iframe.js`, `utils.js`, and `style.css`
to the deployment directory; add `404.html` to disable Pages SPA fallback.
Verification covered RPC initialization and input synchronization in both
parent-to-iframe and iframe-to-parent directions.

## Ariakit Solid playground

Source: [ariakit/ariakit](https://github.com/ariakit/ariakit), commit
`67c3c38abe98788a7fb065c8d9c74fe5e88d65cf`, on the historical `solid/next` branch.
This is the old playground, independent of the current Solid 2 reboot.

The original deployed code crashed before rendering. `repair.patch` fixes the
heading component's missing props sink and returns props from the wrapper hook
rather than the chain mutator's void return. Apply it from the repository root
with `git apply repair.patch` before rebuilding.

The isolated migration build includes `packages/ariakit-solid`,
`packages/ariakit-solid-core`, and `packages/ariakit-solid-playground` as Bun
workspaces, plus the revision's root `tsconfig.json` and `tsconfig.solid.json`.
Its private root package uses `type: module`. Install with
`bun install --ignore-scripts`, then run `bun run build` in the playground
workspace. Copy its `dist` output into the deployment directory and add
`404.html`. The checked-in archive is the verified output; a future rebuild
should pin its newly resolved dependencies and repeat browser checks.

Verification covered headings, groups, separators, reactive element switching,
and focus enable/disable behavior without browser errors.

## Default Pages URLs

The account-level Bulk Redirect list `dio_pages_custom_domains` sends both
`dio-rpc-anywhere.pages.dev` and `dio-ariakit-solid.pages.dev`, including their
preview subdomains, to their corresponding custom domains with HTTP 301.
Subpath matching, path suffix preservation, and query preservation are enabled.
This prevents duplicate content on default Pages URLs while retaining Pages
hosting. The ruleset is `Dio Pages canonical domains`, in the
`http_request_redirect` phase. These account resources are independent of Pages
uploads. See [Cloudflare's setup guide](https://developers.cloudflare.com/pages/how-to/redirect-to-custom-domain/).

List ID: `c63e3339dca040d8af389049140054dd`.
Ruleset ID: `9e9e5a678ff04fc6a89dc6d550a50859`.

The former blog projects `dio-la` and `dio-la-drafts` were deleted after their
custom domains passed verification on TanStack Start Workers.
