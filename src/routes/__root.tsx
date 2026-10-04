import { createRootRoute } from "@tanstack/solid-router";

import { BASE_PAGE_TITLE } from "~/data/config";
import NotFound from "~/pages/[...404]";
import Root from "~/root";

export const Route = createRootRoute({
  shellComponent: Root,
  notFoundComponent: NotFound,
  head: () => ({
    meta: [{ title: `404 | ${BASE_PAGE_TITLE}` }, { name: "description", content: "Not found!" }]
  })
});
