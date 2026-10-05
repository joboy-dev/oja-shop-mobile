import { authClient } from "@/api/auth-client";
import type { UserSummary } from "@/lib/types/user";

/** The signed-in user (from Better Auth's session in SecureStore), or null. `isPending` is true until the first check finishes. */
export function useSessionUser() {
  const { data, isPending } = authClient.useSession();
  const raw = data?.user as
    (NonNullable<typeof data>["user"] & { role?: string; phone?: string | null }) | undefined;
  const user: (UserSummary & { phone: string | null }) | null = raw
    ? {
        id: raw.id,
        name: raw.name,
        email: raw.email,
        image: raw.image ?? null,
        role: raw.role === "admin" ? "admin" : "customer",
        phone: raw.phone ?? null,
      }
    : null;
  return { user, isAuthenticated: !!user, isPending };
}
