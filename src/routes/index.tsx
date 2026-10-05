import { createFileRoute } from "@tanstack/solid-router";

import { SITE_DESCRIPTION } from "~/data/config";
import Home from "~/pages/index";
import { seo } from "~/utils/seo";
export const Route = createFileRoute("/")({
  component: Home,
  validateSearch: (search: Record<string, unknown>): { topic?: string } => ({
    topic: typeof search.topic === "string" ? search.topic : undefined
  }),
  head: () => seo({ description: SITE_DESCRIPTION })
});
