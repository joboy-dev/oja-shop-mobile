/**
 * Type scale from the web (globals.css base + utilities), converted for React Native:
 * rem/clamp → points at phone width, em letter-spacing → absolute points, unitless line-height → points.
 * Class strings must stay literal so Tailwind can see them.
 *
 *   hero    .display-hero   44 / 43, -0.04em
 *   h1      h1              32 / 34, -0.03em
 *   h2      h2              24 / 26, -0.025em
 *   h3      h3              20 / 24, -0.015em
 *   body    body            16 / 25 (1.55)
 *   eyebrow .eyebrow        12 mono, +0.12em, uppercase
 */
export const textVariants = {
  hero: "font-display text-[44px] leading-[43px] tracking-[-1.76px]",
  h1: "font-display text-[32px] leading-[34px] tracking-[-0.96px]",
  h2: "font-display text-[24px] leading-[26px] tracking-[-0.6px]",
  h3: "font-display-semibold text-[20px] leading-[24px] tracking-[-0.3px]",
  bodyLg: "font-sans text-[18px] leading-[28px]",
  body: "font-sans text-[16px] leading-[25px]",
  bodySm: "font-sans text-[15px] leading-[22px]",
  label: "font-sans-medium text-[15px] leading-[20px]",
  caption: "font-sans text-[14px] leading-[20px]",
  badge: "font-sans-semibold text-[12px] leading-[16px]",
  eyebrow: "font-mono text-[12px] leading-[16px] tracking-[1.44px] uppercase",
  prose: "font-sans text-[17px] leading-[29px]",
  // Prices: Geist Mono, tabular numerals (applied in Text via fontVariant). Sizes mirror Price sm/md/lg/xl.
  priceSm: "font-mono-medium text-[14px] leading-[18px]",
  priceMd: "font-mono-medium text-[16px] leading-[21px]",
  priceLg: "font-mono-medium text-[20px] leading-[26px]",
  priceXl: "font-mono-medium text-[30px] leading-[38px]",
  mono: "font-mono text-[14px] leading-[20px]",
} as const;

export type TextVariant = keyof typeof textVariants;

/** Headline variants are capped so large accessibility font sizes don't overflow the layout. */
export const cappedVariants: ReadonlySet<TextVariant> = new Set(["hero", "h1", "h2", "priceXl"]);
