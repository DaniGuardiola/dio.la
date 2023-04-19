import { createEffect, createSignal } from "solid-js";
import { useLocation } from "solid-start";

import {
  GH_DISCUSSIONS_CAT_ID,
  GH_DISCUSSIONS_DRAFTS_CAT_ID,
  REPO,
  REPO_ID,
} from "~/data/config";
import { isDrafts, isLocalhost } from "~/utils/is-host";

import { Giscus } from "./Giscus";

export function Comments() {
  const location = useLocation();
  const [pathname, setPathname] = createSignal(location.pathname);
  createEffect(() => setPathname(location.pathname));
  let giscusWidgetEl: HTMLElement & { requestUpdate: () => void };

  createEffect(() => {
    // SPA refresh hack
    if (pathname()) setTimeout(() => giscusWidgetEl?.requestUpdate(), 50);
  });

  return (
    <Giscus
      ref={giscusWidgetEl!}
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
