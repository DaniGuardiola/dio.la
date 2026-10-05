# Dependency and MDX review

Reviewed October 5, 2026. MDX 3 and Shiki 4 were already current. The official
Shiki Rehype integration and classic Twoslash renderer provide build-time syntax
highlighting and type hovers without shipping either compiler to the browser.
Replacing them would add migration work without a demonstrated benefit.

## Changes

- Updated the remaining compatible direct dependencies and refreshed compatible
  transitive dependencies in Bun's lockfile. Bun remains 1.4.2. Node must be at
  least 22.12 for the current Vite tooling.
- Replaced the archived `remark-mdx-images` with its author's maintained
  [rehype-mdx-import-media](https://github.com/remcohaszing/rehype-mdx-import-media).
  Relative Markdown image URLs become bundled imports; public-root and remote
  URLs stay unchanged. Explicit JSX media still uses explicit imports.
- Removed unused direct dependencies: `@fec/remark-a11y-emoji`, `rollup`,
  `undici`, and `yaml`. Some still occur as dependencies of other tooling.
- Moved Ariakit React to development dependencies: it supplies types for article
  examples, not the site's runtime UI.
- Shared the real MDX configuration between Vite and compiler regression tests.
  KaTeX now runs before Shiki: display math is represented as a code block and
  Shiki otherwise consumes it as plain text. Shiki still precedes raw HTML
  processing to preserve Twoslash fence metadata; media conversion runs last.
  This is a plugin ordering correction, not a compatibility workaround.

## Intentional version holds

| Package    | Version    | Reason and removal condition                                                                                                                                                                                                                                     |
| ---------- | ---------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| TypeScript | `~6.0.3`   | Twoslash uses the established JavaScript compiler API. TypeScript 7's native compiler does not provide that API. Upgrade when Twoslash supports the new API; verify every article and hover/query/include regression.                                            |
| Lexical    | `0.12.6`   | Historical 2023 articles describe internal editor fields and `lexical/LexicalEditorState`. This dependency supplies example types, not a running editor. Keep the historical version unless the articles are deliberately rewritten for a newer Lexical release. |
| KaTeX      | `^0.16.47` | `rehype-katex@7.0.1` declares `katex@^0.16.0`. The direct dependency supplies matching CSS. Upgrade both when the plugin supports newer KaTeX; verify inline and display equations.                                                                              |

Sources: [TypeScript 7 announcement](https://devblogs.microsoft.com/typescript/announcing-typescript-7-0/),
[rehype-katex dependency declaration](https://github.com/remarkjs/remark-math/blob/main/packages/rehype-katex/package.json).

Solid 2 and TanStack Start release-candidate pins and the one upstream Start
patch are documented separately in [the patch removal checklist](../patches/README.md).
Do not blindly apply `bun update --latest`: the stable Start release uses a
different Solid generation, and the holds above serve concrete compatibility needs.

## Verification

`bun run check` checks formatting, lint and types. `bun test` compiles the actual
MDX pipeline and verifies local media metadata, math, GFM tables, external links,
Twoslash includes, queries, highlighted lines and playground URLs. Build both
production and drafts sequentially to validate all published and historical
article examples. `bun run analyze:build` checks generated pages and manifests.

The October 5 upgrade passed lint, formatting, type checking, all five tests
(46 assertions), frozen-lockfile installation, and both complete builds. Build
analysis verified eight public prerendered pages with a sitemap and 21 draft
pages without one. Local production browser checks covered imported images,
visible Twoslash hovers, video attributes, Giscus discussion settings, and styled
article-to-home navigation. Live HTTP checks confirmed the new article chunks
and 31 public / 18 draft referenced assets; the draft page retained noindex.
Fresh live browser checks were limited by the browser tool rejecting its own
local connection-error page after the preview stopped.

Deployed Worker versions:

- Production: `54083aef-fac8-4aff-90a6-d62007270feb`
- Drafts: `839f9ac0-3227-404b-b745-f85ef5b8e9c8`

## Playground link label correction

A visual follow-up found a pre-existing Tailwind 4 migration mistake: the old
`text-[0]` utility compiled to `color: 0`, not `font-size: 0`. It therefore failed
to hide the link's old `Try` text beside the `::after` label. The link now contains
its actual `Open in playground` text and owns its button styling directly;
the hidden text and generated label are removed. Hover and keyboard focus retain
the same reveal behavior. The compiler regression asserts the real link label.
