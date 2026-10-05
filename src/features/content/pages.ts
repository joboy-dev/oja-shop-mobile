import { shippingMethods, shopConfig } from "@/lib/config/shop";
import { siteConfig } from "@/lib/config/site";
import { formatMoney } from "@/utils/money";

/** Long-form copy, identical to the web's pages. A block is a heading, a paragraph, or a list. */
export type Block =
  { type: "h2"; text: string } | { type: "p"; text: string } | { type: "ul" | "ol"; items: string[] };

export interface InfoPageContent {
  eyebrow: string;
  title: string;
  intro?: string;
  blocks: Block[];
}

const s = shippingMethods.standard;
const e = shippingMethods.express;

export const infoPages: Record<string, InfoPageContent> = {
  "shipping-returns": {
    eyebrow: "Help",
    title: "Shipping & returns",
    blocks: [
      { type: "h2", text: "Delivery" },
      {
        type: "p",
        text: "We deliver across Nigeria. Orders are packed by hand and normally leave our studio within one working day of being confirmed.",
      },
      {
        type: "ul",
        items: [
          `${s.label}, ${formatMoney(s.fee)}. ${s.description}. Free on orders over ${formatMoney(shopConfig.freeShippingThreshold)}.`,
          `${e.label}, ${formatMoney(e.fee)}. ${e.description}.`,
        ],
      },
      {
        type: "p",
        text: "You'll get an email when your order ships, and you can follow it under Account → Orders.",
      },
      { type: "h2", text: "Payment" },
      {
        type: "p",
        text: "Pay on delivery, or by bank transfer. For transfers, use your order number as the reference; we ship as soon as the payment arrives.",
      },
      { type: "h2", text: "Returns" },
      {
        type: "p",
        text: "If something isn't right, you can return it within 7 days of delivery for a refund or exchange, provided it is unused and in its original packaging.",
      },
      {
        type: "ol",
        items: [
          "Contact us with your order number and the item you'd like to return.",
          "We'll arrange collection or tell you where to send it.",
          "Once it reaches us and passes a quick check, we refund or exchange within 5 working days.",
        ],
      },
      {
        type: "p",
        text: "Because pieces are handmade, small variations in colour, pattern and glaze are normal and aren't a reason for return. Damaged or incorrect items are always replaced at our cost.",
      },
    ],
  },
  privacy: {
    eyebrow: "Legal",
    title: "Privacy policy",
    intro: "What we collect, why, and who we share it with.",
    blocks: [
      { type: "h2", text: "What we collect" },
      {
        type: "ul",
        items: [
          "Account: your name, email address and profile photo from Google when you sign in. We never see your Google password.",
          "Orders: delivery addresses, phone numbers, items ordered and delivery notes.",
          "Messages: anything you send through the contact form or newsletter signup.",
        ],
      },
      {
        type: "p",
        text: "We do not collect or store card details. Payment is made on delivery or by bank transfer.",
      },
      { type: "h2", text: "How we use it" },
      {
        type: "p",
        text: "To process and deliver your orders, send order emails, answer your messages and, if you subscribed, tell you about new pieces. We don't sell your data.",
      },
      { type: "h2", text: "Who processes it for us" },
      {
        type: "ul",
        items: [
          "Neon, for our database and image storage.",
          "Mailgun, to send email.",
          "Google, for sign-in.",
          "Delivery partners, who receive only the name, address and phone number needed to deliver.",
        ],
      },
      { type: "h2", text: "Your choices" },
      {
        type: "p",
        text: `You can view and edit your addresses in your account, unsubscribe from the newsletter at any time, and ask us to delete your account and data by writing to ${siteConfig.contact.email}. Order records may be kept where we are legally required to.`,
      },
      { type: "h2", text: "On your phone" },
      {
        type: "p",
        text: "The app keeps your sign-in in your phone's secure storage, and remembers your bag and theme choice on the device. We don't use advertising trackers.",
      },
    ],
  },
  terms: {
    eyebrow: "Legal",
    title: "Terms of service",
    intro: "The short version of how buying from Ọjà works.",
    blocks: [
      { type: "h2", text: "Orders" },
      {
        type: "p",
        text: "When you place an order we send a confirmation email. That confirms we've received it; the order is accepted once we confirm the items are available. If something sells out before we can pack it, we'll tell you and refund anything you've paid.",
      },
      { type: "h2", text: "Prices" },
      {
        type: "p",
        text: "Prices are in Nigerian naira and include no hidden fees. Delivery is shown at checkout before you place your order. We may change prices at any time, but never for an order already placed.",
      },
      { type: "h2", text: "Payment" },
      {
        type: "p",
        text: "You can pay on delivery or by bank transfer. Orders paid by transfer ship once payment is received. Quote your order number as the transfer reference.",
      },
      { type: "h2", text: "Delivery and returns" },
      {
        type: "p",
        text: "Delivery times are estimates. Our shipping and returns policy forms part of these terms.",
      },
      { type: "h2", text: "Handmade goods" },
      {
        type: "p",
        text: "Our products are made by hand, so size, colour and pattern vary slightly between pieces. Photographs are as accurate as we can make them, but the piece you receive will not be identical.",
      },
      { type: "h2", text: "Your account" },
      {
        type: "p",
        text: "You sign in with Google and are responsible for activity on your account. We may suspend accounts used for fraud or abuse.",
      },
      { type: "h2", text: "Contact" },
      { type: "p", text: "Questions about these terms? Use the contact form in the app." },
    ],
  },
};

export const faqItems = [
  {
    id: "delivery-time",
    title: "How long does delivery take?",
    content: `${s.description}. Express is ${e.description.toLowerCase()}.`,
  },
  {
    id: "delivery-cost",
    title: "How much is delivery?",
    content: `Standard is ${formatMoney(s.fee)} and free on orders over ${formatMoney(shopConfig.freeShippingThreshold)}. Express is ${formatMoney(e.fee)}.`,
  },
  {
    id: "payment",
    title: "How do I pay?",
    content:
      "Choose pay on delivery (cash or transfer when your order arrives) or bank transfer. If you pick transfer we show our account details straight after checkout and ship once the payment lands.",
  },
  {
    id: "sign-in",
    title: "Why do I need to sign in with Google?",
    content:
      "It confirms your email so we can send your order details, and it lets you track orders and save addresses. We only receive your name, email and profile photo.",
  },
  {
    id: "returns",
    title: "Can I return something?",
    content:
      "Yes. Unused items in their packaging can be returned within 7 days of delivery for a refund or exchange. Contact us with your order number and we'll arrange collection.",
  },
  {
    id: "variation",
    title: "Will my piece look exactly like the photo?",
    content:
      "Close, but not identical. Hand-dyed and hand-thrown pieces vary slightly in pattern, colour and glaze. That variation is part of what you're buying.",
  },
  {
    id: "care",
    title: "How do I look after my pieces?",
    content:
      "Every product page has care notes under 'Materials & care'. As a rule: wash indigo cloth by hand in cool water, and keep wicker dry.",
  },
  {
    id: "stock",
    title: "Why is something sold out?",
    content:
      "Makers produce in small batches. Sold-out pieces return when the next batch is finished. Subscribe to our newsletter to hear first.",
  },
] as const;

export const aboutValues = [
  {
    title: "Small batches",
    text: "A dyer can do one vat properly in a day. We buy what a maker can finish with care, and we stop there.",
  },
  {
    title: "Fair prices",
    text: "Makers set their own prices. We add a flat margin for photography, packing and delivery, and we show you the maths on request.",
  },
  {
    title: "Honest photos",
    text: "We photograph every piece ourselves, in daylight, so what arrives looks like what you ordered.",
  },
] as const;

export const aboutStory = [
  "We work with dyers in Abeokuta who still paint adire eleko by hand in cassava paste, potters in Ibadan who fire stoneware in small batches, and basket weavers in Kano whose patterns have been passed down for generations. Candles and body care come from small producers who would rather make fewer things and make them well.",
  "Ọjà is how their work reaches people in Lagos, Abuja, Port Harcourt and everywhere else in Nigeria, without a middleman taking most of the price.",
] as const;

export const aboutImage =
  "https://images.unsplash.com/photo-1558703374-f9a51255e1cc?auto=format&fit=crop&w=1200&h=800&q=80";
