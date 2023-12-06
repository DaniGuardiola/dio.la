import { createSignal } from "solid-js";

export function isDarkTheme() {
  if (typeof window === "undefined") return false;
  if (localStorage.theme === "dark") return true;
  // sadly, there is no way to do "dark mode by default,
  // light theme if the user wants it" because the default for
  // "prefers-color-scheme" is "light" and "no-preference" was
  // removed from the spec, so this is the only way ¯\_(ツ)_/¯
  // return (
  //   !("theme" in localStorage) &&
  //   window.matchMedia("(prefers-color-scheme: dark)").matches
  return !("theme" in localStorage);
}

export function ThemeScript() {
  return (
    <script>
      {`{
        function isDarkTheme() {
          if (localStorage.theme === "dark") return true;
          return (
            !("theme" in localStorage) &&
            window.matchMedia("(prefers-color-scheme: dark)").matches
          );
        }
        document.documentElement.classList.add(isDarkTheme() ? "dark": "light");
      }`}
    </script>
  );
}

export const [theme, setTheme] = createSignal<"light" | "dark">(
  isDarkTheme() ? "dark" : "light"
);

export function toggleTheme() {
  if (typeof window === "undefined") return;
  setTheme((previousTheme) => (previousTheme === "dark" ? "light" : "dark"));
  localStorage.theme = theme();
}
