// Runs before hydration to avoid a theme flash. Keep the storage policy aligned
// with isDarkTheme in theme.ts; neither path requires storage to be available.
export const THEME_INIT_SCRIPT = `{
  let theme = "dark";
  try {
    if (localStorage.theme === "light") theme = "light";
  } catch {}
  document.documentElement.classList.remove("dark", "light");
  document.documentElement.classList.add(theme);
}`;
