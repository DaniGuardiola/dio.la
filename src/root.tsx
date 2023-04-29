// @refresh reload
import "./root.sass";
import "./fonts.sass";

import clsx from "clsx";
import { type ComponentProps, Suspense } from "solid-js";
import {
  A,
  Body,
  ErrorBoundary,
  FileRoutes,
  Head,
  Html,
  Link,
  Meta,
  Routes,
  Scripts,
} from "solid-start";

import { HeadMetadata } from "./components/HeadMetadata";
import { SkipLinkArea } from "./components/SkipLinks";
import {
  CANONICAL_DOMAIN,
  SITE_DESCRIPTION,
  UMAMI_DRAFTS_ID,
  UMAMI_ID,
} from "./data/config";
import { isDrafts, isLocalhost } from "./utils/is-host";
import {
  headerScrolled,
  scrolledAtTop,
  setUpPageScroll,
} from "./utils/page-scroll";
import { theme, ThemeScript, toggleTheme } from "./utils/theme";

function NavLink(props: ComponentProps<typeof A>) {
  return (
    <A
      rel="noreferrer"
      {...props}
      activeClass="enabled font-bold text-accent pointer-events-none"
      inactiveClass="disabled hover:underline"
      class={clsx(
        "text-[1.1rem] leading-[1.5rem] focus-ring rounded-sm flex",
        "sm:text-[1.25rem]"
      )}
    >
      <span
        class={clsx(
          "block overflow-hidden font-bold transition-[width,opacity,color]",
          "[.enabled>&]:w-4",
          "[.disabled>&]:w-0 [.disabled>&]:opacity-0"
        )}
      >
        {"> "}
      </span>
      {props.children}
    </A>
  );
}

function ThemeToggle() {
  return (
    <div class="ml-4 flex items-end">
      <button
        aria-label="toggle theme"
        class="focus-ring rounded text-[1.1rem] leading-[1.3rem]"
        onClick={toggleTheme}
      >
        <span class="hidden dark:inline">☼</span>
        <span class="dark:hidden">🌗︎</span>
      </button>
    </div>
  );
}

function Header() {
  return (
    <header
      class="fixed z-20 inset-x-0 top-0 bg-white/95 dark:bg-black/95 select-none transition-[height] flex items-center overflow-hidden"
      classList={{
        "h-[5rem] sm:h-[11.25rem]": !headerScrolled(),
        "h-[3.5rem] sm:h-[4.5rem]": headerScrolled(),
        "shadow-[0_2px_4px_rgba(0,0,0,.25)]": !scrolledAtTop(),
      }}
    >
      <div class="main-container px-4 w-full mx-auto flex">
        <A
          href="/"
          aria-label="go to homepage"
          class="group focus-ring rounded-sm"
          activeClass="pointer-events-none"
          end
        >
          <p
            class={clsx(
              "text-[2rem] font-bold leading-[85%] underline-offset-4 decoration-4",
              "min-[400px]:text-[2.5rem]",
              "sm:transition-[font-size]"
            )}
            classList={{
              "sm:text-[5.375rem]": !headerScrolled(),
              "sm:text-[3rem]": headerScrolled(),
            }}
          >
            <span class="group-hover:underline">dio</span>
            <span class="text-accent decoration-accent">
              <span>.</span>
              <span class="group-hover:underline">la</span>
            </span>
          </p>
          <p
            class={clsx(
              "max-sm:hidden",
              "text-[1.4375rem] transition-[height,opacity]"
            )}
            classList={{
              "h-[2.1875rem]": !headerScrolled(),
              "h-0 opacity-0": headerScrolled(),
            }}
          >
            Dani Guardio<span class="text-accent">la</span>’s blog
          </p>
        </A>
        <nav class={clsx("ml-auto flex items-end gap-3", "sm:gap-6")}>
          <NavLink href="/" end aria-label="articles">
            articles
          </NavLink>
          <NavLink
            href="https://twitter.com/daniguardio_la"
            target="_blank"
            aria-label="twitter profile"
          >
            twitter
          </NavLink>
          <NavLink href="/about" aria-label="about Dani">
            about
          </NavLink>
        </nav>
        <ThemeToggle />
      </div>
    </header>
  );
}

function DraftsNotice() {
  return (
    <a
      href="https://dio.la/"
      class="text-dark group fixed top-0 right-0 z-[999] border-y-2 border-black rotate-45 translate-x-24 translate-y-20 px-20 py-1 bg-slate-200 text-lg whitespace-nowrap select-none shadow-md hover:scale-110 transition-transform animate-pulse"
    >
      <p>
        You're looking at my <span class="font-bold">drafts</span>!
      </p>
      <p>
        Visit the main site:{" "}
        <span class="group-hover:underline font-bold text-accent">dio.la</span>
      </p>
    </a>
  );
}

export default function Root() {
  setUpPageScroll();
  // setUpViewTransitions(); // causes issues when navigating to a topic :(

  return (
    <Html class={theme()} lang="en" prefix="og: http://ogp.me/ns#">
      <Head>
        <Meta charset="utf-8" />
        {/* prevent indexing drafts website */}
        {isDrafts() && <Meta name="robots" content="noindex" />}
        <Link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <Link rel="icon" type="image/png" href="/favicon.png" />
        <HeadMetadata
          url={`https://${CANONICAL_DOMAIN}/`}
          description={SITE_DESCRIPTION}
        />
        <Meta name="viewport" content="width=device-width, initial-scale=1" />
        <Link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossorigin="anonymous"
        />
        {!isLocalhost() && (
          <script
            async
            defer
            src="https://analytics.umami.is/script.js"
            data-website-id={isDrafts() ? UMAMI_DRAFTS_ID : UMAMI_ID}
            data-domains="dio.la,drafts.dio.la"
          />
        )}
        <ThemeScript />
      </Head>
      <Body>
        <ErrorBoundary>
          <SkipLinkArea />
          <Header />
          <Suspense>
            <main class="pt-[5rem] sm:pt-[11.25rem]">
              <Routes>
                <FileRoutes />
              </Routes>
            </main>
          </Suspense>
        </ErrorBoundary>
        {isDrafts() && <DraftsNotice />}
        <Scripts />
      </Body>
    </Html>
  );
}
