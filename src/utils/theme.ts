import { createSignal } from "solid-js";

export function isDarkTheme() {
  if (typeof window === "undefined") return true;
  // Dark by default; unavailable storage or an unknown value keeps that default.
  try {
    return localStorage.theme !== "light";
  } catch {
    return true;
  }
}

export const [theme, setTheme] = createSignal<"light" | "dark">(isDarkTheme() ? "dark" : "light");

export function toggleTheme() {
  if (typeof window === "undefined") return;
  function toggle() {
    // Solid 2 queues signal writes; reading theme() after setTheme returns the old value.
    const nextTheme = theme() === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    try {
      localStorage.theme = nextTheme;
    } catch {
      // Theme switching still works when the browser blocks persistence.
    }
  }
  if (!document.startViewTransition) return toggle();
  document.startViewTransition(toggle);
}
