import { ActivityIndicator } from "react-native";
import type { ColorToken } from "@/theme/colors";
import { useTheme } from "@/theme/ThemeProvider";

export function Spinner({
  tone = "primary",
  size = "small",
}: {
  tone?: ColorToken;
  size?: "small" | "large";
}) {
  const { colors } = useTheme();
  return <ActivityIndicator size={size} color={colors[tone]} accessibilityLabel="Loading" />;
}
