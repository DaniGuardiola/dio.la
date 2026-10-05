import { useLocation } from "@tanstack/solid-router";
import { createEffect } from "solid-js";

import { GH_DISCUSSIONS_CAT_ID, GH_DISCUSSIONS_DRAFTS_CAT_ID, REPO, REPO_ID } from "~/data/config";
import { isDrafts, isLocalhost } from "~/utils/is-host";
import { theme } from "~/utils/theme";

import { Giscus } from "./Giscus";

export function Comments() {
  const location = useLocation();
  let giscusWidgetEl!: HTMLElement & { requestUpdate?: () => void };

  createEffect(
    () => location().pathname,
    () => {
      const timer = setTimeout(() => giscusWidgetEl?.requestUpdate?.(), 50);
      return () => clearTimeout(timer);
    }
  );

  return (
    <Giscus
      ref={(element) => {
        giscusWidgetEl = element;
      }}
      repo={REPO}
      repoId={REPO_ID}
      categoryId={
        isDrafts() || isLocalhost() ? GH_DISCUSSIONS_DRAFTS_CAT_ID : GH_DISCUSSIONS_CAT_ID
      }
      mapping="pathname"
      strict="1"
      reactionsEnabled="1"
      emitMetadata="0"
      inputPosition="top"
      theme={theme()}
      lang="en"
      loading="lazy"
    />
  );
}
