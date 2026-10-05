/**
 * Token NAMES match the web app's @theme (app/globals.css) so classes read the same on both:
 * bg-surface, text-fg-muted, bg-primary, rounded-card …
 * Token VALUES are not here: colours resolve from CSS variables that ThemeProvider sets for the
 * current light/dark scheme (see src/theme/colors.ts). The rgb(... / <alpha-value>) form keeps
 * opacity modifiers like bg-primary/50 working.
 */
const token = (name) => `rgb(var(--${name}) / <alpha-value>)`;

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        background: token("background"),
        surface: token("surface"),
        "surface-2": token("surface-2"),
        fg: token("fg"),
        "fg-muted": token("fg-muted"),
        border: token("border"),
        "border-strong": token("border-strong"),
        primary: token("primary"),
        "primary-hover": token("primary-hover"),
        "primary-soft": token("primary-soft"),
        "on-primary": token("on-primary"),
        accent: token("accent"),
        "on-accent": token("on-accent"),
        success: token("success"),
        "success-soft": token("success-soft"),
        danger: token("danger"),
        "danger-soft": token("danger-soft"),
        ring: token("ring"),
      },
      // One entry per font FILE: React Native can't pick a weight inside a custom family.
      fontFamily: {
        display: ["BricolageGrotesque_700Bold"],
        "display-semibold": ["BricolageGrotesque_600SemiBold"],
        sans: ["InstrumentSans_400Regular"],
        "sans-medium": ["InstrumentSans_500Medium"],
        "sans-semibold": ["InstrumentSans_600SemiBold"],
        "sans-bold": ["InstrumentSans_700Bold"],
        mono: ["GeistMono_400Regular"],
        "mono-medium": ["GeistMono_500Medium"],
      },
      // Web: --radius-control 0.75rem, --radius-card 1rem, --radius-sheet 1.5rem
      borderRadius: { control: "12px", card: "16px", sheet: "24px" },
    },
  },
  plugins: [],
};
