export function isDrafts() {
  if (typeof document !== "undefined")
    return document.location.host.startsWith("drafts.");

  const { IS_DRAFTS } = process.env;
  return IS_DRAFTS === "true";
}

export function isLocalhost() {
  if (typeof document !== "undefined")
    return ["localhost:", "127.0.0.1:"].some((host) =>
      document.location.host.startsWith(host)
    );

  const { NODE_ENV, VITE_VERCEL_ENV } = process.env;
  return Boolean(
    NODE_ENV === "development" ||
      (VITE_VERCEL_ENV && VITE_VERCEL_ENV === "development")
  );
}
