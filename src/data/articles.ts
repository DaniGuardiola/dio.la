// types
// -----

export type Topic = "typescript" | "react" | "fun" | "reverse-engineering";

export type ArticleMetadata = {
  id: string;
  date: string;
  title: string;
  description: string;
  topics?: Topic[];
  imageUrl?: string;
};

// data
// ----

export const ARTICLES: ArticleMetadata[] = [
  {
    id: "the-world-of-design-tokens",
    date: "2022/06/12",
    title: "The world of Design Tokens",
    description:
      "A collection of tools, projects, articles, and other resources involving the usage of Design Tokens.",
    topics: ["typescript", "reverse-engineering"],
  },
  {
    id: "making-doctors-appointment-command-line",
    date: "2021/04/23",
    title: "Making a doctor's appointment from the command line",
    description:
      "Reverse-engineering an appointment-making app to create a doctor's appointment CLI.",
    topics: ["react", "fun"],
    imageUrl:
      "https://images.unsplash.com/photo-1666644235536-b3524428b331?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1113&q=80",
  },
  {
    id: "reading-file-line-line-nodejs",
    date: "2021/05/08",
    title: "Reading a file line-by-line in Node.js",
    description:
      "Performance and memory benchmarks of different approaches to reading files line by line with JavaScript.",
    topics: ["react", "reverse-engineering", "fun"],
  },
];

export const HIGHLIGHTS: ArticleMetadata[] = [
  "the-world-of-design-tokens",
  "making-doctors-appointment-command-line",
  "reading-file-line-line-nodejs",
].map(findArticleMetadataById);

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
  return ARTICLES.find((article) => article.id === id);
}
