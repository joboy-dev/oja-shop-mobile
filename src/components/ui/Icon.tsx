import type { LucideIcon } from "lucide-react-native";
import type { ColorToken } from "@/theme/colors";
import { useTheme } from "@/theme/ThemeProvider";

interface IconProps {
  as: LucideIcon;
  size?: number;
  /** A theme colour token (resolves for light/dark). Use `color` only for fixed colours such as white-on-photo. */
  tone?: ColorToken;
  color?: string;
  strokeWidth?: number;
  fill?: string;
}

/** Same lucide icons as the web app. SVG props can't read Tailwind classes, so colour comes from a token. */
export function Icon({ as: Glyph, size = 20, tone = "fg", color, strokeWidth = 2, fill }: IconProps) {
  const { colors } = useTheme();
  return (
    <Glyph
      size={size}
      color={color ?? colors[tone]}
      strokeWidth={strokeWidth}
      fill={fill ?? "none"}
      accessibilityElementsHidden
    />
  );
}
