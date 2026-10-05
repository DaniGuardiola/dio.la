// @refresh reload
import "./root.css";
import "./fonts.css";
import { type ComponentProps } from "@solidjs/web";
import { HeadContent, Scripts } from "@tanstack/solid-router";
import clsx from "clsx";
import { createMemo, Show } from "solid-js";

import { A, useLocation } from "~/utils/routing";

import { DarkThemeIcon, LightThemeIcon } from "./components/icons";
import { SkipLinkArea } from "./components/SkipLinks";
import { UMAMI_DRAFTS_ID, UMAMI_ID } from "./data/config";
import { isDrafts, isLocalhost } from "./utils/is-host";
import { headerScrolled, scrolledAtTop, setUpPageScroll } from "./utils/page-scroll";
import { theme, ThemeScript, toggleTheme } from "./utils/theme";

function NavLink(props: ComponentProps<typeof A>) {
  return (
    <A
      rel="noreferrer"
      {...props}
      activeClass="enabled font-bold text-accent-invert pointer-events-none"
      inactiveClass="disabled hover:underline"
      class="text-[1.1rem] leading-[1.3rem] focus-ring rounded-xs flex"
    >
      <span
        class={clsx(
          "block w-0 opacity-0 overflow-hidden font-bold transition-[width,opacity,color]",
          "[.enabled>&]:w-4 [.enabled>&]:opacity-100"
        )}
      >
        {"> "}
      </span>
      {props.children}
    </A>
  );
}

function ThemeToggle(props: ComponentProps<"div">) {
  return (
    <div {...props} class={clsx("ml-2 flex items-end", props.class)}>
      <button
        title="Toggle theme"
        aria-label="toggle theme"
        class="focus-ring rounded-sm w-8 h-6 flex items-center justify-center -mr-[.375rem]"
        onClick={toggleTheme}
      >
        <LightThemeIcon class="w-5 hidden dark:block" />
        <DarkThemeIcon class="w-5 dark:hidden" />
      </button>
    </div>
  );
}

function Header() {
  return (
    <header
      class={clsx(
        "fixed z-20 inset-x-0 top-0 select-none transition-[height,background-color] flex items-center overflow-hidden",
        {
          "h-[5rem] sm:h-[11.25rem] bg-white/95 dark:bg-neutral-900/95": !headerScrolled(),
          "h-[3.5rem] sm:h-[4.5rem] bg-white/80 dark:bg-neutral-900/80": headerScrolled(),
          "shadow-[0_2px_4px_rgba(0,0,0,.25)]": !scrolledAtTop()
        }
      )}
    >
      <div class="main-container px-4 w-full mx-auto flex">
        <A
          href="/"
          aria-label="go to homepage"
          class="group focus-ring rounded-xs"
          activeClass="pointer-events-none"
          end
        >
          <p
            class={clsx(
              clsx(
                "text-[2rem] font-bold leading-[85%] underline-offset-4 [&_*]:decoration-4",
                "min-[400px]:text-[2.5rem]",
                "sm:transition-[font-size]"
              ),
              {
                "sm:text-[5.375rem]": !headerScrolled(),
                "sm:text-[3rem]": headerScrolled()
              }
            )}
          >
            <span class="group-hover:underline">dio</span>
            <span class="text-accent-invert decoration-accent">
              <span>.</span>
              <span class="group-hover:underline">la</span>
            </span>
          </p>
          <p
            class={clsx(clsx("max-sm:hidden", "text-[1.4375rem] transition-[height,opacity]"), {
              "h-[2.1875rem]": !headerScrolled(),
              "h-0 opacity-0": headerScrolled()
            })}
          >
            Dani Guardio<span class="text-accent-invert">la</span>’s blog
          </p>
        </A>
        <nav class={clsx("ml-auto flex items-end gap-2", "sm:gap-4")}>
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
        <ThemeToggle class="relative top-[.05rem]" />
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
        <span class="group-hover:underline font-bold text-accent-invert">dio.la</span>
      </p>
    </a>
  );
}

const FULL_PAGE_PATHS = ["/me", "/me/"];

export default function Root(props: { children: import("@solidjs/web").JSX.Element }) {
  setUpPageScroll();

  const location = useLocation();
  const isFullPage = createMemo(() => FULL_PAGE_PATHS.some((path) => path === location().pathname));

  return (
    <html class={theme()} lang="en" prefix="og: http://ogp.me/ns#">
      <head>
        {/* Refresh head registration when navigating between article IDs. */}
        <Show when={location().pathname} keyed>
          {(_pathname) => <HeadContent />}
        </Show>
        <meta charset="utf-8" />
        {/* prevent indexing drafts website */}
        {isDrafts() && <meta name="robots" content="noindex" />}
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="icon" type="image/png" href="/favicon.png" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
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
      </head>
      <body>
        <SkipLinkArea />
        <Show when={!isFullPage()}>
          <Header />
        </Show>

        <main class={!isFullPage() ? "pt-[5rem] sm:pt-[11.25rem]" : ""}>{props.children}</main>

        {isDrafts() && <DraftsNotice />}
        <Scripts />
      </body>
    </html>
  );
}
