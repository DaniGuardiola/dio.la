import { For } from "solid-js";
import { A } from "solid-start";

import { findArticleMetadataById, useArticleLocation } from "~/data/articles";
import { type ArticleId } from "~/data/generated/articles";

const ARTICLE_IDS: ArticleId[] = [
  "lexical-explained",
  "what-is-a-node",
  "lexical-state-updates",
];
const ARTICLE_DATA = ARTICLE_IDS.map(findArticleMetadataById);
const ARTICLE_URL_PREFIX = "/article/";

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
                <A href={`${ARTICLE_URL_PREFIX}${id}`} class="inactive">
                  {title}
                </A>
              )}
            </li>
          )}
        </For>
      </ol>
    </blockquote>
  );
}
