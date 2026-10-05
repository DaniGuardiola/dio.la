# Static sites

## RPC Anywhere

[rpc-anywhere.dio.la](https://rpc-anywhere.dio.la/) deploys automatically from
[DaniGuardiola/rpc-anywhere](https://github.com/DaniGuardiola/rpc-anywhere)'s `main`
branch through the git-integrated Pages project `dio-rpc-anywhere-git`.
Previews are disabled. Its build command is:

```sh
bun install --ignore-scripts --frozen-lockfile && bun run build-pages
```

Output directory: `dist-demo`. Build variables: `BUN_VERSION=1.4.2` and
`SKIP_DEPENDENCY_INSTALL=true`. The build script and lockfile live in the RPC
source repository. Source pushes rebuild the demo; this blog repository is not
its deployment source. The initial source build preserved all seven existing
assets byte-for-byte. Verification covered RPC initialization and input
synchronization in both directions, plus the source repository's existing tests.

The old direct-upload project `dio-rpc-anywhere` was replaced after verification.
Its migration archive and manual deployment config are no longer needed.

The historical Ariakit Solid playground was retired at the owner's request.
Its Pages project, DNS record, default-domain redirect, and deployment files
were removed.

## Default Pages URLs

The account-level Bulk Redirect list `dio_pages_custom_domains` sends
`dio-rpc-anywhere-git.pages.dev`, including deployment subdomains, to
`https://rpc-anywhere.dio.la/` with HTTP 301. Subpath matching, path suffix
preservation, and query preservation are enabled. These account resources are
independent of Pages builds.

See [Cloudflare's setup guide](https://developers.cloudflare.com/pages/how-to/redirect-to-custom-domain/).

List ID: `c63e3339dca040d8af389049140054dd`.
Ruleset ID: `9e9e5a678ff04fc6a89dc6d550a50859`.

The former blog projects `dio-la` and `dio-la-drafts` were deleted after their
custom domains passed verification on TanStack Start Workers.
