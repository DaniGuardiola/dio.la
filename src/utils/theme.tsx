import { createSignal } from "solid-js";

export function isDarkTheme() {
  if (typeof window === "undefined") return false;
  if (localStorage.theme === "dark") return true;
  return (
    !("theme" in localStorage) &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
  );
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
