import { Link } from "@solidjs/meta";
import { Show } from "solid-js";
import { Outlet } from "solid-start";

import { HeadMetadata } from "~/components/HeadMetadata";
import { MDXContent } from "~/components/MDXContent";
import { SkipLink, SkipLinks } from "~/components/SkipLinks";
import { CANONICAL_DOMAIN } from "~/data/config";
import { useAnimateBanner } from "~/utils/animate-banner";

const TITLE = "About me";
const DESCRIPTION =
  "Hi! I'm a software engineer with a passion for the web and design systems.";
const PATHNAME = "/about";
const IMAGE_URL: string | undefined = undefined;

function Header() {
  const { animateBannerRef, animateBannerStyle } = useAnimateBanner();

  return (
    <>
      <Link
        href="https://fonts.googleapis.com/css2?family=Roboto+Mono:wght@400;700&family=Roboto+Slab&display=swap"
        rel="stylesheet"
      />
      <header
        ref={animateBannerRef}
        style={animateBannerStyle()}
        class="bg-accent pt-8 pb-6 text-white"
      >
        <div class="main-container px-4">
          <h1 class="font-roboto-slab text-[1.875rem]">{TITLE}</h1>
          <p class="text-[1.125rem] text-subtle-white py-2">{DESCRIPTION}</p>
        </div>
      </header>
      <Show when={IMAGE_URL}>
        <div class="relative">
          <div class="absolute top-0 inset-x-0 -z-10 bg-accent h-[4rem] xs:h-[6rem] sm:h-[9rem] lg:h-[12rem]" />
          <div class="px-4 main-container">
            <img
              alt="This article's main image"
              src={IMAGE_URL}
              class="bg-white w-full object-cover aspect-[1.91/1] rounded shadow-lg"
            />
          </div>
        </div>
      </Show>
    </>
  );
}

export default function ArticleLayout() {
  return (
    <>
      <HeadMetadata
        url={`https://${CANONICAL_DOMAIN}${PATHNAME}`}
        title={TITLE}
        description={DESCRIPTION}
        image={IMAGE_URL} // TODO: support public dir path? (if starts with "/")
        type="article"
      />
      <SkipLinks links={[{ id: "content", label: "content" }]} />
      <div>
        <article>
          <Header />
          <div class="main-container p-4">
            <SkipLink id="content" />
            <MDXContent>
              <Outlet />
            </MDXContent>
          </div>
        </article>
      </div>
    </>
  );
}
