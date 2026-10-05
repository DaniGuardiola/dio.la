import { Link } from "@tanstack/solid-router";
import { createSignal, onSettled } from "solid-js";

import tRexSvg from "./404-t-rex.svg";

const CURSOR_EFFECT_DELAY = 2000;
const CURSOR_EFFECT_INTERVAL = 70;
const TEXT_TO_APPEND = " - not found!";

export default function NotFound() {
  const [text, setText] = createSignal("404");
  const [blinking, setBlinking] = createSignal(true);

  onSettled(() => {
    let index = 0;
    let intervalId: ReturnType<typeof setInterval> | undefined;
    const timeoutId = setTimeout(() => {
      intervalId = setInterval(() => {
        setBlinking(false);
        setText(`404${TEXT_TO_APPEND.slice(0, ++index)}`);
        if (index < TEXT_TO_APPEND.length) return;
        clearInterval(intervalId);
        setBlinking(true);
      }, CURSOR_EFFECT_INTERVAL);
    }, CURSOR_EFFECT_DELAY);
    return () => {
      clearTimeout(timeoutId);
      clearInterval(intervalId);
    };
  });

  return (
    <>
      <div class="bg-accent">
        <h1 class="px-4 py-8 lg:main-container text-white font-fira-code font-bold text-3xl">
          {text()}
          <span class={blinking() ? "motion-safe:animate-blink" : undefined}>_</span>
        </h1>
      </div>
      <div class="p-4 min-h-[65vh] lg:main-container flex flex-col items-center justify-center space-y-8">
        <Link to="/" class="text-accent-invert hover:underline">
          Check out the homepage?
        </Link>
        <img
          class="w-48 motion-safe:animate-pulse"
          src={tRexSvg}
          alt="Chromium's offline T-Rex illustration"
        />
      </div>
    </>
  );
}
