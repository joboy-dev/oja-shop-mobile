# 01 · Setup and project anatomy

## What Expo is
React Native alone needs Xcode/Android Studio. **Expo** wraps it: a CLI (`npx expo`), a bundler (**Metro**, like webpack
for RN), a set of native modules (`expo-image`, `expo-secure-store`…), and **Expo Go** — a prebuilt app on your phone that
loads your JS bundle over Wi-Fi. No native compile for day-to-day work.

Limit: Expo Go contains only Expo's bundled native modules. Add a library with custom native code and you need a
**development build** (`eas build --profile development`). Everything in this app runs in Expo Go.

## Files at the root
| File | Purpose |
|---|---|
| `app.json` | App name, `scheme: "oja"` (deep links), icons, splash, plugins. Like `next.config` + `manifest`. |
| `babel.config.js` / `metro.config.js` | Wire NativeWind into the build. |
| `tailwind.config.js` | Token *names* (values come from `src/theme/colors.ts`). |
| `src/global.css` | Just the three `@tailwind` lines. |
| `.env` | `EXPO_PUBLIC_API_URL`. Restart with `--clear` after editing (Metro caches). |

## `src/`
```
app/        routes (file = screen, like Next's app/)
features/   catalog, cart, checkout, orders… (api + queries + components per feature)
components/ ui primitives, brand SVGs, layout
api/        fetch wrapper, query client, auth client
lib/        synced from the web app
theme/      colours, type scale, motion, ThemeProvider
```

## Why `npx expo install` and not `npm i`
Each Expo SDK pins exact versions of React Native, Reanimated, etc. `expo install` picks the ones that match. Run
`npx expo-doctor` to check.

## Exercises
1. Add a `Text` to the Home header that shows `process.env.EXPO_PUBLIC_API_URL`. Change `.env`, restart with `--clear`. What happens without `--clear`?
2. Shake the phone → "Toggle element inspector". Tap a product card. Find which `View`s make up the card.
