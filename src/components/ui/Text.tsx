import { Text as RNText, type TextProps as RNTextProps } from "react-native";
import { cn } from "@/utils/cn";
import { cappedVariants, textVariants, type TextVariant } from "@/theme/typography";

const tones = {
  default: "text-fg",
  muted: "text-fg-muted",
  primary: "text-primary",
  "on-primary": "text-on-primary",
  "on-accent": "text-on-accent",
  success: "text-success",
  danger: "text-danger",
  white: "text-white",
} as const;

export type TextTone = keyof typeof tones;

export interface TextProps extends RNTextProps {
  variant?: TextVariant;
  tone?: TextTone;
}

const headings = new Set<TextVariant>(["hero", "h1", "h2", "h3"]);
const tabular = new Set<TextVariant>(["priceSm", "priceMd", "priceLg", "priceXl", "mono", "eyebrow"]);

/**
 * The only way text is rendered in the app. In React Native styles don't cascade from a parent View and
 * custom fonts have one file per weight, so the font family, size, line height and tracking all travel
 * together in a `variant` (see theme/typography.ts). Screens never set fontFamily directly.
 */
export function Text({ variant = "body", tone = "default", className, ...props }: TextProps) {
  return (
    <RNText
      accessibilityRole={headings.has(variant) ? "header" : undefined}
      maxFontSizeMultiplier={cappedVariants.has(variant) ? 1.3 : 1.8}
      className={cn(textVariants[variant], tabular.has(variant) && "tabular-nums", tones[tone], className)}
      {...props}
    />
  );
}
