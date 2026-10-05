import NetInfo from "@react-native-community/netinfo";
import { focusManager, onlineManager, QueryClient } from "@tanstack/react-query";
import { AppState, Platform } from "react-native";
import { ApiError } from "./client";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000,
      gcTime: 24 * 60 * 60 * 1000,
      // Retry only failures that might go away (offline, timeout, 5xx), never "not found" or validation.
      retry: (failureCount, error) =>
        error instanceof ApiError ? error.retryable && failureCount < 2 : failureCount < 2,
      refetchOnReconnect: true,
    },
    mutations: { retry: false },
  },
});

/**
 * TanStack Query assumes a browser. Teach it the two mobile equivalents of "tab focus" and
 * "online": the app coming to the foreground, and NetInfo's connectivity state.
 */
export function setupQueryManagers() {
  const appStateSub = AppState.addEventListener("change", (status) => {
    if (Platform.OS !== "web") focusManager.setFocused(status === "active");
  });
  const unsubscribeNet = NetInfo.addEventListener((state) => {
    onlineManager.setOnline(state.isConnected !== false && state.isInternetReachable !== false);
  });
  return () => {
    appStateSub.remove();
    unsubscribeNet();
  };
}
