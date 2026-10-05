import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

/**
 * Same idea as the web's cn(), but tailwind-merge has to learn our custom token names, otherwise
 * `text-fg` / `text-fg-muted` / `font-sans` / `rounded-card` don't conflict with their siblings and
 * both classes survive (NativeWind then applies whichever it sees last, not whichever you wrote last).
 */
const twMerge = extendTailwindMerge({
  extend: {
    theme: {
      color: [
        "background",
        "surface",
        "surface-2",
        "fg",
        "fg-muted",
        "border",
        "border-strong",
        "primary",
        "primary-hover",
        "primary-soft",
        "on-primary",
        "accent",
        "on-accent",
        "success",
        "success-soft",
        "danger",
        "danger-soft",
        "ring",
      ],
      radius: ["control", "card", "sheet"],
    },
    classGroups: {
      "font-family": [
        {
          font: [
            "display",
            "display-semibold",
            "sans",
            "sans-medium",
            "sans-semibold",
            "sans-bold",
            "mono",
            "mono-medium",
          ],
        },
      ],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
