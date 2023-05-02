import { createSignal, type JSX, onCleanup, onMount } from "solid-js";

const ANIMATION_DURATION = 150;

function raf() {
  return new Promise(requestAnimationFrame);
}

const [previousBannerHeight, setPreviousBannerHeight] = createSignal<number>();

type UseAnimateBannerOptions = {
  heightOffsetEl?: () => HTMLElement | undefined;
};

export function useAnimateBanner({
  heightOffsetEl,
}: UseAnimateBannerOptions = {}) {
  const [bannerRef, setBannerRef] = createSignal<HTMLElement>();
  const [style, setStyle] = createSignal<JSX.CSSProperties>();
  const [done, setDone] = createSignal(false);

  async function triggerAnimation(from: number, to: number, onEnd: () => void) {
    function cleanUp() {
      if (done()) return;
      setStyle(undefined);
      onEnd();
      setDone(false);
    }

    setDone(false);
    // setup animation
    setStyle({ height: `${from}px` });
    await raf();
    // execute animation
    setStyle({
      transition: `height ${ANIMATION_DURATION}ms ease-out`,
      height: `${to}px`,
    });
    // wait for animation to end
    bannerRef()?.addEventListener("transitionend", cleanUp, { once: true });
    // timeout fallback
    setTimeout(cleanUp, ANIMATION_DURATION + 100);
  }

  onCleanup(() => setDone(true));

  onMount(() => {
    const heightOffset = heightOffsetEl?.()?.offsetHeight ?? 0;
    const bannerHeight = bannerRef()?.offsetHeight ?? 0;
    const previousHeight = (previousBannerHeight() ?? 0) - heightOffset;

    requestAnimationFrame(async () => {
      if (!previousBannerHeight())
        setPreviousBannerHeight(bannerHeight + heightOffset);
      else {
        await triggerAnimation(previousHeight, bannerHeight, () =>
          setPreviousBannerHeight(bannerHeight + heightOffset)
        );
      }
    });
  });

  return { animateBannerRef: setBannerRef, animateBannerStyle: style };
}
