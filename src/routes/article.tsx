import { Base } from "@solidjs/meta";
import { Show } from "solid-js";
import { Outlet, useLocation } from "solid-start";
import { MDXContent } from "~/components/MDXContent";
import { SkipLink, SkipLinks } from "~/components/SkipLinks";
import { findArticleMetadataById } from "~/data/articles";

const TWITTER_USER = "daniguardio_la";

function ArticleHeader() {
  const location = useLocation();
  const articlePathname = () => location.pathname.replace(/\/*$/, "");
  const articleId = () => articlePathname().match(/\S*\/([\S]*)/)[1];
  const metadata = () => findArticleMetadataById(articleId());
  const host = typeof window !== "undefined" ? window.location.host : "dio.la";
  const protocol =
    typeof window !== "undefined" ? window.location.protocol : "https";
  const articleUrl = () => `${protocol}//${host}${articlePathname()}`;
  const tweetIntentUrl = () =>
    `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      `${metadata().title} by @${TWITTER_USER}`
    )}&url=${encodeURIComponent(articleUrl())}`;
  return (
    <>
      <Show when={typeof window !== "undefined"}>
        <Base href={articleUrl()} />
      </Show>
      <header class="bg-accent pt-8 pb-6 text-white">
        <div class="main-container px-4">
          <p class="font-roboto-mono text-[.875rem] text-subtle-white">
            {/* TODO: format */}
            {metadata().date}
            <span class="font-bold"> · </span>
            {/* TODO: implement */}5 minute read
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
          <h1 class="font-roboto-slab text-[1.875rem]">{metadata().title}</h1>
          <p class="text-[1.125rem] text-subtle-white py-2">
            {metadata().description}
          </p>
        </div>
      </header>
      <Show when={metadata().imageUrl}>
        <div class="relative">
          <div class="absolute top-0 inset-x-0 -z-10 bg-accent h-[4rem] xs:h-[6rem] sm:h-[9rem] lg:h-[12rem]" />
          <div class="px-4 main-container">
            <img
              alt="This article's main image"
              src={metadata().imageUrl}
              class="w-full object-cover aspect-[1.91/1] rounded shadow-lg"
            />
          </div>
        </div>
      </Show>
    </>
    // null
  );
}

export default function ArticleLayout() {
  return (
    <>
      <SkipLinks
        links={[{ id: "article-content", label: "article content" }]}
      />
      <div>
        <article>
          <ArticleHeader />
          <div class="main-container p-4">
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
