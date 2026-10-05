# 04 · Navigation (Expo Router)

Same mental model as the Next.js App Router: **files are routes**, `_layout.tsx` wraps its folder, `[slug].tsx` is dynamic,
`(group)` folders don't appear in the URL.

```
src/app/
  _layout.tsx            root Stack: fonts, splash, providers
  (tabs)/_layout.tsx     the 5-tab bar          ← JS tabs (`expo-router/js-tabs`)
  (tabs)/index.tsx       Home
  (tabs)/shop/…          its own Stack: list + [category]
  (tabs)/account/…       Stack: overview, orders, order detail, addresses, address form
  product/[slug].tsx     pushed above the tabs (tab bar hides)
  search.tsx, login.tsx  presented as modals
  checkout/…             guarded by a layout that redirects signed-out users
  info/…                 about, faq, contact, [page] (shipping, privacy, terms)
```

Ideas to notice:
- **Stack vs Tabs.** A Stack is a pile of screens (push/back). Tabs switch between piles. We nest a Stack inside the Shop and Account tabs.
- **Modals** are just `presentation: "modal"` in the Stack's options.
- **Params**: `useLocalSearchParams<{ slug: string }>()`; navigate with `router.push({ pathname: "/product/[slug]", params: { slug } })`. Typed routes (`typedRoutes: true`) check this at compile time.
- **Guards**: `checkout/_layout.tsx` returns `<Redirect href=…/>` when signed out — the same idea as the web's `requireUser()`.
- **Deep links**: scheme `oja://` maps to the same paths (`oja://product/glazed-stoneware-mug`).
- **`key` to reset a screen**: `<ShopView key={q} />` remounts when the search changes (cleaner than syncing state in an effect — the React Compiler lint rule pushed us there).
- **Android back**: success screen overrides it with `BackHandler` so you don't step back into a finished checkout.

## Exercises
1. Add an `info/shipping-returns` link to the product page's Delivery tab.
2. Open `oja://shop/ceramics` with `npx uri-scheme open "oja://shop/ceramics" --ios` (or `--android`).
3. Add a 6th route `(tabs)/account/notifications.tsx` and see it appear in typed `href`s after `expo start`.
