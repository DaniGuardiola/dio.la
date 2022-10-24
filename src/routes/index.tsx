import { A } from "@solidjs/router";
import clsx from "clsx";
import { ComponentProps, createMemo, For, Show, splitProps } from "solid-js";
import {
  HIGHLIGHTS,
  ArticleMetadata,
  TOPICS_SORTED,
  ARTICLES_BY_YEAR_SORTED,
} from "~/data/articles";

const ARTICLE_URL_PREFIX = "/articles/";

function getArticleUrl(id: string) {
  return `${ARTICLE_URL_PREFIX}${id}`;
}

type TimeProps = ComponentProps<"time"> & {
  date: string;
  includeYear?: boolean;
};

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

function DateLabel(p0: TimeProps) {
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
      props.includeYear && new Date().getFullYear() !== year;
    return `${month} ${day}${shouldDisplayYear ? yearString : ""}`;
  });

  return (
    <time datetime={datetime()} {...restProps}>
      {label()}
    </time>
  );
}

function MainHighlight(props: ArticleMetadata) {
  return (
    <A
      href={getArticleUrl(props.id)}
      class="block rounded-md focus-ring-white group"
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
      class="block rounded-md focus-ring-white group"
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

function getTopicUrl(id: string) {
  return `/?topic=${id}`;
}

function Topics() {
  return (
    <section aria-label="topics" class="desktop-container lg:p-4">
      <h2
        class={clsx(
          "max-lg:hidden",
          "text-[1.25rem] font-bold leading-[2.25rem] mb-[.625rem]"
        )}
      >
        Topics
      </h2>
      <ul
        class={clsx(
          "flex gap-6 whitespace-nowrap p-4 overflow-auto",
          "lg:flex-col lg:gap-[.625rem] lg:p-0"
        )}
      >
        <For each={TOPICS_SORTED}>
          {([id, amount]) => (
            <li>
              <A
                href={getTopicUrl(id)}
                class="text-[1.125rem] leading-none hover:underline focus-ring rounded-sm"
              >
                {`#${id}`} <span class="text-accent font-bold">{amount}</span>
              </A>
            </li>
          )}
        </For>
      </ul>
    </section>
  );
}

function ArticleItem(props: ArticleMetadata) {
  return (
    <A href={getArticleUrl(props.id)} class="block rounded-md focus-ring group">
      <article class="space-y-[.25rem]">
        <div class="flex gap-4">
          <DateLabel
            class="text-[.875rem] uppercase text-accent font-bold"
            date={props.date}
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

function ArticleList() {
  return (
    <section aria-label="articles" class="p-4 lg:pt-2">
      <ul class="space-y-6">
        <For each={ARTICLES_BY_YEAR_SORTED}>
          {([year, articles]) => {
            const isCurrentYear = +year === new Date().getFullYear();
            return (
              <section aria-label={`articles from ${year}`} class="space-y-6">
                <Show when={!isCurrentYear}>
                  <time
                    class="block text-[1.125rem] font-bold pt-[1.25rem]"
                    datetime={year}
                  >
                    {year}
                  </time>
                </Show>
                <For each={articles}>
                  {(article) => <ArticleItem {...article} />}
                </For>
              </section>
            );
          }}
        </For>
      </ul>
    </section>
  );
}

export default function Index() {
  return (
    <div class="space-y-6">
      <Highlights />
      <div
        class={clsx(
          "space-y-4",
          "lg:flex lg:gap-x-12 lg:flex-row-reverse lg:desktop-container"
        )}
      >
        <Topics />
        <ArticleList />
      </div>
    </div>
  );
}
