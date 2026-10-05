import { Link } from "@tanstack/solid-router";
import { For } from "solid-js";

import {
  articleMetadataExists,
  findArticleMetadataById,
  useArticleLocation
} from "~/data/articles";
import { type ArticleId } from "~/data/generated/articles";

type ArticleSeriesIndexProps = {
  name: string;
  articleIds: ArticleId[];
};

export function ArticleSeriesIndex(props: ArticleSeriesIndexProps) {
  const data = () => props.articleIds.filter(articleMetadataExists).map(findArticleMetadataById);

  const { articleId } = useArticleLocation();
  return (
    <blockquote>
      <p>
        <strong>"{props.name}" series</strong>
      </p>
      <ol>
        <For each={data()}>
          {({ id, title }) => (
            <li>
              {articleId() === id ? (
                <>
                  <u>{title}</u> (you're here)
                </>
              ) : (
                <Link to="/article/$id" params={{ id }} class="inactive">
                  {title}
                </Link>
              )}
            </li>
          )}
        </For>
      </ol>
    </blockquote>
  );
}
