import { Toaster as SonnerToaster } from "sonner-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "@/theme/ThemeProvider";
import { radius } from "@/theme/tokens";

/** Toasts (web: Sonner). Same API: toast.success / toast.error / toast("…", { action: { label, onClick } }). */
export function Toaster() {
  const { colors, scheme } = useTheme();
  const insets = useSafeAreaInsets();
  return (
    <SonnerToaster
      theme={scheme}
      position="bottom-center"
      offset={insets.bottom + 72}
      toastOptions={{
        style: {
          backgroundColor: colors.surface,
          borderColor: colors.border,
          borderWidth: 1,
          borderRadius: radius.card,
        },
        titleStyle: { color: colors.fg, fontFamily: "InstrumentSans_500Medium", fontSize: 15 },
        descriptionStyle: { color: colors["fg-muted"], fontFamily: "InstrumentSans_400Regular" },
        actionButtonStyle: { backgroundColor: colors["primary-soft"] },
        actionButtonTextStyle: { color: colors.primary, fontFamily: "InstrumentSans_600SemiBold" },
      }}
    />
  );
}
