import * as Haptics from "expo-haptics";
import { Platform } from "react-native";

type Kind = "light" | "medium" | "success" | "warning" | "select";

/** Fire-and-forget haptic feedback. No-op on web and anywhere haptics aren't available. */
export function haptic(kind: Kind = "light") {
  if (Platform.OS === "web") return;
  const run = async () => {
    switch (kind) {
      case "light":
        return Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      case "medium":
        return Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      case "success":
        return Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      case "warning":
        return Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      case "select":
        return Haptics.selectionAsync();
    }
  };
  void run().catch(() => {});
}
