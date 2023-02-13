export function isDrafts() {
  if (typeof document !== "undefined")
    return (
      document.location.host.startsWith("drafts.") ||
      document.location.host.startsWith("localhost:")
    );

  const { NODE_ENV, VITE_VERCEL_ENV } = process.env;
  return Boolean(
    NODE_ENV === "development" ||
      (VITE_VERCEL_ENV && ["preview", "development"].includes(VITE_VERCEL_ENV))
  );
}
