import { useBeforeLeave } from "@solidjs/router";
import { createEffect, on } from "solid-js";
import { useLocation } from "solid-start";

declare global {
  interface Document {
    startViewTransition(callback: () => void): void;
  }
}

export function setUpViewTransitions() {
  let doneRouting: ((value?: unknown) => void) | undefined;
  useBeforeLeave((event) => {
    if (typeof document === "undefined" || !document.startViewTransition)
      return;
    event.preventDefault();
    document.startViewTransition(
      () =>
        new Promise((res) => {
          event.retry(true);
          doneRouting = res;
        })
    );
  });

  const location = useLocation();
  createEffect(
    on(
      () => location.pathname,
      () => {
        doneRouting?.();
        doneRouting = undefined;
      },
      { defer: true }
    )
  );
}
