import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { QueryClientProvider } from "@tanstack/react-query";
import { useEffect, type ReactNode } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { queryClient, setupQueryManagers } from "@/api/query-client";
import { Toaster } from "@/components/ui/Toaster";
import { CartSync } from "@/features/cart";
import { ThemeProvider } from "@/theme/ThemeProvider";
import { SessionEffects } from "./SessionEffects";

/**
 * Everything the app needs above its screens, outermost first:
 * gestures → safe areas → theme → server-state cache → keyboard → bottom sheets → toasts & sync.
 */
export function AppProviders({ children }: { children: ReactNode }) {
  useEffect(() => setupQueryManagers(), []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ThemeProvider>
          <QueryClientProvider client={queryClient}>
            <KeyboardProvider>
              <BottomSheetModalProvider>
                {children}
                <Toaster />
                {/* SessionEffects first: on sign-out it must reset the bag before CartSync re-initialises it. */}
                <SessionEffects />
                <CartSync />
              </BottomSheetModalProvider>
            </KeyboardProvider>
          </QueryClientProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
