// Run in a separate browser-conditioned Bun process; normal Bun imports server Solid.
import assert from "node:assert/strict";

import { createRoot, flush, untrack } from "solid-js";

import { useAnimateBanner } from "./animate-banner";
import { articleScrolled, setUpPageScroll } from "./page-scroll";

const windowStub = Object.assign(new EventTarget(), {
  scrollY: 0,
  matchMedia: () => ({ matches: false })
});
Object.defineProperty(globalThis, "window", { value: windowStub });
const frames = new Map<number, FrameRequestCallback>();
let frameId = 0;
Object.defineProperty(globalThis, "requestAnimationFrame", {
  value: (callback: FrameRequestCallback) => {
    frames.set(++frameId, callback);
    return frameId;
  }
});
Object.defineProperty(globalThis, "cancelAnimationFrame", {
  value: (id: number) => frames.delete(id)
});
function runFrame() {
  const callbacks = [...frames.values()];
  frames.clear();
  callbacks.forEach((callback) => callback(0));
  flush();
}

const disposeScroll = createRoot((dispose) => {
  setUpPageScroll();
  return dispose;
});
flush();
windowStub.scrollY = 100000;
windowStub.dispatchEvent(new Event("scroll"));
flush();
assert.equal(untrack(articleScrolled), true);
disposeScroll();
windowStub.scrollY = 0;
windowStub.dispatchEvent(new Event("scroll"));
flush();
assert.equal(untrack(articleScrolled), true, "disposed scroll listener must stop updating state");

const storage = { theme: "dark" };
Object.defineProperty(globalThis, "localStorage", { value: storage });
const documentStub = {
  startViewTransition: undefined as undefined | ((callback: () => void) => void)
};
Object.defineProperty(globalThis, "document", { value: documentStub });
const { theme, toggleTheme, isDarkTheme } = await import("./theme");
storage.theme = "invalid";
assert.equal(isDarkTheme(), true, "invalid stored preferences use the dark default");
storage.theme = "light";
assert.equal(isDarkTheme(), false);
storage.theme = "dark";
toggleTheme();
assert.equal(storage.theme, "light", "persist the new theme, not the queued signal's old value");
flush();
assert.equal(untrack(theme), "light");
documentStub.startViewTransition = (callback) => callback();
toggleTheme();
assert.equal(storage.theme, "dark");
flush();
assert.equal(untrack(theme), "dark");

Object.defineProperty(storage, "theme", {
  configurable: true,
  get() {
    throw new Error("Storage denied");
  },
  set() {
    throw new Error("Storage denied");
  }
});
assert.equal(isDarkTheme(), true, "blocked storage must not break initialization");
toggleTheme();
flush();
assert.equal(untrack(theme), "light", "theme switching must work without persistence");

function mountBanner(height: number) {
  const element = Object.assign(new EventTarget(), {
    offsetHeight: height
  }) as unknown as HTMLElement;
  let banner!: ReturnType<typeof useAnimateBanner>;
  const dispose = createRoot((dispose) => {
    banner = useAnimateBanner();
    return dispose;
  });
  banner.animateBannerRef(element);
  flush();
  return { ...banner, dispose };
}
const initial = mountBanner(100);
runFrame();
initial.dispose();
const next = mountBanner(200);
runFrame();
assert.equal(untrack(next.animateBannerStyle)?.height, "100px");
assert.equal(frames.size, 1);
next.dispose();
assert.equal(frames.size, 0, "navigation must cancel the pending animation frame");
runFrame();
assert.equal(
  untrack(next.animateBannerStyle)?.height,
  "100px",
  "disposed animation must not write later"
);
