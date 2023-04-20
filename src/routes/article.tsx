import { Base } from "@solidjs/meta";
import clsx from "clsx";
import { format } from "date-fns";
import { createEffect, createMemo, createSignal, For, Show } from "solid-js";
import { A, Outlet, useNavigate } from "solid-start";

import { Comments } from "~/components/Comments";
import { HeadMetadata } from "~/components/HeadMetadata";
import { MDXContent } from "~/components/MDXContent";
import { SkipLink, SkipLinks } from "~/components/SkipLinks";
import {
  type ArticleMetadata,
  articleMetadataExists,
  findArticleMetadataById,
  getArticlePath,
  useArticleLocation,
} from "~/data/articles";
import { CANONICAL_DOMAIN, TWITTER_USERNAME } from "~/data/config";
import { useAnimateBanner } from "~/utils/animate-banner";
import { articleScrolled } from "~/utils/page-scroll";

// reading speed
const WORDS_PER_MINUTE = 250;

function useArticleData() {
  const { articleId, articlePathname } = useArticleLocation();

  if (!articleMetadataExists(articleId())) return "not-found";

  const metadata = () => findArticleMetadataById(articleId());
  const host =
    typeof document !== "undefined" ? document.location.host : CANONICAL_DOMAIN;
  const protocol =
    typeof document !== "undefined" ? document.location.protocol : "https";
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

  const [heightOffsetEl, setHeightOffsetEl] = createSignal<HTMLElement>();
  const { animateBannerRef, animateBannerStyle } = useAnimateBanner({
    heightOffsetEl: () =>
      props.metadata.imageUrl ? heightOffsetEl() : undefined,
  });

  return (
    <>
      <Show when={typeof window !== "undefined"}>
        <Base href={props.articleUrl} />
      </Show>
      <header
        ref={(el) => {
          if (props.metadata.imageUrl) setHeightOffsetEl(el);
          else animateBannerRef(el);
        }}
        style={props.metadata.imageUrl ? undefined : animateBannerStyle()}
        class="bg-accent pt-8 pb-6 text-white break-words"
      >
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
          <h1 class="font-roboto-slab text-[2.5rem] leading-[1.2]">
            {props.metadata.title}
          </h1>
          <p class="text-[1.125rem] text-subtle-white py-2">
            {props.metadata.description}
          </p>
        </div>
      </header>
      <Show when={props.metadata.imageUrl}>
        <div class="relative">
          <div
            ref={(el) => {
              if (props.metadata.imageUrl) animateBannerRef(el);
              else setHeightOffsetEl(el);
            }}
            style={props.metadata.imageUrl ? animateBannerStyle() : undefined}
            class="absolute top-0 inset-x-0 -z-10 bg-accent h-[4rem] xs:h-[6rem] sm:h-[9rem] lg:h-[12rem]"
          />
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

export function GoToTopButton() {
  return (
    <button
      aria-label="scroll to the top"
      class={clsx(
        `fixed bottom-4 right-4 lg:bottom-8 lg:right-8
            bg-accent text-white p-3 lg:p-4 rounded-xl font-roboto-mono shadow-lg border-2 border-white
              transition-[transform,opacity] ease-out
              hover:-translate-y-2 active:-translate-y-1
              focus:outline-none focus-visible:-translate-y-2 focus-visible:outline-offset-2 focus-visible:outline-accent`,
        articleScrolled() ? "opacity-100" : "opacity-0"
      )}
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
    >
      scroll(TOP)
    </button>
  );
}

function Footer(props: { metadata: ArticleMetadata }) {
  return (
    <footer class="bg-accent">
      <div class="article-container px-4 pt-8 pb-24 text-white space-y-4">
        <Show when={Boolean(props.metadata.topics)}>
          <ul class="flex items-center gap-2">
            <For each={props.metadata.topics?.slice(0, 2)}>
              {(topic) => (
                <li class="text-[.9rem] leading-none hover:underline">
                  <A
                    class="focus-ring-white rounded"
                    href={`/?topic=${topic}#topic-banner`}
                  >{`#${topic}`}</A>
                </li>
              )}
            </For>
          </ul>
        </Show>
        <Show when={props.metadata.prev}>
          <p>
            <A
              class="group scroll-focus-target focus-ring-white rounded"
              href={getArticlePath(props.metadata.prev!.id)}
            >
              <span class="font-bold">{"<-"} Previous:</span>{" "}
              <span class="group-hover:underline">
                {props.metadata.prev?.title}
              </span>
            </A>
          </p>
        </Show>
        <Show when={props.metadata.next}>
          <p class="text-right">
            <A
              class="group scroll-focus-target focus-ring-white rounded"
              href={getArticlePath(props.metadata.next!.id)}
            >
              <span class="font-bold">Next:</span>{" "}
              <span class="group-hover:underline">
                {props.metadata.next?.title}
              </span>
              <span class="font-bold">{" ->"}</span>{" "}
            </A>
          </p>
        </Show>
        <p class="pt-8">
          Follow me on Twitter:{" "}
          <a
            class="font-bold hover:underline focus-ring-white rounded"
            target="_blank"
            href="https://twitter.com/daniguardio_la"
          >
            @daniguardio_la
          </a>
        </p>
      </div>
    </footer>
  );
}

export default function ArticleLayout() {
  const articleData = useArticleData();
  if (articleData === "not-found")
    // eslint-disable-next-line solid/components-return-once
    return useNavigate()("/404", { replace: true });
  const { metadata, articlePathname, articleUrl } = articleData;

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
        links={[
          { id: "article-content", label: "article content" },
          { id: "comments", label: "comments" },
        ]}
      />
      <div>
        <article>
          <ArticleHeader
            metadata={metadata()}
            articleUrl={articleUrl()}
            readingMinutes={readingMinutes()}
          />
          <div class="article-container p-4 space-y-16" ref={contentDiv!}>
            <MDXContent>
              <SkipLink id="article-content" />
              <Outlet />
            </MDXContent>
            <section aria-label="Comments">
              {/* see https://github.com/giscus/giscus/blob/main/CHANGELOG.md#2022-03-19 */}
              <SkipLink id="comments" class="giscus" />
              <Comments />
            </section>
          </div>
          <Footer metadata={metadata()} />
        </article>
      </div>
      <GoToTopButton />
    </>
  );
}
