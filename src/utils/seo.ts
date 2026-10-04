import { BASE_PAGE_TITLE, CANONICAL_DOMAIN, NAME, TWITTER_USERNAME } from "~/data/config";
export function seo(options: {
  title?: string;
  description: string;
  path?: string;
  image?: string;
  article?: boolean;
  titleSuffix?: boolean;
}) {
  const title =
    options.titleSuffix === false
      ? options.title
      : `${options.title ? `${options.title} | ` : ""}${BASE_PAGE_TITLE}`;
  const url = `https://${CANONICAL_DOMAIN}${options.path ?? "/"}`;
  return {
    meta: [
      { title },
      { name: "description", content: options.description },
      { name: "author", content: NAME },
      { property: "og:title", content: title },
      { property: "og:description", content: options.description },
      { property: "og:type", content: options.article ? "article" : "website" },
      { property: "og:locale", content: "en_US" },
      { property: "og:url", content: url },
      {
        property: "og:image",
        content: `https://${CANONICAL_DOMAIN}${options.image ?? "/open-graph/default.png"}`
      },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:creator", content: `@${TWITTER_USERNAME}` }
    ],
    links: [{ rel: "canonical", href: url }]
  };
}
