/**
 * Same output as the web's formatMoney()/nairaToKobo(), but without Intl.NumberFormat: Hermes' Intl
 * support for the en-NG locale and NGN symbol varies by OS/ICU version, and a price that reads
 * "NGN 12,500" on one phone and "₦12,500" on another is a bug. Money is integer kobo throughout.
 */
const CURRENCY_SYMBOLS: Record<string, string> = { NGN: "₦" };

const group = (n: number) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ",");

/** Format integer kobo as currency. Whole-naira amounts drop decimals: ₦12,500 / ₦12,500.50 */
export function formatMoney(kobo: number, currency = "NGN"): string {
  const sign = kobo < 0 ? "-" : "";
  const abs = Math.abs(Math.round(kobo));
  const naira = Math.floor(abs / 100);
  const rest = abs % 100;
  const symbol = CURRENCY_SYMBOLS[currency] ?? `${currency} `;
  return `${sign}${symbol}${group(naira)}${rest === 0 ? "" : `.${String(rest).padStart(2, "0")}`}`;
}

/** Convert a user-typed naira amount (e.g. "12,500.50") to integer kobo. Returns null if invalid. */
export function nairaToKobo(input: string | number): number | null {
  const n = typeof input === "number" ? input : Number(input.replace(/[₦,\s]/g, ""));
  if (!Number.isFinite(n) || n < 0) return null;
  return Math.round(n * 100);
}

export function koboToNaira(kobo: number): number {
  return kobo / 100;
}
