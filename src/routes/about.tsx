import { createFileRoute } from "@tanstack/solid-router";

import Content from "~/content/about/index.mdx";
import AboutLayout from "~/pages/about";
import { seo } from "~/utils/seo";
export const Route = createFileRoute("/about")({
  component: () => (
    <AboutLayout>
      <Content />
    </AboutLayout>
  ),
  head: () =>
    seo({
      title: "About Dani Guardiola",
      description: "Software engineer, math and physics enthusiast.",
      path: "/about",
      image: "/img/me.webp",
      article: true
    })
});
