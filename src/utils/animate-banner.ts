import { type JSX } from "@solidjs/web";
import { createEffect, createSignal } from "solid-js";

const ANIMATION_DURATION = 150;
// Navigation history, not a reactive input: recording a height must not restart animation.
let previousBannerHeight: number | undefined;

type UseAnimateBannerOptions = {
  bannerEl?: () => HTMLElement | undefined;
  heightOffsetEl?: () => HTMLElement | undefined;
};

export function useAnimateBanner({ bannerEl, heightOffsetEl }: UseAnimateBannerOptions = {}) {
  const [bannerRef, setBannerRef] = createSignal<HTMLElement>();
  const [style, setStyle] = createSignal<JSX.CSSProperties>();

  createEffect(
    () => ({ banner: bannerEl ? bannerEl() : bannerRef(), offset: heightOffsetEl?.() }),
    ({ banner, offset }) => {
      if (!banner) return;
      setStyle(undefined);
      let frame = requestAnimationFrame(() => {
        const heightOffset = offset?.offsetHeight ?? 0;
        const targetHeight = banner.offsetHeight;
        const fromHeight = (previousBannerHeight ?? targetHeight + heightOffset) - heightOffset;
        previousBannerHeight = targetHeight + heightOffset;
        if (
          fromHeight === targetHeight ||
          window.matchMedia("(prefers-reduced-motion: reduce)").matches
        )
          return;

        setStyle({ height: `${fromHeight}px` });
        frame = requestAnimationFrame(() => {
          setStyle({
            transition: `height ${ANIMATION_DURATION}ms ease-out`,
            height: `${targetHeight}px`
          });
          banner.addEventListener("transitionend", finish, { once: true });
          timer = setTimeout(finish, ANIMATION_DURATION + 100);
        });
      });
      let timer: ReturnType<typeof setTimeout> | undefined;
      const finish = () => {
        banner.removeEventListener("transitionend", finish);
        clearTimeout(timer);
        setStyle(undefined);
      };
      return () => {
        cancelAnimationFrame(frame);
        clearTimeout(timer);
        banner.removeEventListener("transitionend", finish);
      };
    }
  );

  return { animateBannerRef: setBannerRef, animateBannerStyle: style };
}
