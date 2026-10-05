import { type ComponentProps } from "@solidjs/web";
import { Link, useNavigate, useSearch } from "@tanstack/solid-router";
import clsx from "clsx";
import { format } from "date-fns";
import { createMemo, For, Match, Show, omit, Switch } from "solid-js";

import { SkipLink, SkipLinks } from "~/components/SkipLinks";
import {
  type ArticleMetadata,
  ARTICLES,
  ARTICLES_BY_YEAR_SORTED,
  HIGHLIGHTS,
  type Topic,
  TOPICS_SORTED
} from "~/data/articles";
import { ALLOWED_TOPICS } from "~/data/config";
import { useAnimateBanner } from "~/utils/animate-banner";

// date label
// ----------

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December"
];

type DateLabelProps = ComponentProps<"time"> & {
  date: string;
  includeYear?: boolean | "always";
};

function DateLabel(props: DateLabelProps) {
  const restProps = omit(props, "date", "includeYear");

  const date = createMemo(() => new Date(props.date));

  const datetime = createMemo(() => format(date(), "yyyy-MM-dd"));

  const label = createMemo(() => {
    const day = date().getDate();
    const month = MONTHS[date().getMonth()];
    const year = date().getFullYear();
    const yearString = `, ${year}`;
    const shouldDisplayYear =
      props.includeYear && (props.includeYear === "always" || new Date().getFullYear() !== year);
    return `${month} ${day}${shouldDisplayYear ? yearString : ""}`;
  });

  return (
    <time datetime={datetime()} {...restProps}>
      {label()}
    </time>
  );
}

// highlights
// ----------

function MainHighlight(props: ArticleMetadata) {
  return (
    <Link
      to="/article/$id"
      params={{ id: props.id }}
      class="block rounded-md focus-ring-white focus-scroll-target group"
    >
      <article class="bg-white dark:bg-neutral-950 rounded-md space-y-1 overflow-hidden">
        <Show when={props.imageUrl}>
          <img
            alt="This article's main image"
            class="w-full aspect-[40/21]"
            src={props.imageUrl}
            fetchpriority="high"
          />
        </Show>
        <div class="p-6 flex flex-col gap-3">
          <DateLabel
            class="text-[1rem] text-accent-invert font-bold uppercase"
            date={props.date}
            includeYear
          />
          <h2 class="text-[1.5rem] group-hover:underline group-focus-visible:underline">
            {props.title}
          </h2>

          <Show when={!props.imageUrl}>
            <p class="text-[1.125rem] text-subtle-invert">{props.description}</p>
          </Show>
        </div>
      </article>
    </Link>
  );
}

function Highlight(props: ArticleMetadata) {
  return (
    <Link
      to="/article/$id"
      params={{ id: props.id }}
      class="block rounded-md focus-ring-white focus-scroll-target group"
    >
      <article class="flex flex-col gap-[.375rem] text-white">
        <DateLabel class="text-[.875rem] leading-6 uppercase" date={props.date} includeYear />
        <h2 class="text-[1.25rem] font-bold leading-[1.5rem] group-hover:underline group-focus-visible:underline">
          {props.title}
        </h2>
        <p class="text-[1.125rem] text-subtle-white leading-[1.375rem]">{props.description}</p>
      </article>
    </Link>
  );
}

function Highlights() {
  const [topHighlight, ...highlights] = HIGHLIGHTS;

  const { animateBannerRef, animateBannerStyle } = useAnimateBanner();

  return (
    <section
      ref={animateBannerRef}
      style={animateBannerStyle()}
      class="bg-accent select-none overflow-hidden"
      aria-labelledby="highlights-heading"
    >
      <div class="main-container w-full px-4 py-8 gap-12 flex max-md:flex-col">
        <div class="space-y-4 grow-[2] basis-0">
          <h1 id="highlights-heading" class="text-[2rem] text-white">
            Highlights
          </h1>
          <MainHighlight {...topHighlight} />
        </div>
        <div class="space-y-8 grow basis-0">
          <For each={highlights}>{(highlight) => <Highlight {...highlight} />}</For>
        </div>
      </div>
    </section>
  );
}

// topics
// ------

function Topics() {
  const searchParams = useSearch({ from: "/" });
  const topic = () => searchParams().topic;
  return (
    <>
      <SkipLink id="topics" />
      <section aria-label="topics" class="main-container lg:p-4">
        <div class="lg:sticky lg:top-24">
          <h1
            class={clsx(
              "max-lg:sr-only",
              "text-[1.25rem] font-bold leading-[2.25rem] mb-[.375rem] px-1"
            )}
          >
            Topics
          </h1>
          <ul
            class={clsx(
              "flex gap-6 whitespace-nowrap p-4 overflow-auto",
              "lg:flex-col lg:gap-[.625rem] lg:p-1"
            )}
          >
            <For each={TOPICS_SORTED}>
              {([id, amount]) => (
                <li>
                  <Link
                    to="/"
                    search={{ topic: id }}
                    hash="articles"
                    aria-label={`${id} (${amount} article${amount === 1 ? "" : "s"})`}
                    class={clsx(
                      "text-[1.125rem] leading-none hover:underline focus-ring focus-scroll-target rounded-xs",
                      {
                        "font-bold pointer-events-none": topic() === id
                      }
                    )}
                  >
                    {`#${id}`} <span class="text-accent-invert font-bold">{amount}</span>
                  </Link>
                </li>
              )}
            </For>
          </ul>
        </div>
      </section>
    </>
  );
}

function TopicBanner() {
  const searchParams = useSearch({ from: "/" });
  const topic = () => searchParams().topic as Topic | undefined;

  const topicExists = createMemo(() => topic() && ALLOWED_TOPICS.includes(topic()!));

  return (
    <Show when={topicExists()}>
      <section
        id="topic-banner"
        aria-label={`filtering by topic: ${topic()}`}
        class="bg-accent/75 text-white px-4 py-2 lg:py-4 mb-8 rounded-sm flex items-center justify-center gap-4 flex-wrap focus-scroll-target sticky top-20 lg:top-24"
      >
        <p>
          <span class="max-sm:sr-only">Filtering by topic: </span>
          <span class="font-bold">{`#${topic()}`}</span>
        </p>
        <div class="grow" />
        <Link
          to="/"
          search={{ topic: undefined }}
          hash="topics"
          class={clsx(
            "border border-white p-2 lg:py-0 rounded-sm focus-ring-white",
            "hover:bg-white hover:text-dark focus-visible:bg-white focus-visible:text-dark"
          )}
        >
          Clear filter
        </Link>
      </section>
    </Show>
  );
}

// articles
// --------

type ArticleItemProps = ArticleMetadata & {
  includeYear?: boolean | "always";
};

function ArticleItem(props: ArticleItemProps) {
  const navigate = useNavigate();
  return (
    <Link
      to="/article/$id"
      params={{ id: props.id }}
      class="block rounded-md focus-ring focus-scroll-target group"
    >
      <article class="space-y-[.25rem]">
        <div class="flex gap-4">
          <DateLabel
            class="text-[.875rem] uppercase text-accent-invert font-bold"
            date={props.date}
            includeYear={props.includeYear}
          />
          <Show when={Boolean(props.topics)}>
            <ul class="flex items-center gap-2 overflow-hidden opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100">
              <For each={props.topics?.slice(0, 2)}>
                {(topic) => (
                  <li
                    onClick={(event) => {
                      event.preventDefault();
                      void navigate({ to: "/", search: { topic }, hash: "articles" });
                    }}
                    class="hover-exclude text-[.9rem] leading-none text-subtle-invert hover:underline"
                  >{`#${topic}`}</li>
                )}
              </For>
            </ul>
          </Show>
        </div>
        <h2 class="text-[1.125rem] leading-[1.375rem] [.group:hover:not(:has(.hover-exclude:hover))_&]:underline group-focus-visible:underline">
          {props.title}
        </h2>
        <p class="text-subtle-invert text-[1rem] leading-[1.1875rem]">{props.description}</p>
      </article>
    </Link>
  );
}

type ArticleListProps = { topic?: Topic };

function ArticleList(props: ArticleListProps) {
  const topicExists = createMemo(() => props.topic && ALLOWED_TOPICS.includes(props.topic));
  return (
    <>
      <section id="articles" aria-label="articles" class="focus-scroll-target p-4 lg:grow lg:pt-2">
        <SkipLink id="article-list" />
        <TopicBanner />
        <div class="space-y-6">
          <Switch>
            <Match when={!topicExists()}>
              <For each={ARTICLES_BY_YEAR_SORTED}>
                {([year, articles]) => {
                  const isCurrentYear = +year === new Date().getFullYear();
                  return (
                    <section aria-label={`articles from ${year}`} class="space-y-6">
                      <Show when={!isCurrentYear}>
                        <time class="block text-[1.125rem] font-bold pt-[1.25rem]" datetime={year}>
                          {year}
                        </time>
                      </Show>
                      <ul class="space-y-6">
                        <For each={articles}>
                          {(article) => (
                            <li>
                              <ArticleItem {...article} />
                            </li>
                          )}
                        </For>
                      </ul>
                    </section>
                  );
                }}
              </For>
            </Match>
            <Match when={topicExists()}>
              <For
                each={ARTICLES.filter(
                  (article) => props.topic && article.topics?.includes(props.topic)
                )}
              >
                {(article) => <ArticleItem {...article} includeYear="always" />}
              </For>
            </Match>
          </Switch>
        </div>
      </section>
    </>
  );
}

// home
// ----

export default function Home() {
  const searchParams = useSearch({ from: "/" });
  const topic = () => searchParams().topic as Topic | undefined;

  return (
    <>
      <SkipLinks
        links={[
          { id: "article-list", label: "article list" },
          { id: "topics", label: "topics" }
        ]}
      />
      <div class="space-y-6 pb-20">
        <Highlights />
        <div class={clsx("space-y-4", "lg:flex lg:gap-x-12 lg:flex-row-reverse lg:main-container")}>
          <Topics />
          <ArticleList topic={topic()} />
        </div>
      </div>
    </>
  );
}
