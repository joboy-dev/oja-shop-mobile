// Synced from shop/lib/utils/safe-redirect.ts. Edit it there, then run `npm run sync:shared`.
/** Only allow same-site relative paths as post-login destinations (blocks open redirects). */
export function safeNext(value: string | string[] | null | undefined, fallback = "/"): string {
  const v = Array.isArray(value) ? value[0] : value;
  if (!v || !v.startsWith("/") || v.startsWith("//") || v.startsWith("/\\")) return fallback;
  return v;
}
