# TODO: Remove the Solid Start server-function compatibility patch

`@tanstack%2Fsolid-start@2.0.0-rc.8.patch` updates two imports and their call sites:
`parseServerFunctionUrl` → `parseServerFunctionActionUrl`, and the old ID-based
`serverFunctionUrl` → `serverFunctionActionUrl`. Solid changed these integration
APIs; Start rc.8 still uses the old ones. Start imports this handler during normal
server startup even though this blog does not declare server functions.

Upstream fix: [TanStack/router #8467](https://github.com/TanStack/router/pull/8467),
merged September 18, 2026. Publication is tracked by
[release PR #8468](https://github.com/TanStack/router/pull/8468), targeting rc.9.
The Solid API change is explained in
[solidjs/solid #3501](https://github.com/solidjs/solid/pull/3501).
As checked on October 5, 2026, npm's `rc` tag remains rc.8 and rc.9 is unpublished.
Recheck publication; this status is historical, not a permanent constraint.

When a compatible release is published:

1. Verify its `server-functions-handler` uses the action URL APIs and check its
   Solid runtime/compiler peer requirements. Upgrade Start and Router together,
   keeping the Solid packages and Vite plugin aligned.
2. Remove the rc.8 entry from `package.json`'s `patchedDependencies`, delete the
   `.patch` file, and run `bun install` to update `bun.lock`.
3. Run `bun install --frozen-lockfile`, `bun run check`, and
   `bun test src/data/link-articles.test.ts src/lib/rehype-code.test.ts`.
4. Build production and drafts sequentially (`bun run build`, then
   `bun run build:cloudflare:drafts`); they share generated data and output.
   Verify the unpatched server starts and renders an article. Check client logo
   navigation, series links, back/forward, styles, titles and comments.
5. Update the patch references in the main README and navigation investigation.
   Follow the normal deployment workflow if deployment is authorized; do not
   deploy production using the draft build output.

Do not remove this patch merely because the blog does not call server functions.
