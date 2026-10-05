# TODO: Revisit custom route error/retry UI after SSR hydration is fixed

Verified locally on 2026-10-05 with Solid / @solidjs/web 2.0.0-rc.13,
Solid Router / Start 2.0.0-rc.8 and Vite 8.3.2.

Client-side loader failures and rendering failures recovered successfully with
`await router.invalidate(); reset?.()`. The native pending component also worked
while retrying a delayed loader. However, an error in the initial SSR response
produced hydration-key misses and left the server-rendered retry button inert.
Replacing our custom component with Router's stock `ErrorComponent` reproduced
the problem: its **Hide Error** button did not change the visible error.

The framework renders the same failure in different places. In
`@tanstack/solid-router/src/Match.tsx`, `MatchInner`'s error-status branch directly
renders `RouteErrorComponent` on the server, with `reset={undefined}`. In the
browser it instead throws the error; the ancestor `CatchBoundary` renders the
fallback through `Solid.Errored`. Those render paths generate different hydration
namespaces. Observed stock fallback keys began with
`1002020101148m00210123013237125480002101203237000` on the server versus
`1002020101148m0021012301323712548000220020` requested during hydration.
Solid reported detached replacement elements and unclaimed SSR elements.

No dependency patch, forced remount or hydration workaround was added for this
optional feature. The app retains Router's default error handling. No matching
upstream issue was established; this document is a local investigation record,
not a claim that an upstream fix exists. Temporary diagnostic routes were removed.

## Minimal reproduction

Temporarily create `src/routes/audit-failure.tsx`:

```tsx
import { createFileRoute } from "@tanstack/solid-router";

export const Route = createFileRoute("/audit-failure")({
  loader: () => {
    throw new Error("Controlled loader failure");
  },
  component: () => <h1>Unreachable</h1>
});
```

Temporarily configure `defaultErrorComponent: ErrorComponent` from
`@tanstack/solid-router` in `src/router.tsx`. Run the dev server, directly open
`/audit-failure`, wait for hydration and click **Hide Error**. The expected behavior
is hiding the error text; the observed behavior is unchanged text plus hydration
warnings. Direct navigation matters: an entirely client-rendered error recovers.

## Acceptance before enabling custom retry

1. Recheck upstream versions and source for aligned SSR/client fallback rendering.
2. Verify the stock fallback's button after a direct server-rendered failure.
3. Verify custom retry after initial SSR failure, client loader failure and render
   failure, including a delayed loader and a repeated failure.
4. Verify returning home, normal navigation and the styled 404.
5. Remove all diagnostic routes before building/deploying production and drafts.

[Router error handling](https://tanstack.com/router/latest/docs/framework/solid/guide/data-loading)
documents loader invalidation and boundary reset. The reproduction above checks
the installed versions rather than assuming the documented behavior works.
