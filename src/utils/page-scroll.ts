import { createEffect, createSignal, onCleanup } from "solid-js";

import { ARTICLE_SCROLL_OFFSET, HEADER_SCROLL_OFFSET } from "~/data/config";

export const [scrolledAtTop, setScrolledAtTop] = createSignal(true);
export const [headerScrolled, setHeaderScrolled] = createSignal(false);
export const [articleScrolled, setArticleScrolled] = createSignal(false);

function updateScrolled() {
  if (typeof window === "undefined") return;
  window.scrollY === 0 ? setScrolledAtTop(true) : setScrolledAtTop(false);
  window.scrollY > HEADER_SCROLL_OFFSET
    ? setHeaderScrolled(true)
    : setHeaderScrolled(false);
  window.scrollY > ARTICLE_SCROLL_OFFSET
    ? setArticleScrolled(true)
    : setArticleScrolled(false);
}

if (typeof window !== "undefined") {
  createEffect(() => {
    updateScrolled();
    window?.addEventListener("scroll", updateScrolled);
    onCleanup(() => window?.removeEventListener("scroll", updateScrolled));
  });
}
