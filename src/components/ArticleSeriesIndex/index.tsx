import { For } from "solid-js";

import {
  articleMetadataExists,
  findArticleMetadataById,
  getArticlePath,
  useArticleLocation,
} from "~/data/articles";
import { type ArticleId } from "~/data/generated/articles";

type ArticleSeriesIndexProps = {
  name: string;
  articleIds: ArticleId[];
};

export function ArticleSeriesIndex(props: ArticleSeriesIndexProps) {
  const data = () =>
    props.articleIds.filter(articleMetadataExists).map(findArticleMetadataById);

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
                // TODO: should be <A> but there's a Solid Start bug :(
                <a href={getArticlePath(id)} class="inactive">
                  {title}
                </a>
              )}
            </li>
          )}
        </For>
      </ol>
    </blockquote>
  );
}
