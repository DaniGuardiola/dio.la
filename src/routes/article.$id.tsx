import { dynamic } from "@solidjs/web";
import { createFileRoute, notFound } from "@tanstack/solid-router";

import { ARTICLES } from "~/data/articles";
import { ARTICLE_COMPONENTS } from "~/data/generated/article-components";
import ArticleLayout from "~/pages/article";
import { seo } from "~/utils/seo";
export const Route = createFileRoute("/article/$id")({
  remountDeps: ({ params }) => params.id,
  loader: async ({ params }) => {
    const article = ARTICLES.find((x) => x.id === params.id);
    if (!article) throw notFound();
    await ARTICLE_COMPONENTS[article.id].preload();
    return article;
  },
  head: ({ loaderData }) =>
    loaderData
      ? seo({
          title: loaderData.title,
          description: loaderData.description,
          path: `/article/${loaderData.id}`,
          image: loaderData.imageUrl,
          article: true
        })
      : {},
  component: ArticlePage
});
function ArticlePage() {
  const article = Route.useLoaderData();
  const Content = dynamic(() => ARTICLE_COMPONENTS[article().id]);
  return (
    <ArticleLayout>
      <Content />
    </ArticleLayout>
  );
}
