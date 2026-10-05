import { createContext, useContext, useEffect, useMemo, type ReactNode } from "react";
import { Appearance, useColorScheme, View } from "react-native";
import { DarkTheme, DefaultTheme, ThemeProvider as NavigationThemeProvider } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { chromeColor, overlay, palette, themeVars, type ColorScheme, type ThemeColors } from "./colors";
import { useThemeStore, type ThemePreference } from "./theme.store";

interface ThemeContextValue {
  scheme: ColorScheme;
  colors: ThemeColors;
  overlay: string;
  preference: ThemePreference;
  setPreference: (preference: ThemePreference) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

/**
 * Resolves light/dark (system or manual), exposes the palette to JS, and sets the CSS variables that
 * NativeWind classes (bg-surface, text-fg …) read. Web equivalent: <html data-theme> + ThemeScript.
 */
export function ThemeProvider({ children }: { children: ReactNode }) {
  const system = useColorScheme();
  const preference = useThemeStore((s) => s.preference);
  const setPreference = useThemeStore((s) => s.setPreference);

  const scheme: ColorScheme = preference === "system" ? (system === "dark" ? "dark" : "light") : preference;

  // Keep native chrome (keyboard, alerts, date pickers) in step with a manual choice.
  useEffect(() => {
    // react-native-web (used for quick desktop previews) doesn't implement this.
    Appearance.setColorScheme?.(preference === "system" ? "unspecified" : preference);
  }, [preference]);

  const value = useMemo<ThemeContextValue>(
    () => ({ scheme, colors: palette[scheme], overlay: overlay[scheme], preference, setPreference }),
    [scheme, preference, setPreference],
  );

  const navigationTheme = useMemo(() => {
    const base = scheme === "dark" ? DarkTheme : DefaultTheme;
    const c = palette[scheme];
    return {
      ...base,
      colors: {
        ...base.colors,
        primary: c.primary,
        background: c.background,
        card: c.surface,
        text: c.fg,
        border: c.border,
        notification: c.accent,
      },
    };
  }, [scheme]);

  return (
    <ThemeContext.Provider value={value}>
      <NavigationThemeProvider value={navigationTheme}>
        <View style={[{ flex: 1, backgroundColor: chromeColor[scheme] }, themeVars(scheme)]}>
          <StatusBar style={scheme === "dark" ? "light" : "dark"} />
          {children}
        </View>
      </NavigationThemeProvider>
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used inside <ThemeProvider>");
  return ctx;
}

/**
 * Anything rendered through a portal (bottom sheets, modals) lives outside the root view, so it does not
 * inherit the CSS variables. Spread this onto the portalled content's root `style`.
 */
export function useThemeVars() {
  return themeVars(useTheme().scheme);
}
