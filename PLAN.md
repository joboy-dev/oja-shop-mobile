# Ọjà Mobile — Implementation & Learning Plan

**Brief:** Build the React Native (Expo) mobile version of the Ọjà shop web app. Same products, same cart, same accounts, same orders, same look: identical colour tokens, fonts and type scale. Build it with production-grade structure, and use the build to learn React Native step by step.

**Status:** built (2026-10-05). All phases below are implemented; see "Implementation status" and "Deviations".

---

## Implementation status

| Phase | Status | Notes |
|---|---|---|
| 0 Setup | Done | Expo SDK 57, TypeScript strict, ESLint (+React Compiler rules), Prettier, Jest, `AGENTS.md`, `README.md` |
| 1 API (web repo, branch `feat/mobile-api`) | Done, **needs deploy** | 23 `/api/v1` routes + `route()` helper + 11 handler tests; Better Auth `expo()` plugin. Verified with curl against the real DB. The Vercel site does not have it until that branch is deployed |
| 2 Design system | Done | Tokens copied from the web (a test compares them to `globals.css`), 3 fonts, type scale, ~25 primitives, brand SVGs |
| 3 Navigation shell | Done | 5 tabs, nested stacks, modals, deep links (`oja://`), not-found |
| 4 Catalogue | Done | Home, Shop (infinite grid, filters, sort, chips), Category, Product (gallery + zoom viewer, tabs, related, sticky buy bar), Search |
| 5 Auth | Done in code | Google via Better Auth Expo + SecureStore. **Not exercised end-to-end here** (needs a device + deployed API) |
| 6 Bag & wishlist | Done | Guest/server bag, merge on sign-in, optimistic + Undo, badge bump, swipe to delete, wishlist |
| 7 Checkout | Done | 4 steps, saved/new address, idempotency key, success seal |
| 8 Account | Done | Overview, orders + timeline, address book CRUD, theme switch, sign out |
| 9 Content & polish | Done | About, FAQ, Contact, legal, newsletter, icon/splash, reduced motion, offline banner |
| 10 Test & ship | Partly | 62 unit tests, typecheck/lint clean. **Not done:** device testing, EAS build, Maestro |

Verified by rendering the web build of the app in headless Chrome against the real API (Home, Shop, Product; light + dark). iOS/Android runtime behaviour was not tested.

## Deviations from the plan above

- Routes live in `src/app/` (SDK 57 default), not `app/`. Tabs come from `expo-router/js-tabs`.
- `apiFetch` **throws `ApiError`** (with `status`, `fieldErrors`) instead of returning the envelope; TanStack Query needs throws.
- `GET /products/:slug` returns `{ product, related }` (one round trip); `/home` returns everything the Home screen needs.
- No `expo-blur` (opaque tab bar and headers). No per-IP rate limiting on contact/newsletter (the web actions have none either).
- `formatMoney`/dates are hand-written (`src/utils`), not synced: Hermes' `Intl` locale data for `en-NG`/NGN isn't reliable.
- `cn()` is mobile-specific (extended tailwind-merge). `lib/` sync excludes `money`, `date`, `cn`.
- Address add/edit is a modal route, not a bottom sheet (nested sheets + keyboard are fragile).
- Admin: not in the app (decided).
- Google return on Android lands on `oja://auth-return`, a do-nothing route that pops back.
- Expo Go needs `MOBILE_TRUSTED_ORIGINS=exp://**` on the server (off by default; see README).
- Added `SessionEffects` (clear cache + bag on sign-out) to avoid an auth↔cart import cycle.

## Decisions (§13, resolved)
Edit web repo: yes (careful, additive, on a branch) · Deploy: Vercel `https://oja-shop-amber.vercel.app` · Admin in app: no · Styling: NativeWind (`style` only when unavoidable) · Learning: build everything, notes in `docs/learning/`.

---

## 0. What exists today (audit of the web app)

| Fact | Detail |
|---|---|
| Location | `../shop` (sibling of this folder): `/Users/oluwakorede/Documents/Projects/HNG-Tech/AI Internship/shop`. Git remote `github.com/joboy-dev/oja-shop`. This folder (`shop-mobile-app`) is empty and not a git repo yet. |
| Stack | Next.js 16 (App Router), React 19, Tailwind v4, Drizzle + Neon Postgres, Better Auth (Google), Mailgun, Neon Object Storage, Zustand, Zod v4, react-hook-form, Sonner, Radix, Vaul, `motion`, lucide icons. |
| Shop | **Ọjà** — Lagos shop of handmade goods (adire textiles, ceramics, baskets, candles, body care). 6 categories, 24 products seeded. Money is integer **kobo**, currency NGN. |
| Customer features | Home (hero, category rail, shelves, story, value props, newsletter), shop list with filters/sort/search/pagination, category pages, product detail (gallery, stock, quantity, wishlist, tabs, related), cart (guest cart in localStorage, DB cart when signed in, merge on sign-in), 4-step checkout (contact → address → delivery → review/pay), success page, account (overview, orders + timeline, addresses, wishlist), contact, FAQ, about, legal pages. |
| Admin | Dashboard, products (with image uploads), categories, orders, customers, messages. |
| Backend shape | `server/repositories → server/services → server/actions`. **There is no REST API.** The browser talks to the server only through Next.js Server Actions and Server Components. The one route handler is `app/api/auth/[...all]` (Better Auth). |
| Auth | Better Auth with Google, cookie sessions (30 days). `getSessionUser()` reads the session from request headers. Admins come from `ADMIN_EMAILS`. |
| Running | Only locally (`APP_URL=http://localhost:3000`). Not deployed. |

### The one problem that shapes this plan

A mobile app cannot call Server Actions or render Server Components. It needs an HTTP API. The good news: the web app's **services layer is already clean** (`catalog.service.getProduct()`, `cart.service.addItem()`, `checkout.service.placeOrder()` …), so the API is a thin layer of route handlers that call the same services. No business logic gets duplicated, and the server stays the single source of truth for prices, stock and totals.

So the work has **two tracks**:

1. **Backend track (in `../shop`)**: add a versioned JSON API (`/api/v1/*`) and the Better Auth Expo plugin.
2. **Mobile track (in this folder)**: the Expo app.

---

## 1. Decisions at a glance

| Concern | Choice | Why (senior reasoning) |
|---|---|---|
| Framework | **Expo** (latest stable SDK, created with `create-expo-app`), TypeScript strict, New Architecture | Expo is the React Native team's recommended way to start. No Xcode/Android Studio needed to begin; EAS builds and OTA updates later. |
| Navigation | **Expo Router** (file-based) | Same mental model as the Next.js App Router you already know: folders are routes, `_layout.tsx` wraps children, `[slug].tsx` is dynamic, `(group)` folders don't affect the URL. Gives deep links for free. |
| Server state | **TanStack Query** | Replaces what Server Components + `revalidateTag` do on the web: caching, background refetch, pull-to-refresh, infinite scroll, optimistic updates, retry. |
| Client state | **Zustand** (same as web) persisted with **AsyncStorage** | Guest cart and UI state only. Same store shape as the web `cart-store.ts`, so you can compare the two side by side. |
| Secure storage | **expo-secure-store** | Session token lives in the iOS Keychain / Android Keystore, never in AsyncStorage. |
| Auth | **Better Auth client + `@better-auth/expo`** | Same auth server as the web app. Google sign-in opens a system browser, the server handles the OAuth callback, then deep-links back to the app (`oja://`). One account works on both web and mobile. |
| Styling | **NativeWind** (Tailwind for RN) with the web's token names (`bg-surface`, `text-fg-muted`, `bg-primary`) backed by a typed `theme/` module | You already think in these class names. The web's semantic tokens port 1:1, and light/dark switching works the same way (CSS variables). The typed theme module covers places classes can't reach (SVG fills, Reanimated, navigation theme). ⚠ see §13. |
| Fonts | **Bricolage Grotesque** (display), **Instrument Sans** (body/UI), **Geist Mono** (prices, order numbers) via `@expo-google-fonts/*` + `expo-font` | Exactly the web's three faces. |
| Icons | **lucide-react-native** | Same icon set as the web (`lucide-react`), same names. |
| SVG | **react-native-svg** | Port `LogoMark`, `AdirePattern`, `SuccessSeal` as-is. |
| Images | **expo-image** | Disk + memory caching, blurhash/placeholder, cross-fade transitions. |
| Lists | **FlashList** (`@shopify/flash-list`) for product grids | Recycles cells; smooth with 24+ product cards and images. |
| Forms | **react-hook-form + zod** (same as web) | Reuse the web's zod validators unchanged. |
| Motion | **Reanimated** + **Gesture Handler** | Runs animations on the UI thread. The web's motion tokens (ease-snap, 0.97 press scale, springs) map directly. |
| Bottom sheets | **@gorhom/bottom-sheet** | Mobile equivalent of Vaul (filters, cart quick view, address picker). |
| Toasts | **sonner-native** | Same API as Sonner on the web (`toast.success`, `toast("…", { action })`), including Undo. |
| Haptics | **expo-haptics** | Add-to-bag, wishlist toggle, order placed. |
| Keyboard | **react-native-keyboard-controller** | Reliable keyboard avoidance for checkout and address forms. |
| Network status | **@react-native-community/netinfo** wired to TanStack Query's `onlineManager` | Pause/resume requests when offline; show an offline banner. |
| Testing | **jest-expo + React Native Testing Library**; port the web's pure-function tests (`money`, `calculate-totals`, `cart/merge`, validators) | Logic tests run fast. Screens get behaviour tests. Maestro E2E is an optional final step. |
| Quality | ESLint (`eslint-config-expo`), Prettier (same `.prettierrc` as web), `tsc --noEmit` | Same "done means" bar as the web repo. |
| Package manager | **npm** (same as web) | One fewer thing to learn. Always add native packages with `npx expo install <pkg>` so versions match the SDK. |

**Scope of v1:** the full **customer** experience. **Admin stays on the web** (uploading product photos and managing tables is a desktop job; ⚠ see §13).

---

## 2. Web → React Native: the mental map (read this first)

This is the cheat sheet for learning. Every phase below adds to it.

| On the web you wrote… | In React Native you write… | Note |
|---|---|---|
| `<div>` | `<View>` | Flexbox is the only layout. Default `flexDirection` is **column**, not row. |
| `<p>`, `<span>`, `<h1>` | `<Text>` | **All text must be inside `<Text>`.** No text in a bare `<View>`. Styles don't cascade: a parent `View` can't set a child's font. |
| `<img>` / `next/image` | `<Image>` from `expo-image` | Remote images need explicit width/height or `aspectRatio`. |
| `<button onClick>` | `<Pressable onPress>` | Press feedback is yours to build (we wrap it once in `Button`). |
| `<a href>` / `next/link` | `<Link href>` / `router.push()` from `expo-router` | |
| `<input>` | `<TextInput>` | `onChangeText` gives the string directly. Keyboard types: `email-address`, `phone-pad`, `number-pad`. |
| `overflow: auto` page | `<ScrollView>` or `<FlatList>`/`<FlashList>` | Pages don't scroll by default. Long lists must be virtualised. |
| CSS / Tailwind | `StyleSheet.create({...})` or NativeWind classes | Numbers are density-independent points (no `px`, no `rem`). `letterSpacing` and `lineHeight` are absolute numbers, not `em`/ratios. |
| `:hover` | — | There is no hover on touch. The web's hover image swap becomes a swipe gallery on the product page. |
| `localStorage` | `AsyncStorage` (non-secret) / `SecureStore` (secret) | Both are **async**. |
| Cookies (automatic) | Token stored in SecureStore, attached to each request by our API client | The Better Auth Expo client does this for us. |
| Server Components + `revalidateTag` | TanStack Query (`useQuery`, `invalidateQueries`) | The phone fetches JSON and caches it. |
| Server Actions | `fetch` to `/api/v1/*` wrapped in `useMutation` | |
| Radix Dialog / Vaul | `Modal` route (`presentation: "modal"`) / `@gorhom/bottom-sheet` | |
| `framer-motion` / `motion` | Reanimated | Animations run on the UI thread, not the JS thread. |
| `prefers-color-scheme` | `useColorScheme()` | |
| `prefers-reduced-motion` | `useReducedMotion()` (Reanimated) / `AccessibilityInfo` | |
| `aria-label`, `role` | `accessibilityLabel`, `accessibilityRole` | |
| `useRouter`, `useSearchParams` (Next) | `useRouter`, `useLocalSearchParams` (Expo Router) | |
| `error.tsx` | `export function ErrorBoundary` in the route file | |
| `loading.tsx` | Skeleton rendered while `isPending` | |
| `.env` `NEXT_PUBLIC_*` | `.env` `EXPO_PUBLIC_*` | Anything `EXPO_PUBLIC_` ships inside the app binary. **Never put secrets there.** |

---

## 3. Design system — matching the web exactly

Source of truth: `../shop/app/globals.css` and `../shop/PLAN.md` §8 ("Indigo vat"). The mobile theme copies these values; it does not reinterpret them.

### 3.1 Colour tokens (copied verbatim)

| Token | Light | Dark | Use |
|---|---|---|---|
| `background` | `#f5f6fa` | `#0c0e26` | screen background |
| `surface` | `#ffffff` | `#151838` | cards, sheets |
| `surface-2` | `#eceef6` | `#1d2148` | inputs, muted panels, image placeholders |
| `fg` | `#14163a` | `#eef0fa` | text |
| `fg-muted` | `#585c7e` | `#a3a7c7` | secondary text |
| `border` | `#dadceb` | `#2a2f5c` | hairlines |
| `border-strong` | `#b9bdd6` | `#3d4380` | outline buttons, inputs |
| `primary` | `#2e36a0` | `#8c95ff` | buttons, links, focus, active tab |
| `primary-hover` | `#252c88` | `#a3abff` | pressed state (no hover on mobile) |
| `primary-soft` | `#e6e8fa` | `#232866` | icon chips, primary badges |
| `on-primary` | `#ffffff` | `#0c0e26` | text on primary |
| `accent` | `#f0b429` | `#f5c24c` | sale tags, badges (never body text) |
| `on-accent` | `#14163a` | `#0c0e26` | text on accent |
| `success` / `success-soft` | `#1f7a55` / `#dff3ea` | `#4cc38a` / `#12372b` | in stock, delivered |
| `danger` / `danger-soft` | `#b52b43` / `#fbe3e7` | `#ff6b81` / `#431a26` | errors, remove |
| `ring` | `#2e36a0` | `#8c95ff` | focus (keyboard / switch control) |
| `overlay` | `rgb(20 22 58 / 0.45)` | `rgb(5 6 20 / 0.65)` | sheet / modal backdrop |
| shadow colour | `hsl(232 35% 30%)` | `hsl(232 60% 4%)` | all shadows |

Theme follows the system by default, with a manual **Light / Dark / System** switch in Account (persisted), same as the web's theme toggle. Status bar, navigation bar, tab bar and splash screen follow the theme (`#f5f6fa` / `#0c0e26`, matching the web's `themeColor`).

### 3.2 Typography

| Role | Face | Weights loaded | Web source |
|---|---|---|---|
| Display (headings) | Bricolage Grotesque | 600, 700 | `--font-display` |
| Body / UI | Instrument Sans | 400, 500, 600, 700 | `--font-sans` |
| Utility (prices, order numbers, eyebrows, step counters) | Geist Mono | 400, 500 | `--font-mono` |

React Native differences we handle once, in the `Text` primitive:
- **Weights are separate font files.** On Android, `fontWeight: "700"` does not pick the bold file of a custom font. So `Text` maps `weight` → the exact family name (`InstrumentSans_600SemiBold`), and screens never set `fontFamily` directly.
- **No variable-font optical sizing.** We load static Bricolage weights. Close enough visually; noted as a known difference.
- **`em` → points.** `letterSpacing: -0.03em` at 32px becomes `-0.96`. `line-height: 1.05` at 32px becomes `34`. The scale below is pre-computed from the web's CSS at a 390pt phone width (the `clamp()` values resolve to their mobile end).
- **Tabular numbers:** `fontVariant: ["tabular-nums"]` on prices, same as the web's `.tabular`.

| Variant | Face / weight | Size | Line height | Letter spacing | Web equivalent |
|---|---|---|---|---|---|
| `hero` | Bricolage 700 | 44 | 43 | −1.76 | `.display-hero` |
| `h1` | Bricolage 700 | 32 | 34 | −0.96 | `h1` |
| `h2` | Bricolage 700 | 24 | 26 | −0.6 | `h2` |
| `h3` | Bricolage 600 | 20 | 24 | −0.3 | `h3` |
| `bodyLg` | Instrument 400 | 18 | 28 | 0 | hero / lead copy (`text-lg`) |
| `body` | Instrument 400 | 16 | 25 | 0 | `body` (16px, 1.55) |
| `bodySm` | Instrument 400 | 15 | 22 | 0 | `text-[0.9375rem]` |
| `label` | Instrument 500 | 15 | 20 | 0 | button `md` text |
| `caption` | Instrument 400 | 14 | 20 | 0 | `text-sm` |
| `badge` | Instrument 600 | 12 | 16 | 0 | `Badge` |
| `eyebrow` | Geist Mono 400, UPPERCASE | 12 | 16 | 1.44 | `.eyebrow` |
| `price` | Geist Mono 500, tabular | 14 / 16 / 20 / 30 | ×1.3 | 0 | `Price` sizes sm/md/lg/xl |
| `prose` | Instrument 400 | 17 | 29 | 0 | `.prose-content` |

Dynamic Type / font scaling stays **on** for accessibility; `hero` and `h1` cap at `maxFontSizeMultiplier={1.3}` so headlines don't overflow.

### 3.3 Shape, spacing, elevation

| Token | Value | Web source |
|---|---|---|
| `radius.control` | 12 | `--radius-control: 0.75rem` |
| `radius.card` | 16 | `--radius-card: 1rem` |
| `radius.sheet` | 24 | `--radius-sheet: 1.5rem` |
| `radius.pill` | 999 | `rounded-full` |
| Spacing | 4-pt scale (4, 8, 12, 16, 20, 24, 32, 40, 48, 64) | Tailwind scale |
| Screen gutter | 16 | `container-page` mobile padding |
| Section spacing | 48–64 | `section-y` mobile |
| Product image ratio | 4:5 | `aspect-[4/5]` |
| Button heights | sm 40, md 44, lg 52, icon 44×44 | `Button` sizes |
| `shadow.soft` / `lift` / `overlay` | Same CSS strings via RN `boxShadow` (New Architecture supports it) | `--shadow-*` |
| Glass header / tab bar | `expo-blur` `BlurView` over 78% background | `.glass` |

### 3.4 Motion (from the web's tokens)

| Web | Mobile |
|---|---|
| `--ease-snap: cubic-bezier(0.22, 1, 0.36, 1)` | `Easing.bezier(0.22, 1, 0.36, 1)` |
| durations 120 / 200 / 320 ms | same |
| spring `{ bounce: 0, duration: 0.35 }` | `withSpring(v, { duration: 350, dampingRatio: 1 })` |
| press `scale(0.97)` on buttons and cards | same, on the UI thread, in `Pressable` wrapper |
| cart badge `bump` keyframe | tab-bar badge scale 1 → 1.35 → 1 + light haptic |
| success `stamp` keyframe | `SuccessSeal` stamp with Reanimated + success haptic |
| skeleton shimmer | animated gradient skeleton (`expo-linear-gradient`) |
| `pop-in` staggered reveals | `FadeInDown` entering animations, 60ms stagger, first mount only |
| `prefers-reduced-motion` | `useReducedMotion()` → 150ms opacity fades, no stamp, no stagger |

Only `transform` and `opacity` animate, same rule as the web.

### 3.5 Brand elements

- **LogoMark** — three concentric circles with a turmeric centre. Port the SVG to `react-native-svg`. Used in the home header, splash and app icon.
- **AdirePattern** — port the `<pattern>` SVG unchanged. Appears in the same four places as the web: home hero panel, the footer-equivalent band at the end of Home, the empty-bag illustration, the order-success seal.
- **Hero** — indigo panel with three product photos in round "resist" cut-outs, ported from `components/home/Hero.tsx`.
- **App icon & splash** — LogoMark on `primary` indigo, generated from SVG; splash background follows theme.

### 3.6 Copy voice

Reuse the web's copy word for word where the screen exists on both ("Add to bag", "Place order", "Your bag is empty…", error messages from the API). One brand, one voice.

---

## 4. Architecture

### 4.1 How the pieces talk

```
┌──────────────── Mobile app (this folder) ────────────────┐
│ app/ (Expo Router screens)                                 │
│   └─ use features/*/hooks  (useProducts, useAddToCart…)    │
│        └─ TanStack Query  ←→  features/*/*.api.ts          │
│                                   └─ src/api/client.ts     │
│                                       (fetch + auth cookie,│
│                                        JSON, errors)       │
│ Zustand: guest cart, theme preference (AsyncStorage)       │
│ SecureStore: Better Auth session                           │
└───────────────────────────┬──────────────────────────────┘
                            │ HTTPS  JSON  { ok, data } | { ok:false, error, fieldErrors }
┌───────────────────────────▼──────────────────────────────┐
│ Web app (../shop)                                          │
│ app/api/v1/*  route handlers   ← NEW (thin)                │
│ app/api/auth/[...all]          ← + expo() plugin           │
│   └─ server/services/*  (unchanged business rules)         │
│        └─ server/repositories/* → Neon Postgres            │
└──────────────────────────────────────────────────────────┘
```

### 4.2 Rules (the mobile version of the web's "one rule that matters")

Imports flow one way: **`app/` → `src/features/` → `src/api/`, `src/components/`, `src/lib/`, `src/theme/`**.

- **`app/`** — routes only. A screen file reads params, calls feature hooks, composes feature components. No `fetch`, no business logic, no raw colours.
- **`src/features/<feature>/`** — everything for one feature: `<feature>.api.ts` (HTTP calls), `<feature>.queries.ts` (TanStack hooks + query keys), `components/`, optional `<feature>.store.ts`. Features may import shared code, not each other's internals (go through the feature's `index.ts`).
- **`src/components/`** — UI primitives and brand pieces with no data fetching. Take props, render. Use theme tokens only.
- **`src/api/`** — the HTTP client: base URL, auth header, JSON parsing, timeout, typed `ApiError`. Knows nothing about features.
- **`src/lib/`** — pure, framework-free code. **Mirrored from the web's `lib/`** (types, validators, config, pricing, money, cart merge) so both apps share one definition of a `ProductSummary`, one `checkoutSchema`, one `calculateTotals`.
- **`src/theme/`** — tokens, typography, motion constants, theme provider.
- Money stays integer kobo end to end; only `formatMoney()` formats it.
- The phone never decides a price or total that gets charged. It displays `calculateTotals()` for feedback; the server recomputes at checkout.

### 4.3 Sharing code with the web app

The web's `lib/` is already client-safe and has no Next.js imports in the files we need. Plan:

- `scripts/sync-shared.sh` copies a fixed list of files from `../shop/lib/` into `src/lib/` **verbatim** (`types/*`, `validators/*` minus admin/media, `config/shop.ts`, `config/site.ts`, `config/nigeria.ts`, `pricing/calculate-totals.ts`, `utils/money.ts`, `cart/merge.ts`, `types/action-result.ts`).
- The mobile `tsconfig` maps `@/*` → `src/*`, so the web's `import … from "@/lib/config/shop"` resolves without edits.
- Each synced file gets a header comment "Synced from ../shop/lib — edit there, then run `npm run sync:shared`". A CI-style check (`npm run sync:check`) fails if the copies drift.
- **Later (optional):** move both apps into one pnpm/npm workspace monorepo with a `packages/shared`. Not now: it would restructure the web repo and adds tooling to learn at the same time as React Native.

### 4.4 Folder structure

```
shop-mobile-app/
├─ app/                                # Expo Router — screens only
│  ├─ _layout.tsx                      # root: fonts, splash, providers, Stack
│  ├─ (tabs)/
│  │  ├─ _layout.tsx                   # tab bar: Home · Shop · Wishlist · Bag · Account
│  │  ├─ index.tsx                     # Home
│  │  ├─ shop/
│  │  │  ├─ _layout.tsx                # Stack inside the Shop tab
│  │  │  ├─ index.tsx                  # all products (filters, sort, infinite scroll)
│  │  │  └─ [category].tsx             # category-scoped list
│  │  ├─ wishlist.tsx
│  │  ├─ bag.tsx
│  │  └─ account/
│  │     ├─ _layout.tsx                # signed-out → sign-in prompt
│  │     ├─ index.tsx                  # overview, theme switch, links
│  │     ├─ orders/index.tsx
│  │     ├─ orders/[orderNumber].tsx
│  │     └─ addresses.tsx
│  ├─ product/[slug].tsx               # pushed above tabs
│  ├─ search.tsx                       # modal
│  ├─ login.tsx                        # modal; returns to `next`
│  ├─ checkout/
│  │  ├─ _layout.tsx                   # auth guard + minimal header
│  │  ├─ index.tsx                     # 4-step checkout
│  │  └─ success/[orderNumber].tsx
│  ├─ info/
│  │  ├─ about.tsx
│  │  ├─ faq.tsx
│  │  ├─ contact.tsx
│  │  └─ [page].tsx                    # shipping-returns, privacy, terms
│  └─ +not-found.tsx
├─ src/
│  ├─ api/
│  │  ├─ client.ts                     # apiFetch<T>() → ActionResult<T>, ApiError
│  │  ├─ query-client.ts               # QueryClient defaults, focus/online managers
│  │  └─ query-keys.ts                 # one factory for every cache key
│  ├─ features/
│  │  ├─ auth/        (auth-client.ts, useSession, SignInButton, RequireAuth)
│  │  ├─ catalog/     (catalog.api.ts, catalog.queries.ts, components/ProductCard, ProductGrid,
│  │  │                FilterSheet, SortSheet, ActiveFilters, CategoryRail, ProductGallery,
│  │  │                StockBadge, StickyBuyBar, Hero, ProductShelf, ValueProps, StoryBand)
│  │  ├─ search/      (search.api.ts, useSearch, SearchResultRow)
│  │  ├─ cart/        (cart.api.ts, cart.store.ts, cart.queries.ts, CartLineItem,
│  │  │                FreeShippingBar, BagTabBadge, CartSync)
│  │  ├─ wishlist/    (wishlist.api.ts, wishlist.queries.ts, WishlistButton)
│  │  ├─ checkout/    (checkout.api.ts, useCheckoutForm, StepCard, ContactStep, AddressStep,
│  │  │                DeliveryStep, ReviewStep, OrderSummaryBar, CheckoutProgress)
│  │  ├─ orders/      (orders.api.ts, orders.queries.ts, OrderCard, OrderStatusBadge,
│  │  │                OrderStatusTimeline, OrderItemsList, OrderTotals, PaymentInstructions)
│  │  ├─ addresses/   (addresses.api.ts, addresses.queries.ts, AddressCard, AddressForm, StatePicker)
│  │  └─ content/     (contact.api.ts, newsletter.api.ts, ContactForm, NewsletterBand, faq data)
│  ├─ components/
│  │  ├─ ui/          # Text, Button, IconButton, PressableScale, Badge, Price, Input, Textarea,
│  │  │               # Field, Select (sheet), RadioCard, Checkbox, Switch, QuantityStepper,
│  │  │               # Skeleton, Spinner, EmptyState, ErrorState, Separator, Avatar, Accordion,
│  │  │               # Tabs (segmented), Sheet, Toaster
│  │  ├─ brand/       # LogoMark, Logo, AdirePattern, SuccessSeal
│  │  └─ layout/      # Screen (safe area + background), ScreenHeader, GlassHeader,
│  │                  # OfflineBanner, SectionHeader
│  ├─ lib/            # synced from ../shop/lib (see §4.3) + mobile-only utils
│  ├─ theme/
│  │  ├─ colors.ts    # light/dark token maps (§3.1)
│  │  ├─ typography.ts# variants (§3.2) + font family map
│  │  ├─ tokens.ts    # radius, spacing, shadow, sizes
│  │  ├─ motion.ts    # easing, durations, springs
│  │  ├─ fonts.ts     # useFonts() list
│  │  └─ ThemeProvider.tsx  # system/light/dark, NativeWind vars, navigation theme
│  ├─ hooks/          # useDebounce, useRefreshOnFocus, useAppState, useReducedMotionSafe
│  └─ providers/AppProviders.tsx  # GestureHandler, SafeArea, Theme, Query, KeyboardProvider,
│                                 # BottomSheetModalProvider, Toaster
├─ assets/            # icon, adaptive icon, splash, images
├─ docs/learning/     # one short note per phase: what we built, what you learned, exercises
├─ scripts/sync-shared.sh
├─ global.css         # NativeWind tokens (mirrors ../shop/app/globals.css :root/[data-theme])
├─ tailwind.config.js # token names identical to the web's @theme inline
├─ app.config.ts      # name "Ọjà", slug "oja", scheme "oja", bundle ids, splash, plugins
├─ .env.example       # EXPO_PUBLIC_API_URL
├─ eslint.config.js, .prettierrc, tsconfig.json, jest.config.js
├─ AGENTS.md          # rules for this repo (layers, tokens, done-means), like the web's
└─ PLAN.md            # this file
```

### 4.5 Data layer details

- **`apiFetch<T>(path, { method, body, auth })`** returns the API's `ActionResult<T>` envelope, throws `ApiError` only for network/5xx so TanStack Query can retry those and not validation failures. 15s timeout via `AbortController`.
- **Query keys** live in one factory: `qk.products.list(filters)`, `qk.products.detail(slug)`, `qk.cart`, `qk.wishlist.ids`, `qk.orders.list`, `qk.orders.detail(n)`, `qk.addresses` …
- **Defaults:** `staleTime` 60s for catalogue, 0 for cart/orders; refetch on app foreground (`focusManager` + `AppState`); `onlineManager` + NetInfo.
- **Infinite scroll:** `useInfiniteQuery` over the existing page-based `listProducts` (`page`, `pageSize: 12`).
- **Optimistic updates:** cart and wishlist update instantly, roll back + toast on failure — same behaviour as the web store, including the serial request queue so rapid taps land in order.
- **Cart model (same as web):** signed-out → Zustand + AsyncStorage (`oja-cart`), resolved against the server for fresh prices/stock; signed-in → server cart; on sign-in, merge guest lines (`/cart/merge`) then clear local.

---

## 5. Backend track — API in `../shop` (⚠ needs your OK to edit the web repo)

Follows the web's existing layer rules: each handler does `authorize()` → `schema.safeParse()` → **one service call** → `revalidateTag` → JSON `ActionResult`. No new business logic.

### 5.1 Auth changes
- `npm i @better-auth/expo`; add `expo()` to `plugins` in `server/auth/auth.ts`.
- `trustedOrigins: ["oja://", …dev Expo Go origins]`.
- Google OAuth client is unchanged: the callback still lands on the server (`/api/auth/callback/google`), which then deep-links to `oja://`.
- `getSessionUser()` already reads `headers()`, which works inside route handlers, so existing guards are reused as-is.

### 5.2 Endpoints (`app/api/v1/…`)

| Method & path | Auth | Service call | Replaces web… |
|---|---|---|---|
| `GET /home` | — | `getFeaturedProducts`, `getNewArrivals`, `getCategories` | Home page RSC |
| `GET /categories` · `GET /categories/:slug` | — | `getCategories`, `getCategory` | |
| `GET /products?category&q&minPrice&maxPrice&inStock&sort&page` | — | `listProducts` (query parsed with the web's catalogue validator) | `/shop` RSC |
| `GET /products/:slug` · `GET /products/:slug/related` | — | `getProduct`, `getRelatedProducts` | PDP RSC |
| `GET /search?q` | — | `searchProducts` | `searchProductsAction` |
| `GET /me` | user | `getSessionUser` | |
| `GET /cart` · `POST /cart/items` · `PATCH /cart/items/:productId` · `DELETE /cart/items/:productId` | user | `cart.service.*` | cart actions |
| `POST /cart/merge` | user | `mergeGuestCart` | `mergeGuestCartAction` |
| `POST /cart/resolve` | — | `resolveGuestCart` | `resolveGuestCartAction` |
| `GET /wishlist` · `GET /wishlist/ids` · `POST /wishlist/toggle` | user | `wishlist.service.*` | |
| `GET/POST /addresses` · `PATCH/DELETE /addresses/:id` · `POST /addresses/:id/default` | user | `address.service.*` | address actions |
| `POST /checkout` | user | `placeOrder` (+ `after()` emails, same as action) | `placeOrderAction` |
| `GET /orders` · `GET /orders/:orderNumber` | user | `getUserOrders`, `getUserOrder` | account pages |
| `GET /payment/bank-details` | user | `getBankDetails` | |
| `POST /contact` · `POST /newsletter` | — | `submitContactMessage`, `subscribe` | contact actions |

Shared helper `app/api/v1/_lib/handler.ts`: wraps errors from `server/services/errors.ts` into status codes (400 validation with `fieldErrors`, 401, 403, 404, 409 stock conflict, 500), sets `Cache-Control` on public catalogue GETs, and returns the same `{ ok, data } | { ok: false, error, fieldErrors }` envelope the web actions return — so the mobile app reuses `ActionResult<T>` directly.

Also: update the web `AGENTS.md` ("Only route handler: `app/api/auth`" becomes "route handlers: auth + `api/v1` for the mobile app, thin wrappers over services"), add basic per-IP rate limiting on `contact`/`newsletter`, and add route tests for the envelope.

### 5.3 Running it so a phone can reach it

`localhost:3000` on your Mac is not reachable from a phone, and **Google OAuth does not accept a LAN IP (`192.168.x.x`) as a redirect URI**. Options:

1. **Deploy the web app to Vercel** (recommended): a real HTTPS URL, add its callback to the Google OAuth client, set `EXPO_PUBLIC_API_URL` to it. Also the path to shipping anyway.
2. **Tunnel** (`cloudflared` or `ngrok`) for local development: gives a public HTTPS URL for `localhost:3000`; register that callback in Google. Fine for day-to-day, URL changes unless you reserve one.

Catalogue screens can be built against the LAN IP before auth is needed (`next dev -H 0.0.0.0`).

---

## 6. Screens

Every screen ships with: a skeleton matching the final layout, an empty state with a next action, an error state with **Retry**, pull-to-refresh where the data can change, and works light + dark, small (iPhone SE / 360dp Android) to large phones.

| Screen | Content | Interactions (mobile-native) | Web source |
|---|---|---|---|
| **Home** (tab) | Glass header (logo, search icon), hero with adire panel + 2 CTAs + trust line, category rail, "New in" shelf, "Best sellers" shelf, story band, value props, newsletter band with adire border | Horizontal snap shelves, staggered fade-in once, pull-to-refresh | `(shop)/page.tsx`, `components/home/*` |
| **Shop** (tab) | Category chips, result count, sort, filter button, 2-column grid | Infinite scroll, filter **bottom sheet** (category, price range, in stock), sort sheet, removable active-filter chips, results dim while refetching | `shop-view.tsx`, `FilterSheet`, `SortSelect` |
| **Category** | Category header (name, description, image) + same grid | Same as Shop | `shop/[category]` |
| **Product** | Swipe gallery with page dots, category eyebrow, name, price (+ compare-at strike, −% badge), stock badge, quantity stepper, Add to bag, wishlist heart, segmented tabs (Details / Materials & care / Delivery & returns), "You may also like" | **Sticky bottom buy bar** (always visible on mobile), Add to bag → ✓ "Added" morph + haptic + Bag tab badge bump + toast with "View bag", share button (native share sheet), pinch-to-zoom image viewer | `products/[slug]`, `ProductGallery`, `ProductPurchase` |
| **Search** (modal) | Auto-focused input, recent searches, results list with thumbnail + price | Debounced (300ms) query, keyboard "search" submits to Shop with `q` | `CommandSearch`, `SearchDialog` |
| **Wishlist** (tab) | Saved products grid, move to bag | Signed-out: friendly prompt to sign in. Heart toggles optimistically | `account/wishlist` |
| **Bag** (tab) | Lines with stepper, remove (swipe-to-delete + Undo toast), unavailable lines flagged, free-shipping progress bar, subtotal, shipping estimate, **Checkout** CTA pinned at bottom | Optimistic updates, empty state with adire illustration + "Start with our new adire throws →" | `cart/page.tsx`, `CartView`, `FreeShippingBar` |
| **Sign in** (modal) | Logo, one large "Continue with Google", reasons to sign in | Opens system browser, returns to where you were (`next`) | `(auth)/login` |
| **Checkout** | 4 step cards (Contact → Address → Delivery → Review & pay), collapsible "Show order summary · ₦48,500" bar at top, **Place order** pinned at bottom | Completed steps collapse into editable summaries; saved-address radio cards or new-address form with Nigerian state picker sheet; delivery + payment radio cards; inline validation; keyboard-aware scrolling; idempotency key per checkout session; button loading state; success haptic | `CheckoutFlow`, `StepCard`, `MobileSummary` |
| **Order success** | SuccessSeal stamp, order number in mono, "We've emailed a confirmation to you@…", items, totals, delivery estimate, bank details if transfer | Buttons: View order / Continue shopping; Android back goes home, not back into checkout | `checkout/success` |
| **Account** (tab) | Avatar + greeting, recent orders (3), default address, links (Orders, Addresses, Wishlist, Help, About), **Theme: System / Light / Dark**, Sign out | Signed-out: sign-in card + help links | `account/page.tsx` |
| **Orders** / **Order detail** | List: number, date, status pill, total, thumbnails. Detail: status timeline, items, address, totals, payment method + instructions | Pull-to-refresh | `account/orders/*`, `components/order/*` |
| **Addresses** | Address cards; add / edit (sheet with form) / delete (confirm) / set default | Optimistic default switch | `AddressBook`, `AddressFields` |
| **About / FAQ / Contact** | Native screens. FAQ uses an animated accordion. Contact form → API; success state replaces the form | | `(shop)/about|faq|contact` |
| **Shipping & returns / Privacy / Terms** | Readable prose screens (same copy) | | `(shop)/*` |
| **Not found** | Branded, search + popular categories | Also handles unknown deep links | `not-found.tsx` |

**Deep links** (`oja://` and later universal links on the web domain): `/products/:slug`, `/shop/:category`, `/account/orders/:orderNumber` open the matching screen, so links in order emails can open the app later.

---

## 7. Accessibility & quality floor

- Every touchable ≥ 44×44 (use `hitSlop` for small icons); every icon-only button has `accessibilityLabel`; correct `accessibilityRole` (`button`, `link`, `header`, `tab`, `checkbox`, `radio`).
- Text contrast uses the web's AA-checked pairs only; accent never used for body text.
- Dynamic Type supported; layouts tested at the largest accessibility size.
- Screen readers: VoiceOver + TalkBack pass on Home, Product, Bag, Checkout; quantity changes and form errors are announced (`accessibilityLiveRegion` / `AccessibilityInfo.announceForAccessibility`).
- Reduced motion respected everywhere (§3.4).
- Safe areas (notch, home indicator, Android nav bar) via `react-native-safe-area-context`; edge-to-edge on Android.
- Performance: FlashList for grids, `expo-image` with sized remote images and placeholders, memoised list items, no inline object styles in hot lists, Hermes on, 60fps on a mid-range Android.

---

## 8. Security

- Session token only in **SecureStore**; cleared on sign-out.
- No secrets in the app. `EXPO_PUBLIC_API_URL` is the only env var, and it's public by nature.
- The server remains the boundary: every `/api/v1` handler calls `authorize()`; prices, stock, totals recomputed server-side; checkout idempotency key prevents double orders on flaky networks/retries.
- Deep-link `next` targets are validated (port the web's `safeNext`) so a crafted link can't push to an arbitrary screen.
- HTTPS only outside local dev.

---

## 9. Testing

| Layer | Tool | What |
|---|---|---|
| Shared logic | jest-expo | The web's existing tests for `money`, `calculate-totals`, `cart/merge`, validators run against the synced copies (proves the sync is faithful). |
| Mobile logic | jest | cart store (optimistic + rollback + queue order), `apiFetch` error mapping, query-key factory, filter ↔ params mapping. |
| Components | React Native Testing Library | Button states, QuantityStepper clamping, checkout step validation, empty/error states. |
| API (web repo) | vitest | Envelope + status codes + auth on each `/api/v1` route. |
| E2E (optional, last) | Maestro | Browse → add to bag → sign in → checkout → see order. |
| Manual | Real devices | iPhone + Android phone, light/dark, large text, VoiceOver/TalkBack, airplane mode. |

---

## 10. Phases

Each phase ends with something you can run on your phone, a short `docs/learning/NN-*.md` note, and a "Done when" check. I explain each new concept as we hit it, and leave small **"you try"** exercises in each note so you write some of the code yourself.

| # | Phase | What gets built | You learn | Done when |
|---|---|---|---|---|
| 0 | **Setup** | `git init`; `create-expo-app` (TypeScript, Expo Router); ESLint, Prettier, strict TS, path aliases; `AGENTS.md`; app runs in Expo Go on your phone | How Expo/Metro/Expo Go fit together; project anatomy; `View`/`Text`/`StyleSheet`; flexbox column default; fast refresh | Blank app on your phone; lint + typecheck pass |
| 1 | **API (web repo)** | `/api/v1` handlers + helper + tests; Better Auth `expo()` plugin; deploy to Vercel or set up a tunnel | How a mobile client talks to a server; REST vs Server Actions; why a stable versioned API matters for apps you can't force-update | `curl` returns products JSON from a URL your phone can reach |
| 2 | **Design system** | Theme tokens, fonts, NativeWind config, `Text`, `Button`, `PressableScale`, `Badge`, `Price`, `Input`/`Field`, `Skeleton`, `EmptyState`, `ErrorState`, LogoMark, AdirePattern; a dev-only `/dev/ui` showcase screen like the web's | Styling in RN; fonts and weights; dark mode; `Pressable`; SVG; why primitives wrap platform quirks | Showcase matches the web's `/dev/ui` side by side in light and dark |
| 3 | **Navigation shell** | Tabs (Home, Shop, Wishlist, Bag, Account) with icons and themed glass tab bar, nested stacks, modal routes, not-found, deep-link scheme | Expo Router: stacks, tabs, modals, params, typed routes, layouts | Can navigate every route with placeholder screens; `oja://product/x` opens product |
| 4 | **Catalogue** | API client, QueryClient, query keys; Home, Shop (infinite grid + filter/sort sheets), Category, Product (gallery, tabs, related, sticky buy bar), Search | TanStack Query; FlashList; `expo-image`; bottom sheets; debouncing; loading/empty/error patterns | Browse all 24 products, filter, sort, search, open any product, offline shows banner + cached data |
| 5 | **Auth** | Better Auth Expo client, SecureStore, sign-in modal, `useSession`, guarded routes, sign out | OAuth on mobile; deep links back into the app; secure storage; auth-aware navigation | Sign in with Google on the phone, kill the app, reopen still signed in; account tab shows your name/avatar |
| 6 | **Bag & wishlist** | Cart store (guest + server, merge on sign-in, request queue, Undo), Bag screen, badge bump, haptics, Wishlist | Global state with Zustand; persistence; optimistic UI; gestures (swipe to delete) | Guest bag survives restart and merges on sign-in; stock caps respected; same bag shows on web and phone |
| 7 | **Checkout** | 4-step form with RHF + synced zod schema, saved/new address, state picker, delivery/payment radio cards, summary bar, place order, success seal | Complex forms; keyboard handling; idempotency; Reanimated layout/entering animations | Place a real order from the phone; it appears in the web admin; confirmation email logged |
| 8 | **Account** | Overview, orders list/detail with timeline and payment instructions, address book CRUD, theme switch | Mutations + cache invalidation patterns; sheets with forms | All account pages match the web's data |
| 9 | **Content & polish** | About, FAQ, Contact, legal, newsletter; motion pass (stagger, stamp, badge bump, press feedback); accessibility pass; app icon + splash; offline + error polish | Animation on the UI thread; accessibility APIs; app assets | VoiceOver/TalkBack walkthrough clean; reduced motion respected; no jank on Android |
| 10 | **Test & ship** | Jest + RNTL suites; optional Maestro flow; EAS project; development build; preview builds (APK / TestFlight); OTA updates with `expo-updates` | Dev builds vs Expo Go; EAS Build/Submit/Update; app versioning | `npm test`, lint, typecheck pass; installable preview build on your phone |

**Done means (every phase):** `npm run lint`, `npx tsc --noEmit` and `npm test` pass; the feature works on a real device against the real API, in light and dark mode.

---

## 11. Environment

| Var | Where | Example |
|---|---|---|
| `EXPO_PUBLIC_API_URL` | `shop-mobile-app/.env` | `https://oja-shop.vercel.app` or tunnel URL |
| `BETTER_AUTH_URL` / `NEXT_PUBLIC_APP_URL` | `../shop/.env.local` (and Vercel) | same public URL |
| Google OAuth redirect URI | Google Cloud Console | `<public URL>/api/auth/callback/google` |

**Your machine today:** Node 22, npm 10, no iOS Simulator or Android SDK found, no Watchman. Plan: use **Expo Go on your physical phone** from Phase 0 (install it from the App Store / Play Store). Installing Xcode or Android Studio is optional and only needed for simulators or local native builds; EAS can build in the cloud.

---

## 12. Risks & gotchas

| Risk | Mitigation |
|---|---|
| Google rejects LAN-IP redirect URIs | Deploy or tunnel before Phase 5 (§5.3). |
| Better Auth Expo + Expo Go deep-link origins (`exp://…`) differ from production (`oja://`) | Add both to `trustedOrigins` in dev; switch to a development build if Expo Go gets in the way. |
| Web `lib/` changes break the synced copies | `sync:check` script + header comments; shared tests run in both repos. |
| Web cache tags: `updateTag` only works in Server Actions | Route handlers use `revalidateTag` so web pages still refresh after mobile mutations. |
| Custom font weights on Android | `Text` primitive maps weight → family; screens never set `fontFamily`. |
| NativeWind version vs Expo SDK compatibility | Pin versions from NativeWind's Expo guide at setup; fall back to the typed `theme/` + `StyleSheet` if it fights us (tokens are the same either way). |
| Large product images on slow networks | Server already stores width/height; `expo-image` caching + placeholders; request sized images where the source supports it. |
| Old app versions in the wild once shipped | API is versioned (`/v1`); only additive changes to v1. |

---

## 13. Decisions I need from you

1. **⚠ May I edit the web repo (`../shop`)?** The mobile app cannot work without the `/api/v1` routes and the Better Auth Expo plugin (§5). Changes are additive; existing web behaviour stays the same.
2. **⚠ Deploy or tunnel?** Default: **deploy the web app to Vercel** (needed for Google sign-in from a phone). Alternative: a tunnel for local dev.
3. **Admin in the mobile app?** Default: **no**, admin stays on the web for v1. Could add a read-only orders view for admins later.
4. **Styling approach?** Default: **NativeWind** with the web's exact token class names (familiar, parity with web). Alternative: plain `StyleSheet` + typed theme (more "pure React Native" learning, one less dependency). Tokens and visuals are identical either way.
5. **Learning pace?** Default: I build each phase, explain the new concepts, and leave 1–2 small exercises for you in `docs/learning/`. Alternative: you write more of the code with me reviewing.
