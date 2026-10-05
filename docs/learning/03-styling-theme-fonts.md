# 03 · Styling, theme, fonts (matching the web exactly)

## NativeWind = Tailwind classes → RN styles
`<View className="rounded-card bg-surface p-4">` compiles to a style object. Token **names** are identical to the web
(`bg-surface`, `text-fg-muted`, `border-border-strong`) so you can read mobile code like web code.

## Where the colours come from
`src/theme/colors.ts` holds the web's palette **verbatim** (from `shop/app/globals.css`). `tailwind.config.js` maps each
name to `rgb(var(--name) / <alpha-value>)`. `ThemeProvider` puts the current scheme's variables on the root `View` with
NativeWind's `vars()`. Switching light/dark = swapping the variables; components never mention dark mode.

`colors.test.ts` reads the web's CSS and fails if any hex differs. Change the web first, then mobile.

Gotcha: bottom sheets render through a portal, so they re-apply `useThemeVars()`.

## Fonts and type
Web: Bricolage Grotesque (display), Instrument Sans (UI), Geist Mono (prices, order numbers).
RN differences we handled:
- **One font file per weight.** `font-weight: 700` does not pick the bold file of a custom family. Tailwind families are
  `font-display`, `font-sans-medium`, `font-mono`… each one a file name.
- **No `em`.** `letter-spacing: -0.03em` at 32px → `tracking-[-0.96px]`. `src/theme/typography.ts` has every variant pre-computed.
- **Styles don't cascade**, so `<Text variant="h1">` carries family + size + line height + tracking together. Never set
  `fontFamily` directly.
- Prices use `tabular-nums`.

## `cn()` and why we rewrote it
`tailwind-merge` doesn't know our custom names, so `cn("text-fg", "text-fg-muted")` kept both and NativeWind picked
the wrong one. `src/utils/cn.ts` teaches it our colours, radii and font families (`cn.test.ts`).

## The `className` gotcha we actually hit (twice)
NativeWind turns `className` into styles for **core** components (`View`, `Text`, `Pressable`, `ScrollView`, `TextInput`…).
It does **not** reliably do so for Reanimated components or third-party ones (`Animated.View`, `expo-image`, `LinearGradient`,
`SafeAreaView`, `KeyboardAwareScrollView`). The web preview hid this (we even "fixed" it there with `cssInterop`), but on a real
iPhone every animated button lost its layout: rows stacked vertically, buttons had no background, absolutely-positioned icons vanished.

The rule now: **classes go on plain `View`/`Pressable`; animation goes on a style-only `Animated.View` wrapper** (see `Reveal.tsx`,
`StepCard.tsx`), and third-party components are wrapped (`Image.tsx`, `Gradient.tsx`, `Screen.tsx`). Press feedback is
`active:scale-[0.97]` on a plain Pressable. Lesson: test on a device.

## When we use `style`
Only runtime values: window width, safe-area insets, shadows (theme-dependent), Reanimated animated styles.

## Exercises
1. Add a `success` variant to `Badge` using `bg-success-soft` / `text-success`.
2. Make a `Text` variant `caption-mono` (12px mono). Where must you add it so TypeScript and Tailwind both see it?
3. Switch the theme to Dark in Account and trace which variables change (`themeVars("dark")`).
