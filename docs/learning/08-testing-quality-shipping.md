# 08 · Testing, quality, shipping

## What's tested (62 tests)
- **Shared logic from the web** (`money` re-implemented, `calculateTotals`, `mergeCartItems`, address/checkout validators) — runs here too.
- **Palette parity** (`theme/colors.test.ts`) — fails if mobile colours differ from `../shop/app/globals.css`.
- **`cn`** merging with our tokens, **filters → query** mapping, **`apiFetch`** (envelope, cookie, errors, network), **cart store** (guest, optimistic, rollback, merge on sign-in).

Run `npm test`. We mock modules with `jest.mock` (hoisted above imports, hence the eslint-disable in those files).

## Lint is stricter than you expect
`expo lint` includes the **React Compiler** rules: no `setState` in effects, no reading refs during render, shared values
mutated via `.set()`. They pushed several fixes (`key` remount, state inside an inner form, `placeOrderNow` handler).

## Quality bar (AGENTS.md)
Typecheck, lint, tests, `sync:check`; real device, light + dark; 44pt targets; labels; skeleton/empty/error/refresh.

## Things only a device can tell you (verify before demoing)
1. Google sign-in round trip (iOS + Android), then kill the app: still signed in?
2. Prices read `₦12,500` (we format by hand, not `Intl`).
3. Fonts load; no flash of the wrong theme at launch.
4. Swipe-to-delete, pinch-to-zoom, bottom sheets with the keyboard open.
5. Android: back button on the success screen; Google return deep link doesn't leave a blank screen (`auth-return`).

## Shipping
`npx eas-cli build --profile preview --platform android` (APK you can share) / `--platform ios` (needs an Apple developer
account → TestFlight). `eas update` ships JS-only fixes over the air. Bump `version` in `app.json` for store releases.

## Exercises
1. Add a Jest test for `OrderStatusTimeline` with React Native Testing Library.
2. Add `Maestro` flow: open app → Shop → add first product → Bag shows 1.
