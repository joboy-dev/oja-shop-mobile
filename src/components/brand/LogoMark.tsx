import Svg, { Circle } from "react-native-svg";
import { useTheme } from "@/theme/ThemeProvider";

/** Three concentric rings with a turmeric centre (web: LogoMark). `color` defaults to the theme's primary. */
export function LogoMark({
  size = 28,
  color,
  centerColor,
}: {
  size?: number;
  color?: string;
  centerColor?: string;
}) {
  const { colors } = useTheme();
  const stroke = color ?? colors.primary;
  return (
    <Svg width={size} height={size} viewBox="0 0 32 32" accessibilityElementsHidden>
      <Circle cx="16" cy="16" r="14.5" fill="none" stroke={stroke} strokeWidth="2" />
      <Circle cx="16" cy="16" r="9" fill="none" stroke={stroke} strokeWidth="2" />
      <Circle cx="16" cy="16" r="3.6" fill={centerColor ?? colors.accent} />
    </Svg>
  );
}
