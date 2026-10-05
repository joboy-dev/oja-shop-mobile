// Synced from shop/lib/config/site.ts. Edit it there, then run `npm run sync:shared`.
export const siteConfig = {
  name: "Ọjà",
  slug: "oja",
  tagline: "Handmade goods from Lagos",
  description:
    "Ọjà is a Lagos shop for hand-dyed adire textiles, ceramics, woven baskets, candles and body care, made by independent makers.",
  nav: [
    { label: "Shop", href: "/shop" },
    { label: "Textiles", href: "/shop/textiles" },
    { label: "Ceramics", href: "/shop/ceramics" },
    { label: "About", href: "/about" },
  ],
  footer: {
    shop: [
      { label: "All products", href: "/shop" },
      { label: "Textiles", href: "/shop/textiles" },
      { label: "Ceramics", href: "/shop/ceramics" },
      { label: "Candles", href: "/shop/candles" },
    ],
    help: [
      { label: "Shipping & returns", href: "/shipping-returns" },
      { label: "FAQ", href: "/faq" },
      { label: "Contact", href: "/contact" },
    ],
    company: [
      { label: "About", href: "/about" },
      { label: "Privacy", href: "/privacy" },
      { label: "Terms", href: "/terms" },
    ],
  },
  contact: { email: "hello@oja.shop", phone: "+234 800 000 0000", city: "Lagos, Nigeria" },
  socials: [
    { label: "Instagram", href: "https://instagram.com" },
    { label: "X", href: "https://x.com" },
  ],
} as const;
