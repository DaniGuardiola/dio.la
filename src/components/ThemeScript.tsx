export function ThemeScript() {
  return (
    <script>
      {`{
        function isDarkTheme() {
          if (typeof window === "undefined") return true;
          if (!("theme" in localStorage)) return true;
          if (localStorage.theme === "dark") return true;
          if (localStorage.theme === "light") return false;
          throw new Error("huh?");
        }
        document.documentElement.classList.remove("dark", "light");
        document.documentElement.classList.add(isDarkTheme() ? "dark": "light");
      }`}
    </script>
  );
}
