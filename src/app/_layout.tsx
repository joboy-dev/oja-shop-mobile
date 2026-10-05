import "../global.css";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { OfflineBanner } from "@/components/layout/OfflineBanner";
import { AppProviders } from "@/providers/AppProviders";
import { fontAssets } from "@/theme/fonts";
import { useStackOptions } from "@/theme/useStackOptions";
import { useThemeStore } from "@/theme/theme.store";

// Keep the native splash up until fonts and the saved theme are ready, so there's no flash of the wrong look.
void SplashScreen.preventAutoHideAsync();

function RootStack() {
  const options = useStackOptions();
  return (
    <>
      <OfflineBanner />
      <Stack screenOptions={options}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="product/[slug]" options={{ title: "" }} />
        <Stack.Screen name="search" options={{ headerShown: false, animation: "fade_from_bottom" }} />
        <Stack.Screen name="login" options={{ presentation: "modal", headerShown: false }} />
        <Stack.Screen name="auth-return" options={{ headerShown: false, animation: "none" }} />
        <Stack.Screen name="checkout" options={{ headerShown: false }} />
        <Stack.Screen name="info" options={{ headerShown: false }} />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts(fontAssets);
  const themeReady = useThemeStore((s) => s.hydrated);
  const ready = (fontsLoaded || !!fontError) && themeReady;

  useEffect(() => {
    if (ready) void SplashScreen.hideAsync();
  }, [ready]);

  if (!ready) return null;
  return (
    <AppProviders>
      <RootStack />
    </AppProviders>
  );
}
