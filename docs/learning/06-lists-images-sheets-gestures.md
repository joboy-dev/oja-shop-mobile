# 06 · Lists, images, sheets, gestures, motion

- **Lists.** `FlashList` (Shopify) for the 2-column product grid: it recycles cells like native lists. Horizontal shelves are `FlatList`. Never `.map()` a long list inside a `ScrollView`.
- **Images.** `expo-image`: memory + disk cache, cross-fade. Always give a size/aspect. Wrapper in `components/ui/Image.tsx`.
- **Bottom sheets.** `@gorhom/bottom-sheet` (web: Vaul). `Sheet` handles backdrop, keyboard, safe area. `FilterSheet` mounts its form only while open, so each opening starts from the applied filters.
- **Press feedback.** `PressableScale`: a plain `Pressable` with NativeWind's `active:scale-[0.97]` (no Reanimated component, see note 03 for why).
- **Reanimated 101.** `useSharedValue` (a value both threads see) + `useAnimatedStyle` (style derived from it) + `withTiming`/`withSpring`. Entering/layout animations: `FadeInDown`, `LinearTransition`.
- **Gestures.** `ZoomableImage`: `Gesture.Pinch`, `Pan`, `Tap(2)` composed with `Exclusive`/`Simultaneous`. Pan uses `manualActivation` so a paging list around it can still swipe when not zoomed.
- **Swipe to delete.** `ReanimatedSwipeable` in `CartLineItem` — plus a visible button, because swipe isn't accessible.
- **Haptics.** `utils/haptics.ts` (`expo-haptics`), used for add-to-bag, selections, order success.
- **Reduced motion.** `useReducedMotion()` → no scale, plain fades, no stamp.
- **Sharing/Linking.** `Share.share` (native share sheet), `Linking.openURL` for `mailto:`/`tel:`.

## Exercises
1. Make `Reveal` stagger 90ms instead of 60ms; feel the difference on device.
2. Add a double-tap on a product card image to toggle the wishlist heart (`Gesture.Tap().numberOfTaps(2)`).
3. Turn on Settings → Accessibility → Reduce Motion and walk through Home. What changed?
