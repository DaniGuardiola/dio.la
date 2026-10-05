# Shortcut redirects

Cloudflare Workers Builds deploys `dio-redirects` from this repository's `main`
branch when `cloudflare/redirects/**`, `package.json`, or `bun.lock` changes.
Unrelated blog changes do not redeploy the shortcut Worker.

The build installs dependencies with `bun install --frozen-lockfile`, then runs
`bunx wrangler deploy --config cloudflare/redirects/wrangler.jsonc`.
Build variables are `BUN_VERSION=1.4.2`, `NODE_VERSION=22.23.2`, and
`SKIP_DEPENDENCY_INSTALL=true`. Manage the trigger in the Worker's Settings > Builds.

For a manual deployment, run `bun run deploy:cloudflare:redirects` from the
repository root. Keep the routes and redirect destinations in this directory.
