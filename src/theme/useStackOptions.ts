import type { NativeStackNavigationOptions } from "expo-router";
import { useTheme } from "./ThemeProvider";

/** Native header styling in the brand: themed background, Bricolage titles, no hairline shadow. */
export function useStackOptions(): NativeStackNavigationOptions {
  const { colors } = useTheme();
  return {
    headerStyle: { backgroundColor: colors.background },
    headerTintColor: colors.fg,
    headerTitleStyle: { fontFamily: "BricolageGrotesque_700Bold", color: colors.fg, fontSize: 18 },
    headerShadowVisible: false,
    headerBackButtonDisplayMode: "minimal",
    contentStyle: { backgroundColor: colors.background },
  };
}
