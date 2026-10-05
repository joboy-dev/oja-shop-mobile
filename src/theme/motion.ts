import { Easing } from "react-native-reanimated";

/** Motion tokens from the web (--ease-snap, 120/200/320ms, spring bounce 0 / 0.35s). */
export const ease = {
  snap: Easing.bezier(0.22, 1, 0.36, 1),
  inOutSoft: Easing.bezier(0.65, 0, 0.35, 1),
};

export const duration = { fast: 120, base: 200, slow: 320 } as const;

/** Default spring: no bounce, settles in 350ms. */
export const spring = { duration: 350, dampingRatio: 1 } as const;
/** Slight bounce, only for things released from a drag. */
export const springBouncy = { duration: 450, dampingRatio: 0.85 } as const;

/** Press feedback on every button and card (web: active:scale-[0.97]). */
export const PRESS_SCALE = 0.97;

/** Stagger between siblings revealing on screen (web: 60ms). */
export const STAGGER = 60;
