import { Base, Link } from "@solidjs/meta";
import { createEffect, createMemo, createSignal, Show } from "solid-js";
import { Outlet, useLocation } from "solid-start";
import { format } from "date-fns";
import { HeadMetadata } from "~/components/HeadMetadata";
import { MDXContent } from "~/components/MDXContent";
import { SkipLink, SkipLinks } from "~/components/SkipLinks";
import { ArticleMetadata, findArticleMetadataById } from "~/data/articles";
import { CANONICAL_DOMAIN, TWITTER_USERNAME } from "~/data/config";

// reading speed
const WORDS_PER_MINUTE = 250;

function useArticleData() {
  const location = useLocation();
  const articlePathname = () => location.pathname.replace(/\/*$/, "");
  const articleId = () => {
    const match = articlePathname().match(/\S*\/([\S]*)/);
    if (!match) throw new Error("Missing article id");
    return match[1];
  };
  const metadata = () => findArticleMetadataById(articleId());
  const host =
    typeof window !== "undefined" ? window.location.host : CANONICAL_DOMAIN;
  const protocol =
    typeof window !== "undefined" ? window.location.protocol : "https";
  const articleUrl = () => `${protocol}//${host}${articlePathname()}`;

  return { metadata, articleUrl, articlePathname };
}

type ArticleHeaderProps = {
  metadata: ArticleMetadata;
  articleUrl: string;
  readingMinutes: number;
};

function ArticleHeader(props: ArticleHeaderProps) {
  const tweetIntentUrl = () =>
    `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      `${props.metadata.title} by @${TWITTER_USERNAME}`
    )}&url=${encodeURIComponent(props.articleUrl)}`;

  const date = createMemo(() => {
    const date = new Date(props.metadata.date);
    const isCurrentYear = date.getFullYear() === new Date().getFullYear();
    return {
      short: format(date, `MMM d${!isCurrentYear ? ", yyyy" : ""}`),
      long: format(date, `MMMM do${!isCurrentYear ? ", yyyy" : ""}`),
    };
  });

  return (
    <>
      <Link
        href="https://fonts.googleapis.com/css2?family=Roboto+Mono:wght@400;700&family=Roboto+Slab&display=swap"
        rel="stylesheet"
      />
      <Show when={typeof window !== "undefined"}>
        <Base href={props.articleUrl} />
      </Show>
      <header class="bg-accent pt-8 pb-6 text-white">
        <div class="main-container px-4">
          <p class="font-roboto-mono text-[.875rem] text-subtle-white">
            <span class="sm:hidden">{date().short}</span>
            <span class="max-sm:hidden">{date().long}</span>
            <span class="font-bold"> · </span>
            {props.readingMinutes} min<span class="max-sm:hidden">ute</span>{" "}
            read
            <span class="font-bold"> · </span>
            <a
              href={tweetIntentUrl()}
              class="hover:underline focus-ring-white focus-scroll-target rounded-sm"
              target="_blank"
              rel="noreferrer"
            >
              tweet
            </a>
          </p>
          <h1 class="font-roboto-slab text-[1.875rem]">
            {props.metadata.title}
          </h1>
          <p class="text-[1.125rem] text-subtle-white py-2">
            {props.metadata.description}
          </p>
        </div>
      </header>
      <Show when={props.metadata.imageUrl}>
        <div class="relative">
          <div class="absolute top-0 inset-x-0 -z-10 bg-accent h-[4rem] xs:h-[6rem] sm:h-[9rem] lg:h-[12rem]" />
          <div class="px-4 main-container">
            <img
              alt="This article's main image"
              src={props.metadata.imageUrl}
              class="bg-white w-full object-cover aspect-[1.91/1] rounded shadow-lg"
            />
          </div>
        </div>
      </Show>
    </>
  );
}

export default function ArticleLayout() {
  const { metadata, articlePathname, articleUrl } = useArticleData();

  let contentDiv: HTMLDivElement;
  const [readingMinutes, setReadingMinutes] = createSignal(1);
  createEffect(() => {
    const words = contentDiv.textContent?.trim().split(/\s+/).length ?? 0;
    const minutes = Math.max(1, Math.floor(words / WORDS_PER_MINUTE));
    setReadingMinutes(minutes);
  });

  return (
    <>
      <HeadMetadata
        url={`https://${CANONICAL_DOMAIN}${articlePathname()}`}
        title={metadata().title}
        description={metadata().description}
        image={metadata().imageUrl} // TODO: support public dir path? (if starts with "/")
        type="article"
      />
      <SkipLinks
        links={[{ id: "article-content", label: "article content" }]}
      />
      <div>
        <article>
          <ArticleHeader
            metadata={metadata()}
            articleUrl={articleUrl()}
            readingMinutes={readingMinutes()}
          />
          <div class="main-container p-4" ref={contentDiv!}>
            <SkipLink id="article-content" />
            <MDXContent>
              <Outlet />
            </MDXContent>
          </div>
        </article>
      </div>
    </>
  );
}
