import type { ColorScheme } from "./colors";

/** Web: --radius-control / --radius-card / --radius-sheet (also in tailwind.config.js as rounded-*). */
export const radius = { control: 12, card: 16, sheet: 24, pill: 999 } as const;

/** Minimum touch target (web: ≥44px on every interactive element). */
export const HIT = 44;

/** Horizontal screen gutter (web: container-page, 16px on phones). */
export const GUTTER = 16;

/**
 * Web: --shadow-soft / --shadow-lift / --shadow-overlay, built from hsl(232 35% 30%) in light and
 * hsl(232 60% 4%) in dark. React Native can't take hsl() with `/ alpha`, so the colours are
 * precomputed to rgb. Shadows are theme-dependent values, which classes can't express, so this is
 * one of the few places we use a `style` prop instead of NativeWind.
 */
const shadowRgb = { light: "50, 57, 103", dark: "4, 6, 16" } as const;

type Layer = [y: number, blur: number, alpha: number];
const layers = {
  soft: [
    [1, 2, 0.06],
    [2, 8, 0.05],
  ],
  lift: [
    [2, 4, 0.06],
    [12, 28, 0.12],
  ],
  overlay: [
    [8, 16, 0.12],
    [32, 64, 0.28],
  ],
} satisfies Record<string, Layer[]>;

export type ShadowName = keyof typeof layers;

export function shadow(name: ShadowName, scheme: ColorScheme) {
  return {
    boxShadow: layers[name].map(([offsetY, blurRadius, alpha]) => ({
      offsetX: 0,
      offsetY,
      blurRadius,
      color: `rgba(${shadowRgb[scheme]}, ${alpha})`,
    })),
  };
}
