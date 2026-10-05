# AGENTS.md

Expo (React Native) app for the Ọjà shop. The web app lives in `../shop`; this app talks to it over `/api/v1`.
Read `PLAN.md` for decisions and `docs/learning/` for explanations.

**Expo changes every SDK.** This is SDK 57. Before using an Expo/RN API, check `https://docs.expo.dev/llms.txt`.
Add native packages with `npx expo install <pkg>`, never `npm i` (it picks SDK-incompatible versions).

## Layers (imports flow downward)

`src/app` (routes only) → `src/features/<feature>` → `src/api`, `src/components`, `src/lib`, `src/theme`, `src/utils`

- **`src/app`** — Expo Router screens. Read params, call feature hooks, compose feature components. No `fetch`, no raw colours.
- **`src/features/<name>`** — `<name>.api.ts` (HTTP), `<name>.queries.ts` (TanStack Query hooks), `components/`, `index.ts`.
  Import another feature only through its `index.ts` (ESLint enforces it). Features never import `src/app`.
- **`src/components`** — `ui/` primitives, `brand/`, `layout/`, `forms/`. No data fetching.
- **`src/api`** — `apiFetch()` (returns `data` or throws `ApiError`), query client, query-key factory, auth client.
- **`src/lib`** — **synced from `../shop/lib`; never edit by hand** (`npm run sync:shared`). Types, zod validators, pricing, config.
- **`src/theme`** — colour/type/motion tokens, `ThemeProvider`.

## Invariants

- Money is integer **kobo**; format only with `formatMoney()` (`src/utils/money.ts`, deliberately not `Intl`).
- The phone never decides what is charged. `calculateTotals()` is for display; the server recomputes at checkout.
- Colours/fonts/radii mirror the web (`../shop/app/globals.css`). `src/theme/colors.test.ts` fails if they drift. Change the web first.
- Session token lives in SecureStore (Better Auth Expo client). No secrets in the app; `EXPO_PUBLIC_*` is public.
- Cart: guests persist locally, signed-in users use the server bag; optimistic updates roll back with a toast.

## UI rules

- Style with NativeWind classes using token names (`bg-surface`, `text-fg-muted`, `rounded-card`). `style` only for runtime values
  (window width, safe-area insets, shadows, Reanimated styles) — say why in a comment.
- Text goes through `<Text variant=…>` (font + size + tracking travel together). Never set `fontFamily` directly.
- **Never rely on `className` reaching a Reanimated or third-party component** (it works in the web preview but is silently ignored on a real phone). Put classes on a plain `View`/`Pressable`; animate a style-only `Animated.View` around it, or wrap the library component (`Image.tsx`, `Gradient.tsx`). Judge UI on a device, not only the web preview.
- Tailwind classes must be literal strings (no template interpolation).
- Every tappable thing uses `PressableScale` (plain Pressable + `active:scale-*`, haptics). ≥44pt targets, `accessibilityLabel`/`Role` on everything.
- Every data screen: skeleton shaped like the content, empty state with a next action, error state with retry, pull-to-refresh.
- Animate `transform`/`opacity`; honour reduced motion (`useReducedMotion`).
- Portalled content (bottom sheets) must re-apply theme variables (`useThemeVars`).

## Done means

`npm run typecheck`, `npm run lint`, `npm test` pass; `npm run sync:check` is clean; the change works on a real device in light and dark.
