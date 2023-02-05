import { ALLOWED_TOPICS } from "./config";
import { ArticleId, ARTICLES } from "./generated/articles";

// types
// -----

export type Topic = (typeof ALLOWED_TOPICS)[number];

export type ArticleMetadata = {
  id: string;
  date: string;
  title: string;
  description: string;
  topics?: Topic[];
  imageUrl?: string;
  draft?: boolean;
};

// data
// ----

const highlightsIds: ArticleId[] = ["test-article"];

export const HIGHLIGHTS = highlightsIds.map(findArticleMetadataById);

export { ARTICLES };

// computed
// --------

export const TOPICS = ARTICLES.reduce((acc, article) => {
  article.topics?.forEach((TOPICS) => {
    if (!acc[TOPICS]) acc[TOPICS] = 0;
    acc[TOPICS] += 1;
  });
  return acc;
}, {} as Record<Topic, number>);

export const TOPICS_SORTED = Object.entries(TOPICS).sort(
  ([aName, aCount], [bName, bCount]) => {
    const byCount = bCount - aCount;
    if (byCount !== 0) return byCount;
    return aName.localeCompare(bName);
  }
);

export const ARTICLES_SORTED = ARTICLES.sort(
  (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
);

export const ARTICLES_BY_YEAR = ARTICLES.reduce((acc, article) => {
  const year = new Date(article.date).getFullYear();
  if (!acc[year]) acc[year] = [];
  acc[year].push(article);
  return acc;
}, {} as Record<string, ArticleMetadata[]>);

export const ARTICLES_BY_YEAR_SORTED = Object.entries(ARTICLES_BY_YEAR).sort(
  ([aYear], [bYear]) => +bYear - +aYear
);

// utils
// -----

export function findArticleMetadataById(id: string) {
  const result = ARTICLES.find((article) => article.id === id);
  if (!result) throw new Error(`Article with id "${id}" was not found`);
  return result;
}
