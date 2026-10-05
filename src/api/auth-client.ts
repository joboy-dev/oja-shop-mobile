import { expoClient } from "@better-auth/expo/client";
import { createAuthClient } from "better-auth/react";
import * as SecureStore from "expo-secure-store";
import { API_URL } from "./env";

/**
 * Better Auth client for the same auth server the website uses. The expo plugin opens the system
 * browser for Google, receives the session through the `oja://` deep link, and keeps the cookie in
 * SecureStore (iOS Keychain / Android Keystore), never in plain storage.
 */
export const authClient = createAuthClient({
  baseURL: API_URL,
  plugins: [expoClient({ scheme: "oja", storagePrefix: "oja", storage: SecureStore })],
});
