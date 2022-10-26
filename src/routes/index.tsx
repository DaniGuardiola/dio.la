import { A, useSearchParams } from "solid-start";
import clsx from "clsx";
import {
  ComponentProps,
  createMemo,
  For,
  Match,
  Show,
  splitProps,
  Switch,
} from "solid-js";
import { SkipLink, SkipLinks } from "~/components/SkipLinks";
import {
  HIGHLIGHTS,
  ArticleMetadata,
  TOPICS_SORTED,
  ARTICLES_BY_YEAR_SORTED,
  ARTICLES_SORTED,
} from "~/data/articles";

// article url
// -----------

const ARTICLE_URL_PREFIX = "/article/";

function getArticleUrl(id: string) {
  return `${ARTICLE_URL_PREFIX}${id}`;
}

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
  "December",
];

type DateLabelProps = ComponentProps<"time"> & {
  date: string;
  includeYear?: boolean | "always";
};

function DateLabel(p0: DateLabelProps) {
  const [props, restProps] = splitProps(p0, ["date", "includeYear"]);

  const date = createMemo(() => new Date(props.date));

  const datetime = createMemo(() => {
    const year = date().getFullYear();
    const month = date().getMonth() + 1;
    const day = date().getDate();
    return `${year}-${month}-${day}`;
  });

  const label = createMemo(() => {
    const day = date().getDate();
    const month = MONTHS[date().getMonth()];
    const year = date().getFullYear();
    const yearString = `, ${year}`;
    const shouldDisplayYear =
      props.includeYear &&
      (props.includeYear === "always" || new Date().getFullYear() !== year);
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
    <A
      href={getArticleUrl(props.id)}
      class="block rounded-md focus-ring-white focus-scroll-target group"
    >
      <article class="p-6 bg-white rounded-md space-y-3">
        <DateLabel
          class="text-[1rem] text-accent font-bold uppercase"
          date={props.date}
          includeYear
        />
        <h2 class="text-[1.5rem] group-hover:underline group-focus-visible:underline">
          {props.title}
        </h2>
        <p class="text-[1.125rem] text-subtle">{props.description}</p>
      </article>
    </A>
  );
}

function Highlight(props: ArticleMetadata) {
  return (
    <A
      href={getArticleUrl(props.id)}
      class="block rounded-md focus-ring-white focus-scroll-target group"
    >
      <article class="space-y-[.375rem] text-white">
        <DateLabel
          class="text-[.875rem] uppercase"
          date={props.date}
          includeYear
        />
        <h2 class="text-[1.25rem] font-bold leading-[1.5rem] group-hover:underline group-focus-visible:underline">
          {props.title}
        </h2>
        <p class="text-[1.125rem] text-subtle-white leading-[1.375rem]">
          {props.description}
        </p>
      </article>
    </A>
  );
}

function Highlights() {
  const [topHighlight, ...highlights] = HIGHLIGHTS;

  return (
    <section class="bg-accent select-none" aria-labelledby="highlights-heading">
      <div class="desktop-container w-full px-4 py-8 gap-12 flex max-md:flex-col">
        <div class="space-y-4">
          <h1 id="highlights-heading" class="text-[2rem] text-white">
            Highlights
          </h1>
          <MainHighlight {...topHighlight} />
        </div>
        <div class="space-y-8">
          <For each={highlights}>
            {(highlight) => <Highlight {...highlight} />}
          </For>
        </div>
      </div>
    </section>
  );
}

// topics
// ------

function getTopicUrl(id: string) {
  return `/?topic=${id}#topic-banner`;
}

function Topics() {
  const [searchParams] = useSearchParams();
  const topic = () => searchParams.topic;
  return (
    <>
      <SkipLink id="topics" />
      <section aria-label="topics" class="desktop-container lg:p-4">
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
                <A
                  href={getTopicUrl(id)}
                  aria-label={`${id} (${amount} article${
                    amount === 1 ? "" : "s"
                  })`}
                  class="text-[1.125rem] leading-none hover:underline focus-ring focus-scroll-target rounded-sm"
                  classList={{
                    "font-bold pointer-events-none": topic() === id,
                  }}
                >
                  {`#${id}`} <span class="text-accent font-bold">{amount}</span>
                </A>
              </li>
            )}
          </For>
        </ul>
      </section>
    </>
  );
}

function TopicBanner() {
  const [searchParams, setSearchParams] = useSearchParams();
  const topic = () => searchParams.topic;
  const clearTopic = () => setSearchParams({ topic: undefined });

  return (
    <Show when={topic()}>
      <section
        id="topic-banner"
        aria-label={`filtering by topic: ${topic()}`}
        class="bg-accent/75 text-white px-4 py-2 lg:py-4 mb-8 rounded flex items-center justify-center gap-4 flex-wrap focus-scroll-target"
      >
        <p>
          <span class="max-sm:sr-only">Filtering by topic: </span>
          <span class="font-bold">{`#${topic()}`}</span>
        </p>
        <div class="flex-grow" />
        <button
          type="button"
          onclick={clearTopic}
          class={clsx(
            "border border-white p-2 lg:py-0 rounded focus-ring-white",
            "hover:bg-white hover:text-dark focus-visible:bg-white focus-visible:text-dark"
          )}
        >
          Clear filter
        </button>
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
  return (
    <A
      href={getArticleUrl(props.id)}
      class="block rounded-md focus-ring focus-scroll-target group"
    >
      <article class="space-y-[.25rem]">
        <div class="flex gap-4">
          <DateLabel
            class="text-[.875rem] uppercase text-accent font-bold"
            date={props.date}
            includeYear={props.includeYear}
          />
          <Show when={Boolean(props.topics)}>
            <ul class="flex items-center gap-2 overflow-hidden opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100">
              <For each={props.topics.slice(0, 2)}>
                {(topic) => (
                  <li class="text-[.9rem] leading-none text-subtle">{`#${topic}`}</li>
                )}
              </For>
            </ul>
          </Show>
        </div>
        <h2 class="text-[1.125rem] leading-[1.375rem] group-hover:underline group-focus-visible:underline">
          {props.title}
        </h2>
        <p class="text-[1rem] text-subtle leading-[1.1875rem]">
          {props.description}
        </p>
      </article>
    </A>
  );
}

type ArticleListProps = {
  topic?: string;
};

function ArticleList(props: ArticleListProps) {
  return (
    <>
      <SkipLink id="article-list" />
      <section aria-label="articles" class="p-4 lg:pt-2">
        <TopicBanner />
        <div class="space-y-6">
          <Switch>
            <Match when={!props.topic}>
              <For each={ARTICLES_BY_YEAR_SORTED}>
                {([year, articles]) => {
                  const isCurrentYear = +year === new Date().getFullYear();
                  return (
                    <section
                      aria-label={`articles from ${year}`}
                      class="space-y-6"
                    >
                      <Show when={!isCurrentYear}>
                        <time
                          class="block text-[1.125rem] font-bold pt-[1.25rem]"
                          datetime={year}
                        >
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
            <Match when={props.topic}>
              <For
                each={ARTICLES_SORTED.filter((article) =>
                  article.topics.includes(props.topic as any)
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
  const [searchParams] = useSearchParams();
  const topic = () => searchParams.topic;

  return (
    <>
      <SkipLinks
        links={[
          { id: "article-list", label: "article list" },
          { id: "topics", label: "topics" },
        ]}
      />
      <div class="space-y-6">
        <Highlights />
        <div
          class={clsx(
            "space-y-4",
            "lg:flex lg:gap-x-12 lg:flex-row-reverse lg:desktop-container"
          )}
        >
          <Topics />
          <Switch fallback={<div>Not Found</div>}>
            <Match when={!topic()}>
              <ArticleList />
            </Match>
            <Match when={topic()}>
              <ArticleList topic={topic()} />
            </Match>
          </Switch>
        </div>
      </div>
    </>
  );
}
