import { type ArticleMetadata } from "./articles";

export function linkArticles(articles: ArticleMetadata[]) {
  for (let i = 0; i < articles.length; i++) {
    const article = articles[i];
    const nextArticle = articles[i - 1];
    const prevArticle = articles[i + 1];
    if (nextArticle) article.next = nextArticle;
    if (prevArticle) article.prev = prevArticle;
  }
  return articles;
}
