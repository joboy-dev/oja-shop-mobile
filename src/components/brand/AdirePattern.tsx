import { useId } from "react";
import Svg, { Circle, Defs, G, Path, Pattern, Rect } from "react-native-svg";
import { useTheme } from "@/theme/ThemeProvider";

/**
 * The shop's signature: a tone-on-tone motif inspired by adire eleko cloth (concentric circles, dot
 * clusters, resist lines). Ported from the web's AdirePattern. It fills its parent; set strength with
 * `opacity` (the web uses 0.05–0.16) and colour with `color` (defaults to the theme's primary).
 */
export function AdirePattern({
  color,
  opacity = 0.1,
  size = 96,
}: {
  color?: string;
  opacity?: number;
  size?: number;
}) {
  const { colors } = useTheme();
  const id = `adire-${useId().replace(/[^a-zA-Z0-9]/g, "")}`;
  const c = color ?? colors.primary;
  const dots: [number, number][] = [
    [64, 32],
    [72, 32],
    [80, 32],
    [64, 40],
    [72, 40],
    [80, 40],
    [16, 56],
    [24, 56],
    [32, 56],
    [16, 64],
    [24, 64],
    [32, 64],
  ];

  return (
    <Svg width="100%" height="100%" opacity={opacity} pointerEvents="none" accessibilityElementsHidden>
      <Defs>
        <Pattern id={id} width={size} height={size} patternUnits="userSpaceOnUse">
          <G fill="none" stroke={c} strokeWidth="1.25">
            {[21, 15, 9].map((r) => (
              <Circle key={`a${r}`} cx="24" cy="24" r={r} />
            ))}
            {[21, 15, 9].map((r) => (
              <Circle key={`b${r}`} cx="72" cy="72" r={r} />
            ))}
            <Path d="M52 8h40M52 16h40M4 80h40M4 88h40" strokeLinecap="round" />
          </G>
          <G fill={c}>
            <Circle cx="24" cy="24" r="3" />
            <Circle cx="72" cy="72" r="3" />
            {dots.map(([x, y]) => (
              <Circle key={`${x}-${y}`} cx={x} cy={y} r="1.6" />
            ))}
          </G>
        </Pattern>
      </Defs>
      <Rect width="100%" height="100%" fill={`url(#${id})`} />
    </Svg>
  );
}
