import {
  GH_DISCUSSIONS_CAT_ID,
  GH_DISCUSSIONS_DRAFTS_CAT_ID,
  REPO,
  REPO_ID,
} from "~/data/config";
import { isDrafts, isLocalhost } from "~/utils/is-host";

import { Giscus } from "./Giscus";

export function Comments() {
  return (
    <Giscus
      repo={REPO}
      repoId={REPO_ID}
      categoryId={
        isDrafts() || isLocalhost()
          ? GH_DISCUSSIONS_DRAFTS_CAT_ID
          : GH_DISCUSSIONS_CAT_ID
      }
      mapping="pathname"
      strict="1"
      reactionsEnabled="1"
      emitMetadata="0"
      inputPosition="top"
      theme="light"
      lang="en"
      loading="lazy"
    />
  );
}
