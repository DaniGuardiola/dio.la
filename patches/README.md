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

## TODO: Remove the Solid Start client hydration lifecycle patch

`@tanstack%2Fsolid-start-client@2.0.0-rc.8.patch` fixes two distinct Solid 2
diagnostics reproduced during development on October 5, 2026:

- `Hydrate` / `GenericHydrate` read reactive props and `useHydrated()` in the
  component body. These select the initial renderer, marker ID and whether to
  preserve initial server HTML; they are deliberately one-time snapshots, now
  expressed with `untrack`. Runtime prefetch strategy reads remain tracked.
- `GenericHydrate` called `onCleanup` inside `createEffect`'s unowned effect
  callback. Solid explicitly reports that these callbacks will never run. The
  runtime teardown is now returned from the effect, including its early-return
  branch. One-time prefetch teardown is retained by the existing component cleanup.

This is a dependency correction, not warning suppression. Both package source
and distributed JavaScript are patched. The rules are documented in the installed
`solid-js/skills/reactivity-diagnostics/SKILL.md` (`STRICT_READ_UNTRACKED` and
`NO_OWNER_CLEANUP`). The owning upstream files are
[Hydrate.tsx](https://github.com/TanStack/router/blob/main/packages/solid-start-client/src/Hydrate.tsx)
and [GenericHydrate.tsx](https://github.com/TanStack/router/blob/main/packages/solid-start-client/src/GenericHydrate.tsx).
No matching upstream issue was located; the server-function PR above does not
track these client defects.

Remove this separate patch only after a release handles initial snapshots and
effect cleanup correctly. Test direct article hydration, navigating away before
comments become visible, repeated article/home/article navigation, and scrolling
comments into view. Confirm that comments remain deferred, initialize once with
the current pathname, and emit neither Solid diagnostic. Verify production and
draft builds and a frozen install. Other hydration strategies are not used by
this site and have not been browser-tested here.

## TODO: Remove the Router blur snapshot patch

`@tanstack%2Fsolid-router@2.0.0-rc.8.patch` changes only `handleLeave`'s
`preload()` read to `untrack(preload)` in the source and distributed builds.
Captured browser console stack: `read` → `handleLeave` → the link's blur handler
→ Solid DOM reconciliation. Removing the focused link during navigation fires
synchronous blur while a DOM effect is still running. The event handler needs
the current preload mode once, rather than a reactive dependency. This annotation
preserves intent-preload cancellation; it does not disable diagnostics globally.

Remove after upstream explicitly handles this event snapshot or Solid's event
dispatch no longer diagnoses the read as an effect callback. Recheck focused-link
article/home/article navigation, hover preloading and keyboard focus/blur.
