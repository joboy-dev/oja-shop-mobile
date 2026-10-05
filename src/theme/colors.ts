import { vars } from "nativewind";

/**
 * Colour tokens copied verbatim from the web app (shop/app/globals.css, "Indigo vat").
 * Light/dark pairs were checked against WCAG AA there; do not tweak values here without
 * changing the web first.
 */
export const palette = {
  light: {
    background: "#f5f6fa",
    surface: "#ffffff",
    "surface-2": "#eceef6",
    fg: "#14163a",
    "fg-muted": "#585c7e",
    border: "#dadceb",
    "border-strong": "#b9bdd6",
    primary: "#2e36a0",
    "primary-hover": "#252c88",
    "primary-soft": "#e6e8fa",
    "on-primary": "#ffffff",
    accent: "#f0b429",
    "on-accent": "#14163a",
    success: "#1f7a55",
    "success-soft": "#dff3ea",
    danger: "#b52b43",
    "danger-soft": "#fbe3e7",
    ring: "#2e36a0",
  },
  dark: {
    background: "#0c0e26",
    surface: "#151838",
    "surface-2": "#1d2148",
    fg: "#eef0fa",
    "fg-muted": "#a3a7c7",
    border: "#2a2f5c",
    "border-strong": "#3d4380",
    primary: "#8c95ff",
    "primary-hover": "#a3abff",
    "primary-soft": "#232866",
    "on-primary": "#0c0e26",
    accent: "#f5c24c",
    "on-accent": "#0c0e26",
    success: "#4cc38a",
    "success-soft": "#12372b",
    danger: "#ff6b81",
    "danger-soft": "#431a26",
    ring: "#8c95ff",
  },
} as const;

export type ColorScheme = keyof typeof palette;
export type ColorToken = keyof (typeof palette)["light"];
export type ThemeColors = Record<ColorToken, string>;

/** Backdrop behind sheets and modals (web: --overlay). Has alpha, so it is not a Tailwind token. */
export const overlay = { light: "rgba(20, 22, 58, 0.45)", dark: "rgba(5, 6, 20, 0.65)" } as const;

/** Web's `themeColor` meta values: used for the status bar / system UI background. */
export const chromeColor = { light: palette.light.background, dark: palette.dark.background } as const;

/** "#2e36a0" → "46 54 160", the space-separated form Tailwind's `rgb(var(--x) / <alpha>)` needs. */
export function hexToChannels(hex: string): string {
  const h = hex.replace("#", "");
  return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16)).join(" ");
}

const varsCache: Partial<Record<ColorScheme, ReturnType<typeof vars>>> = {};

/** CSS variables for one scheme (cached, so the style object is referentially stable). Applied on the root view and on anything portalled outside it. */
export function themeVars(scheme: ColorScheme) {
  return (varsCache[scheme] ??= vars(
    Object.fromEntries(
      Object.entries(palette[scheme]).map(([name, hex]) => [`--${name}`, hexToChannels(hex)]),
    ),
  ));
}

/** "#2e36a0", 0.5 → "rgba(46, 54, 160, 0.5)". For props that can't take a Tailwind opacity class (placeholders, gradients). */
export function withAlpha(hex: string, alpha: number): string {
  return `rgba(${hexToChannels(hex).split(" ").join(", ")}, ${alpha})`;
}
