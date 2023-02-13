import { createEffect, createSignal, onCleanup, onMount } from "solid-js";

import { ARTICLE_SCROLL_OFFSET, HEADER_SCROLL_OFFSET } from "~/data/config";

export const [scrolledAtTop, setScrolledAtTop] = createSignal(true);
export const [headerScrolled, setHeaderScrolled] = createSignal(false);
export const [articleScrolled, setArticleScrolled] = createSignal(false);

function updateScrolled() {
  if (typeof window === "undefined") return;
  setScrolledAtTop(window.scrollY === 0);
  setHeaderScrolled(window.scrollY > HEADER_SCROLL_OFFSET);
  setArticleScrolled(window.scrollY > ARTICLE_SCROLL_OFFSET);
}

export function setUpPageScroll() {
  onMount(updateScrolled);

  createEffect(() => {
    window?.addEventListener("scroll", updateScrolled);
    onCleanup(() => window?.removeEventListener("scroll", updateScrolled));
  });
}
