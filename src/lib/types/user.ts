// Synced from shop/lib/types/user.ts. Edit it there, then run `npm run sync:shared`.
/** What the browser is allowed to know about the signed-in user. */
export interface UserSummary {
  id: string;
  name: string;
  email: string;
  image: string | null;
  role: "customer" | "admin";
}
