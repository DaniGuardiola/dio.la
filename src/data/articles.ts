import { useLocation } from "solid-start";

import { type ALLOWED_TOPICS } from "./config";
import { type ArticleId, ARTICLES } from "./generated/articles";

// types
// -----

export type Topic = (typeof ALLOWED_TOPICS)[number];

export type ArticleMetadata = {
  id: ArticleId;
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

export function useArticleLocation() {
  const location = useLocation();
  const articlePathname = () => location.pathname.replace(/\/*$/, "");
  const articleId = () => {
    const match = articlePathname().match(/\S*\/([\S]*)/);
    if (!match) throw new Error("Missing article id");
    return match[1];
  };
  return { articlePathname, articleId };
}

export function getArticlePath(id: ArticleId) {
  return `/article/${id}`;
}

export function findArticleMetadataById(id: string) {
  const result = ARTICLES.find((article) => article.id === id);
  if (!result) throw new Error(`Article with id "${id}" was not found`);
  return result;
}

export function articleMetadataExists(id: string) {
  return ARTICLES.some((article) => article.id === id);
}
