// @refresh reload
import clsx from "clsx";
import {
  ComponentProps,
  createEffect,
  createSignal,
  onCleanup,
  Suspense,
} from "solid-js";
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
import "./root.sass";

const SCROLL_OFFSET = 420;

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

function Header() {
  const [atTop, setAtTop] = createSignal(false);
  const [scrolled, setScrolled] = createSignal(false);

  if (typeof window !== "undefined") {
    function updateScrolled() {
      window.scrollY === 0 ? setAtTop(true) : setAtTop(false);
      window.scrollY > SCROLL_OFFSET ? setScrolled(true) : setScrolled(false);
    }
    createEffect(() => {
      updateScrolled();
      window?.addEventListener("scroll", updateScrolled);
      onCleanup(() => window?.removeEventListener("scroll", updateScrolled));
    });
  }

  return (
    <header
      class="fixed z-20 inset-x-0 top-0 bg-white select-none transition-[height] flex items-center overflow-hidden"
      classList={{
        "h-[5rem] sm:h-[11.25rem]": !scrolled(),
        "h-[3.5rem] sm:h-[4.5rem]": scrolled(),
        "shadow-[0_2px_4px_rgba(0,0,0,.25)]": !atTop(),
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
              "xs:text-[2.5rem]",
              "sm:transition-[font-size]"
            )}
            classList={{
              "sm:text-[5.375rem]": !scrolled(),
              "sm:text-[3rem]": scrolled(),
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
              "h-[2.1875rem]": !scrolled(),
              "h-0 opacity-0": scrolled(),
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
      </div>
    </header>
  );
}

export default function Root() {
  return (
    <Html lang="en" prefix="og: http://ogp.me/ns#">
      <Head>
        <HeadMetadata
          url="https://dio.la/"
          title="dio.la - Dani Guardiola's blog"
          description="Software engineering, web development, and life!"
        />
        <Meta charset="utf-8" />
        <Meta name="viewport" content="width=device-width, initial-scale=1" />
        <Link rel="preconnect" href="https://fonts.googleapis.com" />
        <Link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossorigin="anonymous"
        />
        <Link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap"
          rel="stylesheet"
        />
        <Link
          href="https://fonts.googleapis.com/css2?family=Roboto+Mono:wght@400;700&family=Roboto+Slab&display=swap"
          as="style"
          rel="preload"
        />
      </Head>
      <Body>
        <ErrorBoundary>
          <div id="skip-link-area" />
          <Header />
          <Suspense>
            <main class="pt-[5rem] sm:pt-[11.25rem]">
              <Routes>
                <FileRoutes />
              </Routes>
            </main>
          </Suspense>
        </ErrorBoundary>
        <Scripts />
      </Body>
    </Html>
  );
}
