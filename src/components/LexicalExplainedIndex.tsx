import { For } from "solid-js";

import {
  articleMetadataExists,
  findArticleMetadataById,
  getArticlePath,
  useArticleLocation,
} from "~/data/articles";
import { type ArticleId } from "~/data/generated/articles";

// import { A } from "solid-start";

const ARTICLE_IDS: ArticleId[] = [
  "lexical-explained",
  "what-is-a-node",
  "lexical-state-updates",
];
const ARTICLE_DATA = ARTICLE_IDS.filter(articleMetadataExists).map(
  findArticleMetadataById
);

export function LexicalExplainedIndex() {
  const { articleId } = useArticleLocation();
  return (
    <blockquote>
      <p>
        <strong>Lexical explained series</strong>
      </p>
      <ol>
        <For each={ARTICLE_DATA}>
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
