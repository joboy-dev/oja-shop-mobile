import { Switch as RNSwitch } from "react-native";
import { useTheme } from "@/theme/ThemeProvider";

export function Switch({
  value,
  onValueChange,
  label,
}: {
  value: boolean;
  onValueChange: (v: boolean) => void;
  label: string;
}) {
  const { colors } = useTheme();
  return (
    <RNSwitch
      accessibilityLabel={label}
      value={value}
      onValueChange={onValueChange}
      trackColor={{ false: colors["border-strong"], true: colors.primary }}
      thumbColor="#ffffff"
      ios_backgroundColor={colors["border-strong"]}
    />
  );
}
