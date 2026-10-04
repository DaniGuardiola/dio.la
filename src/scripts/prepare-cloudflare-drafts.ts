import { cp, mkdir, rm } from "node:fs/promises";
import path from "node:path";

// Pages requires a standard config filename. Stage drafts independently so
// their runtime bindings cannot overwrite the production blog's config.
const root = path.resolve(import.meta.dir, "../..");
const staging = path.join(root, ".wrangler/drafts");
await rm(staging, { recursive: true, force: true });
await mkdir(staging, { recursive: true });
await cp(path.join(root, "dist/public"), path.join(staging, "public"), { recursive: true });
await cp(path.join(root, "functions"), path.join(staging, "functions"), { recursive: true });

const config = await Bun.file(path.join(root, "wrangler.drafts.jsonc")).json();
delete config.$schema;
config.pages_build_output_dir = "public";
await Bun.write(path.join(staging, "wrangler.json"), JSON.stringify(config, null, 2));
