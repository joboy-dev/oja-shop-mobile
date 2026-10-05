# 02 · API and auth

## The problem
The website has **no REST API**. Pages call `server/services/*` directly (Server Components) and the browser mutates
through Server Actions. A phone can't do either, so we added a thin JSON layer to the web repo:

`app/api/v1/*/route.ts` → `route()` helper → **the same service functions** the actions use.

No business rules were duplicated; the server still recomputes prices/stock/totals. Look at
`../shop/app/api/v1/_lib/handler.ts`: guard (`access: "user"`), parse (`readJson` + zod), one service call, and the same
`{ ok, data } | { ok:false, error, fieldErrors }` envelope the actions return.

## The client side
`src/api/client.ts` → `apiFetch<T>(path, options)`:
- returns `data`, or **throws `ApiError`** (`status`, `message`, `fieldErrors`).
- `status 0` = couldn't reach the server; `retryable` = 0 or 5xx. TanStack Query retries only those.
- attaches the session cookie by hand: Better Auth stores it in **SecureStore**, we read it with `authClient.getCookie()`
  (async!) and send `Cookie:`. `credentials: "omit"` stops RN from also managing cookies.

## Google sign-in on a phone
1. `authClient.signIn.social({ provider: "google", callbackURL: "/auth-return" })`
2. The Expo client opens the **system browser** on the server's `/api/auth/expo-authorization-proxy`.
3. Google → server callback (`/api/auth/callback/google`) → server redirects to `oja://auth-return?cookie=…`.
4. The client reads the cookie from that link, stores it in SecureStore, and notifies `useSession()`.
5. `login.tsx` watches `isAuthenticated` and navigates to `next`.

Server side (`../shop/server/auth/auth.ts`): `expo()` plugin + `trustedOrigins`. **Why trusted origins matter:** the session
rides in the redirect URL, so the server must only redirect to schemes we own (`oja://`). That's why `exp://` (Expo Go)
is opt-in via `MOBILE_TRUSTED_ORIGINS`.

## Sign-out hygiene
`providers/SessionEffects.tsx` clears the query cache and the bag when the session ends — otherwise user A's bag becomes
user B's guest bag.

## Exercises
1. Call `curl https://<your-url>/api/v1/products?sort=price-asc` and compare with the Shop screen.
2. Add `GET /api/v1/orders` to a REST client (or curl with a copied cookie) and see the envelope for a 401.
3. In `client.test.ts`, add a test for a request that times out (hint: fake timers + never-resolving fetch).
