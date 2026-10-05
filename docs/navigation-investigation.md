# Navigation investigation — 2026-10-05

## Findings

The failed article-to-home navigation and history freeze were caused by application integration errors.
The initial attribution to a Solid/TanStack prerelease bug was not established and
was incorrect as an explanation for these failures.

1. `Comments` passed a signal setter directly as the effect callback:
   `createEffect(() => location().pathname, setPathname)`. A setter returns its
   assigned value. Solid 2 stores an effect callback's return value as its cleanup;
   it must be a function or `undefined`. The pathname string was later called as
   a function during rerun/disposal. Returning void fixes that invalid cleanup.
2. Article layout and series state were derived from the router's global location.
   The destination pathname changes while the outgoing article can still exist.
   On `/`, `useArticleLocation` threw `Missing article id`; on another page,
   article lookup could throw for that page's final path segment. Article metadata
   now comes from the validated route loader. The series index reads an optional
   article route match, so an absent article during teardown is normal state.

3. `linkArticles` linked neighboring article objects directly. Each `next.prev`
   and `prev.next` pointed back into the same chain, making loader metadata cyclic.
   After SSR hydration, a client loader can create a separate object graph. Router's
   `replaceEqualDeep` then recursively compares these graphs. Its depth limit of
   500 does not prevent exponential branching across a doubly linked chain.
   An isolated comparison of two seven-article circular chains did not finish in
   three seconds and was terminated. Back navigation into an SSR-loaded article
   reproducibly froze/crashed the renderer. Neighbor metadata now contains shallow
   summaries with no neighbor links, making each loader result acyclic.
   Repeated back/forward works with the ordinary router and scroll restoration.

The keyed `HeadContent` workaround remounted stylesheet ownership whenever the
pathname changed. The CSS loss was observed in this configuration. Removing the
keyed head is now possible after fixing the underlying application errors.

## Controlled reproductions

All tests used production builds and a fresh preview port per variant. Destination
content was explicitly awaited; a changed address bar alone did not count as a
successful navigation.

| Case                                                            | Result                             |
| --------------------------------------------------------------- | ---------------------------------- |
| Two plain routes, upstream-style shell and stable `HeadContent` | Content and title update           |
| Article reduced to loader data and one heading                  | Navigation succeeds                |
| Article with only MDX wrapper/styles                            | Navigation succeeds                |
| Add article banner                                              | Navigation succeeds                |
| Add comments with original effect callback                      | Navigation fails                   |
| Same case, comments callback returns void                       | Navigation succeeds                |
| Full blog with comments fix but global-path article metadata    | Navigation fails                   |
| Full blog with loader-scoped metadata                           | Non-series article → home succeeds |
| Series article still using global-path helper                   | Series article → home fails        |
| Optional route-match series state                               | Series article → home succeeds     |

Further history controls: disabling scroll restoration did not fix the freeze;
replacing series route state with a static ID did not fix it either. Changing only
the linked metadata to acyclic neighbor summaries fixed it. The regression test
checks serialization and preserves the direction/content of neighbor links.

An independent runtime reproduction demonstrates the invalid cleanup directly:

```sh
bun --conditions=browser -e '
import { createRoot, createSignal, createEffect, flush } from "solid-js";
const [path] = createSignal("/article/a");
const [, setMirror] = createSignal("");
let dispose;
createRoot(d => {
  dispose = d;
  createEffect(path, setMirror);
});
flush();
dispose();
'
```

Observed error: `TypeError: n is not a function. (In 'n()', 'n' is "/article/a")`.
The comparator freeze can be reproduced independently of rendering:

```sh
bun --conditions=browser -e '
import { replaceEqualDeep } from "@tanstack/router-core";
function chain() {
  const articles = Array.from({ length: 7 }, (_, id) => ({ id }));
  articles.forEach((article, i) => {
    article.next = articles[i - 1];
    article.prev = articles[i + 1];
  });
  return articles[1];
}
replaceEqualDeep(chain(), chain());
'
```

Run with a short external timeout: the comparison is intentionally pathological.
The router comparator does not efficiently handle independently allocated cycles;
our loader supplied those cycles unnecessarily. Removing them corrects the loader
contract and preserves every neighbor field the UI uses.

Wrapping the callback in a block that does not return the setter result avoids
this error. The installed Solid runtime explicitly validates effect cleanup
return types in development and invokes stored cleanup during disposal.

## Removed workarounds and remaining decisions

- Removed the keyed head remount; use one ordinary `HeadContent`.
- Restored router navigation for the logo.
- Restored ordinary CSS imports; no document-shell stylesheet URL special case.
- Removed article-path parsing and duplicate metadata lookup from the layout.
- Removed the old native-link fallback in the article series index.
- Article neighbor summaries remain acyclic, including SSR/client loader data.
- Updated `@solidjs/vite-plugin` from next.35 to next.47, aligned with Solid rc.13.
  The upgrade alone did not fix the reproduction and is not credited as its cause.
- `remountDeps` on the article route is retained as an explicit route lifecycle
  choice: different article IDs initialize article-specific state, reading time,
  and banner animation. This is a supported Router option, not a failure fallback.
- The existing Solid Start server-function patch is unrelated: the installed
  prerelease imports API names renamed by the Solid runtime. It remains until a
  matching published Start release includes those names.

Upstream reference for version alignment:
https://github.com/solidjs/solid-vite-plugin/releases/tag/%40solidjs%2Fvite-plugin%403.0.0-next.47

Upstream reference for ordinary Start shell/head structure:
https://github.com/TanStack/router/blob/solid-v2/examples/solid/start-basic/src/routes/__root.tsx

## Final validation

- Frozen Bun lockfile installation passed without dependency changes.
- Oxlint, Oxfmt, TypeScript and production/drafts builds passed.
- Three regression tests passed, including acyclic article metadata and the two
  MDX/Twoslash cases.
- Live production and drafts: series article → logo → home → back, with stylesheet
  preservation and no renderer freeze. Production also exercised forward/back,
  home → article, and the previous-article link.
- Production article titles and Open Graph URLs matched the settled route;
  highlighted code blocks rendered and exactly one comments widget was present.
- The Twitter inactive arrow computed width was zero, and the header remained
  fixed after client navigation.
