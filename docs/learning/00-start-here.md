# 00 · Start here

You know Next.js + Tailwind. React Native is the **same React** (components, hooks, state) with a **different rendering
target**: instead of the DOM, your components become native iOS/Android views. Most of what changes is the *vocabulary*
and a handful of *constraints*.

## Run the app first
`npm start`, scan the QR code in **Expo Go**. Edit any file and the phone updates (Fast Refresh). Shake the phone for the dev menu.

## The cheat sheet

| Web | React Native | Note |
|---|---|---|
| `div` | `View` | Flexbox only, and `flexDirection` defaults to **column**. |
| `p`, `span`, `h1` | `Text` | **All text must be inside `<Text>`.** Styles don't cascade from a parent `View`. |
| `img` / `next/image` | `Image` (we use `expo-image`) | Give it a size (or `aspect-*`). |
| `button onClick` | `Pressable onPress` | You build the press feedback (our `PressableScale`). |
| `a` / `next/link` | `Link` / `router.push()` | Expo Router. |
| `input` | `TextInput` | `onChangeText` gives the string directly. `keyboardType` picks the keyboard. |
| scrolling page | `ScrollView` / `FlatList` / `FlashList` | Pages **don't scroll by default**; long lists must be virtualised. |
| CSS `px/rem/em` | numbers (points) | `letterSpacing` and `lineHeight` are absolute numbers. |
| `:hover` | — | Touch has no hover. Press feedback replaces it. |
| `localStorage` | `AsyncStorage` / `SecureStore` | Both async; secrets go in SecureStore. |
| cookies (automatic) | token in SecureStore | Better Auth's Expo client manages it. |
| Server Components / Actions | `fetch` to `/api/v1` + TanStack Query | The phone can't run server code. |
| `framer-motion` | Reanimated | Animations run on the UI thread. |
| `prefers-color-scheme` | `useColorScheme()` | |
| `aria-*` | `accessibilityLabel/Role/State` | |
| `NEXT_PUBLIC_*` | `EXPO_PUBLIC_*` | Inlined into the app bundle: public, never secrets. |

## Reading order
01 setup → 02 API & auth → 03 styling/theme → 04 navigation → 05 data → 06 lists/sheets/gestures → 07 forms & checkout → 08 testing & shipping.
Each note ends with exercises. Do them in a scratch branch.
