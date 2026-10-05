import { type ArticleMetadata } from "./articles";

export function linkArticles(articles: ArticleMetadata[]) {
  for (let i = 0; i < articles.length; i++) {
    const article = articles[i];
    const nextArticle = articles[i - 1];
    const prevArticle = articles[i + 1];
    // Loader data must stay acyclic: neighbor summaries do not link back to this article.
    if (nextArticle) article.next = { ...nextArticle, next: undefined, prev: undefined };
    if (prevArticle) article.prev = { ...prevArticle, next: undefined, prev: undefined };
  }
  return articles;
}
