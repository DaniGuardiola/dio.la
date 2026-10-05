import { createRouter } from "@tanstack/solid-router";

import RoutePending from "~/pages/route-pending";

import { routeTree } from "./routeTree.gen";
export function getRouter() {
  return createRouter({
    routeTree,
    defaultPreload: "intent",
    scrollRestoration: true,
    // Custom retry UI is deferred: see docs/router-error-hydration.md for the SSR reproduction.
    defaultPendingComponent: RoutePending
  });
}

declare module "@tanstack/solid-router" {
  interface Register {
    router: ReturnType<typeof getRouter>;
  }
}
