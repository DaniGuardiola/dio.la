import "./print.css";

import { createEffect, createSignal, For, Show } from "solid-js";

import { HeadMetadata } from "~/components/HeadMetadata";
import { CANONICAL_DOMAIN } from "~/data/config";
import { theme, toggleTheme } from "~/utils/theme";

import { CAREER } from "./career";
import { Link } from "./shared";

const [tldr, _setTldr] = createSignal(true);
const [recentFirst, _setRecentFirst] = createSignal(false);

const params = new URLSearchParams(
  typeof window === "undefined" ? "" : window.location.search
);

function setTldr(value: boolean) {
  _setTldr(value);
  if (!value) params.set("tldr", "false");
  else params.delete("tldr");
  history.replaceState(null, "", "?" + params.toString());
}
function setRecentFirst(value: boolean) {
  _setRecentFirst(value);
  if (value) params.set("recent-first", "true");
  else params.delete("recent-first");
  history.replaceState(null, "", "?" + params.toString());
}

function Heading() {
  return (
    <div>
      <div class="flex flex-col-reverse md:flex-row items-baseline justify-between">
        <h1 class="font-bold text-5xl">Dani Guardiola</h1>
        <span class="text-subtle-invert text-sm">
          <span class="not-print:hidden">
            <Link subtle href="mailto:hi@daniguardio.la">
              hi@daniguardio.la
            </Link>{" "}
            ·{" "}
            <Link subtle href="https://cal.com/dio.la/30min">
              cal.com/dio.la
            </Link>
          </span>
          <span class="print:hidden">
            <button
              class="underline hover:decoration-2 hover:text-dark-invert"
              onClick={() => setTldr(!tldr())}
            >
              {tldr() ? "show details" : "hide details (TL;DR)"}
            </button>{" "}
            ·{" "}
            <button
              class="underline hover:decoration-2 hover:text-dark-invert"
              onClick={toggleTheme}
            >
              {theme() === "dark" ? "light" : "dark"} theme
            </button>
          </span>
        </span>
      </div>
      <p class="text-lg text-subtle-invert font-bold">
        Software developer · 10+ years{" "}
      </p>
    </div>
  );
}

function Skills() {
  return (
    <Show
      when={tldr()}
      children={
        <ul>
          <li>
            HTML · CSS · JavaScript · TypeScript · web APIs · Tailwind CSS ·
            Radix
          </li>
          <li>
            React · Next.js · Node.js · Bun · Prisma · GraphQL · PostgreSQL
          </li>
        </ul>
      }
      fallback={
        <ul class="list-disc list-inside">
          <li>Web: HTML, CSS, web APIs, design systems.</li>
          <li>JavaScript and TypeScript (certified wizard™).</li>
          <li>React and Solid.js.</li>
          <li>Next.js, Tailwind CSS, Radix, Ariakit.</li>
          <li>Node.js, Prisma, GraphQL, PostgreSQL.</li>
          <li>ASTs, tooling, compilers, code generation.</li>
        </ul>
      }
    />
  );
}

function Introduction() {
  return (
    <section aria-label="Introduction" class="flex flex-col gap-4 text-base">
      <Show when={!tldr()}>
        <p>
          Passionate about software and user interfaces. TypeScript and React
          expert.
        </p>
      </Show>
      <Show
        when={tldr()}
        children={
          <>
            <p>
              <span class="print:hidden">
                <Link subtle href="mailto:hi@daniguardio.la">
                  hi@daniguardio.la
                </Link>{" "}
                ·{" "}
                <Link subtle href="https://cal.com/dio.la/30min">
                  cal.com/dio.la
                </Link>{" "}
                /{" "}
              </span>
              <Link subtle href="https://github.com/DaniGuardiola">
                github.com/DaniGuardiola
              </Link>{" "}
              ·{" "}
              <Link subtle href="https://dio.la">
                dio.la
              </Link>{" "}
              ·{" "}
              <Link subtle href="https://twitter.com/daniguardio_la">
                @daniguardio_la
              </Link>
            </p>
            <Skills />
          </>
        }
        fallback={
          <div class="flex gap-2 flex-wrap">
            <details class="border-2 border-accent rounded p-2">
              <summary class="select-none">A brief history of me</summary>
              <div class="flex flex-col gap-8 text-base pt-4">
                <p>
                  When I was 4, my family's rusty old computer (still running
                  Windows 98) became my first machine. They probably expected me
                  to play games, but I was more interested in messing with the
                  poor computer by running experiments like deleting system
                  files until it crashed. I soon discovered webpages, which I'd
                  spend hours creating with the ancient{" "}
                  <Link href="https://en.wikipedia.org/wiki/Microsoft_FrontPage">
                    Microsoft FrontPage
                  </Link>{" "}
                  and an HTML book someone had gifted me for Christmas.
                </p>
                <p>
                  At 15, I learned how to code and built my first app,{" "}
                  <Link href="https://chromewebstore.google.com/detail/timedoser/cmkneeaihlcdllananjlkmppnkdahdcc">
                    TimeDoser
                  </Link>
                  , which reached over 59k+ installs, 23k+ weekly active users,
                  and a high user rating. It also garnered media attention,
                  being featured on a few websites, including{" "}
                  <Link href="https://lifehacker.com/timedoser-is-a-pomodoro-timer-for-chrome-1639626091">
                    Lifehacker
                  </Link>{" "}
                  and{" "}
                  <Link href="https://www.omgchrome.com/pomodoro-app-for-google-chrome/">
                    OMG! Chrome!
                  </Link>
                  .
                </p>
                <p>
                  By 17, I had my first job at a tech company, launching my
                  professional career as a full-time software developer. Since
                  then, I've worked with companies (mostly startups), built a
                  few personal projects, and contributed to open-source.
                </p>
                <p>
                  I recent years, I've worked with Silicon Valley startups,
                  specializing in TypeScript, React, Next.js, design systems,
                  rich text editors and tooling. I love building and I never
                  waste a chance to take on ambitious tasks. I enjoy a good
                  challenge.
                </p>
              </div>
            </details>
            <details class="border-2 border-accent rounded p-2">
              <summary class="select-none">Skills and knowledge</summary>
              <div class="flex flex-col gap-8 text-base pt-4">
                <p>
                  I've worked with many technologies and stacks, but I don't
                  think listing every little thing is useful. Instead, here's a
                  brief list of the things I currently have professional
                  expertise in:
                </p>
                <Skills />
              </div>
            </details>
          </div>
        }
      />
      <Show
        when={!tldr()}
        children={
          <>
            <p>
              I blog at <Link href="https://dio.la">dio.la</Link>, tweet at{" "}
              <Link href="https://twitter.com/daniguardio_la">
                @daniguardio_la
              </Link>
              , and publish open-source at{" "}
              <Link href="https://github.com/DaniGuardiola">
                github.com/DaniGuardiola
              </Link>
              .
            </p>
            <p>
              Reach me at{" "}
              <Link href="mailto:hi@daniguardio.la">hi@daniguardio.la</Link> or
              schedule a call through{" "}
              <Link href="https://cal.com/dio.la/30min">cal.com/dio.la</Link>.
            </p>
          </>
        }
      />
    </section>
  );
}

function CareerTldr() {
  return (
    <section class="space-y-8 text-dark-invert md:columns-2 gap-10">
      <div class="flex items-baseline gap-4">
        <h1 class="text-2xl font-bold text-accent">Career</h1>
        <span class="text-subtle-invert text-sm print:hidden">
          {recentFirst() ? "recent first" : "chronological"} -{" "}
          <button
            class="underline hover:decoration-2 hover:text-dark-invert"
            onClick={() => setRecentFirst(!recentFirst())}
          >
            change
          </button>
        </span>
      </div>
      <For each={recentFirst() ? CAREER.toReversed() : CAREER}>
        {(entry) => (
          <>
            <article class="flex flex-col gap-4 break-inside-avoid-column">
              <div>
                <h1>
                  <span class="font-bold">{entry.at}</span>
                  {entry.role && <span> · {entry.role}</span>}
                </h1>
                <p class="text-sm text-subtle-invert">
                  <span class="uppercase font-bold">
                    {entry.from}
                    {entry.to && ` - ${entry.to}`}
                  </span>
                  <span>{entry.duration && ` · ${entry.duration}`}</span>
                </p>
                <Show when={entry.stack?.length}>
                  <p class="mt-1 text-sm text-accent font-bold dark:font-normal">
                    {entry.stack
                      ?.map((s) => {
                        if (s === "JavaScript") return "JS";
                        if (s === "TypeScript") return "TS";
                        return s;
                      })
                      .join(" · ")}
                  </p>
                </Show>
              </div>
              <div class="flex flex-col gap-2">
                {entry.shortDescription?.() ?? entry.description()}
              </div>
            </article>
          </>
        )}
      </For>
    </section>
  );
}

function Career() {
  return (
    <section class="flex flex-col gap-4 text-dark-invert">
      <div class="flex items-baseline justify-between gap-4">
        <h1 class="text-2xl font-bold text-accent">Career</h1>
        <span class="text-subtle-invert text-sm">
          Showing {recentFirst() ? "most recent first" : "chronologically"} -{" "}
          <button
            class="underline hover:decoration-2 hover:text-dark-invert"
            onClick={() => setRecentFirst(!recentFirst())}
          >
            change
          </button>
        </span>
      </div>
      <div class="py-2 flex flex-col gap-8">
        <For each={recentFirst() ? CAREER.toReversed() : CAREER}>
          {(entry, index) => (
            <>
              {index() !== 0 && <hr class="border-black-invert/20" />}
              <article class="flex flex-col gap-6">
                {entry.logo && (
                  <img src={entry.logo} class="max-h-12 rounded self-start" />
                )}
                <div>
                  <h1>
                    <span class="font-bold">{entry.at}</span>
                    {entry.role && <span> · {entry.role}</span>}
                  </h1>
                  <p class="text-sm text-subtle-invert">
                    <span class="uppercase font-bold">
                      {entry.from}
                      {entry.to && ` - ${entry.to}`}
                    </span>
                    <span>{entry.duration && ` · ${entry.duration}`}</span>
                  </p>
                  <Show when={entry.stack?.length}>
                    <div class="flex gap-2 flex-wrap mt-2">
                      <For each={entry.stack}>
                        {(tech) => (
                          <span class="text-sm text-subtle-white-invert bg-accent text-white rounded px-2">
                            {tech}
                          </span>
                        )}
                      </For>
                    </div>
                  </Show>
                </div>
                <div class="flex flex-col gap-4">{entry.description()}</div>
              </article>
            </>
          )}
        </For>
      </div>
    </section>
  );
}

function Notes() {
  return (
    <section class="flex flex-col gap-2">
      <h1 class="text-2xl font-bold text-accent">Notes</h1>
      <h2 class="font-bold text-dark-invert mt-6">Remote work</h2>
      <p>
        I've spent about half of my career working remotely, and I love it. I've
        gotten good at working autonomously, managing my time, and communicating
        asynchronously - even across multiple time zones.
      </p>
      <h2 class="font-bold text-dark-invert mt-6">Freelance work</h2>
      <p>
        Throughout my career, I've worked on multiple freelance projects. I've
        created from simple static pages to full-fledged applications. Other
        examples include{" "}
        <Link href="https://github.com/DaniGuardiola/telegram-welcome-bot">
          a Telegram bot
        </Link>
        , some server-scripting tasks, and web-scraping tools.
      </p>
      <h2 class="font-bold text-dark-invert mt-6">
        Free and open-source software
      </h2>
      <p>
        I am an advocate for free (as in freedom) software, and I try to
        contribute to the community whenever possible. Most of my side projects
        are open-source, and I donate regularly. Notably, I'm a top donor to the{" "}
        <Link href="https://opencollective.com/ariakit">Ariakit</Link> project:
        $600 donated personally to date, and $1500 donated by my previous
        employer at my request.
      </p>
      <h2 class="font-bold text-dark-invert mt-6">Languages</h2>
      <p>
        I am proficient in English, having worked with American companies
        exclusively for the past three years. Most of my writing (and tweeting)
        is done in English too. I am also a native Spanish speaker
      </p>
      <h2 class="font-bold text-dark-invert mt-6">Fun facts</h2>
      <ul class="list-disc list-inside space-y-2">
        <li>
          My team was a runner-up at the 2017 European Techcrunch hackathon. The
          project was a conditional basic income financed by distributed crypto
          mining in websites.{" "}
          <Link href="https://devpost.com/software/altrui-st">
            Here's the pitch
          </Link>
          .
        </li>
        <li>
          I built this resume with Solid and Tailwind CSS. You can read the
          source{" "}
          <Link href="https://github.com/DaniGuardiola/dio.la/blob/main/src/routes/me/index.tsx">
            here
          </Link>
          .
        </li>
        <li>
          The <Link href="https://notmylinkedin.com/">notmylinkedin.com</Link>{" "}
          domain redirects to this page. It might seem that I bought it just for
          the memes, but it is actually part of an exploit I've used in
          vulnerable job search websites just so that I could avoid creating a
          LinkedIn account.{" "}
          <Link href="https://dio.la/article/unlinked">
            Here's the full story
          </Link>
          .
        </li>
      </ul>
    </section>
  );
}

function BackgroundTexture() {
  return (
    <div class="absolute -z-10 top-0 w-full h-[11rem] sm:h-[16rem] bg-[radial-gradient(circle_at_1px_1px,var(--subtle-invert)_1px,transparent_0)] bg-[length:30px_30px]">
      <div class="absolute w-full h-full bg-gradient-to-b from-transparent to-gray-100 dark:to-neutral-950" />
    </div>
  );
}

export default function Me() {
  createEffect(() => {
    _setTldr(params.get("tldr") !== "false");
    _setRecentFirst(params.get("recent-first") === "true");
  });
  return (
    <>
      <BackgroundTexture />
      <div class="main-container px-4 py-16 sm:py-32 flex flex-col gap-8 text-dark-invert print:px-12 print:!py-16">
        <HeadMetadata
          url={`https://${CANONICAL_DOMAIN}/me`}
          title={"Not Dani Guardiola's Linkedin"}
          titleSuffix={false}
          description={"About me & career"}
          image="/open-graph/hacking-linkedin.png"
          type="website"
        />
        <Heading />
        <Introduction />
        <Show when={tldr()} children={<CareerTldr />} fallback={<Career />} />
        <Show when={!tldr()}>
          <Notes />
        </Show>
        <button
          class="mt-16 self-start text-subtle-invert underline hover:decoration-2 hover:text-dark-invert"
          onClick={toggleTheme}
        >
          {theme() === "dark" ? "light" : "dark"} theme
        </button>
      </div>
    </>
  );
}
