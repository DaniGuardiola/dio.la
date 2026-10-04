import { createFileRoute } from "@tanstack/solid-router";

import Me from "~/pages/me";
import { seo } from "~/utils/seo";
export const Route = createFileRoute("/me")({
  component: Me,
  validateSearch: (search: Record<string, unknown>) => ({
    tldr: search.tldr === false || search.tldr === "false" ? false : undefined,
    "recent-first":
      search["recent-first"] === true || search["recent-first"] === "true" ? true : undefined
  }),
  head: () =>
    seo({
      title: "Not Dani Guardiola's Linkedin",
      titleSuffix: false,
      description: "About me & career",
      path: "/me",
      image: "/open-graph/hacking-linkedin.png"
    })
});
