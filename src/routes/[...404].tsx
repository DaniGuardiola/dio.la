import { createSignal } from "solid-js";
import { A } from "solid-start";
import { HttpStatusCode } from "solid-start/server";

import tRexSvg from "./404-t-rex.svg";

const CURSOR_EFFECT_DELAY = 2000;
const CURSOR_EFFECT_INTERVAL = 70;
const TEXT_TO_APPEND = " - not found!";

export default function NotFound() {
  const [text, setText] = createSignal("404");
  const [remainingText, setRemainingText] = createSignal(TEXT_TO_APPEND);
  const [blinking, setBlinking] = createSignal(true);

  setTimeout(() => {
    const intervalId = setInterval(() => {
      setBlinking(false);

      setText(`${text()}${remainingText().charAt(0)}`);
      setRemainingText(remainingText().slice(1));

      if (remainingText().length > 0) return;

      clearInterval(intervalId);
      setBlinking(true);
    }, CURSOR_EFFECT_INTERVAL);
  }, CURSOR_EFFECT_DELAY);

  return (
    <>
      <HttpStatusCode code={404} />
      <div class="bg-accent">
        <h1 class="px-4 py-8 lg:main-container text-white font-roboto-mono font-bold text-3xl">
          {text()}
          <span class={blinking() ? "motion-safe:animate-blink" : undefined}>
            _
          </span>
        </h1>
      </div>
      <div class="p-4 min-h-[65vh] lg:main-container flex flex-col items-center justify-center space-y-8">
        <A href="/" class="text-accent hover:underline">
          Check out the homepage?
        </A>
        <img
          class="w-48 motion-safe:animate-pulse"
          src={tRexSvg}
          alt="Chromium's offline T-Rex illustration"
        />
      </div>
    </>
  );
}
