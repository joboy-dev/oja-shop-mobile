import { authClient } from "@/api/auth-client";

/**
 * Opens Google in the system browser. The server handles the OAuth callback and the Better Auth Expo
 * client stores the session in SecureStore when the browser returns (the session hook then updates).
 * `/auth-return` is a do-nothing route so an Android deep-link return just pops back to where you were.
 */
export async function signInWithGoogle() {
  return authClient.signIn.social({ provider: "google", callbackURL: "/auth-return" });
}

/** Ends the session. Clearing the previous user's bag and cached data is SessionEffects' job (providers/). */
export async function signOutUser() {
  await authClient.signOut();
}
