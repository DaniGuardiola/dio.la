import { createSignal } from "solid-js";

export function isDarkTheme() {
  if (typeof window === "undefined") return true;
  if (!("theme" in localStorage)) return true;
  if (localStorage.theme === "dark") return true;
  if (localStorage.theme === "light") return false;
  throw new Error("huh?");
  // sadly, there is no way to do "dark mode by default,
  // light theme if the user wants it" because the default for
  // "prefers-color-scheme" is "light" and "no-preference" was
  // removed from the spec, so this is the only way ¯\_(ツ)_/¯

  // previous version:

  // if (typeof window === "undefined") return false;
  // if (localStorage.theme === "dark") return true;
  // if (localStorage.theme === "light") return false;
  // return (
  //   !("theme" in localStorage) &&
  //   window.matchMedia("(prefers-color-scheme: dark)").matches
}

export const [theme, setTheme] = createSignal<"light" | "dark">(isDarkTheme() ? "dark" : "light");

export function toggleTheme() {
  if (typeof window === "undefined") return;
  function toggle() {
    // Solid 2 queues signal writes; reading theme() after setTheme returns the old value.
    const nextTheme = theme() === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    localStorage.theme = nextTheme;
  }
  if (!document.startViewTransition) return toggle();
  document.startViewTransition(toggle);
}
