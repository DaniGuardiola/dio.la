import { createSignal, Show } from "solid-js";
import { Link, Outlet } from "solid-start";

import { HeadMetadata } from "~/components/HeadMetadata";
import { MDXContent } from "~/components/MDXContent";
import { SkipLink, SkipLinks } from "~/components/SkipLinks";
import { CANONICAL_DOMAIN } from "~/data/config";
import { useAnimateBanner } from "~/utils/animate-banner";

const TITLE = "Dani Guardiola (me!)";
const DESCRIPTION = "Software engineer, math and physics student.";
const PATHNAME = "/about";
const IMAGE_URL: string | undefined = "/img/me.webp";

function Header() {
  const [heightOffsetEl, setHeightOffsetEl] = createSignal<HTMLElement>();
  const { animateBannerRef, animateBannerStyle } = useAnimateBanner({
    heightOffsetEl: () => (IMAGE_URL ? heightOffsetEl() : undefined),
  });

  return (
    <>
      <Link
        href="https://fonts.googleapis.com/css2?family=Roboto+Mono:wght@400;700&family=Roboto+Slab&display=swap"
        rel="stylesheet"
      />
      <header
        ref={(el) => {
          if (IMAGE_URL) setHeightOffsetEl(el);
          else animateBannerRef(el);
        }}
        style={IMAGE_URL ? undefined : animateBannerStyle()}
        class="bg-accent pt-8 pb-6 text-white"
      >
        <div class="main-container px-4">
          <h1 class="font-roboto-slab text-[1.875rem]">{TITLE}</h1>
          <p class="text-[1.125rem] text-subtle-white py-2">{DESCRIPTION}</p>
        </div>
      </header>
      <Show when={IMAGE_URL}>
        <div class="relative">
          <div
            ref={(el) => {
              if (IMAGE_URL) animateBannerRef(el);
              else setHeightOffsetEl(el);
            }}
            style={IMAGE_URL ? animateBannerStyle() : undefined}
            class="absolute top-0 inset-x-0 -z-10 bg-accent h-[4rem] xs:h-[6rem] sm:h-[9rem] lg:h-[12rem]"
          />
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
        image={IMAGE_URL}
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
