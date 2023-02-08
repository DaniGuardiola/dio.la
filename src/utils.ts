export function isDrafts() {
  if (typeof document !== "undefined")
    return document.location.host.startsWith("drafts.");

  const { NODE_ENV, VITE_VERCEL_ENV } = process.env;
  return (
    NODE_ENV === "development" ||
    (VITE_VERCEL_ENV && ["preview", "development"].includes(VITE_VERCEL_ENV))
  );
}
