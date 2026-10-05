/**
 * Base URL of the Ọjà web app (the same server that hosts the website and /api/v1).
 * EXPO_PUBLIC_* values are inlined into the app bundle at build time and are visible to anyone who
 * unpacks the app, so this is only ever a URL, never a secret.
 */
export const API_URL = (process.env.EXPO_PUBLIC_API_URL ?? "https://oja-shop-amber.vercel.app").replace(
  /\/+$/,
  "",
);
